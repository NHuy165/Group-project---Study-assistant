import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  X 
} from "lucide-react";
import QuestionCard from "./QuestionCard";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizView = ({ quiz, game, onUpdateMeta, isSaving }) => {
  const { isNight } = useTheme();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  
  // State quản lý kích thước màn hình cho hiệu ứng pháo giấy
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
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
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOption,
    questionStatus,
    unansweredCount,
    flaggedCount,
    progress,
    milestoneMessage,
    clearMilestoneMessage,
    isSubmitting,
    handleSelectOption,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    toggleFlagCurrentQuestion,
    submitQuiz,
    flaggedQuestionIds,
  } = game;

  // LOGIC: ĐIỀU HƯỚNG BÀN PHÍM
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;
      if (isConfirmOpen) return;

      if (event.key === "ArrowLeft") {
        if (canGoPrev) handlePrevQuestion();
      } else if (event.key === "ArrowRight") {
        if (canGoNext) handleNextQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isConfirmOpen]);

  const handleSave = async () => {
    if (!onUpdateMeta) return;
    const trimmedName = draftName.trim();
    const trimmedDescription = draftDescription.trim();
    if (!trimmedName) return;
    const updated = await onUpdateMeta(quiz.id, {
      name: trimmedName,
      description: trimmedDescription,
    });
    if (updated) setIsEditing(false);
  };

  const displayIndex = totalQuestions === 0 ? 0 : currentIndex + 1;
  const currentStatus = questionStatus?.[currentIndex];
  const questionList = quiz?.questions ?? [];
  const isSubmitted = Boolean(quiz?.isSubmitted);
  const scoreSummary = quiz?.score || null;
  const totalCount = scoreSummary?.total ?? questionList.length;
  const correctCount = scoreSummary?.correct ?? 0;
  const totalScore = scoreSummary?.totalScore ?? 0;
  const totalMaxScore = scoreSummary?.totalMaxScore ?? 0;
  const scorePercent = scoreSummary?.percent ?? 0;

  const getScorePraise = (percent) => {
    if (percent >= 95) {
      return {
        title: "Bé làm rất xuất sắc!",
        subtitle: "Giữ vững phong độ này nhé.",
        tone: "emerald",
      };
    }
    if (percent >= 85) {
      return {
        title: "Bé làm xuất sắc!",
        subtitle: "Chỉ cần thêm chút nữa là hoàn hảo.",
        tone: "teal",
      };
    }
    if (percent >= 70) {
      return {
        title: "Bé làm rất tốt!",
        subtitle: "Ôn thêm vài câu khó nữa nhé.",
        tone: "sky",
      };
    }
    if (percent >= 55) {
      return {
        title: "Bé làm khá ổn!",
        subtitle: "Cố gắng thêm để cải thiện điểm số.",
        tone: "amber",
      };
    }
    return {
      title: "Bé cố gắng hơn nhé!",
      subtitle: "Ôn lại kiến thức và thử lại lần sau.",
      tone: "rose",
    };
  };

  const scorePraise = scoreSummary ? getScorePraise(scorePercent) : null;
  const praiseToneStyles = {
    emerald: isNight
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
      : "border-emerald-200 bg-emerald-50 text-emerald-900",
    teal: isNight
      ? "border-teal-400/40 bg-teal-500/10 text-teal-100"
      : "border-teal-200 bg-teal-50 text-teal-900",
    sky: isNight
      ? "border-sky-400/40 bg-sky-500/10 text-sky-100"
      : "border-sky-200 bg-sky-50 text-sky-900",
    amber: isNight
      ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
      : "border-amber-200 bg-amber-50 text-amber-900",
    rose: isNight
      ? "border-rose-400/40 bg-rose-500/10 text-rose-100"
      : "border-rose-200 bg-rose-50 text-rose-900",
  };
  const praiseClass = scorePraise ? praiseToneStyles[scorePraise.tone] : "";

  const isFilterActive = isSubmitted && resultFilter !== "all";
  const matchesFilter = (question) => {
    if (!isFilterActive) return true;

    const isFlagged = flaggedQuestionIds.includes(question.id);
    const selectedOption = question.options.find(
      (opt) => opt.id === question.attemptId,
    );
    const isCorrect = selectedOption?.isCorrect || false;

    if (resultFilter === "correct") return isCorrect;
    if (resultFilter === "wrong") return !isCorrect && question.attemptId;
    if (resultFilter === "flagged") return isFlagged;
    return true;
  };

  const filteredIndices = isSubmitted
    ? questionList.reduce((acc, question, index) => {
        if (matchesFilter(question)) acc.push(index);
        return acc;
      }, [])
    : [];
  const filteredIndexSet = new Set(filteredIndices);
  const hasFilterMatches = filteredIndices.length > 0;
  const currentFilteredPosition = isFilterActive
    ? filteredIndices.indexOf(currentIndex)
    : -1;

  useEffect(() => {
    if (!isFilterActive || !currentQuestion || !hasFilterMatches) return;
    if (!matchesFilter(currentQuestion)) {
      jumpToQuestion(filteredIndices[0]);
    }
  }, [
    isFilterActive,
    currentQuestion?.id,
    hasFilterMatches,
    filteredIndices,
    jumpToQuestion,
  ]);

  const canGoPrev = isFilterActive
    ? hasFilterMatches && currentFilteredPosition > 0
    : currentIndex > 0;
  const canGoNext = isFilterActive
    ? hasFilterMatches && currentFilteredPosition < filteredIndices.length - 1
    : currentIndex < totalQuestions - 1;

  const handlePrevQuestion = () => {
    if (!isFilterActive) {
      prevQuestion();
      return;
    }
    if (!hasFilterMatches) return;
    const prevIndex = filteredIndices[Math.max(currentFilteredPosition - 1, 0)];
    if (prevIndex !== undefined) jumpToQuestion(prevIndex);
  };

  const handleNextQuestion = () => {
    if (!isFilterActive) {
      nextQuestion();
      return;
    }
    if (!hasFilterMatches) return;
    const nextIndex =
      filteredIndices[
        Math.min(currentFilteredPosition + 1, filteredIndices.length - 1)
      ];
    if (nextIndex !== undefined) jumpToQuestion(nextIndex);
  };

  if (!quiz) {
    return (
      <div
        className={`rounded-2xl border border-dashed p-6 text-center text-sm ${
          isNight
            ? "border-[#7d95e2]/45 bg-[#111a38]/70 text-slate-300"
            : "border-gray-300 bg-white/40 text-gray-500"
        }`}
      >
        Hãy chọn một quiz để bắt đầu.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 relative">
      {/* HIỆU ỨNG PHÁO GIẤY: Nổ khi điểm >= 85% */}
      {isSubmitted && scorePercent >= 85 && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
          />
        </div>
      )}

      {/* POPUP CỘT MỐC (Milestone Toast) */}
      {milestoneMessage && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
          <div
            className={`flex max-w-xs items-start gap-3 rounded-2xl border-2 p-4 shadow-2xl ${
              praiseToneStyles[milestoneMessage.tone]
            }`}
          >
            <div className="pt-1">⭐</div>
            <div>
              <p className="text-sm font-bold">{milestoneMessage.title}</p>
              <p className="text-xs opacity-90">{milestoneMessage.body}</p>
            </div>
            <button
              onClick={clearMilestoneMessage}
              className="rounded-full p-1 hover:bg-black/10"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div
        className={`rounded-3xl border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
          isNight
            ? "border-[#7d95e2]/40 bg-[#111a38]/80"
            : "border-[#88e2d7]/50 bg-gradient-to-br from-white via-[#fff3e6] to-[#e0f2fe] ring-1 ring-[#9be7e2]/40"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <>
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold ${
                    isNight
                      ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                      : "border-gray-200 bg-white text-gray-800"
                  }`}
                  placeholder="Tên quiz"
                />
                <textarea
                  value={draftDescription}
                  onChange={(event) => setDraftDescription(event.target.value)}
                  className={`min-h-[72px] w-full resize-none rounded-xl border px-3 py-2 text-sm ${
                    isNight
                      ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-200 placeholder:text-slate-400"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                  placeholder="Mô tả ngắn cho quiz"
                />
              </>
            ) : (
              <>
                <h3
                  className={`text-lg font-bold ${isNight ? "text-slate-100" : "text-gray-800"}`}
                >
                  {quiz.name}
                </h3>
                <p
                  className={`text-sm ${isNight ? "text-slate-300" : "text-gray-600"}`}
                >
                  {quiz.description || "Chưa có mô tả."}
                </p>
              </>
            )}
            <div
              className={`flex flex-wrap items-center gap-2 text-xs ${isNight ? "text-slate-200" : "text-gray-500"}`}
            >
              <span
                className={`rounded-full px-3 py-1 ${isNight ? "bg-[#1a254f]" : "bg-white/70"}`}
              >
                {quiz.subjectType}
              </span>
              <span
                className={`rounded-full px-3 py-1 ${isNight ? "bg-[#1a254f]" : "bg-white/70"}`}
              >
                {quiz.activityFormat}
              </span>
              <span
                className={`rounded-full px-3 py-1 ${isNight ? "bg-[#1a254f]" : "bg-white/70"}`}
              >
                {quiz.isSubmitted ? "Đã nộp" : "Chưa nộp"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                    isNight
                      ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-200"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-[#4ecdc4] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                >
                  Lưu
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                  isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-200"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`rounded-3xl border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
          isNight
            ? "border-[#7d95e2]/40 bg-[#111a38]/80"
            : "border-[#88e2d7]/50 bg-gradient-to-br from-white via-[#fff3e6] to-[#e0f2fe] ring-1 ring-[#9be7e2]/40"
        }`}
      >
        {/* SCORE BOARD - Hiển thị sau khi nộp bài */}
        {quiz.isSubmitted && quiz.score && (
          <div
            className={`mb-6 rounded-3xl p-6 text-center shadow-lg transition-all ${
              isNight
                ? "bg-[#1a254f] text-white"
                : "border border-[#a5f3fc]/60 bg-gradient-to-br from-white via-[#fff3e6] to-[#e0f2fe] text-gray-800 shadow-[0_18px_45px_rgba(56,189,248,0.2)]"
            }`}
          >
            <h3 className="text-xl font-bold opacity-80">Kết quả bài làm</h3>
            <div className="mt-4 flex items-center justify-center gap-12">
              <div>
                <p
                  className={`text-4xl font-extrabold ${
                    isNight ? "text-[#4ecdc4]" : "text-emerald-600"
                  }`}
                >
                  {totalScore}
                  <span
                    className={`text-lg ${
                      isNight ? "text-slate-300" : "text-gray-500"
                    }`}
                  >
                    {" "}
                    / {totalMaxScore}
                  </span>
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider opacity-60">
                  Điểm số
                </p>
              </div>
              <div
                className={`h-16 w-px ${
                  isNight ? "bg-white/10" : "bg-[#a7f3d0]/50"
                }`}
              ></div>
              <div>
                <p
                  className={`text-4xl font-extrabold ${
                    isNight ? "text-blue-400" : "text-sky-600"
                  }`}
                >
                  {scorePercent}%
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider opacity-60">
                  Tỉ lệ đúng
                </p>
              </div>
            </div>
            {scorePraise && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-center text-sm ${praiseClass}`}
              >
                <p className="text-base font-bold">{scorePraise.title}</p>
                <p className="text-xs opacity-80">{scorePraise.subtitle}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Chỉ hiển thị thanh tiến độ khi chưa nộp bài */}
        {!quiz.isSubmitted && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-bold uppercase ${isNight ? "text-slate-300" : "text-gray-500"}`}
                >
                  Tiến độ
                </p>
                <p
                  className={`text-sm font-semibold ${isNight ? "text-slate-100" : "text-gray-800"}`}
                >
                  Câu {displayIndex} / {totalQuestions}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-bold uppercase ${isNight ? "text-slate-300" : "text-gray-500"}`}
                >
                  Hoàn thành
                </p>
                <p
                  className={`text-sm font-semibold ${isNight ? "text-slate-100" : "text-gray-800"}`}
                >
                  {progress}%
                </p>
              </div>
            </div>
            <div
              className={`mt-3 h-2 w-full overflow-hidden rounded-full ${isNight ? "bg-slate-700" : "bg-gray-200"}`}
            >
              <div
                className="h-full bg-[#4ecdc4] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
      </div>

      {totalQuestions === 0 ? (
        <div
          className={`rounded-2xl border border-dashed p-6 text-center text-sm ${
            isNight
              ? "border-[#7d95e2]/45 bg-[#111a38]/70 text-slate-300"
              : "border-gray-300 bg-white/40 text-gray-500"
          }`}
        >
          {quiz.hasDetails ? "Quiz chưa có câu hỏi." : "Đang tải câu hỏi..."}
        </div>
      ) : (
        <div className="space-y-4">
          {quiz.isSubmitted && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setResultFilter("all")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm hover:-translate-y-0.5 ${
                      resultFilter === "all"
                        ? "bg-[#4ecdc4] text-white border-[#4ecdc4] shadow-[0_12px_26px_rgba(78,205,196,0.35)]"
                        : isNight
                          ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-[#7d95e2]/75"
                          : "border-gray-200/80 bg-white/80 text-gray-700 hover:border-[#4ecdc4]/50 hover:bg-[#f7fffd]"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setResultFilter("correct")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm hover:-translate-y-0.5 ${
                      resultFilter === "correct"
                        ? "bg-green-500 text-white border-green-500 shadow-[0_12px_26px_rgba(34,197,94,0.35)]"
                        : isNight
                          ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-green-500/50"
                          : "border-gray-200/80 bg-white/80 text-gray-700 hover:border-green-300 hover:bg-[#f0fdf4]"
                    }`}
                  >
                    <CheckCircle2 size={16} /> Câu đúng
                  </button>
                  <button
                    onClick={() => setResultFilter("wrong")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm hover:-translate-y-0.5 ${
                      resultFilter === "wrong"
                        ? "bg-red-500 text-white border-red-500 shadow-[0_12px_26px_rgba(239,68,68,0.35)]"
                        : isNight
                          ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-red-500/50"
                          : "border-gray-200/80 bg-white/80 text-gray-700 hover:border-red-300 hover:bg-[#fff1f2]"
                    }`}
                  >
                    <XCircle size={16} /> Câu sai
                  </button>
                  <button
                    onClick={() => setResultFilter("flagged")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm hover:-translate-y-0.5 ${
                      resultFilter === "flagged"
                        ? "bg-yellow-500 text-white border-yellow-500 shadow-[0_12px_26px_rgba(234,179,8,0.35)]"
                        : isNight
                          ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-yellow-500/50"
                          : "border-gray-200/80 bg-white/80 text-gray-700 hover:border-yellow-300 hover:bg-[#fffbeb]"
                    }`}
                  >
                    <Flag size={16} /> Câu phân vân
                  </button>
                </div>
                {quiz.score && (
                  <div
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      isNight
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                        : "border-emerald-200 bg-white/80 text-emerald-700"
                    }`}
                  >
                    Đúng {correctCount}/{totalCount} câu · {scorePercent}%
                  </div>
                )}
              </div>
              {isFilterActive && !hasFilterMatches && (
                <p
                  className={`text-xs ${
                    isNight ? "text-slate-300" : "text-gray-500"
                  }`}
                >
                  Không có câu phù hợp với bộ lọc hiện tại.
                </p>
              )}
            </div>
          )}

          <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
            <div className="space-y-4">
              <QuestionCard
                question={currentQuestion}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
                isSubmitted={quiz.isSubmitted}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={!canGoPrev}
                    className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                      isNight
                        ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft size={18} /> Trước
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!canGoNext}
                    className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                      isNight
                        ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Tiếp <ChevronRight size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={toggleFlagCurrentQuestion}
                    disabled={quiz.isSubmitted}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 ${
                      currentStatus?.isFlagged
                        ? "border-yellow-400 bg-yellow-100 text-yellow-700"
                        : isNight
                          ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                          : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    <Flag size={16} fill={currentStatus?.isFlagged ? "currentColor" : "none"} />
                    {currentStatus?.isFlagged ? "Bỏ phân vân" : "Phân vân"}
                  </button>
                  <button
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={quiz.isSubmitted || isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-[0_10px_20px_rgba(244,63,94,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(244,63,94,0.35)] active:scale-95 disabled:opacity-60"
                  >
                    <Send size={16} />
                    Nộp bài
                  </button>
                </div>
              </div>
            </div>

            <aside
              className={`space-y-3 rounded-2xl border p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
                isNight
                  ? "border-[#7d95e2]/40 bg-[#111a38]/80"
                  : "border-[#8ce1d8]/35 bg-gradient-to-br from-white/92 to-[#eefbff]/86"
              }`}
            >
              <div className="grid grid-cols-4 gap-2">
                {questionStatus.map((status, index) => {
                  const isCurrent = index === currentIndex;
                  const isMatch =
                    !isFilterActive || filteredIndexSet.has(index);
                  
                  let baseStyle = "border-gray-200 bg-white text-gray-600";
                  if (isNight) baseStyle = "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100";
                  if (status.isAnswered) baseStyle = "border-green-500 bg-green-100 text-green-700";
                  if (status.isFlagged) baseStyle = "border-yellow-400 bg-yellow-100 text-yellow-700";

                  const filterStyle =
                    isFilterActive && !isMatch
                      ? "opacity-30 cursor-not-allowed grayscale"
                      : "hover:-translate-y-0.5 hover:shadow-sm";

                  return (
                    <button
                      key={status.id}
                      onClick={() => {
                        if (!isMatch) return;
                        jumpToQuestion(index);
                      }}
                      className={`relative flex items-center justify-center rounded-lg border px-0 py-2 text-xs font-semibold transition-all ${baseStyle} ${
                        isCurrent
                          ? "ring-2 ring-offset-1 ring-[#4ecdc4]/70"
                          : ""
                      } ${filterStyle}`}
                      disabled={!isMatch}
                    >
                      {index + 1}
                      {/* Huy hiệu nhỏ (Mini Badge) khi nộp bài */}
                      {isSubmitted && (
                        <div className="absolute -top-1 -right-1">
                           {/* Logic huy hiệu có thể được thêm vào đây dựa trên đúng/sai */}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-3xl border p-6 shadow-2xl ${
              isNight
                ? "border-[#7d95e2]/45 bg-[#111a38]"
                : "border-white/30 bg-white"
            }`}
          >
            <h3
              className={`text-xl font-black ${isNight ? "text-slate-100" : "text-gray-800"}`}
            >
              Nộp bài ngay? 🚀
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className={isNight ? "text-slate-300" : "text-gray-600"}>
                • Còn <span className="font-bold text-rose-500">{unansweredCount}</span> câu chưa làm.
              </p>
              <p className={isNight ? "text-slate-300" : "text-gray-600"}>
                • Có <span className="font-bold text-yellow-500">{flaggedCount}</span> câu đang phân vân.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                  isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:bg-[#253468]"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setIsConfirmOpen(false);
                  submitQuiz();
                }}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;