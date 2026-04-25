import React, { useState } from "react";
import { useParams } from "react-router-dom"; // BƯỚC 1: Import useParams

import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments"; 
import { useChat } from "../features/chat/hooks/useChat"; 

import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";

export const InteractionPage = () => {
  // BƯỚC 2: Lấy ID trực tiếp từ URL thay vì dựa vào state nội bộ
  const { interactionId } = useParams(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const { handleNewChatClick } = useInteractions();
  
  // BƯỚC 3: Truyền thẳng interactionId từ URL vào các hook
  const { 
    documents, selectedDocIds, uploadMultipleFiles, updateDocument, 
    documentName, setDocumentName, editingID, handleStartEdit, 
    handleDocCheck, deleteDocument, isLoading: isDocsLoading 
  } = useDocuments(interactionId);
  
  const { 
    chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading 
  } = useChat(interactionId);

  return (  
    <InteractionLayout 
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
        </>
      }
    >
      <SourceSidebar 
        documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit}
        tempName={documentName} setTempName={setDocumentName} onRename={updateDocument} 
        onDelete={deleteDocument} onDocCheck={handleDocCheck}
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />

      <ChatArea 
        messages={chatlog} isLoading={isChatLoading} promptText={promptText}
        setPromptText={setPromptText}
        onSend={() => askLLM()} 
      />

      <ToolsSidebar />
    </InteractionLayout>
  );
};