import React, { useState, useEffect, useMemo } from "react";
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

  // UI management hook
  const {
    activeToolId, setActiveToolId,
    isTTROpen, setIsTTROpen,
    selectedActivityId, setSelectedActivityId,
    openQuiz, openTTR, openOpenEnded
  } = useInteractionUI();

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
  
  // Lấy toàn bộ danh sách lịch sử học liệu
  const { activities, fetchActivities, handleDeleteActivity } = useStudyActivities(interactionId);
  
  const { quizzes, removeQuiz, isLoading: isQuizLoading } = useQuizManagement(interactionId);

  // Vẫn giữ bộ lọc cho Quiz nếu Sidebar có 1 khu vực riêng chuyên hiển thị Quiz
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter(item => item.activity_format === "MULTIPLE_CHOICE_QUESTIONS");
  }, [quizzes]);

  const { 
    handleToolClick, activeToolSetup, setActiveToolSetup, 
    handleConfirmCreate, toolLoadingStates, isCreatingNewActivity 
  } = useInteractionTools(interactionId, (activityType, newActivityId) => {
    // Làm mới danh sách tổng hợp
    fetchActivities(); 
  });

  // ==========================================
  // TTR LOGIC
  // ==========================================
  useEffect(() => {
    const loadTTR = async () => {
      try {
        const data = await fetchActivitiesByInteraction(interactionId);
        if (data && data.length > 0) {
          const ttrOnly = data.filter(item => 
            item.activity_type === "TTR" || item.activity_format === "TAP_TO_REVIEW"
          );

          const sortedData = ttrOnly.sort((a, b) => b.id - a.id);
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
    // ... logic nguyên vẹn
  };

  // ==========================================
  // [MỚI] SMART ROUTER (BỘ ĐỊNH TUYẾN THÔNG MINH)
  // ==========================================
  // Hàm này xử lý khi user click vào 1 bài trong danh sách tổng hợp ở góc dưới
  const handleGeneralActivityClick = (activityId) => {
    // Tìm thông tin chi tiết của bài vừa click
    const selectedItem = activities.find(item => item.id === activityId);
    if (!selectedItem) return;

    // Dựa vào định dạng (format) để gọi đúng hàm mở Popup
    if (selectedItem.activity_format === "MULTIPLE_CHOICE_QUESTIONS") {
      setSelectedQuizId(activityId);
      openQuiz();
    } 
    else if (selectedItem.activity_format === "TAP_TO_REVIEW" || selectedItem.activity_type === "TTR") {
      setCurrentActivityId(activityId);
      setCurrentIsNew(false);
      openTTR();
    } 
    else {
      // Mặc định là Tự luận / Gap Fill
      setSelectedActivityId(activityId);
      openOpenEnded();
    }
  };

  const handlePlayQuiz = (quizId) => {
    setSelectedQuizId(quizId); 
    openQuiz(); 
  };

  return (
    <InteractionLayout
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
          <TTRSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSubmit={handleCreateTTRBackground} />

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
      <SourceSidebar
        documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit}
        tempName={documentName} setTempName={setDocumentName} onRename={updateDocument}
        onDelete={deleteDocument} onDocCheck={handleDocCheck}
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />

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

      <ToolsSidebar
        onToolClick={handleToolClick}
        toolLoadingStates={toolLoadingStates}
        isCreatingNewActivity={isCreatingNewActivity}

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

        // [SỬA] TRẢ LẠI DANH SÁCH TỔNG CHO GÓC DƯỚI BÊN PHẢI
        activities={activities} 
        // [SỬA] DÙNG SMART ROUTER ĐỂ MỞ ĐÚNG POPUP
        onActivityClick={handleGeneralActivityClick} 
        onDeleteActivity={handleDeleteActivity}

        quizzes={filteredQuizzes} 
        isQuizLoading={isQuizLoading}
        onQuizClick={handlePlayQuiz}
        onDeleteQuiz={removeQuiz}
      />

      {/* OVERLAYS */}
      {activeToolId === "quiz" && (
        <QuizPanel
          interactionId={interactionId}
          quizId={selectedQuizId} 
          onClose={() => {
            setActiveToolId(null);
            setSelectedQuizId(null);
          }}
        />
      )}

      {selectedActivityId && (
        <OpenEndedContainer
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </InteractionLayout>
  );
};