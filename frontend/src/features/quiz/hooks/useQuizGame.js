import { useEffect, useMemo, useState } from "react";
import { quizService } from "../services/quiz.service";
import { mergeExerciseItem } from "../utils/quizHelpers";

export const useQuizGame = (quiz, onQuizUpdate) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState([]);

  // --- STATE MỚI: Quản lý cột mốc (Milestones) ---
  const [notifiedMilestones, setNotifiedMilestones] = useState([]);
  const [milestoneMessage, setMilestoneMessage] = useState(null);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;

  useEffect(() => {
    setCurrentIndex(0);
    setFlaggedQuestionIds([]);
    setNotifiedMilestones([]); // Reset mốc thưởng khi đổi quiz
    setMilestoneMessage(null);
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

  // Tính toán tiến độ %
  const progress =
    totalQuestions > 0
      ? Math.round(((totalQuestions - unansweredCount) / totalQuestions) * 100)
      : 0;

  // --- LOGIC MỚI: Bắn Popup Lời chúc theo tiến độ ---
  useEffect(() => {
    // Chỉ kích hoạt khi bài CHƯA nộp
    if (quiz?.isSubmitted) return;

    if (progress >= 80 && !notifiedMilestones.includes(80)) {
      setMilestoneMessage({
        title: "Sắp xong rồi!",
        body: "Bạn đã hoàn thành 80% bài làm. Cố lên nhé! 🚀",
        tone: "sky",
      });
      setNotifiedMilestones((prev) => [...prev, 80]);
    } else if (progress >= 50 && !notifiedMilestones.includes(50)) {
      setMilestoneMessage({
        title: "Tuyệt vời!",
        body: "Bạn đã đi được một nửa chặng đường rồi đấy! ⭐",
        tone: "emerald",
      });
      setNotifiedMilestones((prev) => [...prev, 50]);
    } else if (progress >= 20 && !notifiedMilestones.includes(20)) {
      setMilestoneMessage({
        title: "Khởi đầu tốt!",
        body: "Tiếp tục giữ vững phong độ này nhé! 🌱",
        tone: "amber",
      });
      setNotifiedMilestones((prev) => [...prev, 20]);
    }
  }, [progress, notifiedMilestones, quiz?.isSubmitted]);

  const clearMilestoneMessage = () => setMilestoneMessage(null);

  const handleSelectOption = async (optionId) => {
    if (!quiz || quiz.isSubmitted || !currentQuestion) return;

    const optimisticQuestion = { ...currentQuestion, attemptId: optionId };
    if (onQuizUpdate) {
      onQuizUpdate(mergeExerciseItem(quiz, optimisticQuestion));
    }

    try {
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

    setIsSubmitting(true);
    try {
      const updated = await quizService.submitQuiz(quiz.id);
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
    progress, // Export progress ra để UI sử dụng
    milestoneMessage, // Export message để hiện Popup
    clearMilestoneMessage, // Export hàm tắt Popup
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