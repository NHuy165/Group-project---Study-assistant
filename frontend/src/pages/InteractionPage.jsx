import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// ==========================================
// 1. IMPORTS HOOKS
// ==========================================
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments";
import { useChat } from "../features/chat/hooks/useChat";
import { useStudyActivities } from "../features/open_ended/hooks/useStudyActivities";
import { useInteractionTools } from "../features/interactions/hooks/useInteractionTools";
import { useInteractionUI } from "../features/interactions/hooks/useInteractionUI";
import useQuizManagement from "../features/quiz/hooks/useQuizManagement"; 

// ==========================================
// 2. IMPORTS COMPONENTS
// ==========================================
import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";

// Feature components
import QuizPanel from "../features/quiz/components/QuizPanel";
import { OpenEndedContainer } from "../features/open_ended/components/OpenEndedContainer";
import { ToolSetupArea } from "../features/interactions/components/ToolSetupArea";
import { TTRFeature } from "../features/ttr/index";
import { TTRSetupModal } from "../features/ttr/components/TTRSetupModal";
import { createTTRActivity, fetchActivitiesByInteraction } from "../features/ttr/api/ttrApi";

export const InteractionPage = () => {
  const { interactionId } = useParams();

  // ==========================================
  // INTERFACE MANAGEMENT STATES
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // UI management hook (Coordinates closing/opening overlays to prevent overlap)
  const {
    activeToolId, setActiveToolId,
    isTTROpen, setIsTTROpen,
    selectedActivityId, setSelectedActivityId,
    openQuiz, openTTR, openOpenEnded
  } = useInteractionUI();

  // State to store the ID of the quiz currently selected for playing
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Temporary states for TTR
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [currentIsNew, setCurrentIsNew] = useState(false);
  const [ttrTasks, setTtrTasks] = useState([]);

  // ==========================================
  // MAIN LOGIC HOOKS CALLS
  // ==========================================
  const handleNewChatClick = useInteractions();
  
  const { 
    documents, selectedDocIds, uploadMultipleFiles, updateDocument, 
    documentName, setDocumentName, editingID, handleStartEdit, 
    handleDocCheck, deleteDocument, isLoading: isDocsLoading 
  } = useDocuments(interactionId);
  
  const { chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading } = useChat(interactionId);
  
  // Hook to get the Essay activities list
  const { activities, fetchActivities, handleDeleteActivity } = useStudyActivities(interactionId);
  
  // Hook to get the Quiz list 
  const { quizzes, removeQuiz, isLoading: isQuizLoading } = useQuizManagement(interactionId);

  // Hook managing the shared Tool Configuration Form (ToolSetupArea)
  const { 
    handleToolClick, activeToolSetup, setActiveToolSetup, 
    handleConfirmCreate, toolLoadingStates, isCreatingNewActivity 
  } = useInteractionTools(interactionId, (activityType, newActivityId) => {
    if (activityType === "essay") {
      fetchActivities(); 
    } else if (activityType === "quiz") {
      // Intentionally empty or used for manual list refetching if required.
      // We DO NOT trigger openQuiz() or setSelectedQuizId(newActivityId) here.
      // This ensures the ToolSetupArea closes, but the Fullscreen QuizPanel remains hidden
      // until the user manually selects the quiz from the ToolsSidebar.
      console.debug("[InteractionPage] Quiz created successfully with ID:", newActivityId);
    }
  });

  // ==========================================
  // TTR LOGIC (Background data fetching)
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
        console.error("Error loading TTR Data:", err);
      }
    };
    loadTTR();
  }, [interactionId]);

  const handleCreateTTRBackground = ({ prompt: finalPrompt }) => {
    const tempId = Date.now();
    setTtrTasks(prev => [{ id: tempId, name: "Đang AI tạo bài...", status: 'loading' }, ...prev]);
    setIsSetupOpen(false);

    const promptName = finalPrompt.split("Nội dung/Chủ đề:")[1]?.substring(0, 25) || "Bài tập AI";

    createTTRActivity(interactionId, { name: promptName + "...", description: "Tự động tạo", prompt: finalPrompt })
      .then(newActivity => {
        setTtrTasks(prev => prev.map(task =>
          task.id === tempId ? { ...task, id: newActivity.id, name: newActivity.name, status: 'ready', isNew: true } : task
        ));
      })
      .catch(() => setTtrTasks(prev => prev.filter(task => task.id !== tempId)));
  };

  // ==========================================
  // UI HANDLERS
  // ==========================================
  
  // Triggered when user explicitly clicks on an existing Quiz in the Sidebar
  const handlePlayQuiz = (quizId) => {
    setSelectedQuizId(quizId); // Save the selected ID
    openQuiz();                // Trigger UI Hook to display the Quiz Panel overlay
  };

  return (
    <InteractionLayout
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
          <TTRSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSubmit={handleCreateTTRBackground} />

          {/* TTR GAME OVERLAY */}
          {isTTROpen && currentActivityId && (
            <TTRFeature
              activityId={currentActivityId}
              isNew={currentIsNew}
              onClose={() => { setIsTTROpen(false); setCurrentActivityId(null); }}
            />
          )}
        </>
      }
    >
      {/* 1. LEFT COLUMN: DOCUMENTS LIST */}
      <SourceSidebar
        documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit}
        tempName={documentName} setTempName={setDocumentName} onRename={updateDocument}
        onDelete={deleteDocument} onDocCheck={handleDocCheck}
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />

      {/* 2. MIDDLE COLUMN: CHAT OR CONFIG FORM (TOOL SETUP AREA) */}
      {activeToolSetup ? (
        <ToolSetupArea
          toolId={activeToolSetup}
          isLoading={isCreatingNewActivity}
          onConfirm={handleConfirmCreate}
          onCancel={() => setActiveToolSetup(null)}
        />
      ) : (
        <ChatArea
          messages={chatlog} isLoading={isChatLoading} promptText={promptText}
          setPromptText={setPromptText} onSend={() => askLLM()}
        />
      )}

      {/* 3. RIGHT COLUMN: TOOLS & LEARNING MATERIAL LIST */}
      <ToolsSidebar
        // Open shared tool configuration form
        onToolClick={handleToolClick}
        toolLoadingStates={toolLoadingStates}
        isCreatingNewActivity={isCreatingNewActivity}

        // TTR Management
        onOpenTTR={() => setIsSetupOpen(true)}
        ttrTasks={ttrTasks}
        onPlayTTR={(id) => {
          const task = ttrTasks.find(t => t.id === id);
          setCurrentActivityId(id);
          setCurrentIsNew(task ? task.isNew : false);
          openTTR();
          if (task && task.isNew) {
            setTtrTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
          }
        }}

        // Essay List Management
        activities={activities}
        onActivityClick={openOpenEnded}
        onDeleteActivity={handleDeleteActivity}

        // Quiz List Management
        quizzes={quizzes}
        isQuizLoading={isQuizLoading}
        onQuizClick={handlePlayQuiz}
        onDeleteQuiz={removeQuiz}
      />

      {/* 4. SCREEN OVERLAYS */}

      {/* Quiz Overlay: Renders when activeToolId equals "quiz" */}
      {activeToolId === "quiz" && (
        <QuizPanel
          interactionId={interactionId}
          quizId={selectedQuizId} 
          onClose={() => {
            setActiveToolId(null);
            setSelectedQuizId(null); // Reset temporary ID on close
          }}
        />
      )}

      {/* Essay Overlay */}
      {selectedActivityId && (
        <OpenEndedContainer
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </InteractionLayout>
  );
};