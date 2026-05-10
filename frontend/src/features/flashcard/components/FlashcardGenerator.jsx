import React from 'react';

const FlashcardGenerator = ({ isLoading, error, prompt, setPrompt, onCreateFlashcardSet }) => {

    return (
        <div className="bg-white p-6 rounded-xl border border-dashed border-indigo-300 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-indigo-600">✨ Tạo bộ Flashcard với AI</h2>
            
            {error && (
                <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}
            
            <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Nhập nội dung hoặc chủ đề (VD: 10 từ vựng về nấu ăn)..." // Nội dung hiển thị tự động
                rows="4" // Chiều cao của textarea
                value={prompt} // giá trị trong textarea
                onChange={(e) => setPrompt(e.target.value)} // Cập nhật state khi người dùng nhập
                disabled={isLoading} // Disable input khi đang loading để tránh gửi nhiều request cùng lúc
            />
            
            <button
                onClick={() => onCreateFlashcardSet(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-medium"
            >
                {isLoading ? "⏳ AI đang suy nghĩ..." : "🚀 Tạo bộ thẻ ngay"}
            </button>
        </div>
    );
};

export default FlashcardGenerator;
