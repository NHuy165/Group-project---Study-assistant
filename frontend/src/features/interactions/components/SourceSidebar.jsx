
import React from "react";
import { DocumentItem } from "../../documents/components/DocumentItem"; // Import Component con

export const SourceSidebar = ({ 
  documents, selectedDocIds, onAddClick, editingId, setEditingId, 
  tempName, setTempName, onRename, onPreview, onDocCheck, onDelete, isLoading
}) => {

  const sortedDocuments = [...documents].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);
    return dateA - dateB;
  });

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
      {sortedDocuments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 mt-10">Chưa có tài liệu nào.</p>
      ) : (
          sortedDocuments.map((doc) => (
            <DocumentItem
              key={doc.id}
              document={doc}
              isEditing={editingId === doc.id} // Truyền cờ xác định item nào đang được sửa
              isSelected={selectedDocIds?.includes(doc.id)} // Truyền cờ xác định item nào được tích
              tempName={tempName}
              setTempName={setTempName}
              setEditingId={setEditingId}
              onRename={onRename}
              onCheck={onDocCheck}
              onDelete={onDelete}
            />
          ))
      )}
    </nav>
  </aside>
  );
};