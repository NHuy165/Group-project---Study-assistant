import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
// [MỚI] Import Xưởng sản xuất TTR mới
import { useTTRManager } from "../features/ttr/hooks/useTTRManager";

// ==========================================
// 2. IMPORTS COMPONENTS
// ==========================================
import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";

import QuizPanel from "../features/quiz/components/QuizPanel";
import { OpenEndedContainer } from "../features/open_ended/components/OpenEndedContainer";
import { ToolSetupArea } from "../features/interactions/components/ToolSetupArea";
import { TTRFeature } from "../features/ttr/index";

export const InteractionPage = () => {
  const { interactionId } = useParams();
  const navigate = useNavigate(); // [SỬA]: Thêm điều hướng

  // ==========================================
  // INTERFACE MANAGEMENT STATES (Phòng Quản Lý Không Gian)
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const {
    activeToolId,
    setActiveToolId,
    isTTROpen,
    setIsTTROpen,
    selectedActivityId,
    setSelectedActivityId,
    openQuiz,
    openTTR,
    openOpenEnded,
  } = useInteractionUI();

  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // ==========================================
  // MAIN LOGIC HOOKS CALLS (Các Xưởng Sản Xuất)
  // ==========================================

  // [SỬA]: Xóa object useInteractions(), đổi thành hàm Function chuẩn
  const handleNewChatClick = () => {
    navigate("/dashboard");
  };

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

  const { activities, fetchActivities, handleDeleteActivity } =
    useStudyActivities(interactionId);

  const {
    quizzes,
    removeQuiz,
    isLoading: isQuizLoading,
  } = useQuizManagement(interactionId);

  // [MỚI] Cắm điện cho Xưởng TTR
  const { ttrTasks, gameConfig, handleCreateTTRBackground, handlePreparePlay } =
    useTTRManager(interactionId);

  // ==========================================
  // CENTRAL DISPATCHER (Não Bộ Điều Phối)
  // ==========================================
  const {
    handleToolClick,
    activeToolSetup,
    setActiveToolSetup,
    handleConfirmCreate,
    toolLoadingStates,
    isCreatingNewActivity,
  } = useInteractionTools(
    interactionId,
    (activityType, newActivityId) => fetchActivities(),
    // [QUAN TRỌNG] Truyền ống dẫn dữ liệu từ Xưởng TTR vào Dispatcher
    handleCreateTTRBackground,
    // [QUAN TRỌNG] Báo cho Dispatcher biết TTR có đang loading không
    ttrTasks.some((t) => t.status === "loading"),
  );

  // ==========================================
  // SMART ROUTER & FILTERING
  // ==========================================
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter(
      (item) => item.activity_format === "MULTIPLE_CHOICE_QUESTIONS",
    );
  }, [quizzes]);

  const handleGeneralActivityClick = (activityId) => {
    const selectedItem = activities.find((item) => item.id === activityId);
    if (!selectedItem) return;

    if (selectedItem.activity_format === "MULTIPLE_CHOICE_QUESTIONS") {
      setSelectedQuizId(activityId);
      openQuiz();
    } else if (
      selectedItem.activity_type === "REVIEW" &&
      selectedItem.activity_format === "GAP_FILL"
    ) {
      // Nhờ Xưởng TTR chuẩn bị cấu hình, sau đó gọi hàm mở game của UI
      handlePreparePlay(activityId, openTTR);
    } else {
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
          <AddSourceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={uploadMultipleFiles}
          />

          {/* Đã xóa TTRSetupModal cũ vì đã dùng ToolSetupArea chung */}

          {/* Render Game TTR từ gameConfig */}
          {isTTROpen && gameConfig.activityId && (
            <TTRFeature
              activityId={gameConfig.activityId}
              isNew={
                ttrTasks.find((t) => t.id === gameConfig.activityId)?.isNew ||
                false
              }
              onClose={() => {
                setIsTTROpen(false);
                // Có thể gọi thêm hàm reset config ở useTTRManager nếu cần
              }}
            />
          )}
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

      {/* Phòng Lễ Tân - Nhận mọi yêu cầu (Quiz, Essay, TTR) */}
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

      <ToolsSidebar
        onToolClick={handleToolClick}
        toolLoadingStates={toolLoadingStates}
        ttrTasks={ttrTasks}
        // Thay vì tự xử lý logic mở, giao phó cho Xưởng TTR chuẩn bị
        onPlayTTR={(id) => handlePreparePlay(id, openTTR)}
        activities={activities}
        onActivityClick={handleGeneralActivityClick}
        onDeleteActivity={handleDeleteActivity}
        quizzes={filteredQuizzes}
        isQuizLoading={isQuizLoading}
        onQuizClick={handlePlayQuiz}
        onDeleteQuiz={removeQuiz}
      />

      {/* OVERLAYS LÀM BÀI */}
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
