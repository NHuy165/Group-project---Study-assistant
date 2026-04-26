import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/chatApi';

const getErrorMessage = (status) => {
    switch (status) {
        case 400: return "Câu hỏi có vẻ hơi lạ hoặc thiếu tài liệu tham khảo. Bé kiểm tra lại nhé!";
        case 401: return "Phiên làm việc hết hạn rồi. Bé đăng nhập lại để tiếp tục nhé!";
        case 422: return "Có lỗi về định dạng tin nhắn hoặc đường dẫn. Bé kiểm tra lại nha!";
        default: return "AI đang bận một chút hoặc lỗi kết nối mạng. Bé thử lại sau nhé!";
    }
};

export const useChat = (interactionId) => {
    const [chatlog, setChatlog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [promptText, setPromptText] = useState('');

    // ĐƯA readChat LÊN TRÊN CÙNG
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
            setError(getErrorMessage(err.response?.status));
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    // useEffect NẰM DƯỚI readChat SẼ KHÔNG BỊ LỖI NỮA
    useEffect(() => {
        setChatlog([]);
        setError(null);
        setPromptText('');
        if (interactionId) {
            readChat();
        }
    }, [interactionId, readChat]);

    const askLLM = async () => {
        const textToSubmit = promptText.trim();
        
        if (!interactionId) {
            setError("Bé ơi, hãy chọn một cuộc trò chuyện trước khi hỏi nhé!");
            return;
        }
        if (!textToSubmit) return;

        setIsLoading(true);
        setError(null);
        setPromptText('');

        const userMsg = { role: "user", content: textToSubmit };
        setChatlog((prev) => [...prev, userMsg]);

        try {
            const response = await api.askLLM(interactionId, textToSubmit);
            
            if (response && response.answer) {
                setChatlog((prev) => [...prev, { role: "ai", content: response.answer }]); 
            }
            return response;
        } catch (err) {
            setPromptText(textToSubmit);
            setChatlog((prev) => prev.filter(msg => msg !== userMsg)); 
            setError(getErrorMessage(err.response?.status));
        } finally {
            setIsLoading(false);
        }
    };

    return {
        chatlog, isLoading, error, 
        promptText, setPromptText,
        readChat, askLLM
    };
};