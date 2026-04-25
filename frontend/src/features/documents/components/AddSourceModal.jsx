import React, { useRef, useState, useEffect } from "react";

export const AddSourceModal = ({ isOpen, onClose, onAdd }) => {
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Quản lý bộ nhớ cho URL xem trước
  useEffect(() => {
    if (files.length === 1) {
      const file = files[0];
      const isPreviewable = file.type.startsWith("image/") || 
                            file.type.startsWith("video/") || 
                            file.type.startsWith("audio/") || 
                            file.type === "application/pdf";
      
      if (isPreviewable) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url); // Dọn dẹp bộ nhớ
      }
    }
    setPreviewUrl(null);
  }, [files]);

  if (!isOpen) return null;

  // 2. Các hàm xử lý tương tác
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleAdd = () => {
    // Chỉ gửi tên tệp đầu tiên làm đầu vào (có thể mở rộng nếu cần)
    const documentInput = { 
      name: files[0]?.name
    };
    
    onAdd(files, documentInput); 
    
    // Reset trạng thái sau khi gửi
    setFiles([]);
    onClose(); 
  };

  // 3. Hàm render xem trước tệp
  const renderFilePreview = (file, url) => {
    if (file.type.startsWith("image/")) return <img src={url} alt="preview" className="h-full w-full object-contain" />;
    if (file.type.startsWith("video/")) return <video controls src={url} className="h-full w-full bg-black" />;
    if (file.type.startsWith("audio/")) return <div className="flex flex-col items-center gap-2"><span className="text-5xl">🎵</span><audio controls src={url} className="w-full" /></div>;
    if (file.type === "application/pdf") return <iframe src={url} className="w-full h-full border-none" title="pdf" />;
    
    return (
      <div className="text-center p-6">
        <div className="text-5xl mb-2">📄</div>
        <p className="font-bold text-slate-500">Tệp {file.type.split('/')[1].toUpperCase()}</p>
        <p className="text-xs text-slate-400">Sẵn sàng để tải lên</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-3xl rounded-[3rem] bg-white p-10 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-8 top-8 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-800"><span className="text-red-500">+</span> Thêm nguồn học tập</h2>
          <p className="text-slate-400 text-sm mt-1">Bé hãy chọn những tài liệu hay để tớ học cùng nhé!</p>
        </header>

        <input type="file" ref={fileInputRef} accept=".pdf,image/*,audio/*,video/*" onChange={handleFileChange} hidden multiple />

        <div className="min-h-[380px] flex flex-col justify-center">
          {files.length === 0 ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="group flex flex-col items-center justify-center rounded-[2.5rem] py-24 border-4 border-dashed border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#4ecdc4] cursor-pointer transition-all duration-300"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">☁️</div>
              <p className="text-2xl font-black text-slate-300 group-hover:text-[#4ecdc4]">Bấm để chọn hoặc thả tệp vào đây</p>
              <p className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-widest">Hỗ trợ PDF, Hình ảnh, Âm thanh, Video</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
              {/* Danh sách tệp */}
              <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-lg">📄</span>
                        <span className="font-bold text-slate-700 truncate text-sm">{file.name}</span>
                      </div>
                      <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 font-bold text-xs p-1">Gỡ</button>
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current.click()} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:bg-slate-50">+ Thêm tệp khác</button>
                </div>
              </div>

              {/* Xem trước */}
              <div className="flex flex-col h-full">
                <div className="flex-1 min-h-[250px] bg-slate-100 rounded-[2rem] border-2 border-white shadow-inner flex items-center justify-center overflow-hidden">
                  {files.length === 1 && previewUrl ? renderFilePreview(files[0], previewUrl) : (
                    <div className="text-center p-10 opacity-30">
                      <div className="text-5xl mb-2">📦</div>
                      <p className="text-xs font-bold uppercase tracking-widest">Đang chờ tải lên...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-10 flex justify-end">
          <button 
            onClick={handleAdd}
            disabled={files.length === 0}
            className={`rounded-full px-12 py-4 text-lg font-black transition-all duration-300 ${
              files.length > 0 
              ? "bg-[#4ecdc4] text-white shadow-lg shadow-[#4ecdc4]/30 hover:scale-105 active:scale-95" 
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            Tải lên ngay ({files.length})
          </button>
        </footer>
      </div>
    </div>
  );
};