import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 

// ==========================================
// 1. IMPORTS HOOKS
// ==========================================
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments"; 
import { useChat } from "../features/chat/hooks/useChat"; 
import useFlashcardSetManagement from "../features/flashcard/hooks/useFlashcardSetManagement";
import { useStudyActivities } from "../features/open_ended/hooks/useStudyActivities";
import { useInteractionTools } from "../features/interactions/hooks/useInteractionTools";

// ==========================================
// 2. IMPORTS COMPONENTS
// ==========================================
import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";
import { OpenEndedContainer } from "../features/open_ended/components/OpenEndedContainer";
import { ToolSetupArea } from "../features/interactions/components/ToolSetupArea";

import { TTRFeature } from "../features/ttr/index"; 
import { TTRSetupModal } from "../features/ttr/components/TTRSetupModal"; 
import { createTTRActivity, fetchActivitiesByInteraction } from "../features/ttr/api/ttrApi";

import FlashcardPanel from "../features/flashcard/components/FlashcardPanel";

export const InteractionPage = () => {
  const { interactionId } = useParams(); 

  // ==========================================
  // STATE QUẢN LÝ GIAO DIỆN
  // ==========================================
  // State Tài liệu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [_selectedDoc, setSelectedDoc] = useState(null);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardPanelMode, setFlashcardPanelMode] = useState('create');
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState(null);

  // State Tap To Review (TTR)
  const [isSetupOpen, setIsSetupOpen] = useState(false); 
  const [isTTROpen, setIsTTROpen] = useState(false);     
  const [currentActivityId, setCurrentActivityId] = useState(null); 
  const [currentIsNew, setCurrentIsNew] = useState(false); 
  const [ttrTasks, setTtrTasks] = useState([]); 

  // State Open Ended
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  // ==========================================
  // GỌI CÁC CUSTOM HOOKS
  // ==========================================
  const { handleNewChatClick } = useInteractions();
  
  const { 
    documents, selectedDocIds, uploadMultipleFiles, updateDocument, 
    documentName, setDocumentName, editingID, handleStartEdit, 
    handleDocCheck, deleteDocument, isLoading: isDocsLoading 
  } = useDocuments(interactionId);
  
  const { chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading } = useChat(interactionId);

  const {
    flashcardSets,
    isLoading,
    error,
    createNewFlashcardSet,
    createEmptyFlashcardSet,
    removeFlashcardSet,
  } = useFlashcardSetManagement(interactionId);

  const { activities, fetchActivities, handleDeleteActivity } = useStudyActivities(interactionId);
  
  const { 
    handleToolClick, activeToolSetup, setActiveToolSetup, handleConfirmCreate, 
    toolLoadingStates, isCreatingNewActivity 
  } = useInteractionTools(interactionId, fetchActivities);

  // ==========================================
  // LOGIC TTR CHẠY NGẦM
  // ==========================================
  useEffect(() => {
    const loadTTR = async () => {
      try {
        const data = await fetchActivitiesByInteraction(interactionId);
        if (data && data.length > 0) {
          const sortedData = data.sort((a, b) => b.id - a.id);
          const formatted = sortedData.map(item => ({
            id: item.id,
            name: item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name,
            status: 'ready',
            isNew: false 
          }));
          setTtrTasks(formatted);
        }
      } catch (err) {
        console.error("Lỗi tải TTR Data:", err);
      }
    };
    loadTTR();
  }, [interactionId]);

  const handleCreateTTRBackground = ({ prompt: finalPrompt }) => {
    const tempId = Date.now();
    const newTask = { id: tempId, name: "Đang AI tạo bài...", status: 'loading' };
    setTtrTasks(prev => [newTask, ...prev]); 
    setIsSetupOpen(false);

    const promptName = finalPrompt.split("Nội dung/Chủ đề:")[1]?.substring(0, 25) || "Bài tập AI";

    createTTRActivity(interactionId, { name: promptName + "...", description: "Tự động tạo", prompt: finalPrompt })
      .then(newActivity => {
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId ? { ...task, id: newActivity.id, name: newActivity.name, status: 'ready', isNew: true } : task
        ));
      })
      .catch(error => {
        setTtrTasks(prev => prev.filter(task => task.id !== tempId));
      });
  };

  const openFlashcardCreate = () => {
    setSelectedFlashcardSet(null);
    setFlashcardPanelMode('create');
    setIsFlashcardMode(true);
  };

  const openFlashcardSet = (set) => {
    setSelectedFlashcardSet(set);
    setFlashcardPanelMode('study');
    setIsFlashcardMode(true);
  };

  const closeFlashcardPanel = () => {
    setIsFlashcardMode(false);
    setSelectedFlashcardSet(null);
  };

  // ==========================================
  // RENDER GIAO DIỆN
  // ==========================================
  return ( 
    <InteractionLayout 
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
          <TTRSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSubmit={handleCreateTTRBackground} />
          
          {/* LỚP PHỦ GAME TTR */}
          {isTTROpen && currentActivityId && (
            <TTRFeature activityId={currentActivityId} isNew={currentIsNew} onClose={() => { setIsTTROpen(false); setCurrentActivityId(null); }} />
          )}

          {isFlashcardMode && (
            <FlashcardPanel
              flashcardSets={flashcardSets}
              isLoading={isLoading}
              error={error}
              initialViewMode={flashcardPanelMode}
              initialSelectedSet={selectedFlashcardSet}
              onCreateFlashcardSet={createNewFlashcardSet}
              onCreateEmptyFlashcardSet={createEmptyFlashcardSet}
              onRemoveFlashcardSet={removeFlashcardSet}
              onClose={closeFlashcardPanel}
            />
          )}
        </>
      }
    >
      {/* 1. CỘT TRÁI */}
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

        {/* <FlashcardPanel
          flashcardSets={flashcardSets}
          isLoading={isLoading}
          error={error}
          onCreateFlashcardSet={createNewFlashcardSet}
          onCreateEmptyFlashcardSet={createEmptyFlashcardSet}
          onRemoveFlashcardSet={removeFlashcardSet}
          onClose={() => setIsFlashcardMode(false)}
        /> */}


      {/* 2. CỘT GIỮA */}
      {activeToolSetup ? (
        <ToolSetupArea
          toolId={activeToolSetup}
          isLoading={isCreatingNewActivity}
          onConfirm={handleConfirmCreate}
          onCancel={() => setActiveToolSetup(null)}
        />
      ) : (
        <ChatArea
          messages={chatlog}
          isLoading={isChatLoading}
          promptText={promptText}
          setPromptText={setPromptText}
          onSend={() => askLLM()}
        />
      )}

      {/* 3. CỘT PHẢI (Truyền toàn bộ Props của cả 2 tính năng vào) */}
      <ToolsSidebar 
        // Props TTR
        onOpenTTR={() => setIsSetupOpen(true)} 
        ttrTasks={ttrTasks} 
        onPlayTTR={(id) => {
          const task = ttrTasks.find(t => t.id === id);
          setCurrentActivityId(id);
          setCurrentIsNew(task ? task.isNew : false);
          setIsTTROpen(true);
          if (task && task.isNew) {
            setTtrTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
          }
        }} 
        // Props Open-Ended
        activities={activities}
        flashcardSets={flashcardSets}
        onOpenFlashcardSet={openFlashcardSet}
        onDeleteFlashcardSet={removeFlashcardSet}
        onToolClick={(toolId) => {
          if (toolId === 'flashcard') {
            openFlashcardCreate();
            return;
          }

          handleToolClick(toolId);
        }}
        onActivityClick={(id) => setSelectedActivityId(id)}
        onDeleteActivity={handleDeleteActivity}
        toolLoadingStates={toolLoadingStates}
        isCreatingNewActivity={isCreatingNewActivity}
      />

      {/* 4. LỚP PHỦ BÀI TẬP OPEN ENDED */}
      <OpenEndedContainer 
        activityId={selectedActivityId} 
        onClose={() => setSelectedActivityId(null)} 
      />
    </InteractionLayout>
  );
};
