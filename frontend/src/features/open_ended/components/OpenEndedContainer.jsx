import React from "react";
import { createPortal } from "react-dom";
import { useOpenEnded } from "../hooks/useOpenEnded";
import { OpenEndedArea } from "./OpenEndedArea";

import { OpenEndedFallback } from "./OpenEndedFallback";

export const OpenEndedContainer = ({ activityId, onClose }) => {
  const { 
    activityData, 
    isLoading, 
    isSubmitting, 
    error,
    draftSyncError,
    saveAnswerDraft, 
    submitActivity 
  } = useOpenEnded(activityId);

  if (!activityId) return null;

  return createPortal(

    <div className="fixed inset-0 z-[9999] flex items-center justify-center h-screen w-screen overflow-hidden bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      <OpenEndedFallback error={error} onClose={onClose} />

      <OpenEndedArea 
        activityData={activityData} 
        isLoading={isLoading} 
        isSubmitting={isSubmitting}
        draftSyncError={draftSyncError}
        onSaveDraft={saveAnswerDraft} 
        onSubmit={submitActivity} 
        onExit={onClose} 
      />
    </div>,
    document.body
  );
};