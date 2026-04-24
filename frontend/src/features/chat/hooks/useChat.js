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
            const formattedLog = data.flatMap(item => [
                { role: "user", content: item.prompt },
                { role: "ai", content: item.answer }
            ]);

            setChatlog(formattedLog);
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

    const askLLM = async (text) => {
        if (!interactionId) {
        setError("Bé ơi, hãy chọn một cuộc trò chuyện trước khi hỏi nhé!");
        return;
    }
        if (!text || !text.trim()) return;

        setIsLoading(true);
        setError(null);
        const originalText = text;
        setPromptText('');

        // 1. Đưa tin nhắn của người dùng vào UI ngay lập tức
        const userMessage = { role: "user", content: text };
        setChatlog((prev) => [...prev, userMessage]);

        try {
            const chatInput = { prompt: text };
            const response = await api.askLLM(interactionId, chatInput);
            
            // 2. Chuyển đổi dữ liệu từ Backend thành định dạng UI hiểu được
            const aiMessage = { 
                role: "ai", 
                content: response.answer // Giả sử Backend trả về field 'answer'
            };

            setChatlog((prev) => [...prev, aiMessage]);
            return response;
        } catch (err) {
            setPromptText(originalText);
            // Xóa tin nhắn user vừa thêm nếu lỗi (để đồng bộ lại)
            setChatlog((prev) => prev.slice(0, -1)); 
            
            const status = err.response?.status;
            const detail = err.response?.data?.detail;
            setError(detail || "AI đang bận một chút, bé thử lại nhé!");
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