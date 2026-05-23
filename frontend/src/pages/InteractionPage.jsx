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

export const InteractionPage = () => {
  const { interactionId } = useParams(); 

  // ==========================================
  // STATE QUẢN LÝ GIAO DIỆN
  // ==========================================
  // State Tài liệu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // State Tap To Review (TTR)
  const [isSetupOpen, setIsSetupOpen] = useState(false); 
  const [isTTROpen, setIsTTROpen] = useState(false);     
  const [currentActivityId, setCurrentActivityId] = useState(null); 
  const [currentIsNew, setCurrentIsNew] = useState(false); 
  const [ttrTasks, setTtrTasks] = useState([]); 
  const [currentMode, setCurrentMode] = useState('normal');

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


  // ==========================================
  // HÀM GIẢ LẬP ĐỂ TEST LỖI UI (Sẽ xóa sau khi test xong)
  // ==========================================

  // const mockCreateTTRActivity = async (interactionId, payload) => {
  //   return new Promise((resolve, reject) => {
  //     // Giả lập thời gian chờ AI suy nghĩ (1.5 giây)
  //     setTimeout(() => {
        
  //       // 🔴 THAY ĐỔI MÃ LỖI Ở ĐÂY ĐỂ TEST (Ví dụ: 401, 404, 400, 500, 502)
  //       // Nếu muốn test trạng thái tạo THÀNH CÔNG, hãy đổi thành: const TEST_ERROR_CODE = null;
  //       const TEST_ERROR_CODE = null; 

  //       if (TEST_ERROR_CODE) {
  //         reject({
  //           status_code: TEST_ERROR_CODE,
  //           exception_type: 'TEST_MOCK_ERROR',
  //           message: 'Đây là thông báo lỗi giả lập từ Frontend để test giao diện.'
  //         });
  //       } else {
  //         resolve({ 
  //           id: Math.floor(Math.random() * 10000), 
  //           name: "Bài tập Mock Test..." 
  //         });
  //       }
  //     }, 1500); 
  //   });
  // };

  const handleCreateTTRBackground = (data) => {
    // 1. Hứng đầy đủ cả 3 thông tin từ Modal gửi lên
    const { prompt: finalPrompt, gameMode, subjectType } = data;

    const tempId = Date.now();
    const newTask = { id: tempId, name: "Đang AI tạo bài...", status: 'loading' };
    setTtrTasks(prev => [newTask, ...prev]); 
    setIsSetupOpen(false);

    // 2. Gom đúng chuẩn Payload mà API yêu cầu (KHÔNG gửi name, description)
    const payload = { 
      prompt: finalPrompt,
      subject_type: subjectType 
    };

    
    // mockCreateTTRActivity(interactionId, payload) // Hàm test
    // Gọi API thật
    createTTRActivity(interactionId, payload)
      .then(newActivity => {
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId ? { ...task, id: newActivity.id, name: newActivity.name, status: 'ready', isNew: true, gameMode: gameMode } : task
        ));
      })
      .catch(error => {
        // PHÂN LOẠI LỖI THEO ĐÚNG TÀI LIỆU BACKEND
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

        // ĐƯA LỖI VÀO UI (Cập nhật task thành trạng thái lỗi thay vì xóa nó đi)
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId 
            ? { ...task, status: 'error', errorMessage: uiMessage, rawError: error.exception_type } 
            : task
        ));
        
        console.error("Lỗi tạo bài: ", error.message);
      });
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
          <TTRSetupModal 
            isOpen={isSetupOpen} 
            onClose={() => setIsSetupOpen(false)} 
            onSubmit={(data) => {
              // Ép buộc bắt đúng object data từ Modal và truyền thẳng xuống hook
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
            onClose={() => { setIsTTROpen(false); setCurrentActivityId(null); }} 
          />
          )}
        </>
      }
    >
      {/* 1. CỘT TRÁI */}
      <SourceSidebar 
        documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit}
        tempName={documentName} setTempName={setDocumentName} onRename={updateDocument} 
        onDelete={deleteDocument} onDocCheck={handleDocCheck}
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />

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
          messages={chatlog} isLoading={isChatLoading} promptText={promptText}
          setPromptText={setPromptText} onSend={() => askLLM()} 
        />
      )}

      {/* 3. CỘT PHẢI (Truyền toàn bộ Props của cả 2 tính năng vào) */}
      <ToolsSidebar 
        // Props TTR
        onOpenTTR={() => setIsSetupOpen(true)} 
        ttrTasks={ttrTasks} 

        onRemoveTTRTask={(id) => setTtrTasks(prev => prev.filter(t => t.id !== id))}

        onPlayTTR={(id) => {
          const task = ttrTasks.find(t => t.id === id);
          setCurrentActivityId(id);
          setCurrentIsNew(task ? task.isNew : false);
          setCurrentMode(task?.gameMode || 'normal');
          setIsTTROpen(true);
          if (task && task.isNew) {
            setTtrTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
          }
        }} 
        // Props Open-Ended
        activities={activities}
        onToolClick={handleToolClick}
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