import React from "react";
import { useTheme } from "../../../../components/theme/ThemeWrapper";

export const WelcomeCard = ({ name = "Hiệp" }) => {
  const { isNight } = useTheme();

  return (
    <div className="w-full text-center xl:text-left">
      <h1 className={`text-[1.8rem] font-black mb-1 leading-normal ${isNight ? "text-blue-400" : "text-[#1d7bd8]"}`}>
        Chào Bạn! 👋
      </h1>
      <h2 className={`text-[1.2rem] font-extrabold mb-1.5 ${isNight ? "text-slate-200" : "text-[#1e293b]"}`}>
        Hôm nay muốn học gì?
      </h2>
      <p className={`text-[13px] font-semibold leading-snug ${isNight ? "text-slate-400" : "text-slate-500"}`}>
        Cùng khám phá và chinh phục kiến thức thật vui nhé!
      </p>
    </div>
  );
};