import React from "react";
import { StairsLoader } from "../../../components/StairsLoader";

export const ChatArea = ({ messages, isLoading, inputText, setInputText, onSend }) => (
  <main className="flex flex-col flex-1 h-full items-center justify-between rounded-3xl bg-white/60 p-6 backdrop-md shadow-xl border border-white/20">
    <header className="w-full space-y-4 text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 h-10 flex items-center justify-center">Nội dung</h1>
      <hr className="mx-auto w-full border-t border-gray-400/30" />
    </header>

    <div className="flex-1 w-full overflow-y-auto mb-4 space-y-6 pr-2 custom-scrollbar flex flex-col pt-4">
      {messages.length === 0 && !isLoading ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center text-gray-500/70 space-y-4">
          <span className="text-6xl opacity-20">✨</span>
          <p className="font-medium italic tracking-wide">Bắt đầu cuộc trò chuyện...</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 ${msg.role === "user" ? "bg-blue-400 border-white" : "bg-yellow-400 border-white"}`}>
                {msg.role === "user" ? "👦" : "🤖"}
              </div>
              <div className={`relative max-w-[70%] px-6 py-4 rounded-[2rem] shadow-[0_8px_0_0_rgba(0,0,0,0.05)] border-2 text-lg font-medium leading-relaxed ${
                msg.role === "user" ? "bg-[#4ecdc4] text-white border-[#3dbbb2] rounded-br-none" : "bg-white text-gray-700 border-gray-100 rounded-tl-none"
              }`}>
                {msg.content}
                <div className={`absolute bottom-0 w-4 h-4 ${msg.role === "user" ? "-right-2 bg-[#4ecdc4] clip-path-right-tail" : "-left-2 bg-white clip-path-left-tail"}`}></div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 flex-row animate-pulse">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl border-2 border-white shadow-lg">🤖</div>
              <div className="bg-[#FF758F] border-2 border-white/40 px-8 py-5 rounded-[2.5rem] rounded-bl-none shadow-[0_12px_0_0_#E94E77] flex flex-col items-center gap-3">
                <span className="text-white font-black text-xs uppercase italic opacity-90">Tớ đang tìm đáp án...</span>
                <StairsLoader />
              </div>
            </div>
          )}
        </>
      )}
    </div>

    <footer className="w-full max-w-3xl mx-auto relative flex items-center">
      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="Nhập câu hỏi..."
        className="w-full rounded-full border border-gray-200 bg-white/90 px-6 py-4.5 text-[1.1rem] shadow-lg outline-none focus:border-[#4ecdc4]" />
      <button onClick={onSend} className="absolute right-4.5 rounded-full bg-[#4ecdc4] p-3 text-white transition hover:scale-110 active:scale-95" disabled={isLoading}>
        <span className="text-xl">✈️</span>
      </button>
    </footer>
  </main>
);