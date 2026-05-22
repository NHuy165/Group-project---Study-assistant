import { useState, useEffect, useCallback } from 'react';
// Tùy theo cấu trúc dự án mà đường dẫn import API có thể khác
// Giả sử bạn tạo file src/api/studyActivityApi.js
// import * as api from '../api/studyActivityApi'; 
import { getStudyActivityComplete, answerExerciseItem, submitExerciseActivity } from '../api/studyActivityApi';

export const useOpenEnded = (studyActivityId) => {
    // State lưu trữ dữ liệu bài tập (bao gồm danh sách câu hỏi items)
    const [activityData, setActivityData] = useState(null);
    
    // Các state quản lý UI
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [draftSyncError, setDraftSyncError] = useState(null);

    // 1. Hàm lấy toàn bộ thông tin bài tập (API GET)
    const fetchActivityData = useCallback(async () => {
        if (!studyActivityId) return;
        setIsLoading(true);
        setError(null);
        try {
            // const isTestingModal = true;
            // if (isTestingModal) {
            //     throw {
            //         response: {
            //             // BẠN HÃY ĐỔI SỐ NÀY THÀNH:
            //             // 404 (Để xem nút Về sổ tay màu chàm)
            //             // 409 (Để xem nút Xem bài đã nộp màu xanh lá)
            //             // 500 (Để xem nút Thử lại sau màu đỏ)
            //             status: 404, 
            //             data: {
            //                 message: "Đây là câu thông báo lỗi giả lập để test giao diện!"
            //             }
            //         }
            //     };
            // }


            const data = await getStudyActivityComplete(studyActivityId);
            if (data && data.items) {
                data.items.sort((a, b) => a.id - b.id);
            }
            setActivityData(data);
        } catch (err) {
            const status = err.response?.status;
            const backendMessage = err.response?.data?.message;

            let errorState = {
                type: "ERROR",
                message: ""
            }

            if (status === 400) {
                console.error("[Lỗi Code Frontend - 400]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, có lỗi nhỏ xảy ra khi tải bài tập. Bé thử lại sau nhé!";
            }
            else if (status === 500) {
                console.error("[Lỗi Server - 500]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, Cú Mèo đang cảm thấy không khỏe. Bé hãy thử lại sau nhé!";
            }
            else if (status === 404) {
                console.warn("[Lỗi Dữ liệu - 404]:", backendMessage);
                errorState.type = "RETURN_INTERACTION";
                errorState.message = "Không tìm thấy bài tập. Bé hãy quay lại trang sổ tay để tải lại nhé!";
            }
            else {
                console.error(`[Lỗi Không Xác Định - ${status}]:`, backendMessage);
                errorState.type = "ERROR"
                errorState.message = "Có lỗi xảy ra khi tải bài tập. Bé hãy thử lại nhé!";
            }
            setError(errorState);
        } finally {
            setIsLoading(false);
        }
    }, [studyActivityId]);

    // Tự động lấy dữ liệu khi hook được gọi (hoặc ID thay đổi)
    useEffect(() => {
        if (!studyActivityId) {
            setActivityData(null);
            setError(null);
            setDraftSyncError(null);
            setIsLoading(false);
            return; // Dừng tại đây, không gọi fetch nữa
        }

        fetchActivityData();
    }, [fetchActivityData, studyActivityId]);

    // 2. Hàm lưu câu trả lời nháp cho từng câu hỏi (API PATCH answer)
    // - exerciseItemId: ID của câu hỏi cụ thể (trong mảng items)
    // - answerText: Nội dung câu trả lời của học sinh
    const saveAnswerDraft = async (exerciseItemId, answerText) => {
        try {
            // const isTestingModal = true;
            // if (isTestingModal) {
            //     throw {
            //         response: {
            //             // BẠN HÃY ĐỔI SỐ NÀY THÀNH:
            //             // 404 
            //             // 409 
            //             // 500 ...
            //             status: 404, 
            //             data: {
            //                 message: "Đây là câu thông báo lỗi giả lập để test giao diện!"
            //             }
            //         }
            //     };
            // }


            // Không set loading toàn trang ở đây để UI không bị giật khi gõ phím
            await answerExerciseItem(exerciseItemId, answerText);
            
            // Cập nhật lại state local (tùy chọn, để đảm bảo UI đồng bộ)
            // setActivityData(prev => ...) 
        } catch (err) {
            // Xử lý trường hợp mất mạng ngang xương (không có response)
            if (!err.response) {
                setDraftSyncError("Mạng đang chập chờn, bài nháp chưa được lưu!");
                return;
            }

            const status = err.response?.status;
            const backendMessage = err.response?.data?.message;

            let errorState = {
                type: "ERROR",
                message: ""
            }
            
            
            if (status === 404) {
                console.warn("[Lỗi Dữ liệu - 404]:", backendMessage);
                errorState.type = "RETURN_INTERACTION";
                errorState.message = "Không tìm thấy bài tập. Bé hãy quay lại trang sổ tay để tải lại nhé!";
                setError(errorState);
            } 
            else if (status === 409) {
                console.warn("[Lỗi Xung Đột - 409]:", backendMessage);
                errorState.type = "CONFLICT";
                errorState.message = "Bài tập này bé đã nộp rồi nên không thể chỉnh sửa nữa nhé!";
                setError(errorState);
            }
            // Lỗi Code (400) hoặc Lỗi Server (500)
            else {
                console.error(`[Lỗi Lưu Nháp Ngầm - ${status}]:`, err.response?.data?.message);
                // Bật còi báo động, không đụng tới biến 'error' chính
                setDraftSyncError("Hệ thống đang gặp sự cố, bài nháp chưa được lưu. Bé nhớ copy bài lại nhé!");
            }
        }
    };

    // 3. Hàm nộp bài chính thức (API PATCH submit)
    // Lấy chi tiết câu hỏi (fetchActivityData), Lưu nháp (saveAnswerDraft), Nộp bài (submitActivity)
    const submitActivity = async () => {
        if (!studyActivityId) return;
        setIsSubmitting(true);
        setError(null);
        try {
            // const isTestingModal = true;
            // if (isTestingModal) {
            //     throw {
            //         response: {
            //             // BẠN HÃY ĐỔI SỐ NÀY THÀNH:
            //             // 404 (Để xem nút Về sổ tay màu chàm)
            //             // 409 (Để xem nút Xem bài đã nộp màu xanh lá)
            //             // 500 (Để xem nút Thử lại sau màu đỏ)
            //             status: 409, 
            //             data: {
            //                 message: "Đây là câu thông báo lỗi giả lập để test giao diện!"
            //             }
            //         }
            //     };
            // }

            await submitExerciseActivity(studyActivityId);
            // Nộp xong thì gọi lại hàm lấy dữ liệu để update UI (hiển thị điểm, giải thích...)
            await fetchActivityData();
        } catch (err) {
            const status = err.response?.status;
            const backendMessage = err.response?.data?.message;

            let errorState = {
                type: "ERROR",
                message: ""
            }

            if (status === 400) {
                console.error("[Lỗi Code Frontend - 400]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, có lỗi nhỏ xảy ra khi lưu bài tập. Bé thử lại sau nhé!";
            }
            else if (status === 500) {
                console.error("[Lỗi Server - 500]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, Cú Mèo đang cảm thấy không khỏe. Bé hãy thử lại sau nhé!";
            }
            else if (status === 502) {
                console.error(`[Lỗi AI - ${status}]:`, backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Bài chấm của cú mèo bị lỗi rồi, bé nộp lại sau nhé!";
            } 
            else if (status === 503) {
                // LỖI HỆ THỐNG (Dịch vụ AI sập)
                console.error(`[Lỗi AI - ${status}]:`, backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Cú Mèo đang được nâng cấp để trở nên thông minh hơn nên tạm thời không thể đồng hành cùng bé. Bé hãy thử lại sau nhé!";
            }
            else if (status === 404) {
                console.warn("[Lỗi Dữ liệu - 404]:", backendMessage);
                errorState.type = "RETURN_INTERACTION";
                errorState.message = "Không tìm thấy bài tập. Bé hãy quay lại trang sổ tay để tải lại nhé!";
            }
            else if (status === 409) {
                console.warn("[Lỗi Xung Đột - 409]:", backendMessage);
                errorState.type = "CONFLICT";
                errorState.message = "Bài tập này bé đã nộp rồi nên không thể chỉnh sửa nữa nhé!";
            }
            else {
                console.error(`[Lỗi Không Xác Định - ${status}]:`, backendMessage);
                errorState.type = "ERROR"
                errorState.message = "Có lỗi xảy ra khi tải bài tập. Bé hãy thử lại nhé!";
            }
            setError(errorState);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        activityData,
        isLoading,
        isSubmitting,
        error,
        draftSyncError,
        saveAnswerDraft,
        submitActivity,
        refreshData: fetchActivityData // Export ra phòng trường hợp muốn gọi thủ công
    };
};