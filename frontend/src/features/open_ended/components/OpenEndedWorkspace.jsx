import React from "react";
import { CaretLeft, CaretRight, Question, PaperPlaneRight } from "@phosphor-icons/react";

export const OpenEndedWorkspace = ({
  currentItem, currentIndex, totalItems, 
  draftValue, isSubmitted, isUnsure,
  onChange, onBlur, onToggleUnsure, onPrev, onNext, onSubmit
}) => {
  return (
    <main className="flex flex-1 flex-col rounded-[32px] border border-white/40 bg-white/90 p-8 shadow-xl backdrop-blur-md">
      
      <header className="mb-6 flex items-start justify-between">
        <div>
          <span className="mb-1 inline-block rounded-lg bg-[#ffe4d9] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d46b3f]">
            Nội dung
          </span>
          <h3 className="text-2xl font-extrabold text-gray-800">
            <span className="mr-2 text-[#FF758F]">Câu {currentIndex + 1}:</span> 
            {currentItem.question}
          </h3>
        </div>
      </header>

      {/* Khung nhập liệu */}
      <div className="relative flex flex-1 flex-col">
        <textarea
          value={draftValue}
          onChange={(e) => onChange(currentItem.id, e.target.value)}
          onBlur={() => onBlur(currentItem.id)}
          disabled={isSubmitted}
          placeholder={isSubmitted ? "Không có câu trả lời." : "Nhập câu trả lời tự luận của bé vào đây..."}
          className={`custom-scrollbar flex-1 w-full resize-none rounded-[24px] border-2 p-6 text-[1.1rem] leading-relaxed outline-none transition-colors ${
            isSubmitted 
              ? "border-gray-200 bg-gray-100 text-gray-600" 
              : "border-gray-200 bg-gray-50 focus:border-[#4ecdc4] focus:bg-white text-gray-600"
          }`}
        />

        {/* Nhận xét AI (Nếu đã nộp bài) */}
        {isSubmitted && currentItem.explanation && (
           <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-yellow-200 bg-yellow-50/90 p-4 shadow-lg backdrop-blur-md">
              <p className="font-bold text-yellow-700">🤖 Cú Mèo nhận xét:</p>
              <p className="mt-1 text-gray-700">{currentItem.explanation}</p>
           </div>
        )}
      </div>

      {/* Thanh công cụ phía dưới */}
      <div className="mt-6 flex items-center justify-between">
        
        {/* Nút Phân Vân / Hiển thị điểm */}
        {!isSubmitted ? (
          <button 
            onClick={() => onToggleUnsure(currentItem.id)}
            className={`flex items-center gap-2 rounded-full border-2 px-5 py-2.5 font-bold transition-all ${
              isUnsure 
                ? "border-orange-400 bg-orange-100 text-orange-600" 
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Question size={20} weight={isUnsure ? "fill" : "bold"} />
            Phân vân
          </button>
        ) : (
          <div className="font-bold text-[#1d7bd8]">
            🎯 Điểm: {Math.round(currentItem.user_score || 0)} / {Math.round(currentItem.max_score || 0)}
          </div>
        )}

        {/* Cụm điều hướng & Nộp bài */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onPrev} disabled={currentIndex === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-30"
          >
            <CaretLeft size={24} weight="bold" />
          </button>
          
          <button 
            onClick={onNext} disabled={currentIndex === totalItems - 1}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-30"
          >
            <CaretRight size={24} weight="bold" />
          </button>

          {!isSubmitted && (
            <button 
              onClick={onSubmit}
              className="ml-4 flex items-center gap-2 rounded-full border-b-[4px] border-[#2d8680] bg-[#4ecdc4] px-8 py-3 text-[1.05rem] font-black tracking-wide text-white transition-all hover:-translate-y-1 hover:brightness-105 active:translate-y-1 active:border-b-0 active:brightness-95"
            >
              <PaperPlaneRight size={20} weight="fill" /> Nộp Bài
            </button>
          )}
        </div>

      </div>
    </main>
  );
};