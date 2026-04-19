import { InteractionList } from "../features/interactions/components/InteractionList";
import React, { useState } from "react";

import backgroundImg from "../assets/background.png";
import videoIcon from "../assets/icon/video.svg";
import slideIcon from "../assets/icon/slide.svg"
import quizIcon from "../assets/icon/Quiz.svg"
import { AddSourceModal } from "../components/AddSourceModal";
import { FilePreviewModal } from "../components/FilePreviewModal";



export const InteractionPage = () => {
  // Tài liệu upload
  const [documents, setDocuments] = useState([]);
  const [activeViewDoc, setActiveViewDoc] = useState(null); // File đang xem

  const initialNotes = [
    { id: 1, name: "Ghi chú 01" },
    { id: 2, name: "Ghi chú 02" },
    { id: 3, name: "Ghi chú 03" },
  ];
  // Các icon
  const tools = [
  { name: 'Video', icon: videoIcon, isSvg: true },
  { name: 'Slide', icon: slideIcon, isSvg: true },
  { name: 'Mind Map', icon: '🧠', isSvg: false },
  { name: 'Flashcard', icon: '📕', isSvg: false },
  { name: 'Quiz', icon: quizIcon, isSvg: true },
];

  // State quản lý tài liệu và ghi chú (để có thể cập nhật khi người dùng tương tác)
  // const [documents, setDocuments] = useState(initialDocuments);
  const [notes, setNotes] = useState(initialNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Checkbox khi người dùng click vào một tài liệu, sẽ cập nhật trạng thái checked của tài liệu đó
  const handleDocCheck = (id) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  // Hàm này truyền xuống Modal 
  const handleAddDocument = (uploadedFiles) => {
    const newDocs = uploadedFiles.map(fileObj => ({
      id: crypto.randomUUID(),
      name: fileObj.name,
      file: fileObj, // Lưu lại file thật để xem preview
      checked: false,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

    // Xử lý icon định dạng khi thêm file
  const getFileIcon = (fileName) => {
    if (!fileName) return "📁";
    const extension = fileName.split('.').pop().toLowerCase();
    
    // Phân loại định dạng
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoTypes = ['mp4', 'mov', 'avi', 'mkv'];
    const audioTypes = ['mp3', 'wav', 'm4a', 'flac'];
    const docTypes = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'];

    if (imageTypes.includes(extension)) return "🖼️";  // Hình ảnh
    if (videoTypes.includes(extension)) return "🎥";  // Video
    if (audioTypes.includes(extension)) return "🎵";  // Âm thanh
    if (docTypes.includes(extension)) return "📄";    // Tài liệu
    if (fileName.startsWith('http')) return "🔗";     // Link
    
    return "📁"; // Khác (mặc định là thư mục/tệp lạ)

  };

  return (
    <div
      className="flex h-screen w-screen flex-col bg-cover bg-center bg-no-repeat px-10 pb-10 pt-28 font-sans text-gray-800 shadow-inner"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Header Tên ứng dụng - Giữ nguyên vị trí */}
      <header className="absolute top-10 left-10 z-50 text-4xl font-black tracking-tight text-meteor">
        EduSpark<span>.AI</span>
      </header>

      <button className="absolute top-10 right-10 z-50 rounded-full bg-white/60 px-6 py-2.5 text-sm font-bold text-[#888888]-700 shadow-md backdrop-blur-md transition hover:bg-white hover:scale-105 active:scale-95 border border-white/20">
        + New chat
      </button>
      
      <div className="flex h-full w-full space-x-6">
        {/* CỘT TRÁI (Nguồn tài liệu) */}
        <aside className="flex w-[22%] flex-col space-y-4 rounded-3xl bg-white/45 p-6 backdrop-md shadow-xl border border-white/0">
          <header className="space-y-4">
            <div className="flex items-center space-x-2 text-2xl font-bold text-[#463333]-800">
              <span>📚</span>
              <h2>Nguồn tài liệu</h2>
            </div>
            {/* Đường kẻ ngang dưới tiêu đề */}
            <hr className="border-t border-gray-400/30" />
          </header>

          <button 
            onClick={() => setIsModalOpen(true)} // Khi bấm thì chuyển thành true (mở)
            className="w-full rounded-2xl bg-[#bf94e4] py-3.5 font-bold text-white transition hover:bg-[#b388d8] shadow-md"
          >
            + Thêm nguồn
          </button>

          <nav className="flex-1 space-y-3 overflow-y-auto pr-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => handleDocCheck(doc.id)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={doc.checked}
                    onChange={() => {}}
                    className="h-5 w-5 rounded-md border-2 border-gray-300 accent-[#4ecdc4]"
                  />
                  {/* Tên file */}
                  <span className="font-semibold text-gray-700 truncate max-w-[150px]">
                    {doc.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // NGĂN KHÔNG CHO TICK CHECKBOX
                    setSelectedDoc(doc);
                    setIsPreviewOpen(true);
                  }}
                  className="p-2 hover:bg-white rounded-xl transition-all hover:scale-125 shadow-sm active:scale-95"
                  title="Xem chi tiết"
                >
                  <span className="text-xl">{getFileIcon(doc.name)}</span>
                </button>
              </div>

              
            ))}
          </nav>
        </aside>

        {/* VÙNG TRUNG TÂM (Nội dung + Khung Chat) */}
        <main className="flex flex-col flex-1 h-full items-center justify-between rounded-3xl bg-white/45 p-6 backdrop-md shadow-xl border border-white/20">
          <header className="w-full space-y-4 text-center">
            {/* Đặt h-10 để khớp chiều cao hàng với 2 cột bên */}
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center justify-center h-10">
              Nội dung
            </h1>
            <hr className="mx-auto w-full border-t border-gray-400/30" />
          </header>

          <div className="flex-1 w-full flex items-center justify-center text-gray-600 font-medium italic">
            <p>Bắt đầu cuộc trò chuyện hoặc chọn một tài liệu...</p>
          </div>
          
          <footer className="w-full max-w-3xl mb-4 mt-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn tại đây..."
                className="w-full rounded-full border border-gray-200 bg-white/90 px-6 py-4.5 text-[1.1rem] font-medium leading-tight text-[#333] placeholder-gray-400 shadow-lg outline-none transition focus:border-[#4ecdc4] focus:bg-white"
              />
              <button className="absolute right-4.5 rounded-full bg-[#4ecdc4] p-3 text-white transition hover:scale-110 hover:bg-[#45b7aa]">
                <span className="text-xl">✈️</span>
              </button>
            </div>
          </footer>

          {/* Ở dưới cùng, chữ nghiêng */}
          <div className="w-full text-center text-xs text-gray-600 mt-2 italic">
            <p>TDTT có thể đưa thông tin không chính xác, Hãy kiểm tra câu trả lời mà bạn nhận được</p>
          </div>
        </main>

        {/* CỘT PHẢI (Công cụ & Ghi chú) */}
        <aside className="flex w-[20%] flex-col space-y-4 rounded-3xl bg-white/45 p-6 backdrop-md shadow-xl border border-white/20">
          {/* Nút New chat đặt tuyệt đối hoặc điều chỉnh để không làm lệch hàng tiêu đề */}
          <div className="relative">
             
            <header className="space-y-4">
              {/* Cỡ chữ text-2xl to hơn và h-10 để thẳng hàng */}
              <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800 h-10">
                <span>⚙️</span>
                <h2>Công cụ</h2>
              </div>
              <hr className="border-t border-gray-400/30" />
            </header>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tools.map((item) => (
              <button 
                key={item.name} 
                className="flex flex-col items-center justify-center rounded-2xl bg-[#FFEDE2B2]/80 p-3 space-y-2 shadow-sm hover:shadow-md transition hover:scale-105 active:scale-95"
              >
                {item.isSvg ? (
                  /* Nếu là SVG thì dùng thẻ img */
                  <img 
                    src={item.icon} 
                    alt={item.name} 
                    className="w-8 h-8 object-contain" 
                  />
                ) : (
                  /* Nếu không phải SVG (là emoji) thì dùng thẻ span */
                  <span className="text-2xl">{item.icon}</span>
                )}
                
                <span className="text-xs font-bold text-gray-700">{item.name}</span>
              </button>
            ))}
          </div>

          <header className="space-y-4 pt-2">
            {/* Cỡ chữ text-2xl cho Ghi chú */}
            <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
              <span>📝</span>
              <h2>Ghi chú</h2>
            </div>
            <hr className="border-t border-gray-400/30" />
          </header>

          <button className="w-full rounded-2xl bg-[#bf94e4] py-3 font-bold text-white transition hover:bg-[#b388d8] shadow-md">
            + Thêm ghi chú
          </button>

          <nav className="flex-1 space-y-3 overflow-y-auto pr-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-center rounded-2xl bg-white/80 px-4 py-3 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <span className="text-gray-400 mr-3 text-sm">✍️</span>
                <span className="font-semibold text-gray-700 text-sm">{note.name}</span>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    <AddSourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddDocument} // Hàm đưa vào để Modal có thể gọi khi thêm tài liệu mới
      />
    <FilePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        doc={selectedDoc} 
      />


      {/* 4. Sửa nút bấm ở cột trái/phải để mở modal */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="..."
      >
        + Thêm nguồn
      </button>
    </div>
  );
};