import React, { useState } from "react";

export const DocumentDetailModal = ({ 
  document, 
  isOpen, 
  onClose, 
  onRename, 
  onDelete 
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  if (!isOpen || !document) return null;

  const handleRename = () => {
    if (tempName.trim() && tempName !== document.name) {
      onRename(document.id);
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Tên tài liệu */}
        <div className="mb-2">
          {isEditingName ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="text-xl font-bold text-slate-800 bg-transparent outline-none border-b border-[#4ecdc4] w-full"
            />
          ) : (
            <h3 
              onClick={() => setIsEditingName(true)}
              className="text-xl font-bold text-slate-800 cursor-pointer hover:text-[#4ecdc4] transition-colors"
              title="Nhấp để đổi tên"
            >
              {document.name} 
            </h3>
          )}
        </div>
        
        <p className="text-xs text-slate-400 mb-6">
          Ngày tạo: {new Date(document.createdAt || document.created_at).toLocaleDateString("vi-VN")}
        </p>

        {/* Nút hành động */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditingName(true)}
            className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
          >
            ✏️ Đổi tên
          </button>
          <button 
            onClick={() => {
              onDelete(document.id); // Xóa luôn, không hỏi lại
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors"
          >
            🗑️ Xóa
          </button>
        </div>
      </div>
    </div>
  );
};