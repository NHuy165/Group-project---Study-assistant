import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/chatApi';

export const useChat = (interactionId) => {
    const [chatlog, setChatlog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [promptText, setPromptText] = useState('');

    const handlePrompTextChange = (e) => {
        setPromptText(e.target.value);
    }

    const readChat = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.readChat(interactionId);
            setChatlog(data);
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;
            
            if (status === 401) {
                detail || setError("Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để xem lịch sử trò chuyện nhé!");
            } else if (status === 422) {
                detail || setError("Yêu cầu không hợp lệ. Bé kiểm tra lại đường dẫn hoặc chọn lại cuộc trò chuyện nhé!");
            } else {
                detail || setError("Máy chủ đang bận một chút, không thể tải tin nhắn cũ. Bé thử lại sau nha!");
            }
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => {
        readChat();
    }, [readChat]);

    const askLLM = async (text) => { // UI gọi promptText và truyền vào hàm 

        if (!text || !text.trim()) return; // Chặn gửi tin nhắn trống

        setIsLoading(true);
        setError(null);
        const originalText = text; // Giữ lại text để trả về nếu lỗi
        setPromptText(''); // Xóa ô nhập prompt sau khi người dùng gửi

        try {
            const chatInput = { prompt: text };
            const response = await api.askLLM(interactionId, chatInput);
            
            // Cập nhật log chat ngay lập tức với câu trả lời mới
            setChatlog((prev) => [...prev, response]); // Response có chứa cả promptText, id, answer
            return response;
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            // Trả lại text vào ô nhập liệu để bé không phải gõ lại từ đầu
            setPromptText(originalText);

            if (status === 400) {
                setError(detail || "Câu hỏi có vẻ hơi lạ hoặc quá dài. Bé thử hỏi ngắn gọn hơn xem sao nhé!");
            } else if (status === 401) {
                setError(detail || "Phiên làm việc hết hạn rồi. Bé đăng nhập lại để tiếp tục trò chuyện với AI nhé!");
            } else if (status === 422) {
                setError(detail || "Có lỗi về định dạng tin nhắn. Bé kiểm tra lại nội dung vừa nhập nhé!");
            } else {
                setError(detail || "AI đang bận một chút hoặc lỗi kết nối mạng. Bé nhấn gửi lại lần nữa xem sao!");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        chatlog,
        isLoading,
        error,
        promptText,

        handlePrompTextChange,
        readChat,
        askLLM,
    };
};