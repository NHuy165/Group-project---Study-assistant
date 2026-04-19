import React, { useMemo } from "react";

export const FilePreviewModal = ({ isOpen, onClose, doc }) => {
  const fileUrl = useMemo(() => {
    if (doc?.file && doc.file instanceof Blob) return URL.createObjectURL(doc.file);
    return null;
  }, [doc]);


  if (!isOpen || !doc || !fileUrl) return null;

  const fileType = doc.file.type;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-10">
      <div className="relative w-full max-w-5xl h-[85vh] rounded-[3rem] bg-white p-10 shadow-2xl animate-in zoom-in duration-300">
        
        {/* Nút tắt ✕ */}
        <button onClick={onClose} className="absolute right-10 top-10 p-3 rounded-full hover:bg-slate-100 transition-colors z-20">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <header className="mb-6">
          <h2 className="text-3xl font-black text-slate-800 truncate pr-20">📂 {doc.name}</h2>
          <hr className="mt-4 border-slate-100" />
        </header>

        {/* Khung xem trước trực tiếp */}
        <div className="w-full h-[calc(100%-100px)] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 flex items-center justify-center">
          {doc.name.toLowerCase().endsWith('.pdf') ? (
            <iframe src={fileUrl} className="w-full h-full border-none" title="preview" />
          ) : fileType.startsWith('image/') ? (
            <img src={fileUrl} className="max-h-full object-contain" alt="preview" />
          ) : fileType.startsWith('video/') ? (
            <video controls src={fileUrl} className="max-h-full w-full bg-black" />
          ) : (
            <div className="text-center">
              <span className="text-8xl block mb-4">📄</span>
              <p className="text-xl font-bold text-slate-500">Tệp tin này hiện chưa hỗ trợ xem trực tiếp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};