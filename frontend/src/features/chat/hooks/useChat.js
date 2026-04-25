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
            
            // THÊM TỪ CODE MỚI: Chuyển đổi dữ liệu Backend thành định dạng UI hiểu được
            const formattedLog = data.flatMap(item => [
                { role: "user", content: item.prompt },
                { role: "ai", content: item.answer }
            ]);

            setChatlog(formattedLog);
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;
            
            // GIỮ NGUYÊN LOGIC CŨ: Bắt lỗi chi tiết
            if (status === 401) {
                setError(detail || "Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để xem lịch sử trò chuyện nhé!");
            } else if (status === 422) {
                setError(detail || "Yêu cầu không hợp lệ. Bé kiểm tra lại đường dẫn hoặc chọn lại cuộc trò chuyện nhé!");
            } else {
                setError(detail || "Máy chủ đang bận một chút, không thể tải tin nhắn cũ. Bé thử lại sau nha!");
            }
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => {
        readChat();
    }, [readChat]);

    const askLLM = async (text) => {
        // THÊM TỪ CODE MỚI: Rào lỗi khi chưa chọn cuộc trò chuyện
        if (!interactionId) {
            setError("Bé ơi, hãy chọn một cuộc trò chuyện trước khi hỏi nhé!");
            return;
        }

        if (!text || !text.trim()) return; // Chặn gửi tin nhắn trống

        setIsLoading(true);
        setError(null);
        const originalText = text; // Giữ lại text để trả về nếu lỗi
        setPromptText(''); // Xóa ô nhập prompt sau khi người dùng gửi

        // THÊM TỪ CODE MỚI: Đưa tin nhắn của người dùng vào UI ngay lập tức
        const userMessage = { role: "user", content: text };
        setChatlog((prev) => [...prev, userMessage]);

        try {
            const chatInput = { prompt: text };
            const response = await api.askLLM(interactionId, chatInput);
            
            // THÊM TỪ CODE MỚI: Format tin nhắn AI trả về
            const aiMessage = { 
                role: "ai", 
                content: response.answer 
            };
            
            // Cập nhật log chat với câu trả lời của AI
            setChatlog((prev) => [...prev, aiMessage]); 
            return response;
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            // Trả lại text vào ô nhập liệu để bé không phải gõ lại từ đầu
            setPromptText(originalText);
            
            // THÊM TỪ CODE MỚI: Xóa tin nhắn user vừa hiển thị tạm nếu gọi API bị lỗi
            setChatlog((prev) => prev.slice(0, -1));

            // GIỮ NGUYÊN LOGIC CŨ: Bắt lỗi chi tiết
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