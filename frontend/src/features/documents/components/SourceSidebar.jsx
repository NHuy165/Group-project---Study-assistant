import React, { useMemo, useState } from "react";
import { DocumentItem } from "./DocumentItem";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

// 1. Khai báo danh sách các Tab (Khay chứa)
const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả', emoji: '📚' },
  { id: 'MATHS', label: 'Toán', emoji: '📐' },
  { id: 'VIETNAMESE', label: 'T.Việt', emoji: '📖' },
  { id: 'ENGLISH', label: 'T.Anh', emoji: '🔤' }
];

export const SourceSidebar = ({ 
  documents, selectedDocIds, onAddClick, editingId, setEditingId, 
  tempName, setTempName, onRename, onPreview, onDocCheck, onDelete, isLoading,
  onOpenPathModal
}) => {
  const { isNight } = useTheme(); 
  
  // 2. State lưu trữ Tab đang được chọn
  const [activeFilter, setActiveFilter] = useState('ALL');

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      // Sắp xếp giảm dần (mới nhất lên đầu)
      return dateB - dateA; 
    });
  }, [documents]);

  // 3. Logic lọc tài liệu theo môn học
  const displayedDocuments = useMemo(() => {
    if (activeFilter === 'ALL') return sortedDocuments;
    return sortedDocuments.filter(doc => doc.subject_type === activeFilter);
  }, [sortedDocuments, activeFilter]);

  return (
    <aside className={`flex w-[22%] flex-col space-y-4 rounded-3xl p-6 backdrop-blur-md shadow-xl border transition-colors duration-500 ${
      isNight ? "bg-gray-900/60 border-gray-700/50" : "bg-white/30 border-white/20"
    }`}>
      
      <header className="space-y-4 shrink-0">
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

      <div className="flex gap-3 shrink-0">
        <button 
          onClick={onAddClick} 
          className={`rounded-2xl py-3.5 font-bold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 ${
            documents.length > 0 ? "w-1/2 bg-[#bf94e4] hover:bg-[#b388d8]" : "w-full bg-[#bf94e4] hover:bg-[#b388d8]"
          }`}
        >
          {documents.length > 0 ? "+ Thêm" : "+ Thêm nguồn"}
        </button>

        {/* Nút Tạo Lộ Trình chỉ hiện khi đã có tài liệu */}
        {documents.length > 0 && (
          <button 
            onClick={onOpenPathModal}
            className="w-1/2 rounded-2xl bg-gradient-to-r from-[#4ecdc4] to-[#45b7af] py-3.5 font-bold text-white transition-all shadow-md shadow-[#4ecdc4]/30 hover:shadow-lg hover:shadow-[#4ecdc4]/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span className="text-lg animate-pulse">🏁</span> Lộ trình
          </button>
        )}
      </div>

      {/* 4. THANH ĐIỀU HƯỚNG TABS (CÁC KHAY CHỨA) */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              title={tab.label} // Tooltip dự phòng của trình duyệt
              className={`group flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
                isActive
                  ? "bg-[#bf94e4] text-white shadow-md shadow-[#bf94e4]/30 px-3.5 py-2.5"
                  : (isNight ? "bg-gray-800/60 text-gray-400 hover:bg-gray-700 hover:text-gray-200 px-3 py-2.5" : "bg-white/50 text-slate-500 hover:bg-white hover:text-slate-800 px-3 py-2.5")
              }`}
            >
              <span className="text-[15px] shrink-0 drop-shadow-sm">{tab.emoji}</span>
              
              {/* Text bị ẩn đi qua max-w-0, chỉ bung ra khi Active HOẶC khi Hover */}
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                isActive 
                  ? "max-w-[80px] opacity-100 ml-1.5" 
                  : "max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-1.5"
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {/* Loading State */}
        {isLoading && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 opacity-50">
            <span className="text-3xl animate-bounce mb-2">⏳</span>
            <p className={`text-center text-sm font-semibold ${isNight ? "text-gray-400" : "text-gray-500"}`}>
              Đang tải tài liệu...
            </p>
          </div>
        )}
        
        {/* Empty State (Chưa có tài liệu nào trên hệ thống) */}
        {!isLoading && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 opacity-60">
            <span className="text-4xl mb-3">📭</span>
            <p className={`text-center text-sm font-semibold ${isNight ? "text-gray-400" : "text-gray-500"}`}>
              Bé chưa có tài liệu nào.
            </p>
          </div>
        )}

        {/* Empty State (Có tài liệu nhưng tab hiện tại đang trống) */}
        {!isLoading && documents.length > 0 && displayedDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 opacity-60">
            <span className="text-4xl mb-3">🗂️</span>
            <p className={`text-center text-sm font-semibold ${isNight ? "text-gray-400" : "text-gray-500"}`}>
              Chưa có tài liệu {FILTER_TABS.find(t => t.id === activeFilter)?.label}.
            </p>
          </div>
        )}
        
        {/* Render danh sách tài liệu đã được lọc */}
        {displayedDocuments.map((doc) => (
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
            isNight={isNight} 
          />
        ))}
      </nav>

    </aside>
  );
};