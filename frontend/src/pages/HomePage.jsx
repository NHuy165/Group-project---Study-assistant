import React from "react";
import { ThemeWrapper, useTheme } from "../components/theme/ThemeWrapper";
import { NotebookHeader } from "../features/home/components/LeftBlock/NotebookHeader";
import { UserProfileCard } from "../features/home/components/LeftBlock/UserProfileCard"; 

const HomeContent = () => {
  const { isNight } = useTheme();

  // Thêm backdrop-blur-xl và giảm bg xuống 60% để mờ ảo
  const sidebarCardCls = isNight
    ? "bg-slate-900/60 border-white/[0.08] backdrop-blur-xl"
    : "bg-white/60 border-white/60 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]";

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden gap-8 px-8 lg:px-12 pt-24 pb-8 w-full">
        
        {/* CỘT TRÁI: Nội dung chính */}
        <div className="flex-1 overflow-hidden min-w-[600px]">
          <NotebookHeader />
        </div>

        {/* CỘT PHẢI: Sidebar Profile & Charts */}
        <aside className="w-[340px] shrink-0 flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-6 pr-2">
          
          {/* ĐÃ TÁCH FILE: Gọi Component UserProfileCard vào đây */}
          <UserProfileCard name="Minh" />

          {/* Card: Chart 1 */}
          <div className={`rounded-[1.5rem] p-5 border-2 flex flex-col min-h-[240px] transition-all ${sidebarCardCls}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-500">🪴</span>
              <h4 className={`text-[13px] font-extrabold ${isNight ? "text-slate-200" : "text-slate-800"}`}>
                Tiến độ học tập
              </h4>
            </div>
            <div className="flex-1 bg-white/40 rounded-2xl flex items-center justify-center border border-dashed border-slate-300 text-xs font-semibold text-slate-400">
              [Radar Chart Placeholder]
            </div>
          </div>

          {/* Card: Chart 2 */}
          <div className={`rounded-[1.5rem] p-5 border-2 flex flex-col min-h-[240px] transition-all ${sidebarCardCls}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-500">📊</span>
              <h4 className={`text-[13px] font-extrabold ${isNight ? "text-slate-200" : "text-slate-800"}`}>
                Điểm số trung bình
              </h4>
            </div>
            <div className="flex-1 bg-white/40 rounded-2xl flex items-center justify-center border border-dashed border-slate-300 text-xs font-semibold text-slate-400">
              [Donut Chart Placeholder]
            </div>
          </div>

          {/* Card: Chart 3 */}
          <div className={`rounded-[1.5rem] p-5 border-2 flex flex-col min-h-[200px] transition-all ${sidebarCardCls}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-purple-500">📈</span>
              <h4 className={`text-[13px] font-extrabold ${isNight ? "text-slate-200" : "text-slate-800"}`}>
                Biểu đồ tiến bộ
              </h4>
            </div>
            <div className="flex-1 bg-white/40 rounded-2xl flex items-center justify-center border border-dashed border-slate-300 text-xs font-semibold text-slate-400">
              [Line Chart Placeholder]
            </div>
          </div>
          
        </aside>
      </div>
    </div>
  );
};

export const HomePage = () => (
  <ThemeWrapper showToggle={true}>
    <HomeContent />
  </ThemeWrapper>
);