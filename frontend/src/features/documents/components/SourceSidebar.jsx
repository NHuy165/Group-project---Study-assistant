// src/features/documents/components/SourceSidebar.jsx
import React, { useMemo } from "react";
import { DocumentItem } from "./DocumentItem";

export const SourceSidebar = ({ 
  documents, selectedDocIds, onAddClick, editingId, setEditingId, 
  tempName, setTempName, onRename, onPreview, onDocCheck, onDelete, isLoading
}) => {

  // Tối ưu: Chỉ tính toán lại khi mảng documents thay đổi, tránh giật lag khi gõ phím
  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      return dateA - dateB;
    });
  }, [documents]);

  return (
    <aside className="flex w-[22%] flex-col space-y-4 rounded-3xl bg-white/45 p-6 backdrop-md shadow-xl border border-white/0">
      <header className="space-y-4">
        <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
          <span>📚</span>
          <h2>Nguồn tài liệu</h2>
        </div>
        <hr className="border-t border-gray-400/30" />
      </header>

      <button onClick={onAddClick} className="w-full rounded-2xl bg-[#bf94e4] py-3.5 font-bold text-white transition hover:bg-[#b388d8] shadow-md">
        + Thêm nguồn
      </button>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {/* Nếu đang tải và chưa có file nào */}
        {isLoading && documents.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-10 animate-pulse">Đang tải tài liệu...</p>
        )}
        
        {/* Nếu tải xong nhưng mảng rỗng */}
        {!isLoading && sortedDocuments.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-10">Bé chưa có tài liệu nào.</p>
        )}
        
        {/* Render danh sách tài liệu */}
        {sortedDocuments.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            isEditing={editingId === doc.id} 
            isSelected={selectedDocIds?.includes(doc.id)} 
            tempName={tempName}
            setTempName={setTempName}
            setEditingId={setEditingId}
            onRename={onRename}
            onCheck={onDocCheck}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        ))}
      </nav>
    </aside>
  );
};