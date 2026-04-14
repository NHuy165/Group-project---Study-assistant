import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/chatApi';

export const useChat = (interactionId) => {
    const [chatlog, setChatlog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const readChat = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true);
        try {
            const data = await api.readChat(interactionId);
            setChatlog(data);
        } catch (err) {
            setError("Không thể tải lịch sử trò chuyện");
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => {
        readChat();
    }, [readChat]);

    const askLLM = async () => {
        // chatInput khớp với LLMResponseInput ở backend
        try {
            const chatInput = { prompt: promptText };
            const response = await api.askLLM(interactionId, chatInput);
            
            // Cập nhật log chat ngay lập tức với câu trả lời mới
            setChatLog((prev) => [...prev, response]);
            return response;
        } catch (err) {
            setError("Lỗi khi kết nối với AI");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        chatlog,
        isLoading,
        error,
        readChat,
        askLLM,
    };
};