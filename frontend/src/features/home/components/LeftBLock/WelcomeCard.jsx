import React from "react";

export const WelcomeCard = ({ name = "Minh" }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-[2.5rem] leading-tight font-black text-[#1d7bd8] mb-1">
          Chào {name}! 👋
        </h1>
        <h2 className="text-[1.4rem] font-extrabold text-[#444]">
          Hôm nay mình muốn học gì nào?
        </h2>
        <p className="text-[#777] mt-2 text-sm font-semibold">
          Cùng khám phá và chinh phục kiến thức thật vui nhé!
        </p>
      </div>
    </div>
  );
};