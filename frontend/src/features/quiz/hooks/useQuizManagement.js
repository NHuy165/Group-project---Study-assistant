import { useCallback, useEffect, useState } from "react";
import {
  useReadQuizzes,
  useCreateQuiz,
  useGetQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
} from "./useQuiz";

const getErrorMessage = () => "Không tải được quiz. Thử lại sau.";

const useQuizManagement = (interactionId) => {
  // Local state to keep the UI snappy (Optimistic Updates)
  const [quizzes, setQuizzes] = useState([]);
  const [globalError, setGlobalError] = useState(null);

  // Initialize API hooks (No more manual try/catch/finally needed)
  const { mutate: fetchQuizzes, isPending: isFetching } = useReadQuizzes();
  const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz();
  const { mutate: fetchQuizDetail, isPending: isFetchingDetail } = useGetQuiz();
  const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuiz();
  const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();

  // Combined loading state to keep backward compatibility with QuizPanel
  const isLoading =
    isFetching || isCreating || isFetchingDetail || isUpdating || isDeleting;

  const loadQuizzes = useCallback(async () => {
    if (!interactionId) return;
    setGlobalError(null);
    
    const data = await fetchQuizzes(interactionId);
    if (data) {
      setQuizzes(data);
    } else {
      setGlobalError(getErrorMessage());
    }
  }, [interactionId, fetchQuizzes]);

  useEffect(() => {
    setQuizzes([]);
    if (interactionId) {
      loadQuizzes();
    }
  }, [interactionId, loadQuizzes]);

  const createNewQuiz = async (data) => {
    if (!interactionId) return null;
    
    const newQuiz = await createQuiz(interactionId, data);
    if (newQuiz) {
      setQuizzes((prev) => [newQuiz, ...prev]); // New quiz appears at the top
      return newQuiz;
    }
    
    setGlobalError(getErrorMessage());
    return null;
  };

  const loadQuizDetail = async (quizId) => {
    const detail = await fetchQuizDetail(quizId);
    if (detail) {
      setQuizzes((prev) =>
        prev.map((item) => (item.id === detail.id ? detail : item)),
      );
      return detail;
    }
    
    setGlobalError(getErrorMessage());
    return null;
  };

  const removeQuiz = async (quizId) => {
    if (!interactionId) return null;
    
    const success = await deleteQuiz(quizId);
    if (success) {
      setQuizzes((prev) => prev.filter((item) => item.id !== quizId));
      return true;
    }
    
    setGlobalError(getErrorMessage());
    return null;
  };

  const updateQuizMeta = async (quizId, data) => {
    if (!interactionId) return null;
    
    const updated = await updateQuiz(quizId, data);
    if (updated) {
      setQuizzes((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? {
                ...item,
                name: updated.name,
                title: updated.title,
                description: updated.description,
              }
            : item,
        ),
      );
      return updated;
    }
    
    setGlobalError(getErrorMessage());
    return null;
  };

  const updateQuizInList = (updatedQuiz) => {
    setQuizzes((prev) =>
      prev.map((item) => (item.id === updatedQuiz.id ? updatedQuiz : item)),
    );
  };

  return {
    quizzes,
    isLoading,   // For general UI blocking
    isFetching,  // Specific states for granular UI control (e.g. skeleton loading)
    isCreating,  // e.g. Show spinner only on the 'Create' button
    isDeleting,  // e.g. Show spinner on the specific trash bin icon
    isUpdating,  
    error: globalError,
    createNewQuiz,
    removeQuiz,
    loadQuizDetail,
    updateQuizMeta,
    updateQuizInList,
  };
};

export default useQuizManagement;