import React, { useState } from "react";
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { SourceSidebar } from "../features/interactions/components/SourceSidebar";
import { ChatArea } from "../features/interactions/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/interactions/components/AddSourceModal";
import { FilePreviewModal } from "../features/interactions/components/FilePreviewModal";
import backgroundImg from "../assets/background.png";

export const InteractionPage = () => {
  // Logic từ siêu Hook (Kết hợp của bạn và Partner)
  const { 
    documents, messages, inputText, setInputText, isLoading,
    handleSendMessage, handleAddDocument, handleRenameDoc,
    tempName, setTempName, editingDocId, setEditingDocId,
    handleNewChatClick, handleDocCheck
  } = useInteractions();

  // State UI thuần túy
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="flex h-screen w-screen flex-col bg-cover bg-center bg-no-repeat px-10 pb-10 pt-28 font-sans text-gray-800 shadow-inner"
      style={{ backgroundImage: `url(${backgroundImg})` }}>
      
      <header className="absolute top-10 left-10 z-50 text-4xl font-black tracking-tight text-meteor">
        EduSpark<span>.AI</span>
      </header>

      <button onClick={handleNewChatClick} className="absolute top-10 right-10 z-50 rounded-full bg-white/60 px-6 py-2.5 text-sm font-bold shadow-md backdrop-blur-md transition hover:scale-105 active:scale-95">
        + New chat
      </button>
      
      <div className="flex h-full w-full space-x-6 overflow-hidden">
        <SourceSidebar 
          documents={documents} onAddClick={() => setIsModalOpen(true)}
          editingId={editingDocId} setEditingId={setEditingDocId}
          tempName={tempName} setTempName={setTempName}
          onRename={handleRenameDoc} onDocCheck={handleDocCheck}
          onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
        />

        <ChatArea messages={messages} isLoading={isLoading} 
          inputText={inputText} setInputText={setInputText} onSend={handleSendMessage} 
        />

        <ToolsSidebar />
      </div>

      <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddDocument} />
      <FilePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} doc={selectedDoc} />
    </div>
  );
};