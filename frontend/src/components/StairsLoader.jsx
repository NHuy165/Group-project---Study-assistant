import React from 'react';

export const StairsLoader = () => {
  return (
    <div className="relative h-20 w-36 flex items-end justify-start px-2 overflow-visible">
      {/* Trái bóng */}
      <div 
        className="absolute bottom-6 left-2 w-5 h-5 bg-gradient-to-br from-white to-yellow-200 rounded-full shadow-[0_5px_15px_rgba(255,255,255,0.4)] z-20 border-2 border-yellow-300"
        style={{ 
            animation: 'ball-parabolic-jump 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' 
        }}
      ></div>

      {/* Các bậc thang */}
      <div className="flex items-end gap-3 w-full h-[85%]">
        {[
          { color: "from-cyan-400 to-blue-500", h: "35%", delay: "-0.5s" }, // Bậc 1: Chạm lúc 0s
          { color: "from-green-400 to-emerald-500", h: "55%", delay: "0.25s" },   // Bậc 2: Chạm lúc 0.5s
          { color: "from-yellow-400 to-orange-500", h: "75%", delay: "1s" }, // Bậc 3: Chạm lúc 1.25s
          { color: "from-pink-500 to-red-500", h: "95%", delay: "1.75s" }       // Bậc 4: Chạm lúc 2.0s
        ].map((step, i) => (
          <div 
            key={i}
            className={`w-7 rounded-t-xl bg-gradient-to-t ${step.color} origin-bottom shadow-md`}
            style={{ 
              height: step.h,
              animation: `step-impact 2.5s ease-out infinite`,
              animationDelay: step.delay
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};