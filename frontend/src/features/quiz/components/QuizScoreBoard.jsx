import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizScoreBoard = ({ scoreSummary, scorePercent, resultFilter, setResultFilter }) => {
  const { isNight } = useTheme();

  if (!scoreSummary) return null;

  return (
    <div className={`rounded-3xl p-6 text-center shadow-lg transition-all ${isNight ? "bg-[#1a254f] text-white" : "border border-[#a5f3fc]/60 bg-gradient-to-br from-white via-[#fff3e6] to-[#e0f2fe] text-gray-800"}`}>
      <h3 className="text-xl font-bold opacity-80">Kết quả bài làm</h3>
      
      {/* Score details */}
      <div className="mt-4 flex items-center justify-center gap-12">
        <div>
          <p className={`text-4xl font-extrabold ${isNight ? "text-[#4ecdc4]" : "text-emerald-600"}`}>
            {scoreSummary.totalScore} <span className={`text-lg ${isNight ? "text-slate-300" : "text-gray-500"}`}> / {scoreSummary.totalMaxScore}</span>
          </p>
          <p className="mt-1 text-sm font-medium uppercase tracking-wider opacity-60">Điểm số</p>
        </div>
        <div className={`h-16 w-px ${isNight ? "bg-white/10" : "bg-[#a7f3d0]/50"}`}></div>
        <div>
          <p className={`text-4xl font-extrabold ${isNight ? "text-blue-400" : "text-sky-600"}`}>{scorePercent}%</p>
          <p className="mt-1 text-sm font-medium uppercase tracking-wider opacity-60">Tỉ lệ đúng</p>
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => setResultFilter("all")} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm ${resultFilter === "all" ? "bg-[#4ecdc4] text-white border-[#4ecdc4]" : isNight ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100" : "border-gray-200 bg-white text-gray-700"}`}>
          Tất cả
        </button>
        <button onClick={() => setResultFilter("correct")} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm ${resultFilter === "correct" ? "bg-green-500 text-white border-green-500" : isNight ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100" : "border-gray-200 bg-white text-gray-700"}`}>
          <CheckCircle2 size={16} /> Câu đúng
        </button>
        <button onClick={() => setResultFilter("wrong")} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm ${resultFilter === "wrong" ? "bg-red-500 text-white border-red-500" : isNight ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100" : "border-gray-200 bg-white text-gray-700"}`}>
          <XCircle size={16} /> Câu sai
        </button>
      </div>
    </div>
  );
};

export default QuizScoreBoard;