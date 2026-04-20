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
            setError("Không thể tải lịch sử trò chuyện");
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => {
        readChat();
    }, [readChat]);

    const askLLM = async (promptText) => {
        // chatInput khớp với LLMResponseInput ở backend

        if (!promptText.trim()) return; // Chặn gửi tin nhắn trống

        setIsLoading(true);
        setError(null);

        try {
            const chatInput = { prompt: promptText };
            const response = await api.askLLM(interactionId, chatInput);
            
            // Cập nhật log chat ngay lập tức với câu trả lời mới
            setChatlog((prev) => [...prev, response]); // Response có chứa cả promptText, id, answer
            return response;
        } catch (err) {
            setError("Lỗi khi kết nối với AI");
        } finally {
            setIsLoading(false);
            setPromptText('');
        }
    };

    return {
        chatlog,
        isLoading,
        error,

        handlePrompTextChange,
        readChat,
        askLLM,
    };
};