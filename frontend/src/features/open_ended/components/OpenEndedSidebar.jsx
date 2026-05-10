import React from "react";
import { SignOut, CircleDashed, CheckCircle, Question } from "@phosphor-icons/react";

export const OpenEndedSidebar = ({ 
  items, currentIndex, drafts, unsureItems, onSelect, onExit 
}) => {
  return (
    <aside className="flex w-1/4 min-w-[250px] flex-col rounded-[32px] border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur-md">
      
      {/* Nút Thoát */}
      <button 
        onClick={onExit}
        className="mb-6 flex w-fit items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-100"
      >
        <SignOut size={18} weight="bold" /> Thoát
      </button>

      <h2 className="mb-4 text-xl font-black uppercase tracking-wide text-[#2d8680]">
        Câu hỏi tự luận
      </h2>
      <hr className="mb-4 border-dashed border-gray-300" />

      {/* Danh sách các câu hỏi */}
      <div className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
        {items.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const hasAnswer = drafts[item.id]?.trim().length > 0;
          const isUnsure = unsureItems.has(item.id);

          // Logic chọn màu sắc
          let statusColor = "text-gray-500 bg-gray-50 hover:bg-gray-100";
          let StatusIcon = CircleDashed;

          if (isCurrent) {
            statusColor = "text-white bg-[#4ecdc4] shadow-md"; // Đang chọn
          } else if (isUnsure) {
            statusColor = "text-orange-600 bg-orange-100 border border-orange-300"; // Phân vân
            StatusIcon = Question;
          } else if (hasAnswer) {
            statusColor = "text-[#1d7bd8] bg-blue-50 border border-blue-200"; // Đã làm
            StatusIcon = CheckCircle;
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelect(idx)}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 font-bold transition-all ${statusColor}`}
            >
              <span>Câu {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
              {!isCurrent && <StatusIcon size={20} weight={hasAnswer ? "fill" : "regular"} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};