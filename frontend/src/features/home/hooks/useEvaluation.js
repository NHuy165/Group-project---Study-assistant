import { useState, useEffect } from 'react';
import { 
    createStudentAssessment, 
    readLatestStudentAssessment, 
    readStudentAssessment,
    readStudentAssessmentByDay 
} from '../api/studyProgressAPI';

export const useEvaluation = (autoFetch = false) => {
    const [todayAssessment, setTodayAssessment] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [totalHistory, setTotalHistory] = useState(0);
    const [detailAssessment, setDetailAssessment] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    
    const [error, setError] = useState(null);
    const [detailError, setDetailError] = useState(null);

    // CHỈNH SỬA BÓC TÁCH: Nhận diện chính xác Mảng chứa Object từ API filter theo ngày đổ về
    const normalizeText = (data) => {
        if (data == null) return '';
        if (typeof data === 'string') return data;
        
        // 1. Nếu là Mảng (Do Backend trả về mảng phần tử khi filter theo ?date=)
        if (Array.isArray(data)) {
            if (data.length === 0) return '';
            const firstItem = data[0];
            return firstItem.content || firstItem.assessment || JSON.stringify(firstItem);
        }
        
        // 2. Nếu là Đối tượng Single Object
        if (typeof data === 'object') {
            return data.content || data.assessment || JSON.stringify(data);
        }
        return String(data);
    };

    // Tác vụ 1: Lấy hoặc tạo đánh giá hôm nay
    const fetchAssessment = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await createStudentAssessment();
            if (!data) {
                const latestData = await readLatestStudentAssessment();
                setTodayAssessment(normalizeText(latestData));
                return;
            }
            setTodayAssessment(normalizeText(data));
        } catch (err) {
            console.error('Lỗi khi load đánh giá hôm nay:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchAssessment();
        }
    }, [autoFetch]);

    // Tác vụ 2: Tải danh sách lịch sử nhật ký (Mảng danh sách lớn)
    const readHistory = async (limit, offset) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await readStudentAssessment(limit, offset);
            if (Array.isArray(response)) {
                setHistoryList(response);
                setTotalHistory(response.length);
            } else if (response && Array.isArray(response.data)) {
                setHistoryList(response.data);
                setTotalHistory(response.total || response.data.length);
            } else if (response) {
                const possibleArray = response.results || response.items || [];
                setHistoryList(Array.isArray(possibleArray) ? possibleArray : [response]);
                setTotalHistory(1);
            }
        } catch (err) {
            console.error('Lỗi khi tải lịch sử:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Tác vụ 3: Truy vấn chi tiết theo ngày
    const readDetailByDay = async (dateStr) => {
        if (!dateStr) {
            setDetailError(new Error("Không tìm thấy thông tin ngày đánh giá hợp lệ."));
            return;
        }
        setIsDetailLoading(true);
        setDetailError(null);
        setDetailAssessment(null); // Clear data cũ
        try {
            const data = await readStudentAssessmentByDay(dateStr);
            const parsedText = normalizeText(data);
            
            // Kiểm tra chuỗi text sau chuẩn hóa có thực sự tồn tại nội dung không
            if (!parsedText || parsedText.trim() === "" || parsedText === "undefined") {
                setDetailError(new Error("Không có dữ liệu"));
            } else {
                setDetailAssessment(parsedText); // Lưu chuỗi text Markdown sạch vào State
            }
        } catch (err) {
            console.error('Lỗi khi tải chi tiết theo ngày:', err);
            setDetailError(err);
        } finally {
            setIsDetailLoading(false);
        }
    };

    return { 
        todayAssessment, 
        historyList, 
        totalHistory, 
        detailAssessment,
        setDetailAssessment,
        isLoading, 
        isDetailLoading,
        error, 
        detailError,
        setDetailError,
        fetchAssessment, 
        readHistory,
        readDetailByDay 
    };
};