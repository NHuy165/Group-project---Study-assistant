import { useState } from "react";

export const useInteractionUI = () => {
  // Quản lý trạng thái các lớp phủ (Overlays)
  const [activeToolId, setActiveToolId] = useState(null); // Cho Quiz
  const [isTTROpen, setIsTTROpen] = useState(false);      // Cho TTR Game
  const [selectedActivityId, setSelectedActivityId] = useState(null); // Cho Tự Luận

  // Hàm mở Quiz: Ép đóng TTR và Tự Luận
  const openQuiz = () => {
    setActiveToolId("quiz");
    setIsTTROpen(false);
    setSelectedActivityId(null);
  };

  // Hàm mở TTR Game: Ép đóng Quiz và Tự Luận
  const openTTR = () => {
    setIsTTROpen(true);
    setActiveToolId(null);
    setSelectedActivityId(null);
  };

  // Hàm mở Tự Luận: Ép đóng Quiz và TTR
  const openOpenEnded = (id) => {
    setSelectedActivityId(id);
    setActiveToolId(null);
    setIsTTROpen(false);
  };

  // Hàm đóng tất cả
  const closeAllPopups = () => {
    setActiveToolId(null);
    setIsTTROpen(false);
    setSelectedActivityId(null);
  };

  return {
    activeToolId,
    setActiveToolId,
    isTTROpen,
    setIsTTROpen,
    selectedActivityId,
    setSelectedActivityId,
    openQuiz,
    openTTR,
    openOpenEnded,
    closeAllPopups,
  };
};