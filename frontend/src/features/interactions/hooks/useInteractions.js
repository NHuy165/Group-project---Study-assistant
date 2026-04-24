import { useState, useEffect } from "react";
import * as api from "../api/interactionsAPI";

export const useInteractions = () => {
    const [interactions, setInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [interactionName, setInteractionName] = useState('');
    const [interactionDescription, setInteractionDescription] = useState('');

    const [editingInteractionID, setEditingInteractionID] = useState(null);

    const [activeInteractionId, setActiveInteractionId] = useState(null); // State lưu ID của interaction đang mở để truyền xuống useDocuments và useChat

    // Hiển thị tên interaction khi người dùng nhập: Gọi 2 lần: khi create và khi update
    const handleInteractionNameChange = (e) => {
        setInteractionName(e.target.value);
    };

    // Hiển thị mô tả interaction khi người dùng nhập: Gọi 2 lần: khi create và khi update
    const handleInteractionDescriptionChange = (e) => {
        setInteractionDescription(e.target.value);
    };

    // Xử lý sự kiện khi người dùng ấn "New chat"
    const handleNewChatClick = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Gom dữ liệu từ State của UI thành documentInput
        const interactionInput = {
        name: interactionName || "Cuộc trò chuyện",
        description: interactionDescription || "...",
        };
        await createInteraction(interactionInput);

        // Reset form sau khi thành công
        setInteractionName("");
        setInteractionDescription("");
    };

    // Xử lý sự kiện khi người dùng ấn Edit ở mỗi interaction
    const handleEditInteractionClick = (interactionEditing) => {
        setEditingInteractionID(interactionEditing.id);
        setInteractionName(interactionEditing.name);
        setInteractionDescription(interactionEditing.description);
    };

    // Hủy hành động edit
    const cancelEditInteractionClick = () => {
        setEditingInteractionID(null);
        setInteractionName("Tên cuộc trò chuyện");
        setInteractionDescription("Mô tả nội dung cuộc trò chuyện");
    };

    // Gọi khi người dùng ấn update (sau khi đã thực hiện edit, ấn update để lưu thay đổi => gọi hàm này)
    const handleUpdateInteractionClick = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!editingInteractionID) return;

        const updateData = {
        name: interactionName || "Cuộc trò chuyện",
        description: interactionDescription || "...",
        };

        await updateInteraction(editingInteractionID, updateData);
        cancelEditInteractionClick(); // Sửa xong thì xóa dấu vết, reset form
    };

    const readInteractions = async () => {
        // Hàm này được chạy tại đây bằng useEffect để lấy interactions
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.readInteractions();
            setInteractions(data);

            // Nếu có interaction nào đó đã tồn tại và chưa có interaction nào được chọn (activeInteractionId), thì tự động chọn interaction đầu tiên trong danh sách
            if (data.length > 0 && !activeInteractionId) {
                setActiveInteractionId(data[0].id);
            }

        } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;

        // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
        if (status === 401) {
            setError(
            "Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!",
            );
            // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
        }

        // 2. Các lỗi khác (500, mất mạng, server bảo trì...)
        else {
            setError(
            detail ||
                "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!",
            );
        }
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        readInteractions();
    }, []);

    const createInteraction = async (input) => {
        setIsLoading(true);
        setError(null);
        try {
        const newInteraction = await api.createInteraction(input);
        setInteractions((prevInteractions) => [
            ...prevInteractions,
            newInteraction,
        ]); // Cập nhật danh sách dựa trên danh sách cũ
        return newInteraction;
        } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;

        // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
        if (status === 401) {
            setError(
            detail ||
                "Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!",
            );
            // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
        }

        // 2. Lỗi 422 - Unprocessable Entity (Lỗi logic, ví dụ: thiếu file hoặc định dạng file không được hỗ trợ)
        else if (status === 422) {
            setError(
            detail ||
                "Bé kiểm tra lại nhé, hình như mình điền thiếu thông tin của phiên học tập rồi!",
            );
        }

        // 3. Các lỗi khác (500, mất mạng, server bảo trì...)
        else {
            setError(
            detail ||
                "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!",
            );
        }
        return null;
        } finally {
        setIsLoading(false);
        }
    };

    const updateInteraction = async (id, updateData) => {
        setIsLoading(true);
        setError(null);
        try {
        const updated = await api.updateInteraction(id, updateData);
        setInteractions(
            interactions.map((item) => (item.id === id ? updated : item)),
        );
        
        } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;

        // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
        if (status === 401) {
            setError(
            "Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!",
            );
            // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
        }

        // 2. Lỗi 404 - Not Found (Không tìm thấy tài liệu hoặc Interaction)
        else if (status === 404) {
            setError(
            "Hệ thống không tìm thấy phiên học này. Bé hãy tải lại trang hoặc bắt đầu phiên học mới nhé!",
            );
        }

        // 3. Lỗi 422 - Unprocessable Entity (Lỗi logic, ví dụ: thiếu file hoặc định dạng file không được hỗ trợ)
        else if (status === 422) {
            setError(
            "Bé kiểm tra lại nhé, hình như mình điền thiếu thông tin phiên học tập rồi!",
            );
        }

        // 4. Các lỗi khác (500, mất mạng, server bảo trì...)
        else {
            setError(
            detail ||
                "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!",
            );
        }
        } finally {
        setIsLoading(false);
        }
    };

    const deleteInteraction = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
        await api.deleteInteraction(id);
        setInteractions(interactions.filter((item) => item.id !== id));
        } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;

        // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
        if (status === 401) {
            setError(
            "Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!",
            );
            // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
        }

        // 2. Lỗi 404 - Not Found (Không tìm thấy tài liệu hoặc Interaction)
        else if (status === 404) {
            setError(
            "Hệ thống không tìm thấy phiên học này. Bé hãy tải lại trang hoặc bắt đầu phiên học mới nhé!",
            );
        }

        // 3. Lỗi 422 - Unprocessable Entity (Lỗi logic, ví dụ: thiếu file hoặc định dạng file không được hỗ trợ)
        else if (status === 422) {
            setError(
            "Bé kiểm tra lại nhé, hình như mình điền thiếu thông tin phiên học tập rồi!",
            );
        }

        // 4. Các lỗi khác (500, mất mạng, server bảo trì...)
        else {
            setError(
            detail ||
                "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!",
            );
        }
        } finally {
        setIsLoading(false);
        }
    };

    return {
        interactions,
        isLoading,
        error,
        interactionName,
        interactionDescription,
        editingInteractionID,

        handleInteractionNameChange,
        handleInteractionDescriptionChange,
        handleNewChatClick, // createInteraction
        handleEditInteractionClick,
        cancelEditInteractionClick,
        handleUpdateInteractionClick, // updateInteraction
        createInteraction,

        activeInteractionId, // Trả về để InteractionPage có thể dùng
        setActiveInteractionId,
        readInteractions,
        deleteInteraction,
        setError // Reset Error khi người dùng tắt thông báo
    };
};