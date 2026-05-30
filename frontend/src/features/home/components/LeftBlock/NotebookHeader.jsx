import React from "react";
import { Link } from "react-router-dom";
import { WelcomeCard } from "./WelcomeCard";
import { CreateNotebookCard } from "./CreateNotebookCard";
import { LearningPathCard } from "./LearningPathCard";
import { RecentNotebooksCard } from "./RecentNotebooksCard";
import { StreakCard } from "./StreakCard";
import { useInteractions } from "../../../interactions/hooks/useInteractions";
import { useTheme } from "../../../../components/theme/ThemeWrapper";

export const NotebookHeader = () => {
  const { isNight } = useTheme();
  const {
    interactions,
    isLoading,
    formData,
    handleFormChange,
    createInteraction,
    updateInteraction,
    deleteInteraction,
  } = useInteractions();

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await createInteraction({
      name: formData.name.trim(),
      description: formData.description.trim() || "...",
    });
  };

  // ĐÃ SỬA: Đổi giao diện ban ngày sang kính mờ (Glassmorphism) đồng bộ với Sidebar phải
  const cardCls = isNight
    ? "bg-slate-900/90 border-white/[0.1] shadow-2xl"
    : "bg-white/60 border-white/60 backdrop-blur-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]";

  return (
    <div className="relative flex flex-col gap-4 h-[90vh] overflow-hidden pr-2 pb-4 pt-10">
      <Link
        to="/dashboard"
        className={`
          fixed left-8 top-5
          text-3xl md:text-4xl font-black tracking-tight
          transition-all duration-300 ease-out
          hover:scale-105
          active:scale-95
          cursor-pointer
          select-none
          ${
            isNight
              ? "hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
              : "hover:drop-shadow-[0_0_20px_rgba(37,99,235,0.35)]"
          }
        `}
      >
        <span className="text-meteor">EduSpark.AI</span>
      </Link>

      {/* ROW 1: Lời chào + Tạo sổ */}
      <div className="flex gap-4 shrink-0 items-center">
        <div
          className={`flex-[1.2] h-full rounded-[2rem] px-6 py-5 border-2 flex flex-col justify-center transition-all ${cardCls}`}
        >
          <WelcomeCard name="Hiệp" />
        </div>

        <div className="hidden md:flex flex-col items-center justify-center h-16 w-2 shrink-0 relative mx-1">
          <div
            className={`h-full w-[2px] rounded-full ${isNight ? "bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" : "bg-gradient-to-b from-transparent via-blue-500/60 to-transparent"}`}
          />
          <div className="absolute w-4 h-4 rounded-full bg-blue-500/10 border border-blue-400/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div
          className={`flex-[2] h-full rounded-[2rem] px-6 py-5 border-2 transition-all ${cardCls}`}
        >
          <CreateNotebookCard
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleCreateSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ROW 2: Hành trình học tập + Chuỗi học tập */}
      <div className="flex gap-4 shrink-0 h-[200px] items-center">
        <div className="flex-[3] min-w-0 h-full">
          <LearningPathCard />
        </div>

        <div className="hidden md:flex flex-col items-center justify-center h-24 w-2 shrink-0 relative mx-1">
          <div
            className={`h-full w-[2px] rounded-full ${isNight ? "bg-gradient-to-b from-transparent via-purple-500/40 to-transparent" : "bg-gradient-to-b from-transparent via-purple-500/60 to-transparent"}`}
          />
          <div className="absolute w-4 h-4 rounded-full bg-purple-500/10 border border-purple-400/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
          </div>
        </div>

        <div className="flex-[0.85] min-w-0 h-full">
          <StreakCard dayCount={3} />
        </div>
      </div>

      {/* ROW 3: Sổ gần đây */}
      <div className="flex-1 min-h-0">
        <RecentNotebooksCard
          interactions={interactions}
          isLoading={isLoading}
          onEdit={updateInteraction}
          onDelete={deleteInteraction}
        />
      </div>
    </div>
  );
};
