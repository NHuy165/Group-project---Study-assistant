import React, { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

export const DocumentDetailModal = ({ 
  document, isOpen, onClose, onRename, onDelete 
}) => {
  const { isNight } = useTheme(); // <-- Lấy biến isNight
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const dotIndex = document?.name?.lastIndexOf('.') ?? -1;
  const baseName = dotIndex !== -1 ? document.name.substring(0, dotIndex) : (document?.name || "");
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : "";

  useEffect(() => {
    if (document) {
      setTempName(baseName);
      setIsEditingName(false);
    }
  }, [document, isOpen, baseName]);

  if (!isOpen || !document) return null;

  const handleRename = () => {
    const newFullName = tempName.trim() + ext;
    if (tempName.trim() && newFullName !== document.name) {
      onRename(document.id, newFullName); 
    }
    setIsEditingName(false);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md ${isNight ? 'bg-black/60' : 'bg-slate-900/40'}`} onClick={onClose}>
      <div 
        className={`relative w-full max-w-md animate-in zoom-in fade-in rounded-[2.5rem] border p-8 shadow-2xl duration-200 ${
          isNight ? 'bg-gray-900 border-gray-700' : 'bg-white border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute right-6 top-6 rounded-full p-2 transition-colors ${
          isNight ? 'text-gray-400 hover:bg-gray-800' : 'text-slate-400 hover:bg-slate-50'
        }`}>
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
                className={`w-full min-w-0 bg-transparent text-2xl font-black outline-none ${isNight ? 'text-white' : 'text-slate-800'}`}
              />
              <span className={`select-none pl-1 text-2xl font-black ${isNight ? 'text-gray-500' : 'text-slate-400'}`}>{ext}</span>
            </div>
          ) : (
            <h3 
              onDoubleClick={() => setIsEditingName(true)}
              className={`line-clamp-2 cursor-pointer text-2xl font-black leading-tight transition-colors hover:text-[#4ecdc4] ${
                isNight ? 'text-gray-100' : 'text-slate-800'
              }`}
              title="Nhấp đúp để đổi tên"
            >
              {document.name} 
            </h3>
          )}
        </div>
        
        <div className="mb-8 mt-4 flex items-center gap-2">
          <span className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase ${isNight ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
            📅 {new Date(document.createdAt || document.created_at).toLocaleDateString("vi-VN")}
          </span>
          <span className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase ${isNight ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
            📄 {ext.replace('.', '') || "FILE"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setIsEditingName(true)}
            className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-95 ${
              isNight ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✏️ Đổi tên
          </button>
          <button 
            onClick={() => { onDelete(document.id); onClose(); }}
            className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-95 ${
              isNight ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            🗑️ Xóa file
          </button>
        </div>
      </div>
    </div>
  );
};