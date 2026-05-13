import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizView = ({ quiz, game, onUpdateMeta, isSaving }) => {
  const { isNight } = useTheme();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [resultFilter, setResultFilter] = useState("all");

  useEffect(() => {
    if (!quiz) return;
    setDraftName(quiz.name || "");
    setDraftDescription(quiz.description || "");
    setIsEditing(false);
  }, [quiz]);

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

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOption,
    questionStatus,
    unansweredCount,
    flaggedCount,
    progress,
    isSubmitting,
    handleSelectOption,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    toggleFlagCurrentQuestion,
    submitQuiz,
    flaggedQuestionIds,
  } = game;

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

  return (
    <div className="flex h-full flex-col gap-5">
      <div
        className={`rounded-3xl border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
          isNight
            ? "border-[#7d95e2]/40 bg-[#111a38]/80"
            : "border-[#8ce1d8]/35 bg-gradient-to-br from-white/94 via-[#f6fffd]/90 to-[#eefbff]/88"
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
            : "border-[#8ce1d8]/35 bg-gradient-to-br from-white/94 via-[#f6fffd]/90 to-[#eefbff]/88"
        }`}
      >
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
            className="h-full bg-[#4ecdc4]"
            style={{ width: `${progress}%` }}
          />
        </div>
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
      ) : quiz.isSubmitted && quiz.score ? (
        <div className="space-y-4">
          <div
            className={`rounded-3xl border p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
              isNight
                ? "border-[#7d95e2]/40 bg-[#111a38]/80"
                : "border-[#8ce1d8]/35 bg-gradient-to-br from-white/94 via-[#f6fffd]/90 to-[#eefbff]/88"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-600">
                  Kết quả
                </p>
                <h3
                  className={`text-2xl font-bold ${isNight ? "text-slate-100" : "text-gray-800"}`}
                >
                  Hoàn thành!
                </h3>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                <p className="font-bold">
                  Đúng {quiz.score.correct}/{quiz.score.total} câu
                </p>
                <p>Đạt {quiz.score.percent}%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setResultFilter("all")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border ${
                resultFilter === "all"
                  ? "bg-[#4ecdc4] text-white border-[#4ecdc4]"
                  : isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-[#7d95e2]/75"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setResultFilter("correct")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border ${
                resultFilter === "correct"
                  ? "bg-green-500 text-white border-green-500"
                  : isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-green-500/50"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
              }`}
            >
              Câu đúng
            </button>
            <button
              onClick={() => setResultFilter("wrong")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border ${
                resultFilter === "wrong"
                  ? "bg-red-500 text-white border-red-500"
                  : isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-red-500/50"
                    : "border-gray-200 bg-white text-gray-600 hover:border-red-300"
              }`}
            >
              Câu sai
            </button>
            <button
              onClick={() => setResultFilter("flagged")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border ${
                resultFilter === "flagged"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100 hover:border-yellow-500/50"
                    : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
              }`}
            >
              Câu phân vân
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {quiz.questions
              .filter((question) => {
                if (resultFilter === "all") return true;

                const isFlagged = flaggedQuestionIds.includes(question.id);
                const selectedOption = question.options.find(
                  (opt) => opt.id === question.attemptId,
                );
                const isCorrect = selectedOption?.isCorrect || false;

                if (resultFilter === "correct") return isCorrect;
                if (resultFilter === "wrong")
                  return !isCorrect && question.attemptId;
                if (resultFilter === "flagged") return isFlagged;
                return true;
              })
              .map((question) => {
                const isFlagged = flaggedQuestionIds.includes(question.id);
                const selectedOption = question.options.find(
                  (opt) => opt.id === question.attemptId,
                );
                const isCorrect = selectedOption?.isCorrect || false;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      isFlagged
                        ? "border-yellow-300 bg-yellow-50"
                        : isCorrect
                          ? "border-green-300 bg-green-50"
                          : "border-red-300 bg-red-50"
                    }`}
                  >
                    <p
                      className={`font-semibold mb-2 ${
                        isFlagged
                          ? "text-yellow-900"
                          : isCorrect
                            ? "text-green-900"
                            : "text-red-900"
                      }`}
                    >
                      {question.text}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div
                        className={`p-2 rounded ${
                          isFlagged
                            ? "bg-yellow-100 text-yellow-900"
                            : isCorrect
                              ? "bg-green-100 text-green-900"
                              : "bg-red-100 text-red-900"
                        }`}
                      >
                        <p className="font-semibold">Câu trả lời của bạn:</p>
                        <p>{selectedOption?.content || "Không trả lời"}</p>
                      </div>
                      {!isCorrect && !isFlagged && (
                        <div className="bg-green-100 p-2 rounded text-green-900">
                          <p className="font-semibold">Câu trả lời đúng:</p>
                          <p>
                            {
                              question.options.find((opt) => opt.isCorrect)
                                ?.content
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
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
                  onClick={prevQuestion}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                    isNight
                      ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={nextQuestion}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                    isNight
                      ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  Tiếp
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={toggleFlagCurrentQuestion}
                  disabled={quiz.isSubmitted}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 ${
                    currentStatus?.isFlagged
                      ? "border-yellow-400 bg-yellow-100 text-yellow-700"
                      : isNight
                        ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                        : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {currentStatus?.isFlagged ? "Bỏ phân vân" : "Phân vân"}
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={quiz.isSubmitted || isSubmitting}
                  className="rounded-xl bg-[#ff6b6b] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_20px_rgba(255,107,107,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(255,107,107,0.35)] disabled:opacity-60"
                >
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
                const baseStyle = status.isFlagged
                  ? "border-yellow-400 bg-yellow-100 text-yellow-700"
                  : status.isAnswered
                    ? "border-green-500 bg-green-100 text-green-700"
                    : isNight
                      ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                      : "border-gray-200 bg-white text-gray-600";

                return (
                  <button
                    key={status.id}
                    onClick={() => jumpToQuestion(index)}
                    className={`rounded-lg border px-0 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm ${baseStyle} ${
                      isCurrent ? "ring-2 ring-offset-1 ring-[#4ecdc4]/70" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 shadow-xl ${
              isNight
                ? "border-[#7d95e2]/45 bg-[#111a38]"
                : "border-white/30 bg-white"
            }`}
          >
            <h3
              className={`text-lg font-bold ${isNight ? "text-slate-100" : "text-gray-800"}`}
            >
              Xác nhận nộp bài?
            </h3>
            <p
              className={`mt-2 text-sm ${isNight ? "text-slate-300" : "text-gray-600"}`}
            >
              Chưa trả lời:{" "}
              <span className="font-semibold">{unansweredCount}</span>
            </p>
            <p
              className={`text-sm ${isNight ? "text-slate-300" : "text-gray-600"}`}
            >
              Phân vân: <span className="font-semibold">{flaggedCount}</span>
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  isNight
                    ? "border-[#7d95e2]/45 bg-[#1a254f] text-slate-100"
                    : "border-gray-200 bg-white text-gray-600"
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
                className="rounded-xl bg-[#ff6b6b] px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
