import React, { useState } from "react";
import { getFileIcon } from "../../interactions/utils/fileUtils";
import { DocumentDetailModal } from "./DocumentDetailModal";

export const DocumentItem = ({ 
  document, onRename, onDelete, onCheck,
  isSelected, isEditing, tempName, setTempName, setEditingId
}) => {
  const [showModal, setShowModal] = useState(false);
  const isUploading = document.isUploading;

  // Lấy ra phần đuôi để hiển thị bên ngoài ô input
  const dotIndex = document.name.lastIndexOf('.');
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : '';
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onRename(document.id);
    if (e.key === "Escape") setEditingId(null); 
  };

  return (
    <>
      <div className={`group flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition border ${
        isEditing ? "bg-white border-[#4ecdc4]" : "bg-white/60 hover:shadow-md hover:bg-white/80"
      } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
        
        <div className="flex flex-1 items-center space-x-3 overflow-hidden">
        

          {isEditing ? (
            <div className="flex w-full items-center border-b border-[#4ecdc4] pb-0.5">
              {/* Chỉ sửa phần tên */}
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => onRename(document.id)}
                onKeyDown={handleKeyDown}
                className="w-full min-w-0 bg-transparent text-sm font-semibold text-gray-700 outline-none"
              />
              {/* Phần đuôi hiển thị tĩnh */}
              <span className="select-none whitespace-nowrap text-sm text-gray-400">{ext}</span>
            </div>
          ) : (
            <span 
              onDoubleClick={() => setEditingId(document)} 
              className="max-w-[150px] cursor-pointer select-none truncate text-sm font-semibold text-gray-700"
              title="Nhấp đúp để đổi tên"
            >
              {document.name}
              {isUploading && <span className="ml-2 animate-pulse text-[10px] text-[#4ecdc4]">đang xử lý...</span>}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowModal(true)}
            className="rounded-xl p-2 transition-all hover:scale-110 hover:bg-slate-100"
            title="Xem chi tiết"
          >
            <span className="text-xl">{getFileIcon ? getFileIcon(document.name) : "📄"}</span>
          </button>
        </div>
      </div>

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