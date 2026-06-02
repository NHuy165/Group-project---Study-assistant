import React from "react";
import { useTheme } from "../../../../components/theme/ThemeWrapper";
import robotPurple from "../../assets/robot-purple.png";

export const StreakCard = ({
  currentStreak = 0,
  longestStreak = 0,
  isLoading = false,
}) => {
  const { isNight } = useTheme();
  const currentValue = isLoading ? "--" : currentStreak;
  const longestValue = isLoading ? "--" : longestStreak;
  const flameCount = isLoading ? 0 : Math.min(currentStreak, 5);

  // Nền ngoài cùng của Card
  const cardCls = isNight
    ? "bg-gradient-to-br from-slate-900/80 to-purple-900/40 border-white/10 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]"
    : "bg-white/60 border-white/60 backdrop-blur-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]";

  return (
    <div
      className={`relative rounded-[2rem] p-5 border-2 w-full h-full flex flex-col transition-all duration-500 text-center overflow-visible ${cardCls}`}
    >
      <div className="w-full flex flex-col items-center h-full">
        <div className="flex items-center justify-center gap-1.5 w-full">
          <h3
            className={`text-[13px] font-black leading-snug ${isNight ? "text-purple-300 drop-shadow-sm" : "text-[#5b21b6]"}`}
          >
            Cố gắng mỗi ngày tiến bộ mỗi ngày!
          </h3>

          <img
            src={robotPurple}
            alt="Robot"
            className="w-8 h-8 shrink-0 drop-shadow-xl hover:scale-110 transition-transform origin-bottom"
          />
        </div>

        <p
          className={`text-[11.5px] font-semibold mt-1 ${isNight ? "text-gray-300" : "text-slate-500"}`}
        >
          Bạn đã học được {currentValue} ngày rồi đấy!
        </p>

        <div className="flex-1 min-h-2" />

        {/* Ô CHUỖI HỌC TẬP: Dùng nền đen mờ (bg-black/40) vào ban đêm để làm bệ phóng cho chữ sáng */}
        <div
          className={`mt-1 mb-1 flex flex-col items-center rounded-2xl p-2.5 w-[88%] border shadow-lg backdrop-blur-md transition-colors self-center ${
            isNight
              ? "bg-black/40 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              : "bg-white/50 border-white/60"
          }`}
        >
          {/* Chữ chuyển sang màu trắng/xám sáng */}
          <span
            className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isNight ? "text-gray-100 drop-shadow-md" : "text-slate-500"}`}
          >
            Chuỗi học tập
          </span>
          <div className="grid w-full grid-cols-2 gap-2 text-center">
            <div
              className={`rounded-xl px-2 py-2 ${isNight ? "bg-white/5" : "bg-white/70"}`}
            >
              <div
                className={`text-[9px] font-black uppercase tracking-wider ${isNight ? "text-gray-300" : "text-slate-500"}`}
              >
                Hiện tại
              </div>
              <div
                className={`mt-1 flex items-center justify-center gap-1 text-[22px] font-black leading-none ${
                  isNight
                    ? "text-[#ffb703] drop-shadow-[0_0_12px_rgba(255,183,3,0.6)]"
                    : "text-[#ea580c]"
                }`}
              >
                <span>{currentValue}</span>
                <span className="text-[16px] flex drop-shadow-md">
                  {[...Array(flameCount)].map((_, i) => (
                    <span key={i}>🔥</span>
                  ))}
                </span>
              </div>
            </div>

            <div
              className={`rounded-xl px-2 py-2 ${isNight ? "bg-white/5" : "bg-white/70"}`}
            >
              <div
                className={`text-[9px] font-black uppercase tracking-wider ${isNight ? "text-gray-300" : "text-slate-500"}`}
              >
                Dài nhất
              </div>
              <div
                className={`mt-1 text-[22px] font-black leading-none ${
                  isNight
                    ? "text-cyan-300 drop-shadow-[0_0_12px_rgba(103,232,249,0.35)]"
                    : "text-sky-600"
                }`}
              >
                {longestValue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
