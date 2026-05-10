import React from "react";
import videoIcon from "../../../assets/icon/video.svg";
import slideIcon from "../../../assets/icon/slide.svg";
import quizIcon from "../../../assets/icon/Quiz.svg";

// Lấy Context để biết trời sáng hay tối
import { useTheme } from "../../../components/theme/ThemeWrapper";

const TOOLS_LIST = [
  { id: "video", name: "Video", icon: videoIcon, isSvg: true },
  { id: "slide", name: "Slide", icon: slideIcon, isSvg: true },
  { id: "mindmap", name: "Tap To Review", icon: "🧠", isSvg: false },
  { id: "flashcard", name: "Flashcard", icon: "📕", isSvg: false },
  { id: "quiz", name: "Quiz", icon: quizIcon, isSvg: true },
];

const MOCK_NOTES = [
  { id: 1, name: "Ghi chú 01" },
  { id: 2, name: "Ghi chú 02" },
];

export const ToolsSidebar = ({ activeToolId, onSelectTool }) => {
  const { isNight } = useTheme(); // <--- Gọi hook theme

  return (
    <aside
      className={`flex w-[20%] flex-col space-y-4 rounded-3xl p-6 backdrop-md shadow-xl border transition-colors duration-500 ${
        isNight
          ? "bg-gray-900/60 border-gray-700/50"
          : "bg-white/30 border-white/20"
      }`}
    >
      {/* Section Công cụ */}
      <section>
        <header className="mb-4 space-y-4">
          <div
            className={`flex h-10 items-center space-x-2 text-2xl font-bold transition-colors ${
              isNight ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <span>⚙️</span>
            <h2>Công cụ</h2>
          </div>
          <hr
            className={`border-t transition-colors ${
              isNight ? "border-gray-600/50" : "border-gray-400/30"
            }`}
          />
        </header>

        <div className="grid grid-cols-2 gap-3">
          {TOOLS_LIST.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTool?.(item.id)}
              className={`flex flex-col items-center justify-center rounded-2xl p-3 shadow-sm hover:scale-105 transition-all ${
                isNight
                  ? "bg-gray-800/80 border border-gray-700 text-gray-300"
                  : "bg-[#FFEDE2B2]/80 text-gray-700"
              } ${activeToolId === item.id ? "ring-2 ring-[#4ecdc4]" : ""}`}
            >
              {item.isSvg ? (
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`h-8 w-8 object-contain ${isNight ? "opacity-90" : ""}`}
                />
              ) : (
                <span className="text-2xl">{item.icon}</span>
              )}
              <span className="mt-2 text-[10px] font-extrabold uppercase opacity-90">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Section Ghi chú */}
      <section className="flex flex-1 flex-col overflow-hidden pt-2">
        <header className="mb-4 space-y-4">
          <div
            className={`flex items-center space-x-2 text-2xl font-bold transition-colors ${
              isNight ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <span>📝</span>
            <h2>Ghi chú</h2>
          </div>
          <hr
            className={`border-t transition-colors ${
              isNight ? "border-gray-600/50" : "border-gray-400/30"
            }`}
          />
        </header>

        <button className="mb-3 w-full shrink-0 rounded-2xl bg-[#bf94e4] py-3 font-bold text-white shadow-md transition hover:bg-[#b388d8] active:scale-95 hover:shadow-lg">
          + Thêm ghi chú
        </button>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {MOCK_NOTES.map((note) => (
            <div
              key={note.id}
              className={`flex cursor-pointer items-center rounded-2xl px-4 py-3 shadow-sm border transition-colors ${
                isNight
                  ? "bg-gray-800/80 border-gray-700 hover:border-[#bf94e4] text-gray-300" // Tối
                  : "bg-white/80 border-transparent hover:border-[#bf94e4]/50 text-gray-700" // Sáng
              }`}
            >
              <span className="mr-3 text-sm opacity-80">✍️</span>
              <span className="text-sm font-semibold">{note.name}</span>
            </div>
          ))}
        </nav>
      </section>
    </aside>
  );
};
