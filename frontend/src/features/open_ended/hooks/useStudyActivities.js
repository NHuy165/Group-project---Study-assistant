import { useState, useEffect, useCallback } from 'react';
import { getAllStudyActivities, deleteStudyActivity } from '../api/studyActivityApi';

export const useStudyActivities = (interactionId) => {
    const [activities, setActivities] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [error, setError] = useState(null);

    // Dùng ở cột Sidebar trang chính để in ra menu các bài tập
    const fetchActivities = useCallback(async () => {
        if (!interactionId) return;
        setIsLoadingList(true);
        try {
            const data = await getAllStudyActivities(interactionId);
            setActivities(data); // Lưu mảng bài tập vào state
        } catch (error) {
            const status = error.response?.status;
            const backendMessage = error.response?.data?.message;

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
                errorState.type = "RETURN_HOMEPAGE";
                errorState.message = "Không tìm thấy bài tập. Bé hãy tạo sổ bài tập mới nhé.";
            }
            else {
                console.error(`[Lỗi Không Xác Định - ${status}]:`, backendMessage);
                errorState.type = "ERROR"
                errorState.message = "Có lỗi xảy ra khi tải bài tập. Bé hãy thử lại nhé!";
            }

            setError(errorState);
        } finally {
            setIsLoadingList(false);
        }
    }, [interactionId]);

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteStudyActivity(activityId);
            // Sau khi xóa thành công ở Server, cập nhật lại danh sách ở Local ngay lập tức
            console.log("Xóa bài tập thành công, ID:", activityId);
            setActivities(prev => prev.filter(act => act.id !== activityId));
        } catch (error) {
            const status = error.response?.status;
            const backendMessage = error.response?.data?.message;

            let errorState = {
                type: "ERROR",
                message: ""
            }

            if (status === 400) {
                console.error("[Lỗi Code Frontend - 400]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, có lỗi nhỏ xảy ra khi xóa bài tập. Bé thử lại sau nhé!";
            }
            else if (status === 500) {
                console.error("[Lỗi Server - 500]:", backendMessage);
                errorState.type = "DEV_BUG";
                errorState.message = "Ôi, Cú Mèo đang cảm thấy không khỏe. Bé hãy thử lại sau nhé!";
            }
            else if (status === 404) {
                // NUỐT LỖI 404: Nó đã bị xóa rồi thì mình chỉ cần xóa nó khỏi UI hiện tại
                console.warn("Bài tập đã bị xóa trước đó. Cập nhật lại UI.");
                setActivities(prev => prev.filter(act => act.id !== activityId));
                return; // Thoát hàm luôn, không gọi setError
            }
            else {
                console.error(`[Lỗi Không Xác Định - ${status}]:`, backendMessage);
                errorState.type = "ERROR"
                errorState.message = "Có lỗi xảy ra khi xóa bài tập. Bé hãy thử lại nhé!";
            }
            
            setError(errorState);
        }
    };

    // Tự động chạy khi mở sổ tay (interactionId thay đổi)
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return { 
        activities, 
        fetchActivities, 
        handleDeleteActivity,
        isLoadingList,
        error
    };
};