function ChatBox({ chatHistory, setChatHistory, query, setQuery, isLoading }) {

    // Xử lý khi gửi câu hỏi
    const handleQuery = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: query }]);

        try {
        // Axios tự động stringify body thành JSON
        const response = await api.post(`/llm-response/${interactionId}/chat`, {
            content: query
        });

        const aiMessage = { 
            role: 'assistant', 
            content: response.data.content || response.data.response 
        };
        setChatHistory(prev => [...prev, aiMessage]);

        } catch (error) {
        // Axios tự động bắt lỗi 4xx, 5xx vào catch
        const errMsg = error.response?.data?.message || "Lỗi kết nối";
        alert("Lỗi: " + errMsg);
        } finally {
        setIsLoading(false);
        setQuery("");
        }
    };

    return (
        <>
            {/* --- PHẦN CHAT QUERY --- */}
            <h2>Hỏi đáp về tài liệu</h2>
            
            {/* Khung hiển thị nội dung chat */}
            <div>
                {chatHistory.length === 0 && <p>Chưa có câu hỏi nào. Hãy nhập gì đó!</p>}
                {chatHistory.map((msg, index) => (
                <div key={index} >
                    <div>
                    <strong>{msg.role === 'user' ? 'Bạn: ' : 'AI: '}</strong>
                    {msg.content}
                    </div>
                </div>
                ))}
                {isLoading && <p><i>AI đang suy nghĩ...</i></p>}
            </div>

            {/* Ô nhập liệu */}
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập câu hỏi tại đây..."
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            />
            <button onClick={handleQuery} disabled={isLoading}>
                Gửi
            </button>
        </>
    )
}

export default ChatBox;