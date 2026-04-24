import React, { useRef, useState } from "react";

export const AddSourceModal = ({ isOpen, onClose, onAdd }) => {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderPreview = (file) => {
    const fileType = file.type;
    const fileUrl = URL.createObjectURL(file);

    if (fileType.startsWith("image/")) {
      return <img src={fileUrl} alt="preview" className="h-full w-full object-contain rounded-2xl" />;
    }
    if (fileType.startsWith("video/")) {
      return <video controls src={fileUrl} className="h-full w-full rounded-2xl bg-black" />;
    }
    if (fileType.startsWith("audio/")) {
      return (
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🎵</span>
          <audio controls src={fileUrl} className="w-64" />
        </div>
      );
    }
    if (fileType === "application/pdf") {
      return <iframe src={fileUrl} className="w-full h-full rounded-2xl border-none" title="pdf" />;
    }

    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
          <span className="text-4xl text-slate-300">📄</span>
        </div>
        <p className="text-lg font-bold text-slate-500">Xem trước không khả dụng</p>
        <p className="text-sm text-slate-400 mt-1">Hệ thống đã sẵn sàng xử lý tệp này</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl rounded-[3rem] bg-white p-10 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300">
        
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute right-10 top-10 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <span className="text-red-500">+</span> Thêm nguồn mới
          </h2>
        </header>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden multiple />

        {/* --- 1. DÃY NÚT CHỨC NĂNG (Đã mang trở lại) --- */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: 'upload', icon: '☁️', label: 'Tải tệp lên' },
            { id: 'drive', icon: '▲', label: 'Tải từ Drive' },
            { id: 'text', icon: '📄', label: 'Văn bản' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.id === 'upload' && fileInputRef.current.click()}
              className={`flex items-center justify-center gap-3 rounded-2xl py-4 border-2 transition-all duration-300 ${
                activeTab === tab.id 
                ? "border-slate-800 bg-slate-50 font-bold shadow-sm" 
                : "border-slate-100 text-slate-300 hover:border-slate-200"
              }`}
            >
              <span className={activeTab === tab.id ? "" : "grayscale"}>{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --- 2. VÙNG HIỂN THỊ CHÍNH --- */}
        <div className="min-h-[350px]">
          {files.length === 0 ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center rounded-[2.5rem] py-24 border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all"
            >
              <p className="text-3xl font-black text-slate-300">hoặc thả tệp của bạn</p>
              <p className="mt-2 text-slate-400 text-sm italic">pdf, hình ảnh, tài liệu, âm thanh...</p>
            </div>
          ) : files.length === 1 ? (
            <div className="space-y-4">
              {/* Thanh thông tin: Tên | Dung lượng | Xóa */}
              <div className="flex items-center justify-between bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
  
                {/* Bên trái: Icon và Tên file */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-lg">📂</span>
                  {/* SỬA: file.name -> files[0].name */}
                  <span className="font-bold text-slate-700 truncate max-w-[250px]">
                    {files[0].name}
                  </span>
                </div>
                
                {/* Bên phải: Dung lượng và Nút xóa (Nằm ngang hàng) */}
                <div className="flex items-center gap-6">
                  {/* Ô hiển thị dung lượng */}
                  {/* SỬA: file.size -> files[0].size */}
                  <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-50">
                    {(files[0].size / 1024 / 1024).toFixed(2)} MB
                  </span>

                  {/* Nút xóa */}
                  {/* SỬA: removeFile(index) -> removeFile(0) */}
                  <button 
                    onClick={() => removeFile(0)} 
                    className="text-red-500 font-bold text-sm hover:text-red-700 transition-colors"
                  >
                    Xóa file
                  </button>
                </div>
              </div>

              {/* Ô XEM TRƯỚC TO */}
              <div className="w-full h-[250px] bg-slate-50/30 rounded-[2rem] flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                {renderPreview(files[0])}
              </div>
            </div>
          ) : (
            /* DANH SÁCH NHIỀU TỆP */
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Đã chọn {files.length} tệp</p>
              {files.map((f, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-300 transition-all animate-in slide-in-from-bottom-1"
                >
                  {/* Cụm bên trái: Icon + Tên file */}
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-slate-400 text-sm">📄</span>
                    <span className="font-bold text-slate-700 truncate text-sm max-w-[200px]">
                      {f.name}
                    </span>
                  </div>

                  {/* Cụm bên phải: Dung lượng + Nút gỡ (Ngang hàng giống bản 1 tệp) */}
                  <div className="flex items-center gap-6">
                    {/* Ô dung lượng: Dùng đúng style 'xịn' của bản 1 tệp */}
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50/50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                      {(f.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                    {/* Nút gỡ bỏ */}
                    <button 
                      onClick={() => removeFile(i)} 
                      className="text-red-400 hover:text-red-600 font-bold text-xs transition-colors"
                    >
                      Gỡ bỏ
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => fileInputRef.current.click()} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 font-bold hover:bg-slate-50 hover:text-slate-400 transition-all">+ Thêm tệp khác</button>
            </div>
          )}
        </div>

        {/* NÚT TẠO */}
        <div className="mt-10 flex justify-end">
          <button 
            onClick={() => { 
              // SỬA TẠI ĐÂY: Gửi nguyên mảng 'files' (chứa dữ liệu thật) đi
              onAdd(files); 
              
              setFiles([]); // Xóa danh sách file trong modal sau khi thêm thành công
              onClose(); 
            }}
            disabled={files.length === 0}
            className={`rounded-full px-16 py-5 text-xl font-black transition-all duration-500 ${
              files.length > 0 
              ? "bg-red-500 text-white shadow-[0_15px_30px_-5px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95" 
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            Tạo ({files.length})
          </button>
        </div>
      </div>
    </div>
  );
};