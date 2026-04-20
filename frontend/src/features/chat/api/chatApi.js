import axiosClient from '../../../api/axiosClient';

const PATH = '/llm-response';

/**
 * Gửi câu hỏi cho AI
 * Backend: @router.post("/{interaction_id}/chat")
 */

// parameter: interactionId; body: chatInput = { prompt: "..." }
export const askLLM = async (interactionId, promptText) => {
    // chatInput phải khớp với LLMResponseInput (thường là field 'prompt')
    const chatInput = { prompt: promptText };
    
    const response = await axiosClient.post(`${PATH}/${interactionId}/chat`, chatInput);
    return response.data;
};

/**
 * Lấy lịch sử trò chuyện
 * Backend: @router.get("/{interaction_id}/")
 */

// parameter: interactionId; optional query parameter: limit (số lượng message gần nhất muốn lấy)
export const readChat = async (interactionId, limit = null) => {

    // Lưu ý: Có dấu / ở cuối ${interactionId}/ theo đúng backend router
    const response = await axiosClient.get(`${PATH}/${interactionId}/`, {
        params: limit ? {limit} : {}
    });
    return response.data;
};