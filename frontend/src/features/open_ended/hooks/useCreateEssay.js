import { useState } from 'react';
// Import API tạo bài tập của bạn vào
import { createStudyActivity } from '../api/studyActivityApi'; 

export const useCreateEssay = (interactionId, onSuccess) => {
    const [isCreatingEssay, setIsCreatingEssay] = useState(false);
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    // Kích hoạt khi bấm nút công cụ "Tự luận", sau khi tạo xong sẽ gọi fetchActivities để load lại list
    const handleCreateEssay = async (setupData) => {
        if (!interactionId) return;
        
        setIsCreatingEssay(true);
        try {
            // const isTestingModal = true;
            // if (isTestingModal) {
            //     throw {
            //         response: {
            //             // BẠN HÃY ĐỔI SỐ NÀY THÀNH:
            //             // 404 (Để xem nút Về sổ tay màu chàm)
            //             // 409 (Để xem nút Xem bài đã nộp màu xanh lá)
            //             // 500 (Để xem nút Thử lại sau màu đỏ)
            //             status: 502, 
            //             data: {
            //                 message: "Đây là câu thông báo lỗi giả lập để test giao diện!"
            //             }
            //         }
            //     };
            // }

            const payload = {
                prompt: setupData?.prompt,
                activity_type: "EXERCISE",
                activity_format: "OPEN_ENDED",
                subject_type: setupData?.subject
            };
            
            const newActivity = await createStudyActivity(interactionId, payload);
            console.log("Tạo bài tập thành công, ID:", newActivity.id);
            if (onSuccess) onSuccess(); // Báo cho cha biết để gọi fetchActivities()
        } catch (error) {
            const status = error.response?.status;
            const backendMessage = error.response?.data?.message;

            let errorState = {
                type: "ERROR",
                message: ""
            }

            // Xử lý từng luồng mã lỗi
            if (status === 400) {
                // LỖI HỆ THỐNG (Lỗi Frontend Code sai)
                console.error("[Lỗi Code Frontend - 400]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, có lỗi nhỏ xảy ra khi tạo bài. Bé thử lại sau nhé!";
            } 
            else if (status === 500) {
                // LỖI HỆ THỐNG (Backend sập)
                console.error("[Lỗi Server - 500]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Cú Mèo hơi mệt nên làm rối tung lên rồi. Bé thử lại sau một chút nhé!";
            } 
            else if (status === 503) {
                // LỖI HỆ THỐNG (Dịch vụ AI sập)
                console.error(`[Lỗi AI - ${status}]:`, backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Cú Mèo đang được nâng cấp để trở nên thông minh hơn nên tạm thời không thể đồng hành cùng bé. Bé hãy thử lại sau nhé!";
            }
            else if (status === 404) {
                // LỖI BẤT ĐỒNG BỘ (Sổ tay không còn tồn tại)
                console.warn("[Lỗi Dữ liệu - 404]:", backendMessage);
                errorState.type = "RETURN_HOMEPAGE";
                errorState.message = "Không tìm thấy dữ liệu cần thiết để tạo bài tập. Bé hãy tạo sổ bài tập mới nhé.";
            } 
            else if (status === 502) {
                // LỖI GIAO THOA (AI lỗi hoặc Bé nhập prompt khó hiểu)
                console.error(`[Lỗi AI - ${status}]:`, backendMessage);
                errorState.type = "RETRYABLE";
                // Khuyến khích bé đổi prompt theo hướng dẫn từ docs
                errorState.message = "Cú Mèo chưa hiểu rõ ý của bé lắm. Bé thử đặt câu lệnh dễ hiểu hơn xem sao nhé!";
            } 
            else {
                console.error("Lỗi không xác định:", error);
                errorState.type = "ERROR";
                errorState.message = "Có lỗi xảy ra khi gọi AI tạo bài tập. Bé thử lại nhé!";
            }
            setError(errorState);
        } finally {
            setIsCreatingEssay(false);
        }
    };

    return {
        isCreatingEssay,
        handleCreateEssay,
        error,
        clearError
    };
};