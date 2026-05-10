import React from "react";
import videoIcon from "../../../assets/icon/video.svg";
import slideIcon from "../../../assets/icon/slide.svg";
import quizIcon from "../../../assets/icon/Quiz.svg";
import { Trash } from "@phosphor-icons/react";

// Lấy Context để biết trời sáng hay tối
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

const TOOLS_LIST = [
  // { id: 'video', name: 'Video', icon: videoIcon, isSvg: true },
  // { id: 'slide', name: 'Slide', icon: slideIcon, isSvg: true },
  { id: 'mindmap', name: 'Tap To Review', icon: '🧠', isSvg: false },
  { id: 'flashcard', name: 'Flashcard', icon: '📕', isSvg: false },
  { id: 'quiz', name: 'Quiz', icon: quizIcon, isSvg: true },
  { id: 'essay', name: 'Tự Luận', icon: '📝', isSvg: false },
];

const MOCK_NOTES = [
  { id: 1, name: "Ghi chú 01" }, 
  { id: 2, name: "Ghi chú 02" }
];

export const ToolsSidebar = ({ 
  onToolClick, 
  toolLoadingStates = {}, 
  activities = [], 
  onActivityClick, 
  onDeleteActivity,
  isCreatingNewActivity 
})  => {
  const { isNight } = useTheme(); // <--- Gọi hook theme

  return (
    <aside className={`flex w-[20%] flex-col space-y-4 rounded-3xl p-6 backdrop-md shadow-xl border transition-colors duration-500 ${
      isNight ? "bg-gray-900/60 border-gray-700/50" : "bg-white/30 border-white/20"
    }`}>
      
      {/* Section Công cụ */}
      <section>
        <header className="mb-4 space-y-4">
          <div className={`flex h-10 items-center space-x-2 text-2xl font-bold transition-colors ${
            isNight ? "text-gray-100" : "text-gray-800"
          }`}>
            <span>⚙️</span><h2>Công cụ</h2>
          </div>
          <hr className={`border-t transition-colors ${
            isNight ? "border-gray-600/50" : "border-gray-400/30"
          }`} />
        </header>

        <div className="grid grid-cols-2 gap-3">
          {TOOLS_LIST.map((item) => (
            <button key={item.id}
                    onClick={() => onToolClick && onToolClick(item.id)}
                    disabled={toolLoadingStates[item.id]}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 shadow-sm hover:scale-105 transition-all ${
                      isNight 
                        ? "bg-gray-800/80 border border-gray-700 text-gray-300" // Tối: Nền xám đậm, viền mờ, chữ xám nhạt
                        : "bg-[#FFEDE2B2]/80 text-gray-700"                     // Sáng: Nền cam nhạt, chữ đen
            }`}>
              {item.isSvg ? (
                <img src={item.icon} alt={item.name} className={`h-8 w-8 object-contain ${isNight ? "opacity-90" : ""}`} />
              ) : (
                <span className="text-2xl">{item.icon}</span>
              )}
              <span className="mt-2 text-[10px] font-extrabold uppercase opacity-90">{item.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section Ghi chú */}
      <section className="flex flex-1 flex-col overflow-hidden pt-2">
        <header className="mb-4 space-y-4">
          <div className={`flex items-center space-x-2 text-2xl font-bold transition-colors ${
            isNight ? "text-gray-100" : "text-gray-800"
          }`}>
            <span>📝</span><h2>Ghi chú</h2>
          </div>
          <hr className={`border-t transition-colors ${
            isNight ? "border-gray-600/50" : "border-gray-400/30"
          }`} />
        </header>

        <button className="mb-3 w-full shrink-0 rounded-2xl bg-[#bf94e4] py-3 font-bold text-white shadow-md transition hover:bg-[#b388d8] active:scale-95 hover:shadow-lg">
          + Thêm ghi chú
        </button>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {MOCK_NOTES.map((note) => (
            <div key={note.id} className={`flex cursor-pointer items-center rounded-2xl px-4 py-3 shadow-sm border transition-colors ${
              isNight 
                ? "bg-gray-800/80 border-gray-700 hover:border-[#bf94e4] text-gray-300" // Tối
                : "bg-white/80 border-transparent hover:border-[#bf94e4]/50 text-gray-700" // Sáng
            }`}>
              <span className="mr-3 text-sm opacity-80">✍️</span>
              <span className="text-sm font-semibold">{note.name}</span>
            </div>
          ))}
        
          {/* NẾU RỖNG THÌ BÁO CHƯA CÓ */}
          {activities.map((act) => (
            <div key={`act-${act.id}`} className="group relative flex w-full items-center">
              <button 
                key={act.id} 
                onClick={() => onActivityClick && onActivityClick(act.id)} // Bấm vào sẽ mở bài
                className={`flex cursor-pointer w-full items-center rounded-2xl px-4 py-3 shadow-sm border transition-all hover:scale-[1.02] active:scale-95 ${
                  isNight 
                    ? "bg-gray-800/80 border-gray-700 hover:border-[#4ecdc4] text-gray-300" 
                    : "bg-white/80 border-transparent hover:border-[#4ecdc4]/50 text-gray-700" 
                }`}
              >
                <span className="mr-3 text-sm opacity-80">📝</span>
                <span className="text-sm font-semibold truncate text-left">
                  {act.name || `Bài tập Tự luận #${act.id}`}
                </span>
              </button>
              <button 
              onClick={(e) => {
                e.stopPropagation(); // Ngăn việc click xóa làm mở luôn bài tập
                if (window.confirm("Bé có chắc chắn muốn xóa bài tập này không?")) {
                  onDeleteActivity(act.id);
                }
              }}
              // absolute right-2: Gắn chặt vào lề phải
              // opacity-0 group-hover:opacity-100: Mặc định tàng hình, di chuột vào "group" mới hiện
              className={`absolute right-2 flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl text-red-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 ${
                  isNight 
                    ? "hover:bg-gray-800/80" 
                    : "hover:bg-white/80" 
                }`}
            >
              <Trash size={18} weight="bold" />
            </button>
            </div>
          ))}
          {/* Hiển thị 1 ô đang loading khi AI đang tạo */}
          {isCreatingNewActivity && (
            <div className={`flex w-full animate-pulse items-center rounded-2xl px-4 py-3 shadow-sm border transition-all cursor-not-allowed ${
                isNight ? "bg-gray-800/50 border-gray-600" : "bg-gray-100/80 border-gray-300" 
            }`}>
              <span className="mr-3 text-sm opacity-50 animate-spin">⏳</span>
              <span className="text-sm font-semibold text-gray-400 italic">
                Cú Mèo đang soạn bài...
              </span>
            </div>
          )}
        </nav>
      </section>

      

    </aside>
  );
};