import React from "react";
import { useTheme } from "../../../../components/theme/ThemeWrapper";
import robotPurple from "../../assets/robot-purple.png";

export const StreakCard = ({ dayCount = 3 }) => {
  const { isNight } = useTheme();

  // Nền ngoài cùng của Card
  const cardCls = isNight
    ? "bg-gradient-to-br from-slate-900/80 to-purple-900/40 border-white/10 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]"
    : "bg-white/60 border-white/60 backdrop-blur-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]";

  return (
    <div className={`relative rounded-[2rem] p-4 border-2 w-full h-full flex flex-col items-center justify-center transition-all duration-500 text-center overflow-visible ${cardCls}`}>
      
      <img src={robotPurple} alt="Robot" className="absolute -left-4 -bottom-1 w-24 h-24 z-10 drop-shadow-xl hover:scale-110 transition-transform origin-bottom" />
      
      <div className="pl-12 w-full flex flex-col items-center">
        <h3 className={`text-[13px] font-black leading-snug ${isNight ? "text-purple-300 drop-shadow-sm" : "text-[#5b21b6]"}`}>
          Cố gắng mỗi ngày tiến bộ mỗi ngày! 
        </h3>

        <p className={`text-[11.5px] font-semibold mt-1 ${isNight ? "text-gray-300" : "text-slate-500"}`}>
          Bạn đã học được {dayCount} ngày rồi đấy!
        </p>

        {/* Ô CHUỖI HỌC TẬP: Dùng nền đen mờ (bg-black/40) vào ban đêm để làm bệ phóng cho chữ sáng */}
        <div className={`mt-3 flex flex-col items-center rounded-2xl p-2.5 w-[85%] border shadow-lg backdrop-blur-md transition-colors ${
          isNight ? "bg-black/40 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" : "bg-white/50 border-white/60"
        }`}>
          {/* Chữ chuyển sang màu trắng/xám sáng */}
          <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isNight ? "text-gray-100 drop-shadow-md" : "text-slate-500"}`}>
            Chuỗi học tập
          </span>
          
          <div className="flex items-center gap-2">
            {/* Chữ số*/}
            <span className={`text-[28px] font-black leading-none ${
              isNight ? "text-[#ffb703] drop-shadow-[0_0_12px_rgba(255,183,3,0.6)]" : "text-[#ea580c]"
            }`}>
              {dayCount}
            </span>
            {/* Lửa*/}
            <span className="text-[20px] flex drop-shadow-md">
              {[...Array(Math.min(dayCount, 5))].map((_, i) => <span key={i}>🔥</span>)}
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
};