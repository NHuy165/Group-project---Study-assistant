// src/features/documents/components/SourceSidebar.jsx
import React, { useMemo } from "react";
import { DocumentItem } from "./DocumentItem";

// Lấy Context theme
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

export const SourceSidebar = ({ 
  documents, selectedDocIds, onAddClick, editingId, setEditingId, 
  tempName, setTempName, onRename, onPreview, onDocCheck, onDelete, isLoading
}) => {

  const { isNight } = useTheme(); // <--- Gọi hook theme

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      return dateA - dateB;
    });
  }, [documents]);

  return (
    <aside className={`flex w-[22%] flex-col space-y-4 rounded-3xl p-6 backdrop-md shadow-xl border transition-colors duration-500 ${
      isNight ? "bg-gray-900/60 border-gray-700/50" : "bg-white/30 border-white/20"
    }`}>
      <header className="space-y-4">
        <div className={`flex items-center space-x-2 text-2xl font-bold transition-colors ${
          isNight ? "text-gray-100" : "text-gray-800"
        }`}>
          <span>📚</span>
          <h2>Nguồn tài liệu</h2>
        </div>
        <hr className={`border-t transition-colors ${
          isNight ? "border-gray-600/50" : "border-gray-400/30"
        }`} />
      </header>

      <button onClick={onAddClick} className="w-full rounded-2xl bg-[#bf94e4] py-3.5 font-bold text-white transition hover:bg-[#b388d8] shadow-md hover:shadow-lg">
        + Thêm nguồn
      </button>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {/* Loading */}
        {isLoading && documents.length === 0 && (
          <p className={`text-center text-sm mt-10 animate-pulse ${isNight ? "text-gray-400" : "text-gray-500"}`}>
            Đang tải tài liệu...
          </p>
        )}
        
        {/* Empty state */}
        {!isLoading && sortedDocuments.length === 0 && (
          <p className={`text-center text-sm mt-10 ${isNight ? "text-gray-400" : "text-gray-500"}`}>
            Bé chưa có tài liệu nào.
          </p>
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
            isNight={isNight} /* <--- Truyền isNight xuống đây để đổi màu từng file tài liệu */
          />
        ))}
      </nav>
    </aside>
  );
};