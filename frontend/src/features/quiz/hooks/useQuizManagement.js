import { useCallback, useEffect, useState } from "react";
import { quizService } from "../services/quiz.service";

const getErrorMessage = () => "Khong tai duoc quiz. Thu lai sau.";

const useQuizManagement = (interactionId) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuizzes = useCallback(async () => {
    if (!interactionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await quizService.readQuizzes(interactionId);
      setQuizzes(data);
    } catch {
      setError(getErrorMessage());
    } finally {
      setIsLoading(false);
    }
  }, [interactionId]);

  useEffect(() => {
    setQuizzes([]);
    if (interactionId) {
      loadQuizzes();
    }
  }, [interactionId, loadQuizzes]);

  const createNewQuiz = async (data) => {
    if (!interactionId) return null;
    setIsLoading(true);
    setError(null);
    try {
      const newQuiz = await quizService.createQuiz(interactionId, data);
      setQuizzes((prev) => [newQuiz, ...prev]);
      return newQuiz;
    } catch {
      setError(getErrorMessage());
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeQuiz = async (quizId) => {
    if (!interactionId) return null;
    setIsLoading(true);
    setError(null);
    try {
      await quizService.deleteQuiz(interactionId, quizId);
      setQuizzes((prev) => prev.filter((item) => item.id !== quizId));
      return true;
    } catch {
      setError(getErrorMessage());
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuizInList = (updatedQuiz) => {
    setQuizzes((prev) =>
      prev.map((item) => (item.id === updatedQuiz.id ? updatedQuiz : item)),
    );
  };

  return {
    quizzes,
    isLoading,
    error,
    createNewQuiz,
    removeQuiz,
    loadQuizzes,
    updateQuizInList,
  };
};

export default useQuizManagement;
