import React from "react";

export const DocumentItem = ({ 
  document, 
  onRename, 
  onDelete, 
  onPreview, 
  onCheck,
  isSelected,
  isEditing,
  tempName,
  setTempName,
  setEditingId
}) => {
  return (
    <div className="group relative flex items-center justify-between rounded-2xl p-3 transition-all hover:bg-white/50 hover:shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Ô tích chọn tài liệu */}
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onCheck(document.id)}
          className="h-4 w-4 rounded-full border-gray-300 text-[#4ecdc4] focus:ring-[#4ecdc4] cursor-pointer"
        />

        {/* Click vào Icon 📂 để mở xem trước */}
        <div 
          onClick={() => onPreview(document)} 
          className="cursor-pointer text-xl hover:scale-110 transition-transform"
        >
          {document.name.toLowerCase().endsWith('.pdf') ? "📄" : "🖼️"}
        </div>

        {isEditing ? (
          <input
            autoFocus
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => onRename(document.id)}
            onKeyDown={(e) => e.key === "Enter" && onRename(document.id)}
            className="rounded-lg border border-[#4ecdc4] bg-white px-2 py-1 text-sm outline-none w-32"
          />
        ) : (
          <span className="truncate text-sm font-medium text-gray-700">
            {document.name}
          </span>
        )}
      </div>

      {/* Các nút chức năng */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditingId(document.id)} className="p-1 hover:text-blue-500">✏️</button>
        <button onClick={() => onDelete(document.id)} className="p-1 hover:text-red-500">🗑️</button>
      </div>
    </div>
  );
};