import React, { useMemo, useState } from "react";
import QuizGeneratorForm from "./QuizGeneratorForm";
import QuizView from "./QuizView";
import useQuizManagement from "../hooks/useQuizManagement";
import { useQuizGame } from "../hooks/useQuizGame";

const QuizPanel = ({ interactionId, onClose }) => {
  const {
    quizzes,
    isLoading,
    error,
    createNewQuiz,
    removeQuiz,
    updateQuizInList,
  } = useQuizManagement(interactionId);
  const [selectedId, setSelectedId] = useState(null);

  const selectedQuiz = useMemo(
    () => quizzes.find((item) => item.id === selectedId) || null,
    [quizzes, selectedId],
  );

  const game = useQuizGame(interactionId, selectedQuiz, updateQuizInList);

  const handleCreate = async (data) => {
    const created = await createNewQuiz(data);
    if (created) setSelectedId(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col gap-4 rounded-3xl border border-white/30 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Quiz</p>
            <h2 className="text-2xl font-extrabold text-gray-800">
              Luyen tap nhanh
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600"
          >
            Dong
          </button>
        </header>

        <div className="grid h-full grid-cols-[280px_1fr] gap-4 overflow-hidden">
          <aside className="flex flex-col gap-4 overflow-y-auto rounded-2xl border border-white/30 bg-white/50 p-4">
            <QuizGeneratorForm
              onCreateQuiz={handleCreate}
              isLoading={isLoading}
            />

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-gray-500">
                Danh sach quiz
              </p>
              {isLoading && quizzes.length === 0 && (
                <p className="text-sm text-gray-500">Dang tai...</p>
              )}
              {!isLoading && quizzes.length === 0 && (
                <p className="text-sm text-gray-500">Chua co quiz nao.</p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    quiz.id === selectedId
                      ? "border-[#4ecdc4] bg-[#4ecdc4]/10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <button
                    onClick={() => setSelectedId(quiz.id)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="font-semibold text-gray-700">
                      {quiz.title}
                    </span>
                    {quiz.isSubmitted && (
                      <span className="text-xs font-bold text-green-600">
                        Da nop
                      </span>
                    )}
                  </button>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{quiz.subjectType}</span>
                    <button
                      onClick={() => removeQuiz(quiz.id)}
                      className="text-red-500 hover:underline"
                    >
                      Xoa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="h-full overflow-y-auto rounded-2xl border border-white/30 bg-white/50 p-4">
            <QuizView quiz={selectedQuiz} game={game} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default QuizPanel;
