import React from "react";
import { useNavigate } from "react-router-dom";
import { PencilSimple, Trash, ArrowRight } from "@phosphor-icons/react";

export const RecentNotebooksCard = ({ interactions = [], isLoading }) => {
  const navigate = useNavigate();

  // Dữ liệu giả lập để bạn thấy giống hình 1 nhất (Nếu interactions đang rỗng)
  const displayItems = interactions.length > 0 ? interactions.slice(0, 3) : [
    { id: 'fake1', name: "Toán 1", description: "Ôn thi học kì • Cập nhật 2 giờ trước" }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-black text-[#444]">Sổ ghi chú gần đây</h3>
        <button className="text-sm font-extrabold text-[#1d7bd8] hover:underline">Xem tất cả</button>
      </div>

      <div className="flex flex-col gap-3">
        {displayItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => navigate(`/interaction/${item.id}`)}
            className="border-[1.5px] border-[#f1f5f9] rounded-[24px] bg-white p-4 flex items-center justify-between hover:border-[#1d7bd8]/40 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-14 h-14 rounded-[18px] bg-[#fffbeb] flex items-center justify-center border border-[#fde68a] shrink-0 shadow-inner">
                <span className="text-2xl drop-shadow-sm">📒</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-[#444] text-[16px]">{item.name}</h4>
                <p className="text-xs text-[#777] font-semibold mt-1 truncate">{item.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f0f9ff] text-[#0ea5e9] hover:bg-[#e0f2fe] transition-colors">
                <PencilSimple size={18} weight="bold" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2] transition-colors">
                <Trash size={18} weight="bold" />
              </button>
              <div className="w-12 h-10 flex items-center justify-center rounded-[14px] bg-[#ecfdf5] border border-[#a7f3d0] text-[#10b981] ml-2">
                <ArrowRight size={18} weight="bold" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};