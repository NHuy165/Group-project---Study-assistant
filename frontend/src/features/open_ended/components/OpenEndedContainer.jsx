import React from "react";
import { createPortal } from "react-dom";
import { useOpenEnded } from "../hooks/useOpenEnded";
import { OpenEndedArea } from "./OpenEndedArea";

export const OpenEndedContainer = ({ activityId, onClose }) => {
  const { 
    activityData, 
    isLoading, 
    isSubmitting, 
    saveAnswerDraft, 
    submitActivity 
  } = useOpenEnded(activityId);

  // Nếu không có ID thì không render gì cả
  if (!activityId) return null;

  // Render Portal thẳng từ đây
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen overflow-hidden bg-white dark:bg-[#1a1c1e] animate-in fade-in duration-300">
      <OpenEndedArea 
        activityData={activityData}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onSaveDraft={saveAnswerDraft}
        onSubmit={submitActivity}
        onExit={onClose} // Truyền hàm đóng từ cha xuống
      />
    </div>,
    document.body
  );
};