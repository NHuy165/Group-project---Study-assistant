import React from "react";
import { CaretRight } from "@phosphor-icons/react";

const PATHS = [
  { id: 1, title: "Ôn tập", desc: "Luyện lại kiến thức qua bài tập", color: "#6b21a8", bg: "#f4f0fa", border: "#e9d5ff", emoji: "👩‍🎓" },
  { id: 2, title: "Học liệu", desc: "Khám phá tài liệu và bài giảng", color: "#047857", bg: "#ecfdf5", border: "#a7f3d0", emoji: "🦠" },
  { id: 3, title: "Thi thử", desc: "Làm bài thi thử để kiểm tra năng lực", color: "#b45309", bg: "#fffbeb", border: "#fde68a", emoji: "🐥" },
  { id: 4, title: "AI Hỏi đáp", desc: "Giải đáp thắc mắc cùng AI", color: "#be185d", bg: "#fdf2f8", border: "#fbcfe8", emoji: "🤖" },
];

export const LearningPathCard = () => (
  <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60">
    <div className="flex items-center gap-3 mb-1">
      <span className="text-2xl drop-shadow-sm">🚩</span>
      <h3 className="text-lg font-black text-[#444]">Hành trình học tập</h3>
    </div>
    <p className="text-[#777] text-sm font-semibold mb-6">Khám phá các hoạt động giúp bạn học hiệu quả mỗi ngày</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {PATHS.map((item) => (
        <div 
          key={item.id} 
          style={{ backgroundColor: item.bg, borderColor: item.border }}
          className="border-[1.5px] rounded-3xl p-5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group relative min-h-[140px]"
        >
          <div className="flex items-center justify-center w-12 h-12 text-4xl mb-3 drop-shadow-md">
            {item.emoji}
          </div>
          <div className="text-center w-full mt-auto pb-4">
            <h4 className="font-extrabold text-[15px] mb-1" style={{ color: item.color }}>{item.title}</h4>
            <p className="text-[11px] text-[#666] font-semibold leading-relaxed px-2">{item.desc}</p>
          </div>
          <div className="absolute bottom-3 right-3 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-black transition-colors">
            <CaretRight size={14} weight="bold" />
          </div>
        </div>
      ))}
    </div>
  </div>
);