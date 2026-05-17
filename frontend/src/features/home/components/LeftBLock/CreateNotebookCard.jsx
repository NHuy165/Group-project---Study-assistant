import React from "react";

export const CreateNotebookCard = ({ formData, onChange, onSubmit, isLoading }) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className="bg-white/95 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col xl:flex-row items-center gap-6"
    >
      {/* Icon bên trái */}
      <div className="w-16 h-16 rounded-[20px] bg-[#eef7ff] flex items-center justify-center border-2 border-[#d0e8ff] shrink-0 shadow-inner">
        <span className="text-3xl">📘</span>
      </div>
      
      {/* Cụm Input ở giữa */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-extrabold text-[#555] block mb-2 ml-1">Tên sổ ghi chú</label>
          <input 
            name="name"
            value={formData?.name || ""}
            onChange={onChange}
            type="text" 
            placeholder="Ví dụ: Toán lớp 5..." 
            className="w-full bg-white border-[1.5px] border-[#e2e8f0] rounded-2xl px-5 py-3.5 focus:border-[#1d7bd8] focus:ring-4 focus:ring-[#1d7bd8]/10 transition-all outline-none text-sm font-semibold placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="text-sm font-extrabold text-[#555] block mb-2 ml-1">Mô tả ngắn</label>
          <input 
            name="description"
            value={formData?.description || ""}
            onChange={onChange}
            type="text" 
            placeholder="Ví dụ: Ôn thi giữa kỳ..." 
            className="w-full bg-white border-[1.5px] border-[#e2e8f0] rounded-2xl px-5 py-3.5 focus:border-[#1d7bd8] focus:ring-4 focus:ring-[#1d7bd8]/10 transition-all outline-none text-sm font-semibold placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Nút bấm bên phải */}
      <div className="flex items-center gap-4 shrink-0 mt-4 xl:mt-0 xl:self-end mb-1">
        <div className="hidden lg:block text-5xl opacity-90 drop-shadow-md">📖</div>
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-[#1d7bd8] hover:bg-[#1565c0] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-[0_8px_20px_rgba(29,123,216,0.3)] transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="text-xl leading-none">+</span>
          {isLoading ? "Đang tạo..." : "Tạo sổ"}
        </button>
      </div>
    </form>
  );
};