import React, { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

const SUBJECTS = [
  { id: 'MATHS', label: 'Toán', emoji: '📐' },
  { id: 'VIETNAMESE', label: 'Tiếng Việt', emoji: '📖' },
  { id: 'ENGLISH', label: 'Tiếng Anh', emoji: '🔤' }
];

export const DocumentDetailModal = ({ 
  document, isOpen, onClose, onRename, onDelete 
}) => {
  const { isNight } = useTheme();
  
  // States quản lý chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempSubject, setTempSubject] = useState("");

  const dotIndex = document?.name?.lastIndexOf('.') ?? -1;
  const baseName = dotIndex !== -1 ? document.name.substring(0, dotIndex) : (document?.name || "");
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : "";

  // Reset dữ liệu mỗi khi mở Modal
  useEffect(() => {
    if (document) {
      setTempName(baseName);
      setTempSubject(document.subject_type || 'MATHS');
      setIsEditing(false);
    }
  }, [document, isOpen, baseName]);

  if (!isOpen || !document) return null;

  // Gửi cục data (gồm name và subject_type) lên Hook khi ấn Lưu
  const handleSave = () => {
    const newFullName = tempName.trim() + ext;
    const updates = {};
    
    if (tempName.trim() && newFullName !== document.name) {
      updates.name = newFullName;
    }
    if (tempSubject !== document.subject_type) {
      updates.subject_type = tempSubject;
    }

    if (Object.keys(updates).length > 0) {
      onRename(document.id, updates); 
    }
    setIsEditing(false);
  };

  const currentSub = SUBJECTS.find(s => s.id === document.subject_type) || SUBJECTS[0];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md ${isNight ? 'bg-black/60' : 'bg-slate-900/40'}`} onClick={onClose}>
      <div 
        className={`relative w-full max-w-md animate-in zoom-in fade-in rounded-[2.5rem] border p-8 shadow-2xl duration-200 ${
          isNight ? 'bg-gray-900 border-gray-700' : 'bg-white border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút Đóng */}
        <button onClick={onClose} className={`absolute right-6 top-6 rounded-full p-2 transition-colors ${
          isNight ? 'text-gray-400 hover:bg-gray-800' : 'text-slate-400 hover:bg-slate-50'
        }`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Khối Hiển thị / Chỉnh sửa */}
        <div className="mb-2 mt-4">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#4ecdc4]">Chi tiết tài liệu</p>
          
          {isEditing ? (
            <div className="flex flex-col gap-5 mt-3">
              {/* Sửa tên */}
              <div className="flex w-full items-center border-b-2 border-[#4ecdc4] pb-1">
                <input
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className={`w-full min-w-0 bg-transparent text-xl font-black outline-none ${isNight ? 'text-white' : 'text-slate-800'}`}
                />
                <span className={`select-none pl-1 text-xl font-black ${isNight ? 'text-gray-500' : 'text-slate-400'}`}>{ext}</span>
              </div>
              
              {/* Đổi Môn học */}
              <div>
                <p className={`text-[11px] font-extrabold mb-2 uppercase ${isNight ? 'text-gray-400' : 'text-slate-500'}`}>Đổi môn học</p>
                <div className="flex gap-2">
                  {SUBJECTS.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setTempSubject(sub.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        tempSubject === sub.id
                          ? "bg-[#4ecdc4] text-white shadow-md shadow-[#4ecdc4]/30"
                          : (isNight ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200")
                      }`}
                    >
                      <span className="text-sm">{sub.emoji}</span> {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <h3 
              onDoubleClick={() => setIsEditing(true)}
              className={`line-clamp-2 mt-2 cursor-pointer text-2xl font-black leading-tight transition-colors hover:text-[#4ecdc4] ${
                isNight ? 'text-gray-100' : 'text-slate-800'
              }`}
              title="Nhấp đúp để chỉnh sửa"
            >
              {document.name} 
            </h3>
          )}
        </div>
        
        {/* Khối Badges Thông tin (Ẩn đi khi đang Edit cho đỡ rối) */}
        {!isEditing && (
          <div className="mb-8 mt-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase ${isNight ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
              📅 {new Date(document.createdAt || document.created_at).toLocaleDateString("vi-VN")}
            </span>
            <span className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase ${isNight ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
              📄 {ext.replace('.', '') || "FILE"}
            </span>
            <span className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase ${isNight ? 'bg-gray-800 text-[#4ecdc4]' : 'bg-[#e6fcfb] text-[#38b5ac]'}`}>
              {currentSub.emoji} {currentSub.label}
            </span>
          </div>
        )}

        {/* Khối Nút Hành động */}
        <div className={`grid gap-3 mt-8 ${isEditing ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4ecdc4] py-4 font-bold text-white transition-all active:scale-95 shadow-md shadow-[#4ecdc4]/30 hover:bg-[#38b5ac]"
            >
              💾 Lưu thay đổi
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-95 ${
                  isNight ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ✏️ Chỉnh sửa
              </button>
              <button 
                onClick={() => { onDelete(document.id); onClose(); }}
                className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-95 ${
                  isNight ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-500 hover:bg-red-100'
                }`}
              >
                🗑️ Xóa file
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};