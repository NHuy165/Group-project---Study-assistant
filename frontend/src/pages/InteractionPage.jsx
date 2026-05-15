import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// 1. IMPORTS HOOKS
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments";
import { useChat } from "../features/chat/hooks/useChat";
import { useStudyActivities } from "../features/open_ended/hooks/useStudyActivities";
import { useInteractionTools } from "../features/interactions/hooks/useInteractionTools";
import { useInteractionUI } from "../features/interactions/hooks/useInteractionUI"; // Hook UI quản lý Lựa chọn A

// 2. IMPORTS COMPONENTS
import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";

// Components từ Quiz (Nhánh HEAD)
import QuizPanel from "../features/quiz/components/QuizPanel";

// Components từ TTR & Open-Ended (Nhánh epic/ttr)
import { OpenEndedContainer } from "../features/open_ended/components/OpenEndedContainer";
import { ToolSetupArea } from "../features/interactions/components/ToolSetupArea";
import { TTRFeature } from "../features/ttr/index";
import { TTRSetupModal } from "../features/ttr/components/TTRSetupModal";
import { createTTRActivity, fetchActivitiesByInteraction } from "../features/ttr/api/ttrApi";

export const InteractionPage = () => {
  const { interactionId } = useParams();

  // QUẢN LÝ GIAO DIỆN TÀI LIỆU
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // QUẢN LÝ UI ĐỘC LẬP (Lựa chọn A)
  const {
    activeToolId, setActiveToolId,
    isTTROpen, setIsTTROpen,
    selectedActivityId, setSelectedActivityId,
    openQuiz, openTTR, openOpenEnded
  } = useInteractionUI();

  // STATE PHỤ CHO TTR (Dữ liệu tạm thời)
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [currentIsNew, setCurrentIsNew] = useState(false);
  const [ttrTasks, setTtrTasks] = useState([]);

  // GỌI CÁC CUSTOM HOOKS LOGIC
  const { handleNewChatClick } = useInteractions();
  const { documents, selectedDocIds, uploadMultipleFiles, updateDocument, documentName, setDocumentName, editingID, handleStartEdit, handleDocCheck, deleteDocument, isLoading: isDocsLoading } = useDocuments(interactionId);
  const { chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading } = useChat(interactionId);
  const { activities, fetchActivities, handleDeleteActivity } = useStudyActivities(interactionId);
  const { handleToolClick, activeToolSetup, setActiveToolSetup, handleConfirmCreate, toolLoadingStates, isCreatingNewActivity } = useInteractionTools(interactionId, fetchActivities);

  // LOGIC TTR CHẠY NGẦM: Tải danh sách bài tập TTR khi vào phòng
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

  return (
    <InteractionLayout
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
          <TTRSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSubmit={handleCreateTTRBackground} />

          {/* LỚP PHỦ GAME TTR: Sử dụng state từ Hook UI */}
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
      {/* 1. CỘT TRÁI: TÀI LIỆU */}
      <SourceSidebar
        documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit}
        tempName={documentName} setTempName={setDocumentName} onRename={updateDocument}
        onDelete={deleteDocument} onDocCheck={handleDocCheck}
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />

      {/* 2. CỘT GIỮA: CHAT HOẶC SETUP AREA */}
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

      {/* 3. CỘT PHẢI: TOOLS SIDEBAR */}
      <ToolsSidebar
        // Quản lý Quiz (Nhánh HEAD)
        activeToolId={activeToolId}
        onSelectTool={openQuiz} // Gọi hàm quản lý Lựa chọn A

        // Quản lý TTR (Nhánh epic/ttr)
        onOpenTTR={() => setIsSetupOpen(true)}
        ttrTasks={ttrTasks}
        onPlayTTR={(id) => {
          const task = ttrTasks.find(t => t.id === id);
          setCurrentActivityId(id);
          setCurrentIsNew(task ? task.isNew : false);
          openTTR(); // Gọi hàm quản lý Lựa chọn A để đóng Quiz/Tự luận
          if (task && task.isNew) {
            setTtrTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
          }
        }}

        // Quản lý Tự Luận (Nhánh epic/ttr)
        activities={activities}
        onToolClick={handleToolClick}
        onActivityClick={openOpenEnded} // Gọi hàm quản lý Lựa chọn A
        onDeleteActivity={handleDeleteActivity}
        toolLoadingStates={toolLoadingStates}
        isCreatingNewActivity={isCreatingNewActivity}
      />

      {/* 4. CÁC LỚP PHỦ MÀN HÌNH (OVERLAYS) */}

      {/* Lớp phủ Quiz */}
      {activeToolId === "quiz" && (
        <QuizPanel
          interactionId={interactionId}
          onClose={() => setActiveToolId(null)}
        />
      )}

      {/* Lớp phủ Tự Luận */}
      {selectedActivityId && (
        <OpenEndedContainer
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </InteractionLayout>
  );
};