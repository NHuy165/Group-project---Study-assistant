import { useState, useEffect } from 'react';
import { createTTRActivity, fetchActivitiesByInteraction } from '../api/ttrApi';

export const useTTRManager = (interactionId) => {
  const [isSetupOpen, setIsSetupOpen] = useState(false); 
  const [isTTROpen, setIsTTROpen] = useState(false);     
  const [ttrTasks, setTtrTasks] = useState([]); 
  const [actionModal, setActionModal] = useState({ isOpen: false, activityId: null });
  const [gameConfig, setGameConfig] = useState({ activityId: null, initialMode: 'play', gameMode: 'normal' });

  useEffect(() => {
    const loadTTR = async () => {
      try {
        const data = await fetchActivitiesByInteraction(interactionId);
        if (data && data.length > 0) {
          const sortedData = data.sort((a, b) => b.id - a.id);

          const formatted = data.map(item => ({
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
    if (interactionId) loadTTR();
  }, [interactionId]);

  // [MỚI] Nhận thêm subjectType
  const handleCreateTTRBackground = ({ prompt: finalPrompt, gameMode, subjectType }) => {
    const tempId = Date.now();
    const newTask = { id: tempId, name: "AI đang tạo bài...", status: 'loading' };
    setTtrTasks(prev => [newTask, ...prev]);
    setIsSetupOpen(false);

    const promptName = finalPrompt.split("Nội dung/Chủ đề:")[1]?.substring(0, 25) || "Bài tập AI";
    
    // [MỚI] Đưa subject_type vào payload
    const payload = { 
      name: promptName + "...", 
      description: "Tự động tạo", 
      prompt: finalPrompt,
      subject_type: subjectType
    };

    createTTRActivity(interactionId, payload)
      .then(newActivity => {
        setTtrTasks(prev => prev.map(task => 
          task.id === tempId ? { ...task, id: newActivity.id, name: newActivity.name, status: 'ready', isNew: true, gameMode: gameMode } : task
        ));
      })
      .catch(error => {
        setTtrTasks(prev => prev.filter(task => task.id !== tempId));
        console.error("Lỗi tạo bài: ", error);
      });
  };

  const handlePlayTask = (id) => {
    const task = ttrTasks.find(t => t.id === id);
    if (!task) return;

    if (task.isNew) {
      setGameConfig({ activityId: id, initialMode: task.gameMode || 'normal' });
      setIsTTROpen(true);
      setTtrTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
    } else {
      setActionModal({ isOpen: true, activityId: id });
    }
  };

  const handleStartFromMenu = (mode) => {
    setGameConfig({ activityId: actionModal.activityId, initialMode: mode, gameMode: 'normal' });
    setActionModal({ isOpen: false, activityId: null });
    setIsTTROpen(true);
  };

  const closeGame = () => {
    setIsTTROpen(false);
    setGameConfig(prev => ({ ...prev, activityId: null }));
  };

  return {
    ttrTasks,
    isSetupOpen, setIsSetupOpen,
    isTTROpen, setIsTTROpen,
    actionModal, setActionModal,
    gameConfig,
    handleCreateTTRBackground,
    handlePlayTask,
    handleStartFromMenu,
    closeGame
  };
};