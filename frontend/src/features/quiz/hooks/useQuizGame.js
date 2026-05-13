import { useEffect, useMemo, useState } from "react";
import { quizService } from "../services/quiz.service";
import { mergeExerciseItem } from "../utils/quizHelpers";

export const useQuizGame = (quiz, onQuizUpdate) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState([]);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;

  useEffect(() => {
    setCurrentIndex(0);
    setFlaggedQuestionIds([]);
  }, [quiz?.id]);

  const currentQuestion = useMemo(
    () => questions[currentIndex] || null,
    [questions, currentIndex],
  );

  const selectedOption = currentQuestion ? currentQuestion.attemptId : null;

  const questionStatus = useMemo(
    () =>
      questions.map((question) => ({
        id: question.id,
        isAnswered: Boolean(question.attemptId),
        isFlagged: flaggedQuestionIds.includes(question.id),
      })),
    [questions, flaggedQuestionIds],
  );

  const unansweredCount = questionStatus.filter(
    (question) => !question.isAnswered,
  ).length;

  const flaggedCount = questionStatus.filter(
    (question) => question.isFlagged,
  ).length;

  const handleSelectOption = async (optionId) => {
    if (!quiz || quiz.isSubmitted || !currentQuestion) return;

    // Optimistic UI Update: reflect changes instantly for the user
    const optimisticQuestion = { ...currentQuestion, attemptId: optionId };
    if (onQuizUpdate) {
      onQuizUpdate(mergeExerciseItem(quiz, optimisticQuestion));
    }

    try {
      // Call backend to auto-save attempt
      const updatedItem = await quizService.submitAnswer(
        currentQuestion.id,
        optionId,
      );
      if (updatedItem && onQuizUpdate) {
        onQuizUpdate(mergeExerciseItem(quiz, updatedItem));
      }
    } catch (error) {
      console.error("Failed to auto-save answer", error);
    }
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

  const toggleFlagCurrentQuestion = () => {
    if (!currentQuestion) return;
    setFlaggedQuestionIds((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id],
    );
  };

  const submitQuiz = async () => {
    if (!quiz || quiz.isSubmitted) return;

    // Prevent multiple submissions
    setIsSubmitting(true);
    try {
      const updated = await quizService.submitQuiz(quiz.id);
      // The updated quiz payload now unlocks user_score and is_correct flags
      if (updated && onQuizUpdate) onQuizUpdate(updated);
    } catch (error) {
      console.error("Failed to submit quiz", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOption,
    questionStatus,
    unansweredCount,
    flaggedCount,
    isSubmitting,
    handleSelectOption,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    toggleFlagCurrentQuestion,
    submitQuiz,
    flaggedQuestionIds,
  };
};
