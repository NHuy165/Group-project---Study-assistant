// src/features/documents/components/AddSourceModal.jsx
import React, { useRef, useState, useEffect } from "react";

export const AddSourceModal = ({ isOpen, onClose, onAdd }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const changeFile = (newIndex) => {
    if (newIndex === currentIndex || isFlipping) return; 

    setIsFlipping(true); 
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => setIsFlipping(false), 50);
    }, 150); 
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (files.length > 0 && files[currentIndex]) {
      const file = files[currentIndex];
      const isPreviewable = file.type.startsWith("image/") || 
                            file.type.startsWith("video/") || 
                            file.type.startsWith("audio/") || 
                            file.type === "application/pdf";
      
      if (isPreviewable) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }
    setPreviewUrl(null);
  }, [files, currentIndex]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      if (files.length === 0) setCurrentIndex(0); 
    }
  };

  const handleRemoveFile = (e, indexToRemove) => {
    e.stopPropagation();
    const newFiles = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(newFiles);
    
    if (indexToRemove === currentIndex) {
      const nextIndex = Math.max(0, indexToRemove - 1);
      if (newFiles.length > 0) changeFile(Math.min(nextIndex, newFiles.length - 1));
      else setCurrentIndex(0);
    } else if (indexToRemove < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    const documentInput = { name: files[0]?.name };
    onAdd(files, documentInput); 
    setFiles([]);
    setCurrentIndex(0);
    onClose(); 
  };

  // Cập nhật: Luôn ép các thẻ hiển thị dùng w-full h-full và object-contain để vừa khít tivi
  const renderFilePreview = (file, url) => {
    if (file.type.startsWith("image/")) return <img src={url} alt="preview" className="w-full h-full object-contain drop-shadow-md rounded-2xl" />;
    if (file.type.startsWith("video/")) return <video controls src={url} className="w-full h-full object-contain bg-black rounded-2xl" />;
    if (file.type.startsWith("audio/")) return <div className="w-full h-full flex flex-col justify-center items-center gap-4"><span className="text-6xl animate-bounce">🎵</span><audio controls src={url} className="w-full max-w-sm" /></div>;
    if (file.type === "application/pdf") return <iframe src={url} className="w-full h-full border-none rounded-2xl bg-white" title="pdf" />;
    
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-lg">
        <div className="text-6xl mb-4">📄</div>
        <p className="font-bold text-slate-500 text-lg">Tệp {file.type.split('/')[1]?.toUpperCase() || "KHÔNG RÕ"}</p>
        <p className="text-sm text-slate-400 mt-1">Hệ thống không hỗ trợ xem trước tệp này</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        // Nới rộng Modal thêm một chút (max-w-[1100px]) để bố cục 2 cột thoải mái hơn
        className="relative w-full max-w-[1100px] rounded-[3rem] bg-white p-8 md:p-10 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-8 top-8 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <header className="mb-6">
          <h2 className="text-3xl font-black text-slate-800"><span className="text-[#4ecdc4] mr-2">+</span>Thêm nguồn học tập</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Bé hãy chọn những tài liệu hay để tớ học cùng nhé!</p>
        </header>

        <input type="file" ref={fileInputRef} accept=".pdf,image/*,audio/*,video/*" onChange={handleFileChange} hidden multiple />

        <div className="flex flex-col justify-center relative">
          {files.length === 0 ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="group flex flex-col items-center justify-center rounded-[3rem] h-[450px] border-4 border-dashed border-slate-200 bg-slate-50/50 hover:bg-[#f2fcfb] hover:border-[#4ecdc4] cursor-pointer transition-all duration-300"
            >
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">☁️</div>
              <p className="text-2xl font-black text-slate-400 group-hover:text-[#4ecdc4]">Bấm để chọn hoặc thả tệp vào đây</p>
              <p className="mt-3 text-slate-400 text-xs font-bold uppercase tracking-widest">Hỗ trợ PDF, Hình ảnh, Âm thanh, Video</p>
            </div>
          ) : (
            // ===============================================
            // CHIỀU CAO CỐ ĐỊNH h-[600px] cho toàn bộ layout
            // ===============================================
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 animate-in slide-in-from-bottom-8 duration-500 h-[600px]">
              
              {/* KHUNG XEM TRƯỚC: TRẢI DÀI TỪ TRÊN XUỐNG DƯỚI (100% h-[600px]) */}
              <div className="flex flex-col h-full relative">
                <div className="flex justify-between items-center mb-3 px-2 shrink-0">
                  <h3 className="font-bold text-slate-700 text-sm">Xem trước tài liệu</h3>
                  <span className="bg-slate-100 text-slate-500 text-xs font-black px-3 py-1 rounded-full">
                    {currentIndex + 1} / {files.length}
                  </span>
                </div>
                
                <div 
                  className="flex-1 bg-slate-100/50 rounded-[2.5rem] border-2 border-slate-100 shadow-inner flex items-center justify-center overflow-hidden relative group"
                  style={{ perspective: "1500px" }} 
                >
                  {previewUrl ? (
                    <div 
                      className={`absolute inset-0 p-3 transition-all duration-300 ease-in-out ${
                        isFlipping 
                        ? 'opacity-0 scale-90 [transform:rotateY(-90deg)]' 
                        : 'opacity-100 scale-100 [transform:rotateY(0deg)]' 
                      }`}
                    >
                      {renderFilePreview(files[currentIndex], previewUrl)}
                    </div>
                  ) : (
                    <div className="text-center p-10 opacity-30">
                      <div className="text-5xl mb-2 animate-bounce">⏳</div>
                      <p className="text-xs font-bold uppercase tracking-widest">Đang tải bản xem trước...</p>
                    </div>
                  )}

                  {files.length > 1 && (
                    <div className={`absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFlipping ? 'hidden' : ''}`}>
                      <button 
                        onClick={() => changeFile(currentIndex === 0 ? files.length - 1 : currentIndex - 1)}
                        className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur text-slate-700 rounded-full shadow-xl hover:bg-[#4ecdc4] hover:text-white hover:scale-110 transition-all"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button 
                        onClick={() => changeFile((currentIndex + 1) % files.length)}
                        className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur text-slate-700 rounded-full shadow-xl hover:bg-[#4ecdc4] hover:text-white hover:scale-110 transition-all"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* KHUNG DANH SÁCH FILE + FOOTER (NẰM BÊN PHẢI) */}
              <div className="flex flex-col h-full overflow-hidden relative">
                <h3 className="font-bold text-slate-700 text-sm mb-3 shrink-0">Tệp đã chọn ({files.length})</h3>
                
                {/* Vùng danh sách (Có thanh cuộn) */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-2">
                  {files.map((file, i) => (
                    <div 
                      key={i} 
                      onClick={() => changeFile(i)} 
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 group ${
                        i === currentIndex 
                          ? 'bg-[#f0fbfb] border-[#4ecdc4] shadow-[0_4px_12px_rgba(78,205,196,0.15)] scale-[1.02]' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-2xl drop-shadow-sm">📄</span>
                        <div className="min-w-0">
                          <p className={`font-bold truncate text-sm transition-colors ${i === currentIndex ? 'text-[#38a89f]' : 'text-slate-700'}`}>{file.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleRemoveFile(e, i)} 
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                        title="Xóa tệp này"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-600 transition-all"
                  >
                    + Thêm tệp khác
                  </button>
                </div>
                
                {isFlipping && <div className="absolute inset-0 z-10 bg-white/20"></div>}

                {/* =============================================== */}
                {/* NÚT BẤM (FOOTER) ĐƯỢC KÉO LÊN CỘT BÊN PHẢI */}
                {/* =============================================== */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col xl:flex-row justify-end gap-3 shrink-0">
                  <button onClick={() => setFiles([])} className="rounded-full px-6 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                    Xóa tất cả
                  </button>
                  <button 
                    onClick={handleAdd}
                    className="flex-1 rounded-full px-6 py-4 text-lg font-black bg-[#4ecdc4] text-white shadow-[0_8px_20px_rgba(78,205,196,0.3)] hover:scale-105 active:scale-95 hover:bg-[#38b5ac] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Tải lên ngay ({files.length})
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};