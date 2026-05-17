import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizMilestone = ({ milestoneMessage, clearMilestoneMessage }) => {
  const { isNight } = useTheme();
  // State lưu trữ các mốc đã từng xuất hiện (ví dụ: "30% chặng đường!")
  const [history, setHistory] = useState(new Set());

  useEffect(() => {
    if (milestoneMessage) {
      const msgId = milestoneMessage.title;

      // Kiểm tra nếu mốc này đã từng hiện rồi thì tắt ngay lập tức, không hiện nữa
      if (history.has(msgId)) {
        clearMilestoneMessage();
        return;
      }

      // Nếu là lần đầu mốc này xuất hiện -> Đưa vào lịch sử và đặt timer 5 giây
      setHistory(prev => new Set(prev).add(msgId));

      const timer = setTimeout(() => {
        clearMilestoneMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [milestoneMessage, history, clearMilestoneMessage]);

  if (!milestoneMessage) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[120] animate-in slide-in-from-right-10 fade-in duration-500">
      <div className={`flex max-w-sm items-start gap-4 rounded-[1.5rem] border-4 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${
          isNight 
            ? "bg-[#1e293b] border-yellow-400 text-yellow-50 shadow-yellow-500/10" 
            : "bg-white border-yellow-400 text-gray-800 shadow-yellow-500/20"
        }`}>
        <div className="text-3xl animate-bounce">⭐</div>
        <div className="flex-1">
          <p className={`font-black text-sm uppercase tracking-wider mb-1 ${isNight ? "text-yellow-400" : "text-yellow-600"}`}>
            {milestoneMessage.title}
          </p>
          <p className="text-xs font-bold leading-relaxed opacity-90">
            {milestoneMessage.body}
          </p>
        </div>
        <button 
          onClick={clearMilestoneMessage} 
          className="rounded-full p-1 hover:bg-black/10 transition-all opacity-50 hover:opacity-100"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default QuizMilestone;