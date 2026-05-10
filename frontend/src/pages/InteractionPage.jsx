import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments"; 
import { useChat } from "../features/chat/hooks/useChat"; 
import useFlashcardSetManagement from "../features/flashcard/hooks/useFlashcardSetManagement";

import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";

import FlashcardPanel from "../features/flashcard/components/FlashcardPanel";

export const InteractionPage = () => {
  const { interactionId } = useParams(); 

  // ========== UI STATE ==========
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);

  // ========== HOOKS ==========
  const { handleNewChatClick } = useInteractions();
  
  const { 
    documents, selectedDocIds, uploadMultipleFiles, updateDocument, 
    documentName, setDocumentName, editingID, handleStartEdit, 
    handleDocCheck, deleteDocument, isLoading: isDocsLoading 
  } = useDocuments(interactionId);
  
  const { 
    chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading 
  } = useChat(interactionId);

  const {
    flashcardSets,
    isLoading,
    error,
    createNewFlashcardSet,
    removeFlashcardSet,
  } = useFlashcardSetManagement(interactionId);

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
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />
      {isFlashcardMode ? (
        <FlashcardPanel
          flashcardSets={flashcardSets}
          isLoading={isLoading}
          error={error}
          onCreateFlashcardSet={createNewFlashcardSet}
          onRemoveFlashcardSet={removeFlashcardSet}
          onClose={() => setIsFlashcardMode(false)}
        />
      ) : (  

        <ChatArea 
          messages={chatlog} 
          isLoading={isChatLoading} 
          promptText={promptText}
          setPromptText={setPromptText}
          onSend={() => askLLM()} 
        />
      ) }

      <ToolsSidebar 
        onToolClick={(toolId) => {
          if (toolId === 'flashcard') {
            setIsFlashcardMode(!isFlashcardMode);
          }
        }}
      />
      
    </InteractionLayout>
  );
};
