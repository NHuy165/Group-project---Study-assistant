import { useState, useEffect } from 'react';
import { createStudentAssessment, readLatestStudentAssessment, readStudentAssessment } from '../api/studyProgressAPI';

export const useEvaluation = (autoFetch = false) => {
    const [assessment, setAssessment] = useState(null);
    const [history, setHistory] = useState([]);
    const [totalHistory, setTotalHistory] = useState(0); // Để tính toán tổng số trang
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Tự động gọi hoặc kích hoạt kiểm tra / tạo đánh giá khi vào Homepage
    const fetchAssessment = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await createStudentAssessment();
            // Nếu BE trả về null (vì hôm qua đã có đánh giá rồi), ta chủ động đi tìm cái latest cũ
            if (!data) {
                const latestData = await readLatestStudentAssessment();
                const text = latestData == null ? '' : (typeof latestData === 'string' ? latestData : JSON.stringify(latestData));
                setAssessment(text);
                return text;
            }
            
            const text = typeof data === 'string' ? data : JSON.stringify(data);
            setAssessment(text);
            return text;
        } catch (err) {
            console.error('Lỗi khi tạo/load đánh giá học sinh:', err);
            setError(err);
            setAssessment(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchAssessment();
        }
    }, [autoFetch]);

    // 2. Lấy đánh giá gần nhất (Phòng trường hợp UI cần gọi riêng)
    const readLatestAssessment = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await readLatestStudentAssessment();
            const text = data == null ? 'Chưa có đánh giá nào trước đây.' : (typeof data === 'string' ? data : JSON.stringify(data));
            setAssessment(text);
            return text;
        } catch (err) {
            console.error('Lỗi khi load đánh giá mới nhất:', err);
            setError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Lấy lịch sử đánh giá phân trang (mỗi lần 10 items)
    const readHistory = async (limit = 10, offset = 0) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await readStudentAssessment(limit, offset);
            
            // Tùy theo cấu trúc API back-end trả về:
            // Case A: Nếu BE trả về trực tiếp mảng: [...đánh giá]
            if (Array.isArray(response)) {
                setHistory(response);
                // Nếu BE không trả về total, tạm thời tăng dần hoặc xử lý render nút Next/Prev dựa vào length
                setTotalHistory(offset + response.length + (response.length === limit ? 1 : 0));
            } 
            // Case B: Nếu BE trả dạng object chuẩn: { data: [...], total: 35 }
            else if (response && Array.isArray(response.data)) {
                setHistory(response.data);
                setTotalHistory(response.total || 0);
            }
        } catch (err) {
            console.error('Lỗi khi tải lịch sử đánh giá:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { 
        assessment, 
        history, 
        totalHistory, 
        isLoading, 
        error, 
        fetchAssessment, 
        readLatestAssessment, 
        readHistory 
    };
};