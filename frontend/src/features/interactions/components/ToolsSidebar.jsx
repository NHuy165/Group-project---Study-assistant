import React, { useState, useMemo } from "react";
import { Trash } from "@phosphor-icons/react";
import quizIcon from "../../../assets/icon/Quiz.svg";
import { useTheme } from "../../../components/theme/ThemeWrapper";
import { ConfirmModal } from "../../../components/ConfirmModal"; 

// 100% original tools list
const TOOLS_LIST = [
  { id: 'mindmap', name: 'Tap To Review', icon: '🧠', isSvg: false },
  { id: 'flashcard', name: 'Flashcard', icon: '📕', isSvg: false },
  { id: 'quiz', name: 'Quiz', icon: quizIcon, isSvg: true },
  { id: 'essay', name: 'Tự Luận', icon: '📝', isSvg: false },
];

export const ToolsSidebar = ({ 
  activeToolId,
  onOpenTTR, 
  ttrTasks, 
  onPlayTTR, 
  onToolClick, 
  toolLoadingStates = {}, 
  activities = [], 
  onActivityClick, 
  onDeleteActivity, 
  isCreatingNewActivity,
  quizzes = [],
  isQuizLoading,
  onQuizClick,
  onDeleteQuiz
}) => {
  const { isNight } = useTheme(); 
  
  // Smart state to store the target item to delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ==========================================
  // SMART SORTING LOGIC: UNIFIED TIMELINE
  // ==========================================
  // Merge all learning materials into one array and sort descending by ID or Date
  const allLearningMaterials = useMemo(() => {
    // 1. Tag each item with its specific type and a fallback sort key (ID or createdAt)
    const formattedQuizzes = (quizzes || []).map(q => ({ ...q, _itemType: 'quiz', _sortKey: q.created_at || q.createdAt || q.id || 0 }));
    const formattedTtr = (ttrTasks || []).map(t => ({ ...t, _itemType: 'ttr', _sortKey: t.created_at || t.createdAt || t.id || 0 }));
    const formattedActivities = (activities || []).map(a => ({ ...a, _itemType: 'activity', _sortKey: a.created_at || a.createdAt || a.id || 0 }));

    // 2. Merge all arrays
    const mergedList = [...formattedQuizzes, ...formattedTtr, ...formattedActivities];

    // 3. Sort descending (Newest first)
    return mergedList.sort((a, b) => {
      if (a._sortKey > b._sortKey) return -1;
      if (a._sortKey < b._sortKey) return 1;
      return 0;
    });
  }, [quizzes, ttrTasks, activities]);

  return (
    <aside
      className={`flex w-[20%] flex-col space-y-4 rounded-3xl p-6 backdrop-md shadow-xl border transition-colors duration-500 ${
        isNight
          ? "bg-gray-900/60 border-gray-700/50"
          : "bg-white/30 border-white/20"
      }`}
    >
      {/* ========================================== */}
      {/* SECTION 1: CÔNG CỤ TẠO BÀI                 */}
      {/* ========================================== */}
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
          <hr className={`border-t transition-colors ${isNight ? "border-gray-600/50" : "border-gray-400/30"}`} />
        </header>

        <div className="grid grid-cols-2 gap-3">
          {TOOLS_LIST.map((item) => (
            <button 
              key={item.id} 
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

      {/* ========================================== */}
      {/* SECTION 2: DANH SÁCH HỌC LIỆU ĐÃ SORT      */}
      {/* ========================================== */}
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
          
          {/* INDICATOR OPEN ENDED LOADING (Show at top) */}
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

          {/* INDICATOR QUIZ LOADING (Show at top) */}
          {isQuizLoading && (
             <div className={`flex w-full animate-pulse items-center rounded-2xl px-4 py-3 shadow-sm border transition-all cursor-not-allowed ${
                isNight ? "bg-gray-800/50 border-gray-600" : "bg-gray-100/80 border-gray-300" 
            }`}>
              <span className="mr-3 text-sm opacity-50 animate-spin">⏳</span>
              <span className="text-sm font-semibold text-gray-400 italic">
                Đang tải danh sách...
              </span>
            </div>
          )}

          {/* RENDER SORTED UNIFIED LIST */}
          {allLearningMaterials.map((item) => {
            
            // --- QUIZ RENDER ---
            if (item._itemType === 'quiz') {
              return (
                <div key={`quiz-${item.id}`} className="group relative flex w-full items-center">
                  <button 
                    onClick={() => onQuizClick && onQuizClick(item.id)} 
                    className={`flex cursor-pointer w-full items-center rounded-2xl px-4 py-3 shadow-sm border transition-all hover:scale-[1.02] active:scale-95 ${
                      isNight 
                        ? "bg-gray-800/80 border-gray-700 hover:border-[#4ecdc4] text-gray-300" 
                        : "bg-white/80 border-transparent hover:border-[#4ecdc4]/50 text-gray-700" 
                    }`}
                  >
                    <span className="mr-3 text-sm opacity-80">🎯</span>
                    <span className="flex-1 truncate text-left text-sm font-semibold">
                      {item.title || item.name || `Quiz #${item.id}`}
                    </span>
                    {item.isSubmitted && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 opacity-90">
                        Đã nộp
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setDeleteTarget({ type: 'quiz', id: item.id, name: item.title || item.name });
                    }}
                    className={`absolute right-2 flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl text-red-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 ${
                      isNight ? "hover:bg-gray-800/80" : "hover:bg-gray-200" 
                    }`}
                  >
                    <Trash size={18} weight="bold" />
                  </button>
                </div>
              );
            }

            // --- TTR RENDER ---
            if (item._itemType === 'ttr') {
              return (
                <div 
                  key={`ttr-${item.id}`} 
                  onClick={() => item.status === 'ready' && onPlayTTR(item.id)}
                  className={`flex items-center rounded-2xl px-4 py-3 shadow-sm border transition-all ${
                  item.status === 'loading' 
                    ? (isNight ? 'bg-gray-800/40 border-gray-700 opacity-60 cursor-wait' : 'bg-gray-100/50 border-gray-200 opacity-70 cursor-wait')
                    : (isNight ? 'bg-gray-800/80 border-purple-500/50 hover:bg-gray-700 cursor-pointer hover:scale-105' : 'bg-white border-purple-300 hover:bg-purple-50 cursor-pointer hover:scale-105')
                }`}>
                  <span className="mr-3 text-sm flex-shrink-0">
                    {item.status === 'loading' ? (
                      <svg className="animate-spin h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : '🎮'}
                  </span>
                  <span className={`text-sm font-semibold truncate ${item.status === 'loading' ? 'animate-pulse text-gray-500' : (isNight ? 'text-gray-200' : 'text-purple-700')}`}>
                    {item.name}
                  </span>
                </div>
              );
            }

            // --- ACTIVITY (OPEN ENDED) RENDER ---
            if (item._itemType === 'activity') {
              return (
                <div key={`oe-${item.id}`} className="group relative flex w-full items-center">
                  <button 
                    onClick={() => onActivityClick && onActivityClick(item.id)} 
                    className={`flex cursor-pointer w-full items-center rounded-2xl px-4 py-3 shadow-sm border transition-all hover:scale-[1.02] active:scale-95 ${
                      isNight 
                        ? "bg-gray-800/80 border-gray-700 hover:border-[#4ecdc4] text-gray-300" 
                        : "bg-white/80 border-transparent hover:border-[#4ecdc4]/50 text-gray-700" 
                    }`}
                  >
                    <span className="mr-3 text-sm opacity-80">📝</span>
                    <span className="flex-1 truncate text-left text-sm font-semibold">
                      {item.name || `Bài tập #${item.id}`}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setDeleteTarget({ type: 'activity', id: item.id, name: item.name });
                    }}
                    className={`absolute right-2 flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl text-red-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 ${
                      isNight ? "hover:bg-gray-800/80" : "hover:bg-gray-200" 
                    }`}
                  >
                    <Trash size={18} weight="bold" />
                  </button>
                </div>
              );
            }

            return null;
          })}
        </nav>
      </section>

      {/* NHÚNG MODAL XÁC NHẬN XÓA THÔNG MINH */}
      <ConfirmModal
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={() => {
          if (deleteTarget) {
            // Routing delete API based on targeted item type
            if (deleteTarget.type === 'quiz') {
              onDeleteQuiz(deleteTarget.id);
            } else if (deleteTarget.type === 'activity') {
              onDeleteActivity(deleteTarget.id);
            }
            // For future: else if (deleteTarget.type === 'ttr') onDeleteTTR(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Xóa Học Liệu?"
        message={`Bé có chắc chắn muốn xóa bài "${deleteTarget?.name || 'này'}" không? Dữ liệu không thể khôi phục.`}
        isDanger={true}
      />
    </aside>
  );
};