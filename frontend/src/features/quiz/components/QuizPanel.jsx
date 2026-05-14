import React, { useEffect, useMemo, useState } from "react";
import QuizGeneratorForm from "./QuizGeneratorForm";
import QuizView from "./QuizView";
import useQuizManagement from "../hooks/useQuizManagement";
import { useQuizGame } from "../hooks/useQuizGame";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizPanel = ({ interactionId, onClose }) => {
  const { isNight } = useTheme();
  const {
    quizzes,
    isLoading,
    error,
    createNewQuiz,
    removeQuiz,
    loadQuizDetail,
    updateQuizMeta,
    updateQuizInList,
  } = useQuizManagement(interactionId);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const selectedQuiz = useMemo(
    () => quizzes.find((item) => item.id === selectedId) || null,
    [quizzes, selectedId],
  );

  const game = useQuizGame(selectedQuiz, updateQuizInList);

  useEffect(() => {
    if (!selectedId) return;
    if (!selectedQuiz || selectedQuiz.hasDetails) return;
    loadQuizDetail(selectedId);
  }, [selectedId, selectedQuiz, loadQuizDetail]);

  const handleCreate = async (data) => {
    const created = await createNewQuiz(data);
    if (created) setSelectedId(created.id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const deleted = await removeQuiz(pendingDelete.id);
    if (deleted && selectedId === pendingDelete.id) {
      setSelectedId(null);
    }
    setPendingDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 lg:p-8">
      <div
        className={`relative flex h-full max-h-[92vh] w-full max-w-7xl flex-col gap-4 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl ${
          isNight
            ? "border-[#7aa7ff]/30 bg-gradient-to-br from-[#0e1631]/90 via-[#1a1b3f]/90 to-[#18142b]/90 shadow-[0_28px_70px_rgba(2,10,35,0.55)]"
            : "border-white/50 bg-gradient-to-br from-[#dcfff7]/95 via-[#fff1e7]/92 to-[#e8f4ff]/95 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
        }`}
      >
        {/* Background effects */}
        <div className="quiz-aurora quiz-aurora-a -left-24 -top-20 z-0" />
        <div className="quiz-aurora quiz-aurora-b right-16 top-8 z-0" />
        <div className="quiz-aurora quiz-aurora-c bottom-0 left-1/2 z-0 -translate-x-1/2" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.26),transparent_40%)]" />

        {/* FIX: Added 'relative z-10' to header to prevent background effects from blocking clicks on the close button */}
        <header className="relative z-10 flex items-center justify-between">
          <div>
            <p
              className={`text-xs font-bold uppercase ${isNight ? "text-slate-300" : "text-gray-500"}`}
            >
              Quiz
            </p>
            <h2
              className={`text-2xl font-extrabold ${isNight ? "text-slate-100" : "text-gray-800"}`}
            >
              Luyện tập nhanh
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              isNight
                ? "border-[#88a1ff]/40 bg-[#1a254f]/80 text-slate-100"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            Đóng
          </button>
        </header>

        <div className="relative z-10 grid h-full grid-cols-[320px_1fr] gap-5 overflow-hidden">
          <aside
            className={`flex flex-col gap-4 overflow-y-auto rounded-2xl border p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] ${
              isNight
                ? "border-[#6e85d7]/35 bg-[#121d3c]/75"
                : "border-[#89e2d7]/35 bg-gradient-to-br from-white/92 to-[#eefbff]/85"
            }`}
          >
            <QuizGeneratorForm
              onCreateQuiz={handleCreate}
              isLoading={isLoading}
            />

            <div className="space-y-2">
              <p
                className={`text-xs font-bold uppercase ${isNight ? "text-slate-300" : "text-gray-500"}`}
              >
                Danh sách quiz
              </p>
              {isLoading && quizzes.length === 0 && (
                <p
                  className={`text-sm ${isNight ? "text-slate-300" : "text-gray-500"}`}
                >
                  Đang tải...
                </p>
              )}
              {!isLoading && quizzes.length === 0 && (
                <p
                  className={`text-sm ${isNight ? "text-slate-300" : "text-gray-500"}`}
                >
                  Chưa có quiz nào.
                </p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    quiz.id === selectedId
                      ? "border-[#4ecdc4] bg-[#4ecdc4]/20"
                      : isNight
                        ? "border-[#6e85d7]/40 bg-[#1a254f]/65"
                        : "border-[#9adfd8]/40 bg-gradient-to-br from-white to-[#f2fcff]"
                  }`}
                >
                  <button
                    onClick={() => setSelectedId(quiz.id)}
                    className="grid w-full grid-cols-[1fr_auto] items-start gap-2 text-left"
                  >
                    <span
                      className={`font-semibold leading-6 ${isNight ? "text-slate-100" : "text-gray-700"}`}
                    >
                      {quiz.title || quiz.name}
                    </span>
                    {quiz.isSubmitted && (
                      <span className="whitespace-nowrap rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                        Đã nộp
                      </span>
                    )}
                  </button>
                  <div
                    className={`mt-2 flex items-center justify-between text-xs ${isNight ? "text-slate-300" : "text-gray-500"}`}
                  >
                    <span>{quiz.subjectType}</span>
                    <button
                      onClick={() => setPendingDelete(quiz)}
                      className="text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section
            className={`h-full overflow-y-auto rounded-2xl border p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] ${
              isNight
                ? "border-[#6e85d7]/35 bg-[#121d3c]/75"
                : "border-[#89e2d7]/35 bg-gradient-to-br from-white/94 via-[#f6fffd]/90 to-[#eefbff]/88"
            }`}
          >
            <QuizView
              quiz={selectedQuiz}
              game={game}
              onUpdateMeta={updateQuizMeta}
              isSaving={isLoading}
            />
          </section>
        </div>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/30 bg-white p-5 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">Xóa quiz này?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Bạn có chắc muốn xóa “{pendingDelete.name}”? Hành động này không
              thể hoàn tác.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="rounded-xl bg-[#ff6b6b] px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPanel;