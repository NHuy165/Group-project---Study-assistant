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
import {
  createTTRActivity,
  fetchActivitiesByInteraction,
} from "../features/ttr/api/ttrApi";
import { QuizPanel } from "../features/quiz/components";

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
  const [currentMode, setCurrentMode] = useState('normal');

  // State Open Ended
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  // State Quiz
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // ==========================================
  // GỌI CÁC CUSTOM HOOKS
  // ==========================================
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

  const {
    flashcardSets,
    isLoading,
    isCreatingWithAI,
    error,
    createNewFlashcardSet,
    createEmptyFlashcardSet,
    removeFlashcardSet,
  } = useFlashcardSetManagement(interactionId);

  const { activities, fetchActivities, handleDeleteActivity } =
    useStudyActivities(interactionId);

  const {
    handleToolClick,
    activeToolSetup,
    setActiveToolSetup,
    createToolError,
    clearCreateToolError,
    handleConfirmCreate,
    toolLoadingStates,
    isCreatingNewActivity,
  } = useInteractionTools(interactionId, fetchActivities);

  const normalizeValue = (value) =>
    String(value ?? "")
      .trim()
      .toUpperCase();
  const getActivityFormat = (item) => normalizeValue(item?.activity_format);
  const getActivityType = (item) => normalizeValue(item?.activity_type);

  // ==========================================
  // LOGIC TTR CHẠY NGẦM
  // ==========================================
  useEffect(() => {
    const loadTTR = async () => {
      try {
        const data = await fetchActivitiesByInteraction(interactionId);
        if (Array.isArray(data)) {
          const filteredData = data.filter(
            (item) =>
              getActivityType(item) === "REVIEW" &&
              getActivityFormat(item) === "GAP_FILL",
          );
          console.log("[InteractionPage] TTR activities:", filteredData);
          const sortedData = filteredData.sort((a, b) => b.id - a.id);
          const formatted = sortedData.map((item) => ({
            id: item.id,
            name:
              item.name.length > 25
                ? item.name.substring(0, 25) + "..."
                : item.name,
            status: "ready",
            isNew: false,
          }));
          setTtrTasks(formatted);
        } else {
          setTtrTasks([]);
        }
      } catch (err) {
        console.error("Lỗi tải TTR Data:", err);
      }
    };
    loadTTR();
  }, [interactionId]);

// 1. Giữ lại các filter từ nhánh epic-main
  const openEndedActivities = (activities || []).filter(
    (item) =>
      getActivityType(item) === "EXERCISE" &&
      getActivityFormat(item) === "OPEN_ENDED",
  );

  const quizActivities = (activities || []).filter(
    (item) =>
      getActivityType(item) === "EXERCISE" &&
      getActivityFormat(item) === "MULTIPLE_CHOICE_QUESTIONS",
  );

  // 2. Sử dụng logic cập nhật từ nhánh HEAD
  const handleCreateTTRBackground = (data) => {
    // Hứng đầy đủ thông tin từ Modal gửi lên
    const { prompt: finalPrompt, gameMode, subjectType } = data;

    const tempId = Date.now();
    const newTask = {
      id: tempId,
      name: "Đang AI tạo bài...",
      status: "loading",
    };
    setTtrTasks((prev) => [newTask, ...prev]);
    setIsSetupOpen(false);

    // Gom đúng chuẩn Payload mà API yêu cầu
    const payload = { 
      prompt: finalPrompt,
      subject_type: subjectType 
    };

    // Gọi API thật
    createTTRActivity(interactionId, payload)
      .then(newActivity => {
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId 
            ? { ...task, id: newActivity.id, name: newActivity.name, status: 'ready', isNew: true, gameMode: gameMode } 
            : task
        ));
      })
      .catch(error => {
        // PHÂN LOẠI LỖI ĐỂ HIỂN THỊ UI TỐT HƠN (Từ HEAD)
        let uiMessage = "Lỗi hệ thống. Vui lòng thử lại.";
        
        if (error.status_code === 401) {
          uiMessage = "Phiên đăng nhập hết hạn. Vui lòng tải lại trang.";
        } else if (error.status_code === 404) {
          uiMessage = "Tài nguyên không tìm thấy hoặc đã bị xóa.";
        } else if (error.status_code === 400) {
          uiMessage = "Dữ liệu gửi lên không hợp lệ.";
        } else if (error.status_code === 502 || error.status_code === 503) {
          uiMessage = "AI bị nghẽn hoặc làm sai. Hãy thử giảm độ khó hoặc viết prompt rõ hơn.";
        } else if (error.status_code === 500) {
          uiMessage = "Lỗi từ Backend (500). Đã báo cáo hệ thống.";
        }

        // Đưa lỗi vào UI thay vì xóa task
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId 
            ? { ...task, status: 'error', errorMessage: uiMessage, rawError: error.exception_type } 
            : task
        ));
        
        console.error("Lỗi tạo bài: ", error.message);
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
<AddSourceModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={uploadMultipleFiles} 
          />
          
          <TTRSetupModal 
            isOpen={isSetupOpen} 
            onClose={() => setIsSetupOpen(false)} 
            onSubmit={(data) => {
              console.log("Dữ liệu bẫy được tại Component cha:", data);
              handleCreateTTRBackground({
                prompt: data.prompt,
                gameMode: data.gameMode,
                subjectType: data.subjectType
              });
            }} 
          />
          
          {/* LỚP PHỦ GAME TTR */}
          {isTTROpen && currentActivityId && (
            <TTRFeature 
              activityId={currentActivityId} 
              isNew={currentIsNew} 
              initialMode={currentMode}
              onClose={() => { 
                setIsTTROpen(false); 
                setCurrentActivityId(null); 
              }} 
            />
          )}

          {/* LỚP PHỦ QUIZ */}
          {isQuizOpen && currentQuizId && (
            <QuizPanel
              interactionId={interactionId}
              quizId={currentQuizId}
              onClose={() => {
                setIsQuizOpen(false);
                setCurrentQuizId(null);
              }}
            />
          )}

          {isFlashcardMode && (
            <FlashcardPanel
              isLoading={isLoading}
              error={error}
              isCreatingWithAI={isCreatingWithAI}
              initialViewMode={flashcardPanelMode}
              initialSelectedSet={selectedFlashcardSet}
              onCreateFlashcardSet={createNewFlashcardSet}
              onCreateEmptyFlashcardSet={createEmptyFlashcardSet}
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
        onPreview={(doc) => {
          setSelectedDoc(doc);
          setIsPreviewOpen(true);
        }}
      />

      {/* 2. CỘT GIỮA */}
      {activeToolSetup ? (
        <ToolSetupArea
          toolId={activeToolSetup}
          isLoading={isCreatingNewActivity}
          errorMessage={createToolError}
          onClearError={clearCreateToolError}
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

        onRemoveTTRTask={(id) => setTtrTasks(prev => prev.filter(t => t.id !== id))}

        onPlayTTR={(id) => {
          const task = ttrTasks.find((t) => t.id === id);
          setCurrentActivityId(id);
          setCurrentIsNew(task ? task.isNew : false);
          setCurrentMode(task?.gameMode || 'normal');
          setIsTTROpen(true);
          setSelectedActivityId(null);
          setIsQuizOpen(false);
          setCurrentQuizId(null);
          if (task && task.isNew) {
            setTtrTasks((prev) =>
              prev.map((t) => (t.id === id ? { ...t, isNew: false } : t)),
            );
          }
        }}
        // Props Open-Ended
        activities={openEndedActivities}
        // Props Quiz
        quizActivities={quizActivities}
        // Props Flashcard
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
        onActivityClick={(id) => {
          setIsQuizOpen(false);
          setCurrentQuizId(null);
          setSelectedActivityId(id);
        }}
        onQuizClick={(id) => {
          setSelectedActivityId(null);
          setIsQuizOpen(true);
          setCurrentQuizId(id);
        }}
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
