import React, { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 
import { XIcon, SparkleIcon, TargetIcon, RocketLaunchIcon, TrashIcon, FloppyDiskIcon } from "@phosphor-icons/react";
import ReactMarkdown from 'react-markdown';

const SUBJECTS = [
  { id: 'MATHS', label: 'Toán', emoji: '📐' },
  { id: 'VIETNAMESE', label: 'Tiếng Việt', emoji: '📖' },
  { id: 'ENGLISH', label: 'Tiếng Anh', emoji: '🔤' }
];

export const DocumentDetailModal = ({ 
  document, isOpen, onClose, onRename, onDelete,
  isGeneratingPath, pathData, onGenerate, fileIcon
}) => {
  const { isNight } = useTheme();
  
  const [tempName, setTempName] = useState("");
  const [tempSubject, setTempSubject] = useState("");

  const dotIndex = document?.name?.lastIndexOf('.') ?? -1;
  const baseName = dotIndex !== -1 ? document.name.substring(0, dotIndex) : (document?.name || "");
  const ext = dotIndex !== -1 ? document.name.substring(dotIndex) : "";

  useEffect(() => {
    if (document) {
      setTempName(baseName);
      setTempSubject(document.subject_type || 'MATHS');
    }
  }, [document, isOpen, baseName]);

  if (!isOpen || !document) return null;

  const isChanged = tempName.trim() !== baseName || tempSubject !== document.subject_type;

  const handleSave = () => {
    const newFullName = tempName.trim() + ext;
    const updates = {};
    if (tempName.trim() && newFullName !== document.name) updates.name = newFullName;
    if (tempSubject !== document.subject_type) updates.subject_type = tempSubject;

    if (Object.keys(updates).length > 0) {
      onRename(document.id, updates); 
    }
  };

  const fileTypeDisplay = document.type || ext.replace('.', '').toUpperCase() || "FILE";

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md transition-all ${isNight ? 'bg-black/70' : 'bg-slate-900/50'}`} onClick={onClose}>
      <div 
        className={`relative w-full max-w-[1000px] h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] shadow-2xl border animate-in zoom-in-95 duration-300 ${
          isNight ? 'bg-gray-900 border-gray-700' : 'bg-white border-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-5 top-5 z-50 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors">
          <XIcon size={24} weight="bold" />
        </button>

        {/* ➖➖ CỘT TRÁI: QUẢN LÝ THÔNG TIN FILE (35%) ➖➖ */}
        <div className={`w-full md:w-[320px] flex flex-col p-8 border-r shrink-0 ${isNight ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50/50 border-slate-100'}`}>
           <p className="text-[11px] font-black uppercase tracking-widest text-[#4ecdc4] mb-6">Quản lý Tài liệu</p>
           
           <div className="flex flex-col gap-6 flex-1">
             {/* Sửa tên */}
             <div>
               <label className={`text-[11px] font-extrabold uppercase mb-2 block ${isNight ? 'text-gray-500' : 'text-slate-500'}`}>Tên tài liệu</label>
               <div className={`flex items-center border-b-2 pb-1 focus-within:border-[#4ecdc4] transition-colors ${isNight ? 'border-gray-700' : 'border-slate-300'}`}>
                 <span className="mr-2 text-xl drop-shadow-sm">{fileIcon}</span>
                 <input
                   value={tempName}
                   onChange={(e) => setTempName(e.target.value)}
                   className={`w-full bg-transparent text-[15px] font-black outline-none ${isNight ? 'text-white' : 'text-slate-800'}`}
                 />
                 <span className={`select-none pl-1 text-[15px] font-black ${isNight ? 'text-gray-600' : 'text-slate-400'}`}>{ext}</span>
               </div>
             </div>
             
             {/* Sửa Môn học */}
             <div>
               <label className={`text-[11px] font-extrabold uppercase mb-2 block ${isNight ? 'text-gray-500' : 'text-slate-500'}`}>Đổi môn học</label>
               <div className="flex flex-col gap-2">
                 {SUBJECTS.map(sub => (
                   <button
                     key={sub.id}
                     onClick={() => setTempSubject(sub.id)}
                     className={`flex items-center justify-start px-4 gap-3 py-3 rounded-xl text-sm font-bold transition-all ${
                       tempSubject === sub.id
                         ? "bg-[#4ecdc4] text-white shadow-md shadow-[#4ecdc4]/30"
                         : (isNight ? "bg-gray-800/80 text-gray-400 hover:bg-gray-700" : "bg-white text-slate-500 hover:bg-slate-200 border border-slate-200")
                     }`}
                   >
                     <span className="text-xl">{sub.emoji}</span> Môn {sub.label}
                   </button>
                 ))}
               </div>
             </div>

             <div className="mt-2 text-xs font-semibold text-gray-400 flex flex-col gap-1">
                <p>📅 Ngày tải: {new Date(document.createdAt || document.created_at).toLocaleDateString("vi-VN")}</p>
                <p>🗂️ Định dạng: {fileTypeDisplay}</p>
             </div>
           </div>

           <div className="mt-auto pt-6 flex flex-col gap-2 shrink-0">
             {isChanged && (
               <button onClick={handleSave} className="flex items-center justify-center gap-2 rounded-xl bg-[#4ecdc4] py-3.5 font-bold text-white shadow-md shadow-[#4ecdc4]/30 hover:bg-[#38b5ac] active:scale-95 transition-all">
                 <FloppyDiskIcon size={20} weight="fill" /> Lưu thông tin
               </button>
             )}
             <button onClick={() => { onDelete(document.id); onClose(); }} className={`flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-all active:scale-95 ${isNight ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
               <TrashIcon size={20} weight="fill" /> Xóa tài liệu này
             </button>
           </div>
        </div>

        {/* ➖➖ CỘT PHẢI: LỘ TRÌNH AI (65%) ➖➖ */}
        <div className={`flex-1 flex flex-col relative ${isNight ? 'bg-gray-900' : 'bg-white'}`}>
           <div className={`p-8 pb-5 border-b shrink-0 ${isNight ? 'border-gray-800' : 'border-slate-100'}`}>
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ecdc4] to-[#2ab7a8] flex items-center justify-center shadow-lg shadow-[#4ecdc4]/30 shrink-0">
                 <RocketLaunchIcon size={26} weight="fill" className="text-white" />
               </div>
               <div>
                 <h2 className={`text-xl font-black ${isNight ? 'text-gray-100' : 'text-slate-800'}`}>Lộ trình học tập cá nhân</h2>
                 <p className={`text-xs font-semibold mt-0.5 ${isNight ? 'text-gray-400' : 'text-slate-500'}`}>AI phân tích riêng cho tài liệu này</p>
               </div>
             </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isGeneratingPath ? (
                <div className="flex flex-col items-center justify-center h-full opacity-80">
                  <div className="relative flex items-center justify-center mb-6">
                     <div className="absolute w-20 h-20 border-4 border-t-[#4ecdc4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                     <SparkleIcon size={32} weight="fill" className="text-[#4ecdc4] animate-pulse" />
                  </div>
                  <p className={`font-black text-lg ${isNight ? 'text-[#4ecdc4]' : 'text-[#2ab7a8]'}`}>Đang phân tích tài liệu...</p>
                </div>
              ) : !pathData ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <TargetIcon size={64} weight="duotone" className={`mb-4 ${isNight ? 'text-gray-700' : 'text-slate-200'}`} />
                  <p className={`text-center font-bold max-w-sm ${isNight ? 'text-gray-400' : 'text-slate-500'}`}>
                    Nhấn nút bên dưới để Cú Mèo trích xuất ý chính và gợi ý lịch ôn tập dựa trên nội dung tài liệu này nhé!
                  </p>
                </div>
              ) : (
                // ĐÃ LOẠI BỎ LỚP KHUNG PROSE GÂY LỖI MÀU, ÉP ĐỊNH DẠNG TRỰC TIẾP QUA COMPONENTS PROP
                <div className="w-full max-w-none">
                  <ReactMarkdown
                    components={{
                      h3: ({node, ...props}) => <h3 className={`text-lg font-black mt-4 mb-2 ${isNight ? 'text-white' : 'text-slate-800'}`} {...props} />,
                      h4: ({node, ...props}) => <h4 className={`text-sm font-extrabold mt-3 mb-1.5 ${isNight ? 'text-slate-200' : 'text-slate-700'}`} {...props} />,
                      p: ({node, ...props}) => <p className={`text-[13.5px] font-medium leading-relaxed mb-3 ${isNight ? 'text-gray-300' : 'text-slate-600'}`} {...props} />,
                      strong: ({node, ...props}) => <strong className={`font-black ${isNight ? 'text-[#4ecdc4]' : 'text-[#269e94]'}`} {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className={`text-[13.5px] font-medium ${isNight ? 'text-gray-300' : 'text-slate-600'}`} {...props} />,
                    }}
                  >
                    {pathData}
                  </ReactMarkdown>
                </div>
              )}
           </div>

           <div className={`p-6 border-t flex justify-end shrink-0 ${isNight ? 'border-gray-800' : 'border-slate-100'}`}>
              <button 
                 onClick={onGenerate} disabled={isGeneratingPath}
                 className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-bold text-white transition hover:bg-slate-700 active:scale-95 shadow-md"
              >
                <SparkleIcon size={18} weight="fill" />
                {pathData ? "Tạo lại lộ trình" : "🏁 Phân tích & Tạo lộ trình"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};