import React, { useState } from "react";
import { createPortal } from "react-dom"; // Biến portal đưa modal ra ngoài body
import { getFileIcon } from "../../interactions/utils/fileUtils"; // Dùng file utils của bạn
import { DocumentDetailModal } from "./DocumentDetailModal";
import { useLearningPath } from "../hooks/useLearningPath"; 

export const DocumentItem = ({ 
  document, onRename, onDelete,
  isEditing, tempName, setTempName, setEditingId, isNight 
}) => {
  const [showModal, setShowModal] = useState(false);
  const isUploading = document.isUploading;

  // Khởi tạo trạng thái lộ trình riêng cho tài liệu này
  const { isGeneratingPath, pathData, generateLearningPath } = useLearningPath();

  const dotIndex = document.name?.lastIndexOf('.') ?? -1;
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : '';
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onRename(document.id);
    if (e.key === "Escape") setEditingId(null); 
  };

  // Sử dụng hàm getFileIcon từ file utils có sẵn của bạn
  const fileIcon = getFileIcon(document.name);

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
            // Hiển thị icon tương ứng với loại file
            <span className="text-xl shrink-0 drop-shadow-sm">{fileIcon}</span>
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
              onDoubleClick={() => !isUploading && setEditingId(document)} 
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

        {/* Nút Chi Tiết */}
        <div className="ml-2 flex shrink-0 items-center gap-1">
          <button 
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition-all duration-300 ${
              isUploading 
                ? 'opacity-30 grayscale pointer-events-none' 
                : (isNight ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] hover:bg-[#4ecdc4]/40' : 'bg-[#e6fcfb] text-[#38b5ac] hover:bg-[#4ecdc4] hover:text-white shadow-sm')
            }`}
            title="Quản lý file & Tạo lộ trình"
          >
            <span className="text-sm">✨</span> Chi tiết
          </button>
        </div>
      </div>

      {/* SỬA ĐỔI CHÍNH XÁC: Gọi window.document.body để không bị trùng tên với biến prop */}
      {showModal && createPortal(
        <DocumentDetailModal
          document={document}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onRename={onRename}
          onDelete={onDelete}
          isGeneratingPath={isGeneratingPath}
          pathData={pathData}
          onGenerate={() => generateLearningPath(document.id, document.name)}
          fileIcon={fileIcon}
        />,
        window.document.body 
      )}
    </>
  );
};