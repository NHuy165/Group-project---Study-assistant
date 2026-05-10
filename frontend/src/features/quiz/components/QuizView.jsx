import React from "react";
import QuestionCard from "./QuestionCard";

const QuizView = ({ quiz, game }) => {
  if (!quiz) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/40 p-6 text-center text-sm text-gray-500">
        Hay chon mot quiz de bat dau.
      </div>
    );
  }

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOption,
    progress,
    isSubmitting,
    handleSelectOption,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  } = game;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-2xl border border-white/20 bg-white/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Tien do</p>
            <p className="text-sm font-semibold text-gray-800">
              Cau {currentIndex + 1} / {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-gray-500">
              Hoan thanh
            </p>
            <p className="text-sm font-semibold text-gray-800">{progress}%</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-[#4ecdc4]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        isSubmitted={quiz.isSubmitted}
      />

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={prevQuestion}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600"
        >
          Truoc
        </button>
        <button
          onClick={nextQuestion}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600"
        >
          Tiep
        </button>
        <button
          onClick={submitQuiz}
          disabled={quiz.isSubmitted || isSubmitting}
          className="rounded-xl bg-[#ff6b6b] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          Nop bai
        </button>
      </div>

      {quiz.isSubmitted && quiz.score && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm">
          <p className="font-bold text-green-700">Ket qua</p>
          <p className="text-green-700">
            Dung {quiz.score.correct}/{quiz.score.total} cau -{" "}
            {quiz.score.percent}%
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizView;
