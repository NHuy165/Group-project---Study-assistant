import { useState, useEffect, useCallback } from 'react';
// Tùy theo cấu trúc dự án mà đường dẫn import API có thể khác
// Giả sử bạn tạo file src/api/studyActivityApi.js
import * as api from '../api/studyActivityApi'; 

export const useOpenEnded = (studyActivityId) => {
    // State lưu trữ dữ liệu bài tập (bao gồm danh sách câu hỏi items)
    const [activityData, setActivityData] = useState(null);
    
    // Các state quản lý UI
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // 1. Hàm lấy toàn bộ thông tin bài tập (API GET)
    const fetchActivityData = useCallback(async () => {
        if (!studyActivityId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getStudyActivityComplete(studyActivityId);
            if (data && data.items) {
                data.items.sort((a, b) => a.id - b.id);
            }
            setActivityData(data);
        } catch (err) {
            console.error("Lỗi khi tải bài tập:", err);
            setError("Không thể tải bài tập lúc này. Bé thử lại sau nhé!");
        } finally {
            setIsLoading(false);
        }
    }, [studyActivityId]);

    // Tự động lấy dữ liệu khi hook được gọi (hoặc ID thay đổi)
    useEffect(() => {
        fetchActivityData();
    }, [fetchActivityData]);

    // 2. Hàm lưu câu trả lời nháp cho từng câu hỏi (API PATCH answer)
    // - exerciseItemId: ID của câu hỏi cụ thể (trong mảng items)
    // - answerText: Nội dung câu trả lời của học sinh
    const saveAnswerDraft = async (exerciseItemId, answerText) => {
        try {
            // Không set loading toàn trang ở đây để UI không bị giật khi gõ phím
            await api.answerExerciseItem(exerciseItemId, answerText);
            
            // Cập nhật lại state local (tùy chọn, để đảm bảo UI đồng bộ)
            // setActivityData(prev => ...) 
        } catch (err) {
            console.error("Lỗi khi lưu nháp:", err);
            // Có thể hiển thị toast/thông báo lỗi nhỏ ở đây
        }
    };

    // 3. Hàm nộp bài chính thức (API PATCH submit)
    // Lấy chi tiết câu hỏi (fetchActivityData), Lưu nháp (saveAnswerDraft), Nộp bài (submitActivity)
    const submitActivity = async () => {
        if (!studyActivityId) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await api.submitExerciseActivity(studyActivityId);
            // Nộp xong thì gọi lại hàm lấy dữ liệu để update UI (hiển thị điểm, giải thích...)
            await fetchActivityData();
        } catch (err) {
            console.error("Lỗi khi nộp bài:", err);
            setError("Có lỗi khi nộp bài. Bé kiểm tra lại kết nối mạng nha!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        activityData,
        isLoading,
        isSubmitting,
        error,
        saveAnswerDraft,
        submitActivity,
        refreshData: fetchActivityData // Export ra phòng trường hợp muốn gọi thủ công
    };
};