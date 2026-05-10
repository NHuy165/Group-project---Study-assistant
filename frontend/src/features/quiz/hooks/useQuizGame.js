import { useMemo, useState } from "react";
import { quizService } from "../services/quiz.service";

export const useQuizGame = (interactionId, quiz, onQuizUpdate) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;

  const currentQuestion = useMemo(
    () => questions[currentIndex] || null,
    [questions, currentIndex],
  );

  const selectedOption = currentQuestion
    ? quiz.answers?.[currentQuestion.id]
    : null;

  const progress =
    totalQuestions === 0
      ? 0
      : Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = async (index) => {
    if (!quiz || quiz.isSubmitted || !currentQuestion) return;
    const updated = await quizService.submitAnswer(
      interactionId,
      quiz.id,
      currentQuestion.id,
      index,
    );
    if (updated && onQuizUpdate) onQuizUpdate(updated);
  };

  const nextQuestion = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const prevQuestion = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const jumpToQuestion = (index) => {
    setCurrentIndex(Math.min(Math.max(index, 0), totalQuestions - 1));
  };

  const submitQuiz = async () => {
    if (!quiz || quiz.isSubmitted) return;
    setIsSubmitting(true);
    const updated = await quizService.submitQuiz(interactionId, quiz.id);
    setIsSubmitting(false);
    if (updated && onQuizUpdate) onQuizUpdate(updated);
  };

  return {
    currentQuestion,
    currentIndex,
    selectedOption,
    totalQuestions,
    progress,
    isSubmitting,
    handleSelectOption,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    submitQuiz,
  };
};

export default useQuizGame;
