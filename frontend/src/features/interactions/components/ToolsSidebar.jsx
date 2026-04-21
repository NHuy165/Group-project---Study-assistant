import React from "react";

import videoIcon from "../../../assets/icon/video.svg";
import slideIcon from "../../../assets/icon/slide.svg";
import quizIcon from "../../../assets/icon/Quiz.svg";

export const ToolsSidebar = () => {
  // Danh sách công cụ hỗ trợ học tập
  const tools = [
    { name: 'Video', icon: videoIcon, isSvg: true },
    { name: 'Slide', icon: slideIcon, isSvg: true },
    { name: 'Mind Map', icon: '🧠', isSvg: false },
    { name: 'Flashcard', icon: '📕', isSvg: false },
    { name: 'Quiz', icon: quizIcon, isSvg: true },
  ];

  // Dữ liệu ghi chú mẫu 
  const notes = [
    { id: 1, name: "Ghi chú 01" },
    { id: 2, name: "Ghi chú 02" },
    { id: 3, name: "Ghi chú 03" },
  ];

  return (
    <aside className="flex w-[20%] flex-col space-y-4 rounded-3xl bg-white/60 p-6 backdrop-md shadow-xl border border-white/20">
      {/* PHẦN 1: CÔNG CỤ */}
      <header className="space-y-4">
        <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800 h-10">
          <span>⚙️</span>
          <h2>Công cụ</h2>
        </div>
        <hr className="border-t border-gray-400/30" />
      </header>

      <div className="grid grid-cols-2 gap-3">
        {tools.map((item) => (
          <button 
            key={item.name} 
            className="flex flex-col items-center justify-center rounded-2xl bg-[#FFEDE2B2]/80 p-3 space-y-2 shadow-sm hover:shadow-md transition hover:scale-105 active:scale-95"
          >
            {item.isSvg ? (
              <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-2xl">{item.icon}</span>
            )}
            <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-tight text-center leading-none">
                {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* PHẦN 2: GHI CHÚ */}
      <header className="space-y-4 pt-2">
        <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
          <span>📝</span>
          <h2>Ghi chú</h2>
        </div>
        <hr className="border-t border-gray-400/30" />
      </header>

      <button className="w-full rounded-2xl bg-[#bf94e4] py-3 font-bold text-white transition hover:bg-[#b388d8] shadow-md active:scale-95">
        + Thêm ghi chú
      </button>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-center rounded-2xl bg-white/80 px-4 py-3 shadow-sm hover:shadow-md transition cursor-pointer border border-transparent hover:border-[#bf94e4]/30"
          >
            <span className="text-gray-400 mr-3 text-sm">✍️</span>
            <span className="font-semibold text-gray-700 text-sm">{note.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};