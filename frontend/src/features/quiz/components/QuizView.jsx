import React from "react";
import { useQuizGame } from "../hooks/useQuizGame.ts";
import QuestionCard from "./QuestionCard.jsx";

const QuizView = ({ data, isLoading, error }) => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    selectedOption,
    handleSelectOption,
    nextQuestion,
    prevQuestion,
    isFirst,
    isLast,
  } = useQuizGame(data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải quiz...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <p className="text-2xl mb-4">📝</p>
          <p className="text-gray-600 font-semibold">Chưa có quiz nào!</p>
          <p className="text-sm text-gray-500 mt-2">
            Hãy tạo một quiz mới để bắt đầu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress bar */}
      <div className="mb-4 bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question counter */}
      <p className="text-center text-sm text-gray-500 mb-6">
        Câu {currentIndex + 1} / {totalQuestions}
      </p>

      {/* Question card */}
      <QuestionCard
        question={currentQuestion}
        onSelectOption={handleSelectOption}
        selectedOption={selectedOption}
        isSubmitted={false}
      />

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 gap-3">
        <button
          onClick={prevQuestion}
          disabled={isFirst}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-30 hover:bg-gray-200 transition-colors"
        >
          ← Câu trước
        </button>
        <button
          onClick={nextQuestion}
          disabled={isLast}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-30 hover:bg-indigo-700 transition-colors"
        >
          Câu tiếp theo →
        </button>
      </div>

      {/* Submit button */}
      {isLast && (
        <button className="mt-6 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
          ✓ Nộp bài
        </button>
      )}
    </div>
  );
};

export default QuizView;
