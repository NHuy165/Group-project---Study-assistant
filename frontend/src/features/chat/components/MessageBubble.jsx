
import React from 'react';

export const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      
      {/* Avatar */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-2xl shadow-lg ${
        isUser ? "border-white bg-blue-400" : "border-white bg-yellow-400"
      }`}>
        {isUser ? "👦" : "🤖"}
      </div>
      
      {/* Khung nội dung */}
      <div className={`relative max-w-[70%] rounded-[2rem] border-2 px-6 py-4 text-lg font-medium leading-relaxed shadow-[0_8px_0_0_rgba(0,0,0,0.05)] ${
        isUser 
          ? "rounded-br-none border-[#3dbbb2] bg-[#4ecdc4] text-white" 
          : "rounded-tl-none border-gray-100 bg-white text-gray-700"
      }`}>
        {content}
        
        {/* Cái đuôi nhọn của bong bóng chat */}
        <div className={`absolute bottom-0 h-4 w-4 ${
          isUser ? "-right-2 bg-[#4ecdc4] clip-path-right-tail" : "-left-2 bg-white clip-path-left-tail"
        }`} />
      </div>

    </div>
  );
};