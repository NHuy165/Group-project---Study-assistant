import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizMilestone = ({ milestoneMessage, clearMilestoneMessage }) => {
  const { isNight } = useTheme();
  // Set lưu trữ các mốc đã hiện để đảm bảo chỉ hiện 1 lần
  const [shownMilestones, setShownMilestones] = useState(new Set());

  useEffect(() => {
    if (milestoneMessage) {
      const milestoneId = milestoneMessage.title;
      
      if (!shownMilestones.has(milestoneId)) {
        // Nếu mốc này chưa từng xuất hiện -> Cho hiện 5 giây rồi tắt
        const timer = setTimeout(() => {
          clearMilestoneMessage();
          setShownMilestones(prev => new Set(prev).add(milestoneId));
        }, 5000);
        return () => clearTimeout(timer);
      } else {
        // Nếu đã từng xuất hiện rồi -> Ép tắt ngay lập tức
        clearMilestoneMessage();
      }
    }
  }, [milestoneMessage, shownMilestones, clearMilestoneMessage]);

  if (!milestoneMessage) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
      <div className={`flex max-w-xs items-start gap-3 rounded-2xl border-2 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
          isNight ? "bg-[#1e293b] border-blue-400 text-blue-100" : "bg-white border-blue-200 text-blue-900"
        }`}>
        <div className="text-xl pt-1">⭐</div>
        <div>
          <p className="font-black text-sm uppercase tracking-tight">{milestoneMessage.title}</p>
          <p className="text-xs opacity-90">{milestoneMessage.body}</p>
        </div>
        <button onClick={clearMilestoneMessage} className="rounded-full p-1 hover:bg-black/10 transition-all">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default QuizMilestone;