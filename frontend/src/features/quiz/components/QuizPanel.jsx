import React, { useState } from "react";
import { createPortal } from "react-dom";
import QuizGeneratorForm from "./QuizGeneratorForm.jsx";
import QuizView from "./QuizView.jsx";

const QuizPanel = ({ quizzes, isLoading, onCreateQuiz, error, onClose }) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => (
    <div className="flex-1 overflow-auto p-5 md:p-6">
      {showGenerator ? (
        <QuizGeneratorForm
          isLoading={isLoading}
          error={error}
          onCreateQuiz={async (quizParams) => {
            const createdQuiz = await onCreateQuiz(quizParams);
            if (createdQuiz) {
              setShowGenerator(false);
            }
          }}
        />
      ) : (
        <QuizView data={quizzes} isLoading={isLoading} error={error} />
      )}
    </div>
  );

  const renderHeader = ({ expanded = false } = {}) => (
    <>
      <header className="border-b border-slate-100 px-5 pb-4 pt-5 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              <span className="mr-2 text-indigo-500">📝</span>
              Quiz
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tạo và làm bài trắc nghiệm của bạn
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {expanded ? (
              <button
                onClick={() => setIsExpanded(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                aria-label="Thu nho quiz"
                title="Thu nho"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                aria-label="Phong to quiz"
                title="Phong to"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
                </svg>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Dong quiz"
              title="Dong"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-2 border-b border-slate-100 px-5 py-4 md:px-6">
        <button
          onClick={() => setShowGenerator(false)}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
            !showGenerator
              ? "bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Làm bài
        </button>

        <button
          onClick={() => setShowGenerator(true)}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
            showGenerator
              ? "bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tạo mới
        </button>
      </div>
    </>
  );

  const expandedPanel =
    isExpanded && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          >
            <div
              className="relative flex h-[min(760px,calc(100vh-2rem))] w-full max-w-[1100px] flex-col overflow-hidden rounded-[3rem] border border-white/20 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {renderHeader({ expanded: true })}
              {renderContent()}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <aside className="flex h-full w-[34%] min-w-[360px] max-w-[520px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur-md">
        {renderHeader()}
        {renderContent()}
      </aside>

      {expandedPanel}
    </>
  );
};

export default QuizPanel;
