import { useState } from "react";

import { useCreateEssay } from "../../open_ended/hooks/useCreateEssay";
import { useCreateQuiz } from "../../quiz/hooks/useQuiz";
// Tương lai nhóm code xong thì mở comment ra:
// import { useCreateTTR } from "../../mindmap/hooks/useCreateTTR";
// import { useCreateFlashcard } from "../../flashcard/hooks/useCreateFlashcard";

export const useInteractionTools = (interactionId, onActivityCreated) => {
  // State lưu ID của tool đang được setup (null, 'essay', 'quiz'...)
  const [activeToolSetup, setActiveToolSetup] = useState(null);

  // 1. Gọi các hooks của từng tính năng
  const { isCreatingEssay, handleCreateEssay } = useCreateEssay(
    interactionId,
    () => {
      setActiveToolSetup(null);
      if (onActivityCreated) onActivityCreated();
    },
  );

  const { mutate: createQuizMutate, isPending: isCreatingQuiz } =
    useCreateQuiz();

  const handleCreateQuiz = async (setupData) => {
    if (!interactionId) return;
    try {
      const payload = {
        subjectType: setupData?.subject,
        prompt: setupData?.prompt,
      };
      console.log("[useInteractionTools] Create quiz payload:", payload);
      const newQuiz = await createQuizMutate(interactionId, payload);
      console.log("[useInteractionTools] Created quiz:", newQuiz);
      if (newQuiz && newQuiz.id) {
        setActiveToolSetup(null);
        if (onActivityCreated) onActivityCreated();
      } else {
        console.error(
          "[useInteractionTools] Quiz creation did not return an id:",
          newQuiz,
        );
      }
    } catch (error) {
      console.error("[useInteractionTools] Create quiz error:", error);
    }
  };

  // Tương lai:
  // const { isCreatingQuiz, handleCreateQuiz } = useCreateQuiz(interactionId, onActivityCreated);
  // const { isCreatingTTR, handleCreateTTR } = useCreateTTR(interactionId, onActivityCreated);

  // 2. Hàm điều phối trung tâm
  const handleToolClick = (toolId) => {
    setActiveToolSetup(toolId);
  };

  const handleConfirmCreate = (setupData) => {
    if (activeToolSetup === "essay") {
      handleCreateEssay(setupData);
      return;
    }
    if (activeToolSetup === "quiz") {
      handleCreateQuiz(setupData);
      return;
    }
    // Sau này bổ sung: if (activeToolSetup === 'quiz') { ... }
  };

  // 3. Gom trạng thái Loading của tất cả các nút lại thành 1 Object
  const toolLoadingStates = {
    essay: isCreatingEssay,
    quiz: isCreatingQuiz,
    // ttr: isCreatingTTR,
    // flashcard: false
  };

  // 4. Kiểm tra xem có BẤT KỲ tool nào đang chạy hay không để hiện màn hình chờ
  const isCreatingNewActivity = Object.values(toolLoadingStates).some(
    (state) => state === true,
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
