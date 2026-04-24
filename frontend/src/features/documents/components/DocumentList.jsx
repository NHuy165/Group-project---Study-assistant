// src/features/documents/components/DocumentList.jsx
import React from "react";
import { DocumentItem } from "./DocumentItem";

export const DocumentList = ({ 
  documents, 
  onRename, 
  onDelete, 
  onPreview, 
  onCheck,
  editingId,
  setEditingId,
  tempName,
  setTempName 
}) => {
  if (documents.length === 0) {
    return <p className="text-center text-xs text-gray-400 mt-10 italic">Bé chưa có tài liệu nào...</p>;
  }

  return (
    <div className="space-y-1">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          document={doc}
          onRename={onRename}
          onDelete={onDelete}
          onPreview={onPreview}
          onCheck={onCheck}
          isEditing={editingId === doc.id}
          tempName={tempName}
          setTempName={setTempName}
          setEditingId={setEditingId}
        />
      ))}
    </div>
  );
};