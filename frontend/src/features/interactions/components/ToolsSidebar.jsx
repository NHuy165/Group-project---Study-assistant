
import React from "react";
import videoIcon from "../../../assets/icon/video.svg";
import slideIcon from "../../../assets/icon/slide.svg";
import quizIcon from "../../../assets/icon/Quiz.svg";

const TOOLS_LIST = [
  { id: 'video', name: 'Video', icon: videoIcon, isSvg: true },
  { id: 'slide', name: 'Slide', icon: slideIcon, isSvg: true },
  { id: 'mindmap', name: 'Mind Map', icon: '🧠', isSvg: false },
  { id: 'flashcard', name: 'Flashcard', icon: '📕', isSvg: false },
  { id: 'quiz', name: 'Quiz', icon: quizIcon, isSvg: true },
];

const MOCK_NOTES = [
  { id: 1, name: "Ghi chú 01" }, 
  { id: 2, name: "Ghi chú 02" }
];

export const ToolsSidebar = () => {
  return (
    <aside className="flex w-[20%] flex-col space-y-4 rounded-3xl bg-white/60 p-6 backdrop-blur-md shadow-xl border border-white/20">
      
      {/* Section Công cụ */}
      <section>
        <header className="mb-4 space-y-4">
          <div className="flex h-10 items-center space-x-2 text-2xl font-bold text-gray-800">
            <span>⚙️</span><h2>Công cụ</h2>
          </div>
          <hr className="border-t border-gray-400/30" />
        </header>

        <div className="grid grid-cols-2 gap-3">
          {TOOLS_LIST.map((item) => (
            <button key={item.id} className="flex flex-col items-center justify-center rounded-2xl bg-[#FFEDE2B2]/80 p-3 shadow-sm hover:scale-105 transition-transform">
              {item.isSvg ? (
                <img src={item.icon} alt={item.name} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-2xl">{item.icon}</span>
              )}
              <span className="mt-2 text-[10px] font-extrabold uppercase text-gray-700">{item.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section Ghi chú */}
      <section className="flex flex-1 flex-col overflow-hidden pt-2">
        <header className="mb-4 space-y-4">
          <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
            <span>📝</span><h2>Ghi chú</h2>
          </div>
          <hr className="border-t border-gray-400/30" />
        </header>

        <button className="mb-3 w-full shrink-0 rounded-2xl bg-[#bf94e4] py-3 font-bold text-white shadow-md transition hover:bg-[#b388d8] active:scale-95">
          + Thêm ghi chú
        </button>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {MOCK_NOTES.map((note) => (
            <div key={note.id} className="flex cursor-pointer items-center rounded-2xl bg-white/80 px-4 py-3 shadow-sm border transition-colors hover:border-[#bf94e4]/50">
              <span className="mr-3 text-sm text-gray-400">✍️</span>
              <span className="text-sm font-semibold text-gray-700">{note.name}</span>
            </div>
          ))}
        </nav>
      </section>

    </aside>
  );
};