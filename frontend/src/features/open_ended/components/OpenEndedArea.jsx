import React, { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 
import { useExerciseStore } from "../hooks/useExerciseStore";
import { OpenEndedSidebar } from "./OpenEndedSidebar";
import { OpenEndedWorkspace } from "./OpenEndedWorkspace";

export const OpenEndedArea = ({ 
  activityData, isLoading, isSubmitting, 
  error, clearError, testError, // Nhận thêm props
  onSaveDraft, onSubmit, onExit 
}) => {
  const { isNight } = useTheme(); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [drafts, setDrafts] = useState({}); 

  const [isMinTimePassed, setIsMinTimePassed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMinTimePassed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getUnsureItems = useExerciseStore(state => state.getUnsureItems);
  const toggleUnsure = useExerciseStore(state => state.toggleUnsure);
  const unsureItems = activityData?.id ? getUnsureItems(activityData.id) : new Set();

  useEffect(() => {
    if (activityData?.items) {
      const initialDrafts = {};
      activityData.items.forEach(item => { initialDrafts[item.id] = item.attempt || ""; });
      setDrafts(initialDrafts);
    }
  }, [activityData]);

  if (isLoading || !isMinTimePassed) {
    return (
      <div className="relative flex h-[82vh] w-[95vw] max-w-[1600px] flex-col items-center justify-center bg-transparent mt-12">
        <style>{`
          .book-wrapper { position: relative; width: 100px; height: 70px; perspective: 1000px; }
          .book-cover { position: absolute; inset: -4px; background: #a855f7; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
          .book-page { position: absolute; right: 0; width: 50%; height: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 0 4px 4px 0; transform-origin: left center; animation: page-flip 1.2s infinite linear; }
          @keyframes page-flip { 0% { transform: rotateY(0deg); opacity: 1; } 40% { opacity: 1; } 50% { transform: rotateY(-180deg); opacity: 0; } 100% { transform: rotateY(-180deg); opacity: 0; } }
        `}</style>
        <div className="book-wrapper">
          <div className="book-cover" />
          {[1,2,3].map(i => <div key={i} className="book-page" style={{animationDelay: `${(i-1)*0.4}s`}} />)}
        </div>
        <h3 className={`mt-8 text-xl font-black animate-pulse ${isNight ? 'text-white' : 'text-gray-800'}`}>ĐANG TRẢI TRANG GIẤY...</h3>
      </div>
    );
  }

  if (!activityData || !activityData.items || activityData.items.length === 0) return null;
  const items = activityData.items;
  const currentItem = items[currentIndex];

  return (
    <div className="relative flex h-[82vh] w-[95vw] max-w-[1600px] gap-8 mt-12 overflow-hidden bg-transparent">
      
      {/* ===================== BANNER HIỂN THỊ LỖI ===================== */}
      {error && (
        <div className="absolute top-4 left-1/2 z-[200] -translate-x-1/2 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center justify-between gap-4 rounded-2xl border px-6 py-4 shadow-2xl ${
            isNight ? "border-red-400/50 bg-[#2a1118]/95 text-red-200" : "border-red-300 bg-red-50 text-red-700"
          }`}>
            <span className="text-2xl">⚠️</span>
            <span className="text-[15px] font-bold">{error}</span>
            <button
              onClick={clearError}
              className={`ml-4 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${
                isNight ? "bg-red-500/30 text-red-100 hover:bg-red-500/50" : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* ===================== KHU VỰC TEST LỖI (Góc dưới trái) ===================== */}
      <div className={`absolute bottom-4 left-4 z-[200] flex flex-col gap-2 rounded-xl p-3 text-xs font-bold shadow-lg backdrop-blur-md ${isNight ? 'bg-slate-800/80 border border-slate-700' : 'bg-white/80 border border-slate-300'}`}>
        <p className={`text-center mb-1 ${isNight ? 'text-slate-300' : 'text-slate-600'}`}>Mô phỏng lỗi BE</p>
        <div className="grid grid-cols-2 gap-2">
            <button onClick={() => testError(400)} className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">400 Bad Req</button>
            <button onClick={() => testError(401)} className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">401 Auth</button>
            <button onClick={() => testError(404)} className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">404 Not Found</button>
            <button onClick={() => testError(409, "SUBMITTED_EXERCISE")} className="rounded bg-orange-500 px-2 py-1 text-white hover:bg-orange-600">409 Submitted</button>
            <button onClick={() => testError(500)} className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">500 Server</button>
            <button onClick={() => testError(502)} className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">502 AI Lỗi</button>
        </div>
      </div>

      {isSubmitting && (
        <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center rounded-[2.5rem] backdrop-blur-md ${isNight ? 'bg-black/60' : 'bg-white/60'}`}>
          <span className="text-6xl animate-bounce mb-4">🦉</span>
          <h3 className="text-2xl font-black text-[#4ecdc4]">ĐANG CHẤM BÀI...</h3>
        </div>
      )}

      <OpenEndedSidebar items={items} currentIndex={currentIndex} drafts={drafts} unsureItems={unsureItems} onSelect={setCurrentIndex} onExit={onExit} />
      
      <OpenEndedWorkspace 
        currentItem={currentItem} currentIndex={currentIndex} totalItems={items.length} 
        draftValue={drafts[currentItem.id] || ""} isSubmitted={activityData.is_submitted} isUnsure={unsureItems.has(currentItem.id)} 
        onChange={(id, val) => setDrafts(p => ({...p, [id]: val}))} 
        onBlur={(id) => { if (!activityData.is_submitted && onSaveDraft) onSaveDraft(id, drafts[id]); }} 
        onToggleUnsure={(id) => { if (activityData?.id) toggleUnsure(activityData.id, id); }} 
        onPrev={() => currentIndex > 0 && setCurrentIndex(p => p - 1)} 
        onNext={() => currentIndex < items.length - 1 && setCurrentIndex(p => p + 1)} 
        onSubmit={onSubmit} 
      />
    </div>
  );
};