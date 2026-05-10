import { useState, useCallback, useEffect } from "react";
import { readAllQuizzes, createQuiz, deleteQuiz } from "../api/quizAPI.js";

/**
 * Hook quản lý logic quiz: load, tạo, xóa
 * @param {number} interactionId - ID của interaction
 * @returns {Object} - quizzes, isLoading, error, methods
 */
const useQuizManagement = (interactionId) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Tải toàn bộ quizzes từ backend
   */
  const loadQuizzes = useCallback(async () => {
    if (!interactionId) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await readAllQuizzes(interactionId);
      const data = Array.isArray(response) ? response : [];
      setQuizzes(data);
    } catch (err) {
      console.error("Lỗi tải quiz:", err);
      setError("Không thể tải quiz");
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  }, [interactionId]);

  /**
   * Tạo quiz mới từ subject + context
   */
  const createNewQuiz = useCallback(
    async (quizParams) => {
      if (!quizParams?.subject || !interactionId) {
        setError("Vui lòng chọn môn học");
        return null;
      }

      setIsLoading(true);
      setError("");
      try {
        const newQuizzes = await createQuiz(interactionId, quizParams);

        if (Array.isArray(newQuizzes) && newQuizzes.length > 0) {
          setQuizzes((prev) => [...prev, ...newQuizzes]);
          return newQuizzes;
        }
      } catch (err) {
        console.error("Lỗi tạo quiz:", err);
        setError("Lỗi tạo quiz. Vui lòng thử lại");
      } finally {
        setIsLoading(false);
      }
      return null;
    },
    [interactionId],
  );

  /**
   * Xóa quiz
   */
  const removeQuiz = useCallback(async (quizId) => {
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      setError("");
    } catch (err) {
      console.error("Lỗi xóa quiz:", err);
      setError("Lỗi xóa quiz");
    }
  }, []);

  /**
   * Tự động tải quizzes khi interactionId thay đổi
   */
  useEffect(() => {
    if (interactionId) {
      loadQuizzes();
    }
  }, [interactionId, loadQuizzes]);

  return {
    quizzes,
    setQuizzes,
    isLoading,
    error,
    loadQuizzes,
    createNewQuiz,
    removeQuiz,
  };
};

export default useQuizManagement;
