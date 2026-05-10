import React, { useState } from "react";
import { useParams } from "react-router-dom"; 

// ==========================================
// 1. IMPORTS HOOKS (CHỨA LOGIC CỦA CÁC TÍNH NĂNG)
// ==========================================
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments"; 
import { useChat } from "../features/chat/hooks/useChat"; 
import { useStudyActivities } from "../features/open_ended/hooks/useStudyActivities";
import { useInteractionTools } from "../features/interactions/hooks/useInteractionTools";

// ==========================================
// 2. IMPORTS COMPONENTS (CÁC THÀNH PHẦN GIAO DIỆN)
// ==========================================
import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";
import { OpenEndedContainer } from "../features/open_ended/components/OpenEndedContainer";
import { ToolSetupArea } from "../features/interactions/components/ToolSetupArea";

export const InteractionPage = () => {
  // ==========================================
  // PHẦN A: STATE QUẢN LÝ GIAO DIỆN (UI STATE)
  // ==========================================
  
  // Lấy ID phiên học hiện tại từ URL trên trình duyệt
  const { interactionId } = useParams();

  // State quản lý việc ẩn/hiện của các Modal liên quan đến Tài liệu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // State "Công tắc" để mở màn hình làm bài tập:
  // - Nếu là null: Giao diện hiển thị bình thường (Chat, Tài liệu, Công cụ).
  // - Nếu có ID: Bật lớp phủ toàn màn hình để làm bài tập.
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  
  
  // ==========================================
  // PHẦN B: GỌI LOGIC TỪ CÁC CUSTOM HOOKS
  // (InteractionPage đóng vai trò người điều phối, truyền dữ liệu từ Hook xuống Component)
  // ==========================================
  
  // 1. Nút tạo phiên chat mới
  const { handleNewChatClick } = useInteractions();
  
  // 2. Logic tính năng Tài Liệu (Dành cho Cột trái)
  const { 
    documents, selectedDocIds, uploadMultipleFiles, updateDocument, 
    documentName, setDocumentName, editingID, handleStartEdit, 
    handleDocCheck, deleteDocument, isLoading: isDocsLoading 
  } = useDocuments(interactionId);
  
  // 3. Logic tính năng Chat với Cú Mèo (Dành cho Khu vực giữa)
  const { 
    chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading 
  } = useChat(interactionId);

  // 4. Logic lấy danh sách các bài tập đã tạo (Dành cho Cột phải)
  const { activities, fetchActivities, handleDeleteActivity } = useStudyActivities(interactionId);
  
  // 5. Logic xử lý các nút bấm công cụ: Tự luận, Quiz... (Dành cho Cột phải)
  // Truyền fetchActivities vào để mỗi khi AI tạo xong bài, nó tự động tải lại danh sách.
  const { 
    handleToolClick, 
    activeToolSetup,      // Tool nào đang được setup
    setActiveToolSetup,   // Hàm để đóng/mở setup
    handleConfirmCreate,  // Hàm xác nhận tạo bài
    toolLoadingStates,
    isCreatingNewActivity 
  } = useInteractionTools(interactionId, fetchActivities);


  // ==========================================
  // PHẦN C: RENDER GIAO DIỆN
  // ==========================================
  return ( 
    <InteractionLayout 
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
        </>
      }
    >
    
      {/* 1. CỘT TRÁI: Khu vực quản lý nguồn tài liệu */}
      <SourceSidebar 
        documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds}
        onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit}
        tempName={documentName} setTempName={setDocumentName} onRename={updateDocument} 
        onDelete={deleteDocument} onDocCheck={handleDocCheck}
        onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
      />

      {/* 2. CỘT GIỮA: Khu vực Chat với AI */}
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
        setPromptText={setPromptText}
        onSend={() => askLLM()} 
      />
      )}
      

      {/* 3. CỘT PHẢI: Khu vực chọn tính năng và danh sách bài tập */}
      <ToolsSidebar 
        activities={activities}
        onToolClick={handleToolClick}
        onActivityClick={(id) => setSelectedActivityId(id)}
        onDeleteActivity={handleDeleteActivity}
        toolLoadingStates={toolLoadingStates}
        isCreatingNewActivity={isCreatingNewActivity}
      />

      {/* 4. LỚP PHỦ BÀI TẬP (PORTAL) */}
      {/* Container này tự động gọi API lấy chi tiết câu hỏi và bung toàn màn hình khi có ID */}
      <OpenEndedContainer 
        activityId={selectedActivityId} 
        // Khi người dùng bấm "Thoát", set ID về null để giấu lớp phủ đi
        onClose={() => setSelectedActivityId(null)} 
      />
    </InteractionLayout>

  );
};