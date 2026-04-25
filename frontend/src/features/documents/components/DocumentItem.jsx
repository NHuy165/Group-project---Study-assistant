// src/features/documents/components/DocumentItem.jsx
import React, { useState } from "react";
import { getFileIcon } from "../../interactions/utils/fileUtils";
import { DocumentDetailModal } from "./DocumentDetailModal";

export const DocumentItem = ({ 
  document, onRename, onDelete, onCheck, onUpdateDescription,
  isSelected, isEditing, tempName, setTempName, setEditingId
}) => {
  
  const [showModal, setShowModal] = useState(false);
  const isUploading = document.isUploading;
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onRename(document.id);
    if (e.key === "Escape") setEditingId(null); 
  };

  return (
    <>
      <div className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition border ${
        isEditing ? "bg-white border-[#4ecdc4]" : "bg-white/60 hover:shadow-md hover:bg-white/80"
      }`}>
        
        <div className="flex items-center space-x-3 flex-1 overflow-hidden">
          {isUploading ? (
            <div className="h-5 w-5 rounded-full border-2 border-gray-200 border-t-[#4ecdc4] animate-spin"></div>
          ) : (
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => onCheck(document.id)}
              className="h-5 w-5 rounded-md border-2 border-gray-300 accent-[#4ecdc4] cursor-pointer" 
            />
          )}

          {/* Tên file hoặc Ô nhập liệu */}
          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => onRename(document.id)}
              onKeyDown={handleKeyDown}
              className="font-semibold text-gray-700 bg-transparent outline-none border-b border-[#4ecdc4] w-full"
            />
          ) : (
            <span 
              onDoubleClick={() => setEditingId(document)} 
              className="font-semibold text-gray-700 truncate max-w-[150px] cursor-pointer select-none"
              title="Nhấp đúp để đổi tên"
            >
              {document.name}
            </span>
          )}
        </div>

        {/* Nút chức năng - Click vào icon để hiện modal */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowModal(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all hover:scale-110"
            title="Xem chi tiết"
          >
            <span className="text-xl">{getFileIcon ? getFileIcon(document.name) : "📄"}</span>
          </button>
        </div>
      </div>

      {/* Modal chi tiết tài liệu */}
      <DocumentDetailModal
        document={document}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onRename={onRename}
        onDelete={onDelete}
      />
    </>
  );
};