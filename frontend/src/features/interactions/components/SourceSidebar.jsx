import React from "react";
import { getFileIcon } from "../utils/fileUtils";

export const SourceSidebar = ({ 
  documents, onAddClick, editingId, setEditingId, 
  tempName, setTempName, onRename, onPreview, onDocCheck 
}) => (
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
      {documents.map((doc) => (
        <div key={doc.id} className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition border ${
          editingId === doc.id ? "bg-white border-[#4ecdc4]" : "bg-white/60 hover:shadow-md"
        }`} onClick={() => editingId !== doc.id && onDocCheck(doc.id)}>
          <div className="flex items-center space-x-3 flex-1 overflow-hidden">
            <input type="checkbox" checked={doc.checked} readOnly className="h-5 w-5 rounded-md border-2 border-gray-300 accent-[#4ecdc4]" />
            {editingId === doc.id ? (
              <input autoFocus value={tempName} onChange={(e) => setTempName(e.target.value)}
                onBlur={() => onRename(doc.id)} onKeyDown={(e) => e.key === "Enter" && onRename(doc.id)}
                onClick={(e) => e.stopPropagation()} className="font-semibold text-gray-700 bg-transparent outline-none border-b border-[#4ecdc4] w-full" />
            ) : (
              <span className="font-semibold text-gray-700 truncate max-w-[150px] select-none"
                onDoubleClick={(e) => { e.stopPropagation(); setEditingId(doc.id); setTempName(doc.name); }}>
                {doc.name}
              </span>
            )}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onPreview(doc); }} className="p-2 hover:bg-white rounded-xl transition-all hover:scale-125">
            <span className="text-xl">{getFileIcon(doc.name)}</span>
          </button>
        </div>
      ))}
    </nav>
  </aside>
);