import React, { useRef, useEffect } from "react";
import { StairsLoader } from "../../../components/StairsLoader";
import { MessageBubble } from "./MessageBubble";

export const ChatArea = ({ messages, isLoading, promptText, setPromptText, onSend }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Gom logic submit form lại cho gọn
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload trang
    onSend();
  };

  return (
    <main className="flex h-full flex-1 flex-col items-center justify-between rounded-3xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-md">
      
      {/* Header */}
      <header className="w-full space-y-4 text-center">
        <h1 className="flex h-10 items-center justify-center text-3xl font-extrabold text-gray-800">Nội dung</h1>
        <hr className="mx-auto w-full border-t border-gray-400/30" />
      </header>

      {/* Vùng hiển thị tin nhắn */}
      <div className="custom-scrollbar mb-4 flex w-full flex-1 flex-col space-y-6 overflow-y-auto pr-2 pt-4">
        
        {messages.length === 0 && !isLoading ? (
          <div className="flex w-full flex-1 flex-col items-center justify-center space-y-4 text-gray-500/70">
            <span className="text-6xl opacity-20">✨</span>
            <p className="font-medium italic tracking-wide">Bắt đầu cuộc trò chuyện...</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble key={index} role={msg.role} content={msg.content} />
            ))}
            
            {/* Loading Indicator của AI */}
            {isLoading && (
              <div className="flex flex-row items-end gap-3 animate-pulse">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-yellow-400 text-2xl shadow-lg">🤖</div>
                <div className="flex flex-col items-center gap-3 rounded-[2.5rem] rounded-bl-none border-2 border-white/40 bg-[#FF758F] px-8 py-5 shadow-[0_12px_0_0_#E94E77]">
                  <span className="text-xs font-black uppercase italic text-white opacity-90">Tớ đang tìm đáp án...</span>
                  <StairsLoader />
                </div>
              </div>
            )}
            
            {/* Mỏ neo tự động cuộn */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Khung nhập liệu (Đã đổi sang thẻ form) */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto flex items-center">
        <input 
          type="text" 
          value={promptText} 
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Nhập câu hỏi..."
          className="w-full rounded-full border border-gray-200 bg-white/90 px-6 py-4 text-[1.1rem] shadow-lg outline-none focus:border-[#4ecdc4] transition-colors" 
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !promptText.trim()} 
          className="absolute right-3 rounded-full bg-[#4ecdc4] p-3 text-white transition hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="text-xl">✈️</span>
        </button>
      </form>

    </main>
  );
};