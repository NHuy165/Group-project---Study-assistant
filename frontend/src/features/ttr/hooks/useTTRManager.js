import { useState, useEffect, useCallback } from "react";
import { createTTRActivity, fetchActivitiesByInteraction } from "../api/ttrApi";

export const useTTRManager = (interactionId) => {
  // ==========================================
  // 1. DATA STATES (Data Workshop - Only handles lists)
  // ==========================================
  const [ttrTasks, setTtrTasks] = useState([]);

  // ==========================================
  // 2. TTR SPECIFIC CONFIG STATES (Game Setup Prep)
  // ==========================================
  // The configuration payload that will be passed into the Game Panel
  const [gameConfig, setGameConfig] = useState({
    activityId: null,
    initialMode: "play",
    gameMode: "normal",
  });

  // ==========================================
  // 3. DATA FETCHING (Auto Load)
  // ==========================================
  useEffect(() => {
    const loadTTR = async () => {
      if (!interactionId) return;
      try {
        const data = await fetchActivitiesByInteraction(interactionId);
        if (data && data.length > 0) {
          // [SỬA Ở ĐÂY]: Khôi phục lại bộ lọc để TTR không "ăn cắp" bài của Quiz
          const ttrOnly = data.filter(
            (item) =>
              item.activity_type === "REVIEW" &&
              item.activity_format === "GAP_FILL",
          );

          // Sort descending (newest first)
          const sortedData = ttrOnly.sort((a, b) => b.id - a.id);

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
        }
      } catch (err) {
        console.error("Error loading TTR Data:", err);
      }
    };
    loadTTR();
  }, [interactionId]);

  // ==========================================
  // 4. CORE ACTIONS
  // ==========================================

  // Create task in background (Optimistic UI update)
  const handleCreateTTRBackground = useCallback(
    ({ prompt: finalPrompt, gameMode }) => {
      const tempId = Date.now();
      const newTask = {
        id: tempId,
        name: "AI đang tạo bài...",
        status: "loading",
      };

      // Add temporary loading task to the top
      setTtrTasks((prev) => [newTask, ...prev]);

      const promptName =
        finalPrompt.split("Nội dung/Chủ đề:")[1]?.substring(0, 25) ||
        "Bài tập AI";
      const payload = {
        name: promptName + "...",
        description: "Tự động tạo",
        prompt: finalPrompt,
      };

      createTTRActivity(interactionId, payload)
        .then((newActivity) => {
          // Replace temp task with real data from BE
          setTtrTasks((prev) =>
            prev.map((task) =>
              task.id === tempId
                ? {
                    ...task,
                    id: newActivity.id,
                    name: newActivity.name,
                    status: "ready",
                    isNew: true,
                    gameMode: gameMode,
                  }
                : task,
            ),
          );
        })
        .catch((error) => {
          // Rollback on fail
          setTtrTasks((prev) => prev.filter((task) => task.id !== tempId));
          console.error("Error creating TTR: ", error);
        });
    },
    [interactionId],
  );

  // Prepare to play: sets config and signals UI to open
  const handlePreparePlay = useCallback(
    (id, triggerUIOpen) => {
      const task = ttrTasks.find((t) => t.id === id);
      if (!task) return;

      setGameConfig({
        activityId: id,
        initialMode: task.isNew ? "play" : null,
        gameMode: task.gameMode || "normal",
      });
      if (task.isNew) {
        setTtrTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isNew: false } : t)),
        );
      }
      if (triggerUIOpen) triggerUIOpen();
    },
    [ttrTasks],
  );
  return {
    ttrTasks,
    gameConfig,
    handleCreateTTRBackground,
    handlePreparePlay,
  };
};
