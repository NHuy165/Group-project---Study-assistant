import { useState } from "react";
import { quizService } from "../services/quiz.service";

const createMutation = (fn) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = async (...args) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error, data };
};

export const useCreateQuiz = () => createMutation(quizService.createQuiz);
export const useGetQuiz = () => createMutation(quizService.readQuiz);
export const useSubmitAnswer = () => createMutation(quizService.submitAnswer);
export const useSubmitQuiz = () => createMutation(quizService.submitQuiz);
export const useDeleteQuiz = () => createMutation(quizService.deleteQuiz);
