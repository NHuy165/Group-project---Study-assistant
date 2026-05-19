import { useState } from "react";

import { useCreateEssay } from "../../open_ended/hooks/useCreateEssay";
import { useCreateQuiz } from "../../quiz/hooks/useQuiz";

export const useInteractionTools = (
  interactionId, 
  onActivityCreated, 
  // Inject TTR handlers from parent (InteractionPage) to keep this hook pure
  handleCreateTTR, 
  isCreatingTTR = false 
) => {
  // State to store the ID of the tool currently being setup (null, 'essay', 'quiz', 'mindmap'...)
  const [activeToolSetup, setActiveToolSetup] = useState(null);

  // ==========================================
  // 1. ACTIVITY CREATION HOOKS & HANDLERS
  // ==========================================

  // --- ESSAY ---
  const { isCreatingEssay, handleCreateEssay } = useCreateEssay(
    interactionId,
    () => {
      setActiveToolSetup(null);
      if (onActivityCreated) onActivityCreated("essay");
    }
  );

  // --- QUIZ ---
  const { mutate: createQuiz, isPending: isCreatingQuiz } = useCreateQuiz();

  const handleCreateQuiz = async (setupData) => {
    const payload = {
      subjectType: setupData.subject,
      prompt: setupData.prompt,
    };

    console.debug("[useInteractionTools] Creating quiz, payload:", payload);
    
    try {
      const newQuiz = await createQuiz(interactionId, payload);
      
      if (newQuiz) {
        setActiveToolSetup(null); 
        if (onActivityCreated) {
          onActivityCreated("quiz", newQuiz.id); 
        }
      } else {
        console.error("Quiz creation failed. Please try again!");
      }
    } catch (err) {
      console.error("Error creating quiz:", err);
    }
  };

  // --- TTR (MINDMAP) ---
  // Wrap the injected TTR handler to also close the setup form automatically
  const handleTTRDispatch = (setupData) => {
    if (handleCreateTTR) {
      handleCreateTTR({
        prompt: setupData.prompt,
        gameMode: 'normal' // Can be extended to read from setupData later
      });
      setActiveToolSetup(null); // Close the form immediately (Optimistic UI)
    } else {
      console.error("handleCreateTTR is not provided to useInteractionTools");
    }
  };

  // ==========================================
  // 2. CENTRAL DISPATCHER (Strategy Pattern)
  // ==========================================
  
  const handleToolClick = (toolId) => {
    setActiveToolSetup(toolId);
  };

  // The "Phonebook": Maps tool IDs to their respective creation functions.
  // This eliminates all if-else chains and makes scaling incredibly easy!
  const actionHandlers = {
    essay: handleCreateEssay,
    quiz: handleCreateQuiz,
    mindmap: handleTTRDispatch,
    // Future tools (e.g., flashcard) just need ONE line here:
    // flashcard: handleCreateFlashcard,
  };

  const handleConfirmCreate = (setupData) => {
    // 1. Look up the correct handler in the phonebook
    const handler = actionHandlers[activeToolSetup];
    
    // 2. Execute if found, log error if not
    if (handler) {
      handler(setupData);
    } else {
      console.error(`[useInteractionTools] No handler defined for tool: ${activeToolSetup}`);
    }
  };

  // ==========================================
  // 3. LOADING STATES (FOR UI SPINNERS)
  // ==========================================
  const toolLoadingStates = {
    essay: isCreatingEssay,
    quiz: isCreatingQuiz,
    mindmap: isCreatingTTR, // Now tracking TTR loading state
  };

  // Check if ANY tool is currently processing to show the loading overlay
  const isCreatingNewActivity = Object.values(toolLoadingStates).some(
    (state) => state === true
  );

  return {
    activeToolSetup,
    setActiveToolSetup,
    handleToolClick,
    handleConfirmCreate,
    toolLoadingStates,
    isCreatingNewActivity,
  };
};