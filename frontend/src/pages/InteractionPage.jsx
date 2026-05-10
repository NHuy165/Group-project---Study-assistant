import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useInteractions } from "../features/interactions/hooks/useInteractions";
import { useDocuments } from "../features/documents/hooks/useDocuments"; 
import { useChat } from "../features/chat/hooks/useChat"; 
import { InteractionLayout } from "../features/interactions/components/InteractionLayout";
import { SourceSidebar } from "../features/documents/components/SourceSidebar";
import { ChatArea } from "../features/chat/components/ChatArea";
import { ToolsSidebar } from "../features/interactions/components/ToolsSidebar";
import { AddSourceModal } from "../features/documents/components/AddSourceModal";

import { TTRFeature } from "../features/ttr/index"; 
import { TTRSetupModal } from "../features/ttr/components/TTRSetupModal"; 
import { createTTRActivity, fetchActivitiesByInteraction } from "../features/ttr/api/ttrApi";

export const InteractionPage = () => {
  const { interactionId } = useParams(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [isSetupOpen, setIsSetupOpen] = useState(false); 
  const [isTTROpen, setIsTTROpen] = useState(false);     
  const [currentActivityId, setCurrentActivityId] = useState(null); 
  const [currentIsNew, setCurrentIsNew] = useState(false); // <-- CỜ BÁO BÀI MỚI

  const [ttrTasks, setTtrTasks] = useState([]); 

  const { handleNewChatClick } = useInteractions();
  const { documents, selectedDocIds, uploadMultipleFiles, updateDocument, documentName, setDocumentName, editingID, handleStartEdit, handleDocCheck, deleteDocument, isLoading: isDocsLoading } = useDocuments(interactionId);
  const { chatlog, promptText, setPromptText, askLLM, isLoading: isChatLoading } = useChat(interactionId);

  // 1. Tự load bài từ DB, SẮP XẾP BÀI MỚI LÊN ĐẦU
  useEffect(() => {
    const loadTTR = async () => {
      try {
        const data = await fetchActivitiesByInteraction(interactionId);
        if (data && data.length > 0) {
          const sortedData = data.sort((a, b) => b.id - a.id); // Bài ID lớn/Mới nhất lên đầu
          const formatted = sortedData.map(item => ({
            id: item.id,
            name: item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name,
            status: 'ready',
            isNew: false // BÀI CŨ
          }));
          setTtrTasks(formatted);
        }
      } catch (err) {
        console.error("Lỗi tải TTR Data:", err);
      }
    };
    loadTTR();
  }, [interactionId]);

  // 2. Tạo bài: Chèn lên ĐẦU danh sách
  const handleCreateTTRBackground = ({ prompt: finalPrompt }) => {
    const tempId = Date.now();
    const newTask = { id: tempId, name: "Đang AI tạo bài...", status: 'loading' };
    setTtrTasks(prev => [newTask, ...prev]); // ĐẨY LÊN ĐẦU
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
        console.error("Lỗi tạo bài: ", error);
      });
  };

  return (  
    <InteractionLayout 
      onNewChat={handleNewChatClick}
      modals={
        <>
          <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={uploadMultipleFiles} />
          <TTRSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSubmit={handleCreateTTRBackground} />
          
          {/* TRUYỀN THÊM CỜ isNew VÀO GAME */}
          {isTTROpen && currentActivityId && (
            <TTRFeature activityId={currentActivityId} isNew={currentIsNew} onClose={() => { setIsTTROpen(false); setCurrentActivityId(null); }} />
          )}
        </>
      }
    >
      <SourceSidebar documents={documents} isLoading={isDocsLoading} selectedDocIds={selectedDocIds} onAddClick={() => setIsModalOpen(true)} editingId={editingID} setEditingId={handleStartEdit} tempName={documentName} setTempName={setDocumentName} onRename={updateDocument} onDelete={deleteDocument} onDocCheck={handleDocCheck} onPreview={(doc) => { setSelectedDoc(doc); setIsPreviewOpen(true); }} />
      <ChatArea messages={chatlog} isLoading={isChatLoading} promptText={promptText} setPromptText={setPromptText} onSend={() => askLLM()} />
      
      <ToolsSidebar 
        onOpenTTR={() => setIsSetupOpen(true)} 
        ttrTasks={ttrTasks} 
        onPlayTTR={(id) => {
          const task = ttrTasks.find(t => t.id === id);
          setCurrentActivityId(id);
          setCurrentIsNew(task ? task.isNew : false);
          setIsTTROpen(true);
          // Gỡ mác "Bài mới" sau khi click lần đầu
          if (task && task.isNew) {
            setTtrTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
          }
        }} 
      />
    </InteractionLayout>
  );
};