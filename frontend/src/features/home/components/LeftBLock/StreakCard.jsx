import React from "react";

export const StreakCard = ({ dayCount = 3 }) => (
  <div className="bg-white/95 backdrop-blur-xl rounded-[32px] px-8 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="flex items-center gap-5 text-center md:text-left">
      <div className="text-5xl drop-shadow-md">👾</div>
      <div>
        <p className="font-black text-lg text-[#6b21a8]">Cố gắng mỗi ngày, tiến bộ mỗi ngày! 🚀</p>
        <p className="text-[13px] font-bold text-[#777] mt-1">Bạn đã học được {dayCount} ngày liên tiếp rồi đấy!</p>
      </div>
    </div>
    
    <div className="flex items-center gap-5 shrink-0">
      <div className="bg-[#fafafa] border-[1.5px] border-gray-200 rounded-full px-6 py-2.5 flex items-center gap-3 shadow-inner">
        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Chuỗi học tập</span>
        <span className="text-2xl font-black text-[#ea580c]">{dayCount}</span>
        <div className="flex gap-1">
          {[...Array(Math.min(dayCount, 5))].map((_, i) => (
            <span key={i} className="text-xl drop-shadow-sm">🔥</span>
          ))}
        </div>
      </div>
      <div className="text-4xl drop-shadow-lg animate-bounce hover:scale-110 transition-transform cursor-pointer">
        🎁
      </div>
    </div>
  </div>
);