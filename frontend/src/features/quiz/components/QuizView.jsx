import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { ChevronLeft, ChevronRight, Send, Flag } from "lucide-react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

// Import các sub-components
import QuestionCard from "./QuestionCard";
import QuizMilestone from "./QuizMilestone";
import QuizNavigator from "./QuizNavigator";
import QuizScoreBoard from "./QuizScoreBoard";
import QuizSidebarInfo from "./QuizSidebarInfo";
import QuizConfirmModal from "./QuizConfirmModal";

const QuizView = ({ quiz, game, onUpdateMeta, isSaving }) => {
  const { isNight } = useTheme();
  
  // Local States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!quiz) return;
    setDraftName(quiz.name || "");
    setDraftDescription(quiz.description || "");
    setIsEditing(false);
  }, [quiz]);

  const {
    currentQuestion, currentIndex, totalQuestions, selectedOption, questionStatus,
    unansweredCount, flaggedCount, milestoneMessage, clearMilestoneMessage,
    isSubmitting, handleSelectOption, nextQuestion, prevQuestion, jumpToQuestion,
    toggleFlagCurrentQuestion, submitQuiz
  } = game;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (["input", "textarea"].includes(activeTag)) return;
      if (isConfirmOpen) return;
      if (event.key === "ArrowLeft" && canGoPrev) handlePrevQuestion();
      if (event.key === "ArrowRight" && canGoNext) handleNextQuestion();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isConfirmOpen]);

  const handleSave = async () => {
    if (!onUpdateMeta) return;
    const trimmedName = draftName.trim();
    if (!trimmedName) return;
    const updated = await onUpdateMeta(quiz.id, { name: trimmedName, description: draftDescription.trim() });
    if (updated) setIsEditing(false);
  };

  const questionList = quiz?.questions ?? [];
  const isSubmitted = Boolean(quiz?.isSubmitted);
  const scoreSummary = quiz?.score || null;
  const scorePercent = scoreSummary?.percent ?? 0;

  // Filtering Logic
  const isFilterActive = isSubmitted && resultFilter !== "all";
  const matchesFilter = (question) => {
    if (!isFilterActive) return true;
    const isCorrect = question.options.find((opt) => opt.id === question.attemptId)?.isCorrect || false;
    if (resultFilter === "correct") return isCorrect;
    if (resultFilter === "wrong") return !isCorrect;
    return true;
  };

  const filteredIndices = isSubmitted ? questionList.reduce((acc, q, index) => {
    if (matchesFilter(q)) acc.push(index); return acc;
  }, []) : [];
  
  const filteredIndexSet = new Set(filteredIndices);
  const hasFilterMatches = filteredIndices.length > 0;
  const currentFilteredPosition = isFilterActive ? filteredIndices.indexOf(currentIndex) : -1;

  useEffect(() => {
    if (!isFilterActive || !currentQuestion || !hasFilterMatches) return;
    if (!matchesFilter(currentQuestion)) jumpToQuestion(filteredIndices[0]);
  }, [isFilterActive, currentQuestion?.id, hasFilterMatches, filteredIndices, jumpToQuestion]);

  const canGoPrev = isFilterActive ? hasFilterMatches && currentFilteredPosition > 0 : currentIndex > 0;
  const canGoNext = isFilterActive ? hasFilterMatches && currentFilteredPosition < filteredIndices.length - 1 : currentIndex < totalQuestions - 1;

  const handlePrevQuestion = () => {
    if (!isFilterActive) { prevQuestion(); return; }
    if (!hasFilterMatches) return;
    jumpToQuestion(filteredIndices[Math.max(currentFilteredPosition - 1, 0)]);
  };

  const handleNextQuestion = () => {
    if (!isFilterActive) { nextQuestion(); return; }
    if (!hasFilterMatches) return;
    jumpToQuestion(filteredIndices[Math.min(currentFilteredPosition + 1, filteredIndices.length - 1)]);
  };

  if (!quiz) return null;

  return (
    <div className="flex h-full flex-col gap-5 relative">
      {/* Confetti effect on high score */}
      {isSubmitted && scorePercent >= 85 && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} gravity={0.15} />
        </div>
      )}

      <QuizMilestone milestoneMessage={milestoneMessage} clearMilestoneMessage={clearMilestoneMessage} />

      {/* 2-COLUMN LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
        
        {/* LEFT COLUMN: Questions & Controls */}
        <div className="space-y-5">
          {isSubmitted && (
            <QuizScoreBoard scoreSummary={scoreSummary} scorePercent={scorePercent} resultFilter={resultFilter} setResultFilter={setResultFilter} />
          )}

          {totalQuestions > 0 ? (
            <QuestionCard question={currentQuestion} selectedOption={selectedOption} onSelectOption={handleSelectOption} isSubmitted={quiz.isSubmitted} />
          ) : (
            <div className={`rounded-2xl border border-dashed p-6 text-center text-sm ${isNight ? "border-[#7d95e2]/45 bg-[#111a38]/70 text-slate-300" : "border-gray-300 bg-white/40 text-gray-500"}`}>
              {quiz.hasDetails ? "Quiz chưa có câu hỏi." : "Đang tải câu hỏi..."}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={handlePrevQuestion} disabled={!canGoPrev} className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50 ${isNight ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100" : "border-gray-200 bg-white text-gray-600"}`}><ChevronLeft size={18} /> Trước</button>
              <button onClick={handleNextQuestion} disabled={!canGoNext} className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50 ${isNight ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100" : "border-gray-200 bg-white text-gray-600"}`}>Tiếp <ChevronRight size={18} /></button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {!quiz.isSubmitted && (
                <button onClick={toggleFlagCurrentQuestion} className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 ${questionStatus[currentIndex]?.isFlagged ? "border-yellow-400 bg-yellow-100 text-yellow-700" : isNight ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100" : "border-gray-200 bg-white text-gray-600"}`}>
                  <Flag size={16} fill={questionStatus[currentIndex]?.isFlagged ? "currentColor" : "none"} /> Phân vân
                </button>
              )}
              {!quiz.isSubmitted && (
                <button onClick={() => setIsConfirmOpen(true)} disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60">
                  <Send size={16} /> Nộp bài
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Info & Navigator */}
        <aside className="space-y-4">
          <QuizSidebarInfo 
            quiz={quiz} isEditing={isEditing} setIsEditing={setIsEditing} 
            draftName={draftName} setDraftName={setDraftName} 
            draftDescription={draftDescription} setDraftDescription={setDraftDescription} 
            handleSave={handleSave} isSaving={isSaving} 
          />
          <QuizNavigator 
            quiz={quiz} questionStatus={questionStatus} currentIndex={currentIndex} 
            isFilterActive={isFilterActive} filteredIndexSet={filteredIndexSet} jumpToQuestion={jumpToQuestion} 
          />
        </aside>
      </div>

      <QuizConfirmModal 
        isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} 
        onConfirm={() => { setIsConfirmOpen(false); submitQuiz(); }} 
        unansweredCount={unansweredCount} flaggedCount={flaggedCount} isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default QuizView;