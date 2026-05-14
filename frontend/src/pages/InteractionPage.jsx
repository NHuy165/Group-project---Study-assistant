import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments";
import { useChat } from "../features/chat/hooks/useChat";

import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";
import QuizPanel from "../features/quiz/components/QuizPanel";

export const InteractionPage = () => {
  // Get interaction ID from URL parameters
  const { interactionId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeToolId, setActiveToolId] = useState(null);

  const { handleNewChatClick } = useInteractions();

  const {
    documents,
    selectedDocIds,
    uploadMultipleFiles,
    updateDocument,
    documentName,
    setDocumentName,
    editingID,
    handleStartEdit,
    handleDocCheck,
    deleteDocument,
    isLoading: isDocsLoading,
  } = useDocuments(interactionId);

  const {
    chatlog,
    promptText,
    setPromptText,
    askLLM,
    isLoading: isChatLoading,
  } = useChat(interactionId);

  // Toggle tool sidebar items
  const handleToolSelect = (toolId) => {
    setActiveToolId((prev) => (prev === toolId ? null : toolId));
  };

  return (
    <InteractionLayout
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={uploadMultipleFiles}
          />
        </>
      }
    >
      <SourceSidebar
        documents={documents}
        isLoading={isDocsLoading}
        selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)}
        editingId={editingID}
        setEditingId={handleStartEdit}
        tempName={documentName}
        setTempName={setDocumentName}
        onRename={updateDocument}
        onDelete={deleteDocument}
        onDocCheck={handleDocCheck}
        onPreview={(doc) => {
          setSelectedDoc(doc);
          setIsPreviewOpen(true);
        }}
      />

      <ChatArea
        messages={chatlog}
        isLoading={isChatLoading}
        promptText={promptText}
        setPromptText={setPromptText}
        onSend={() => askLLM()}
      />

      <ToolsSidebar
        activeToolId={activeToolId}
        onSelectTool={handleToolSelect}
      />

      {/* RENDER QUIZ PANEL - Controlled by activeToolId state */}
      {activeToolId === "quiz" && (
        <QuizPanel
          interactionId={interactionId}
          onClose={() => {console.log("Đã bấm nút đóng!"); 
            setActiveToolId(null)}} // This function closes the quiz UI
        />
      )}
    </InteractionLayout>
  );
};