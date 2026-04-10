export const useChat = (interactionId) => {
    //

    const readChat = async () => {
        // Hàm này được chạy tại đây bằng useEffect để lấy interactions
    };

    const askLLM = async () => {

    };

    return {
        chatlog,
        isLoading,
        error,
        readChat,
        askLLM,
    };
};