import React from "react";
import videoIcon from "../../../assets/icon/video.svg";
import slideIcon from "../../../assets/icon/slide.svg";
import quizIcon from "../../../assets/icon/Quiz.svg";
import { Trash } from "@phosphor-icons/react";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

const TOOLS_LIST = [
  { id: 'mindmap', name: 'Tap To Review', icon: '🧠', isSvg: false },
  { id: 'flashcard', name: 'Flashcard', icon: '📕', isSvg: false },
  { id: 'quiz', name: 'Quiz', icon: quizIcon, isSvg: true },
  { id: 'essay', name: 'Tự Luận', icon: '📝', isSvg: false },
];

// NHẬN GỘP PROPS TỪ CẢ 2 NHÁNH
export const ToolsSidebar = ({ 
  onOpenTTR, ttrTasks, onPlayTTR, 
  onToolClick, toolLoadingStates = {}, activities = [], onActivityClick, onDeleteActivity, isCreatingNewActivity,
  flashcardSets = [], onOpenFlashcardSet, onDeleteFlashcardSet,
}) => {
  const { isNight } = useTheme(); 

  const handleToolClick = (toolId) => {
    if (onToolClick) {
      onToolClick(toolId);
    }
  };

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
          <hr className={`border-t transition-colors ${isNight ? "border-gray-600/50" : "border-gray-400/30"}`} />
        </header>

        <div className="grid grid-cols-2 gap-3">
          {TOOLS_LIST.map((item) => (
            <button 
              key={item.id} 
              // GỘP LOGIC CLICK: Nếu là TTR thì mở modal setup, nếu công cụ khác thì gọi ToolSetupArea
              onClick={() => {
                if (item.id === 'mindmap' && onOpenTTR) {
                  onOpenTTR();
                } else if (onToolClick) {
                  onToolClick(item.id);
                }
              }}
              disabled={toolLoadingStates[item.id]}
              className={`flex flex-col items-center justify-center rounded-2xl p-3 shadow-sm hover:scale-105 transition-all ${
                isNight 
                  ? "bg-gray-800/80 border border-gray-700 text-gray-300"
                  : "bg-[#FFEDE2B2]/80 text-gray-700"
              }`}
            >
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

      {/* Section Học Liệu */}
      <section className="flex flex-1 flex-col overflow-hidden pt-2">
        <header className="mb-4 space-y-4">
          <div className={`flex items-center space-x-2 text-2xl font-bold transition-colors ${
            isNight ? "text-gray-100" : "text-gray-800"
          }`}>
            <span>📝</span><h2>Học Liệu</h2>
          </div>
          <hr className={`border-t transition-colors ${isNight ? "border-gray-600/50" : "border-gray-400/30"}`} />
        </header>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">

          {/* HIỂN THỊ DANH SÁCH BÀI TTR */}
          {ttrTasks && ttrTasks.map((task) => (
            <div 
              key={`ttr-${task.id}`} 
              onClick={() => task.status === 'ready' && onPlayTTR(task.id)}
              className={`flex items-center rounded-2xl px-4 py-3 shadow-sm border transition-all ${
              task.status === 'loading' 
                ? (isNight ? 'bg-gray-800/40 border-gray-700 opacity-60 cursor-wait' : 'bg-gray-100/50 border-gray-200 opacity-70 cursor-wait')
                : (isNight ? 'bg-gray-800/80 border-purple-500/50 hover:bg-gray-700 cursor-pointer hover:scale-105' : 'bg-white border-purple-300 hover:bg-purple-50 cursor-pointer hover:scale-105')
            }`}>
              <span className="mr-3 text-sm flex-shrink-0">
                {task.status === 'loading' ? (
                  <svg className="animate-spin h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : '🎮'}
              </span>
              <span className={`text-sm font-semibold truncate ${task.status === 'loading' ? 'animate-pulse text-gray-500' : (isNight ? 'text-gray-200' : 'text-purple-700')}`}>
                {task.name}
              </span>
            </div>
          ))}

          {/* HIỂN THỊ DANH SÁCH BỘ FLASHCARD */}
          {flashcardSets && flashcardSets.map((set) => (
            <div key={`flashcard-${set.id}`} className="group relative flex w-full items-center">
              <button
                onClick={() => onOpenFlashcardSet && onOpenFlashcardSet(set)}
                className={`flex cursor-pointer w-full items-center rounded-2xl px-4 py-3 shadow-sm border transition-all hover:scale-[1.02] active:scale-95 ${
                  isNight
                    ? "bg-gray-800/80 border-indigo-500/40 hover:border-indigo-400 text-gray-300"
                    : "bg-white/80 border-indigo-200 hover:border-indigo-400/70 text-gray-700"
                }`}
              >
                <span className="mr-3 text-sm opacity-80">📕</span>
                <span className={`text-sm font-semibold truncate text-left w-3/4 ${
                  isNight ? "text-indigo-100" : "text-indigo-700"
                }`}>
                  {set.name || `Flashcard #${set.id}`}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFlashcardSet && onDeleteFlashcardSet(set.id);
                }}
                className={`absolute right-2 flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl text-red-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 ${
                  isNight ? "hover:bg-gray-800/80" : "hover:bg-gray-200"
                }`}
              >
                <Trash size={18} weight="bold" />
              </button>
            </div>
          ))}
        
          {/* HIỂN THỊ DANH SÁCH BÀI OPEN-ENDED */}
          {activities && activities.map((act) => (
            <div key={`oe-${act.id}`} className="group relative flex w-full items-center">
              <button 
                onClick={() => onActivityClick && onActivityClick(act.id)} 
                className={`flex cursor-pointer w-full items-center rounded-2xl px-4 py-3 shadow-sm border transition-all hover:scale-[1.02] active:scale-95 ${
                  isNight 
                    ? "bg-gray-800/80 border-gray-700 hover:border-[#4ecdc4] text-gray-300" 
                    : "bg-white/80 border-transparent hover:border-[#4ecdc4]/50 text-gray-700" 
                }`}
              >
                <span className="mr-3 text-sm opacity-80">📝</span>
                <span className="text-sm font-semibold truncate text-left w-3/4">
                  {act.name || `Bài tập #${act.id}`}
                </span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (window.confirm("Bé có chắc chắn muốn xóa bài tập này không?")) {
                    onDeleteActivity(act.id);
                  }
                }}
                className={`absolute right-2 flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl text-red-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 ${
                  isNight ? "hover:bg-gray-800/80" : "hover:bg-gray-200" 
                }`}
              >
                <Trash size={18} weight="bold" />
              </button>
            </div>
          ))}

          {/* INDICATOR OPEN ENDED LOADING */}
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
