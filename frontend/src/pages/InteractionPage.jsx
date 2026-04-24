import React, { useState } from "react";
// Import các Hook chuyên biệt
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments"; 
import { useChat } from "../features/chat/hooks/useChat"; 

// ĐIỀU CHỈNH: Import đúng theo vị trí file trong ảnh bạn gửi (interactions/components)
import { SourceSidebar } from "../features/interactions/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";
import { FilePreviewModal } from "../features/documents/components/FilePreviewModal";
import backgroundImg from "../assets/background.png";

export const InteractionPage = () => {
  // 1. Quản lý Phiên (Sessions)
  const { 
    activeInteractionId, 
    handleNewChatClick,
    isLoading: isInteractionLoading 
  } = useInteractions();

  // 2. Quản lý Tài liệu (Chỉ lấy các biến liên quan đến File)
  const {
    documents, 
    selectedDocIds,
    uploadSingleFile, // Dùng hàm mới đã đổi tên
    updateDocument: handleRenameDoc,
    documentName: tempName,
    setDocumentName: setTempName,
    editingID: editingDocId,
    setEditingID: setEditingDocId,
    handleDocCheck,
    isLoading: isDocsLoading,
  } = useDocuments(activeInteractionId);

  // 3. Quản lý Chat (Chỉ lấy các biến liên quan đến Tin nhắn)
  const {
    chatlog: messages,        
    promptText: inputText,    
    handlePrompTextChange,    
    askLLM: onSend,
    isLoading: isChatLoading,
  } = useChat(activeInteractionId);

  // Hàm xử lý upload nhiều file: Nhận mảng file từ AddSourceModal và gọi uploadSingleFile cho từng file
  const handleUploadFiles = async (filesArray) => {
  for (const file of filesArray) {
    await uploadSingleFile(file); // Gọi hàm upload từng cái từ useDocuments
  }
};

  // State UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Gộp tất cả trạng thái loading
  const isLoading = isChatLoading || isDocsLoading || isInteractionLoading;

  return (
    <div className="flex h-screen w-screen flex-col bg-cover bg-center bg-no-repeat px-10 pb-10 pt-28 font-sans text-gray-800 shadow-inner"
      style={{ backgroundImage: `url(${backgroundImg})` }}>
      
      <header className="absolute top-10 left-10 z-50 text-4xl font-black tracking-tight text-meteor">
        EduSpark<span>.AI</span>
      </header>

      <button 
        onClick={handleNewChatClick} 
        className="absolute top-10 right-10 z-50 rounded-full bg-white/60 px-6 py-2.5 text-sm font-bold shadow-md backdrop-blur-md transition hover:scale-105 active:scale-95"
      >
        + New chat
      </button>
      
      <div className="flex h-full w-full space-x-6 overflow-hidden">
        <SourceSidebar 
          documents={documents} 
          isLoading={isDocsLoading}
          selectedDocIds={selectedDocIds}
          onAddClick={() => setIsModalOpen(true)}
          editingId={editingDocId} 
          setEditingId={setEditingDocId}
          tempName={tempName} 
          setTempName={setTempName}
          onRename={handleRenameDoc} 
          onDocCheck={handleDocCheck}
          onPreview={(doc) => { 
            setSelectedDoc(doc); 
            setIsPreviewOpen(true); 
          }}
        />

        <ChatArea 
          messages={messages} 
          isLoading={isChatLoading} 
          inputText={inputText} 
          // Truyền string vào và convert thành event cho useChat
          setInputText={(val) => handlePrompTextChange({ target: { value: val } })}
          onSend={() => onSend(inputText)} 
        />

        <ToolsSidebar />
      </div>

      <AddSourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleUploadFiles} 
      />
      
      <FilePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        doc={selectedDoc} 
      />
    </div>
  );
};