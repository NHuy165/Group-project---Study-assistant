import axios from 'axios';

// Prefix chính xác từ main.py là /llm-response
const API_URL = 'http://localhost:8000/llm-response';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    };
};

/**
 * Gửi câu hỏi cho AI
 * Backend: @router.post("/{interaction_id}/chat")
 */

// parameter: interactionId; body: chatInput = { prompt: "..." }
export const askLLM = async (interactionId, promptText) => {
    // chatInput phải khớp với LLMResponseInput (thường là field 'prompt')
    const chatInput = { prompt: promptText };
    
    const response = await axios.post(`${API_URL}/${interactionId}/chat`, 
        chatInput, getAuthHeader());
    return response.data;
};

/**
 * Lấy lịch sử trò chuyện
 * Backend: @router.get("/{interaction_id}/")
 */

// parameter: interactionId; optional query parameter: limit (số lượng message gần nhất muốn lấy)
export const readChat = async (interactionId, limit = null) => {
    const config = { ...getAuthHeader() };
    
    if (limit) {
        config.params = { limit };
    }

    // Lưu ý: Có dấu / ở cuối ${interactionId}/ theo đúng backend router
    const response = await axios.get(`${API_URL}/${interactionId}/`, config);
    return response.data;
};