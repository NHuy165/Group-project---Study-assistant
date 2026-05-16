import { useState } from "react";

import { useCreateEssay } from "../../open_ended/hooks/useCreateEssay";
import { useCreateQuiz } from "../../quiz/hooks/useQuiz";

export const useInteractionTools = (interactionId, onActivityCreated) => {
  // State to store the ID of the tool currently being setup (null, 'essay', 'quiz'...)
  const [activeToolSetup, setActiveToolSetup] = useState(null);

  // ==========================================
  // 1. ACTIVITY CREATION HOOKS
  // ==========================================

  // --- ESSAY ---
  const { isCreatingEssay, handleCreateEssay } = useCreateEssay(
    interactionId,
    () => {
      // Close the setup form
      setActiveToolSetup(null);
      // Notify parent component to refresh the list
      if (onActivityCreated) onActivityCreated("essay");
    }
  );

  // --- QUIZ ---
  // Get the mutate function (renamed to createQuiz) and isPending state from useCreateQuiz
  const { mutate: createQuiz, isPending: isCreatingQuiz } = useCreateQuiz();

  const handleCreateQuiz = async (setupData) => {
    // Map data from ToolSetupArea (which sends 'subject') 
    // to what quizAPI.js expects ('subjectType' in camelCase)
    const payload = {
      subjectType: setupData.subject,
      prompt: setupData.prompt,
    };

    console.debug("[useInteractionTools] Creating quiz, payload:", payload);
    
    try {
      // Call the mutation function with interactionId and mapped payload
      const newQuiz = await createQuiz(interactionId, payload);
      console.debug("[useInteractionTools] createQuiz result:", newQuiz);
      
      if (newQuiz) {
        // Step 1: Close the setup form (ToolSetupArea) immediately upon success
        setActiveToolSetup(null); 
        
        // Step 2: Notify parent (InteractionPage) to update the Sidebar list
        // Note: We pass the ID, but we expect the parent NOT to auto-open the QuizPanel
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

  // ==========================================
  // 2. CENTRAL DISPATCHER FUNCTIONS
  // ==========================================
  const handleToolClick = (toolId) => {
    // Open the ToolSetupArea for the selected tool
    setActiveToolSetup(toolId);
  };

  const handleConfirmCreate = (setupData) => {
    // Dispatch the payload to the correct handler based on active tool
    if (activeToolSetup === "essay") {
      handleCreateEssay(setupData);
    } else if (activeToolSetup === "quiz") {
      handleCreateQuiz(setupData);
    }
  };

  // ==========================================
  // 3. LOADING STATES (FOR UI SPINNERS)
  // ==========================================
  const toolLoadingStates = {
    essay: isCreatingEssay,
    quiz: isCreatingQuiz,
    // ttr: isCreatingTTR,
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