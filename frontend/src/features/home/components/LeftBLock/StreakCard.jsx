import React from "react";
import { useTheme } from "../../../../components/theme/ThemeWrapper";
import robotPurple from "../../assets/robot-purple.png";

export const StreakCard = ({ dayCount = 3 }) => {
  const { isNight } = useTheme();

  // ĐÃ SỬA NỀN KÍNH
  const cardCls = isNight
    ? "bg-gradient-to-br from-slate-900/80 to-purple-900/20 border-white/[0.08]"
    : "bg-white/60 border-white/60 backdrop-blur-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]";

  return (
    <div className={`relative rounded-[2rem] p-4 border-2 w-full h-full flex flex-col items-center justify-center transition-all duration-500 text-center overflow-visible ${cardCls}`}>
      
      <img src={robotPurple} alt="Robot" className="absolute -left-4 -bottom-1 w-24 h-24 z-10 drop-shadow-xl hover:scale-110 transition-transform origin-bottom" />
      
      <div className="pl-12 w-full flex flex-col items-center">
        <h3 className={`text-[13px] font-black leading-snug ${isNight ? "text-purple-400" : "text-[#5b21b6]"}`}>
          Cố gắng mỗi ngày tiến bộ mỗi ngày! 
        </h3>

        <p className={`text-[11.5px] font-semibold ${isNight ? "text-slate-400" : "text-slate-500"}`}>
          Bạn đã học được {dayCount} ngày rồi đấy!
        </p>

        <div className="mt-3 flex flex-col items-center bg-white/40 dark:bg-black/20 rounded-xl p-2 w-[85%] border border-white/50 shadow-sm">
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isNight ? "text-slate-400" : "text-slate-500"}`}>
            Chuỗi học tập
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[24px] font-black text-[#ea580c] leading-none drop-shadow-sm">{dayCount}</span>
            <span className="text-[18px] flex">
              {[...Array(Math.min(dayCount, 5))].map((_, i) => <span key={i}>🔥</span>)}
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
};