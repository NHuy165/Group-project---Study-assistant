import React from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizNavigator = ({ 
  quiz, questionStatus, currentIndex, isFilterActive, filteredIndexSet, jumpToQuestion 
}) => {
  const { isNight } = useTheme();

  return (
    <div className={`rounded-[2rem] border-2 p-5 ${isNight ? "bg-[#1a254f]/40 border-blue-400/10" : "bg-white/40 border-blue-50"}`}>
      <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-tighter">Danh sách câu hỏi</p>
      <div className="grid grid-cols-4 gap-2">
        {questionStatus.map((status, index) => {
          const isCurrent = index === currentIndex;
          const isMatch = !isFilterActive || filteredIndexSet.has(index);
          
          let btnClass = isNight ? "bg-white/5 border-white/10 text-white/40" : "bg-white border-gray-100 text-gray-400";

          if (quiz.isSubmitted) {
            // --- LOGIC KHI ĐÃ NỘP BÀI ---
            const q = quiz.questions[index];
            const isAttempted = !!q.attemptId;
            if (isAttempted) {
              const isCorrect = q.options?.find(o => o.id === q.attemptId)?.isCorrect;
              btnClass = isCorrect 
                ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/20";
            } else {
              btnClass = isNight 
                ? "bg-slate-600 border-slate-500 text-slate-200 shadow-md" 
                : "bg-slate-500 border-slate-600 text-white shadow-md";
            }
          } else {
            // --- LOGIC KHI ĐANG LÀM BÀI (ƯU TIÊN PHÂN VÂN) ---
            if (status.isFlagged) {
              // ƯU TIÊN SỐ 1: Nếu cắm cờ phân vân -> Hiện màu vàng ngay
              btnClass = isNight 
                ? "bg-yellow-400 border-yellow-500 text-yellow-950 shadow-[0_0_15px_rgba(250,204,21,0.3)]" 
                : "bg-yellow-400 border-yellow-500 text-yellow-950 shadow-md";
            } else if (status.isAnswered) {
              // ƯU TIÊN SỐ 2: Nếu đã làm nhưng không phân vân -> Hiện màu xanh
              btnClass = isNight
                ? "bg-[#4ecdc4]/80 border-[#4ecdc4] text-white"
                : "bg-[#4ecdc4] border-[#3eb7ae] text-white shadow-md";
            }
          }

          return (
            <button 
              key={status.id} onClick={() => isMatch && jumpToQuestion(index)} disabled={!isMatch}
              className={`relative flex items-center justify-center rounded-lg border-2 px-0 py-2.5 text-xs font-bold transition-all ${btnClass} ${
                isCurrent ? "ring-2 ring-offset-1 ring-blue-400/70 scale-105" : ""
              } ${!isMatch ? "opacity-10 scale-90 grayscale" : "hover:-translate-y-0.5 hover:shadow-sm"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizNavigator;