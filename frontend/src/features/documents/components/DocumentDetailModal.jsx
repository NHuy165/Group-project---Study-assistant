import React, { useState, useEffect } from "react";

export const DocumentDetailModal = ({ 
  document, isOpen, onClose, onRename, onDelete 
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // Tách tên và đuôi ngay từ document prop
  const dotIndex = document?.name?.lastIndexOf('.') ?? -1;
  const baseName = dotIndex !== -1 ? document.name.substring(0, dotIndex) : (document?.name || "");
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : "";

  useEffect(() => {
    if (document) {
      setTempName(baseName);
      setIsEditingName(false); // Đóng chế độ edit mỗi khi mở modal mới
    }
  }, [document, isOpen, baseName]);

  if (!isOpen || !document) return null;

  const handleRename = () => {
    // Ghép tên mới với đuôi cũ để gửi lên
    const newFullName = tempName.trim() + ext;
    if (tempName.trim() && newFullName !== document.name) {
      onRename(document.id, newFullName); 
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md" onClick={onClose}>
      <div 
        className="relative w-full max-w-md animate-in zoom-in fade-in rounded-[2.5rem] border border-white/20 bg-white p-8 shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-6 top-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="mb-2 mt-4">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#4ecdc4]">Chi tiết tài liệu</p>
          
          {isEditingName ? (
            <div className="flex w-full items-center border-b-2 border-[#4ecdc4] pb-1">
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                className="w-full min-w-0 bg-transparent text-2xl font-black text-slate-800 outline-none"
              />
              <span className="select-none pl-1 text-2xl font-black text-slate-400">{ext}</span>
            </div>
          ) : (
            <h3 
              onDoubleClick={() => setIsEditingName(true)}
              className="line-clamp-2 cursor-pointer text-2xl font-black leading-tight text-slate-800 transition-colors hover:text-[#4ecdc4]"
              title="Nhấp đúp để đổi tên"
            >
              {document.name} 
            </h3>
          )}
        </div>
        
        <div className="mb-8 mt-4 flex items-center gap-2">
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase text-slate-500">
            📅 {new Date(document.createdAt || document.created_at).toLocaleDateString("vi-VN")}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase text-slate-500">
            📄 {ext.replace('.', '') || "FILE"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setIsEditingName(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 py-4 font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-95"
          >
            ✏️ Đổi tên
          </button>
          <button 
            onClick={() => { onDelete(document.id); onClose(); }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 font-bold text-red-500 transition-all hover:bg-red-100 active:scale-95"
          >
            🗑️ Xóa file
          </button>
        </div>
      </div>
    </div>
  );
};