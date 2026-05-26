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
  deleteTTRActivity
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
  const [testSidebarError, setTestSidebarError] = useState(null);

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

  const handleCreateTTRBackground = (data) => {
    const { prompt: finalPrompt, gameMode, subjectType } = data;

    const tempId = Date.now();
    const newTask = {
      id: tempId,
      name: "Đang AI tạo bài...",
      status: "loading",
    };
    setTtrTasks((prev) => [newTask, ...prev]);
    setIsSetupOpen(false);

    const payload = { 
      prompt: finalPrompt,
      subject_type: subjectType 
    };

    createTTRActivity(interactionId, payload)
      .then(newActivity => {
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId 
            ? { ...task, id: newActivity.id, name: newActivity.name, status: 'ready', isNew: true, gameMode: gameMode } 
            : task
        ));
      })
      .catch(error => {
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

  const handleDeleteTTR = async (activityId) => {
    try {
      // 1. Gọi xuống Backend để xóa
      await deleteTTRActivity(activityId);
      
      // 2. Nếu BE xóa thành công, mới cập nhật lại mảng ở giao diện (Frontend)
      setTtrTasks(prev => prev.filter(t => t.id !== activityId));
      console.log("Đã xóa TTR thành công:", activityId);
    } catch (error) {
      console.error("Lỗi khi xóa TTR:", error);
      alert("Không thể xóa bài tập lúc này, vui lòng thử lại sau.");
    }
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

          {/* FIX ĐỒNG BỘ: Đưa ToolSetupArea vào khu vực modals dưới dạng Lớp phủ (Modal Overlay) */}
          {activeToolSetup && (
            <ToolSetupArea
              toolId={activeToolSetup}
              isLoading={isCreatingNewActivity}
              errorMessage={createToolError}
              onClearError={clearCreateToolError}
              onConfirm={handleConfirmCreate}
              onCancel={() => setActiveToolSetup(null)}
            />
          )}
          
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

      {/* 2. CỘT GIỮA - LUÔN LUÔN RENDER CHAT AREA ĐỂ GIỮ FORM CHO BACKGROUND ĐẰNG SAU */}
      <ChatArea
        messages={chatlog}
        isLoading={isChatLoading}
        promptText={promptText}
        setPromptText={setPromptText}
        onSend={() => askLLM()}
      />

      {/* 3. CỘT PHẢI */}
      <ToolsSidebar
        // Props TTR
        onOpenTTR={() => setIsSetupOpen(true)} 
        ttrTasks={ttrTasks} 
        onRemoveTTRTask={handleDeleteTTR}
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

        toolError={createToolError || testSidebarError}
        onClearToolError={() => {
          clearCreateToolError();
          setTestSidebarError(null);
        }}
      />

      {/* 4. LỚP PHỦ BÀI TẬP OPEN ENDED */}
      <OpenEndedContainer
        activityId={selectedActivityId}
        onClose={() => setSelectedActivityId(null)}
      />


    {/* ======================================================== */}
      {/* BẢNG ĐIỀU KHIỂN TEST LỖI (Sau khi test xong thì XÓA đi) */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2 rounded-2xl border-2 border-dashed border-red-400 bg-white/90 p-4 shadow-2xl backdrop-blur-md dark:bg-slate-800/90 dark:border-red-500">
        <h3 className="text-center text-xs font-black uppercase tracking-wider text-red-500">
          🛠 Test Lỗi Sidebar
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {/* Test lỗi thả banner từ trên xuống */}
          <button 
            onClick={() => setTestSidebarError("⚠️ Lỗi 400: Bé chưa nhập tên bộ thẻ kìa!")}
            className="rounded-lg bg-orange-100 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300"
          >
            Test Lỗi Form (Banner)
          </button>
          
          <button 
            onClick={() => setTestSidebarError("🤖 Lỗi 502: Cú Mèo đang nghẽn mạng, bé thử lại nha!")}
            className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300"
          >
            Test Lỗi AI (Banner)
          </button>

          <hr className="my-1 border-red-200 dark:border-red-800" />

          {/* Test lỗi thẻ TTR màu đỏ */}
          <button 
            onClick={() => {
              const tempId = Date.now();
              setTtrTasks(prev => [{
                id: tempId,
                name: "Bài tập Động vật (Đang lỗi)",
                status: 'error',
                errorMessage: "Phiên đăng nhập hết hạn. Vui lòng tải lại trang."
              }, ...prev]);
            }}
            className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300"
          >
            Test Lỗi Thẻ TTR
          </button>
        </div>
      </div>
    </InteractionLayout>
  );
};