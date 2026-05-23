import React, { useState } from "react";
import { getFileIcon } from "../../interactions/utils/fileUtils";
import { DocumentDetailModal } from "./DocumentDetailModal";

export const DocumentItem = ({ 
  document, onRename, onDelete, onCheck,
  isSelected, isEditing, tempName, setTempName, setEditingId, isNight 
}) => {
  const [showModal, setShowModal] = useState(false);
  const isUploading = document.isUploading;

  const dotIndex = document.name.lastIndexOf('.');
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : '';
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onRename(document.id);
    if (e.key === "Escape") setEditingId(null); 
  };

  return (
    <>
      <div className={`group flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 border ${
        isEditing 
          ? (isNight ? "bg-gray-800 border-[#4ecdc4]" : "bg-white border-[#4ecdc4]") 
          : isUploading 
            ? (isNight ? "bg-red-900/20 border-red-800/50 pointer-events-none" : "bg-red-50/70 border-red-200 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.1)]") 
            : (isNight ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:shadow-md" : "bg-white/60 hover:shadow-md hover:bg-white/80 border-transparent")
      }`}>
        
        <div className="flex flex-1 items-center space-x-3 overflow-hidden">
          {isUploading ? (
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-40"></div>
              <div className="absolute h-full w-full animate-spin rounded-full border-2 border-red-100 border-t-red-500"></div>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"></div>
            </div>
          ) : (
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => onCheck(document.id)}
              className={`h-5 w-5 shrink-0 cursor-pointer rounded-md border-2 accent-[#4ecdc4] ${isNight ? "border-gray-600 bg-gray-700" : "border-gray-300"}`} 
            />
          )}

          {isEditing ? (
            <div className="flex w-full items-center border-b border-[#4ecdc4] pb-0.5">
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => onRename(document.id)}
                onKeyDown={handleKeyDown}
                className={`w-full min-w-0 bg-transparent text-sm font-semibold outline-none ${isNight ? "text-gray-100" : "text-gray-700"}`}
              />
              <span className="select-none whitespace-nowrap text-sm text-gray-400">{ext}</span>
            </div>
          ) : (
            <div 
              onDoubleClick={() => setEditingId(document)} 
              className="flex flex-1 items-center gap-2 overflow-hidden cursor-pointer"
              title="Nhấp đúp để đổi tên"
            >
              <span className={`truncate text-sm font-semibold transition-colors duration-300 ${
                isUploading 
                  ? (isNight ? 'text-red-400/80' : 'text-red-800/60') 
                  : (isNight ? 'text-gray-200' : 'text-gray-700')
              }`}>
                {document.name}
              </span>
              
              {isUploading && (
                <span className="shrink-0 text-[9px] font-black tracking-widest text-red-500 uppercase flex items-center">
                  <span className="animate-pulse">Đang tải</span>
                  <span className="ml-0.5 inline-flex animate-[bounce_1s_infinite_0s] text-lg leading-none">.</span>
                  <span className="inline-flex animate-[bounce_1s_infinite_0.15s] text-lg leading-none">.</span>
                  <span className="inline-flex animate-[bounce_1s_infinite_0.3s] text-lg leading-none">.</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-1">
          <button 
            onClick={() => setShowModal(true)}
            className={`rounded-xl p-2 transition-all duration-300 ${
              isUploading 
                ? 'opacity-30 grayscale' 
                : (isNight ? 'hover:scale-110 hover:bg-gray-700' : 'hover:scale-110 hover:bg-slate-100')
            }`}
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