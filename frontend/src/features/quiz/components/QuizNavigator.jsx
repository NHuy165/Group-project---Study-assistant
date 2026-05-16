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
            const q = quiz.questions[index];
            const isAttempted = !!q.attemptId;
            if (isAttempted) {
              const isCorrect = q.options?.find(o => o.id === q.attemptId)?.isCorrect;
              // LOGIC HIỆN MÀU ĐỎ KHI SAI NẰM Ở ĐÂY:
              btnClass = isCorrect 
                ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/20";
            } else {
              btnClass = "bg-gray-400 border-gray-500 text-white opacity-40";
            }
          } else if (status.isAnswered) {
            btnClass = "bg-[#4ecdc4] border-[#3eb7ae] text-white shadow-md";
          } else if (status.isFlagged) {
            btnClass = "bg-yellow-400 border-yellow-500 text-yellow-950 shadow-md";
          }

          return (
            <button 
              key={status.id} onClick={() => isMatch && jumpToQuestion(index)} disabled={!isMatch}
              className={`aspect-square flex items-center justify-center rounded-xl border-2 text-xs font-black transition-all ${btnClass} ${
                isCurrent ? "ring-4 ring-blue-400/30 scale-110" : ""
              } ${!isMatch ? "opacity-10 scale-90 grayscale" : "hover:-translate-y-1"}`}
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