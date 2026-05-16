import React, { useEffect, useMemo } from "react";
import QuizView from "./QuizView";
import useQuizManagement from "../hooks/useQuizManagement";
import { useQuizGame } from "../hooks/useQuizGame";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizPanel = ({ interactionId, quizId, onClose }) => {
  const { isNight } = useTheme();
  
  // Dùng lại Hook quản lý để lấy hàm update và load detail
  // (Dữ liệu danh sách đã được chuyển ra InteractionPage lo)
  const {
    quizzes,
    isLoading,
    loadQuizDetail,
    updateQuizMeta,
    updateQuizInList,
  } = useQuizManagement(interactionId);

  // Tìm đúng bài quiz mà user đã click ngoài Sidebar
  const selectedQuiz = useMemo(
    () => quizzes.find((item) => item.id === quizId) || null,
    [quizzes, quizId],
  );

  // Khởi tạo bộ não tính điểm & logic làm bài
  const game = useQuizGame(selectedQuiz, updateQuizInList);

  // Tự động tải chi tiết câu hỏi (nếu chưa có) ngay khi mở popup
  useEffect(() => {
    if (!quizId) return;
    if (!selectedQuiz || selectedQuiz.hasDetails) return;
    loadQuizDetail(quizId);
  }, [quizId, selectedQuiz, loadQuizDetail]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:p-8 backdrop-blur-sm transition-all">
      <div
        className={`relative flex h-full max-h-[92vh] w-full max-w-6xl flex-col gap-5 overflow-hidden rounded-[2.5rem] border p-6 md:p-8 shadow-2xl ${
          isNight
            ? "border-[#7aa7ff]/30 bg-gradient-to-br from-[#0e1631]/95 via-[#1a1b3f]/95 to-[#18142b]/95 shadow-[0_28px_70px_rgba(2,10,35,0.7)]"
            : "border-white/50 bg-gradient-to-br from-[#dcfff7]/95 via-[#fff1e7]/95 to-[#e8f4ff]/95 shadow-[0_24px_60px_rgba(15,23,42,0.25)]"
        }`}
      >
        {/* Các hiệu ứng ánh sáng (Aurora Effects) */}
        <div className="quiz-aurora quiz-aurora-a -left-24 -top-20 z-0 opacity-70" />
        <div className="quiz-aurora quiz-aurora-b right-16 top-8 z-0 opacity-70" />
        <div className="quiz-aurora quiz-aurora-c bottom-0 left-1/2 z-0 -translate-x-1/2 opacity-70" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.26),transparent_40%)]" />

        {/* HEADER */}
        <header className="relative z-10 flex items-center justify-between pl-2">
          <div>
            <p className={`text-xs font-black uppercase tracking-widest ${isNight ? "text-slate-400" : "text-gray-500"}`}>
              Quiz
            </p>
            <h2 className={`text-3xl font-black ${isNight ? "text-slate-100" : "text-gray-800"}`}>
              Không gian làm bài
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`rounded-2xl border-2 px-6 py-3 text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-lg ${
              isNight
                ? "border-[#88a1ff]/40 bg-[#1a254f]/80 text-slate-100 hover:bg-[#253468]"
                : "border-gray-200 bg-white text-gray-700 hover:bg-white"
            }`}
          >
            Đóng X
          </button>
        </header>

        {/* KHU VỰC LÀM BÀI CHÍNH (FULL WIDTH) */}
        <section
          className={`relative z-10 h-full w-full overflow-y-auto rounded-[2rem] border p-6 md:p-8 shadow-inner custom-scrollbar ${
            isNight
              ? "border-[#6e85d7]/35 bg-[#121d3c]/80"
              : "border-[#89e2d7]/40 bg-gradient-to-br from-white/95 via-[#f6fffd]/95 to-[#eefbff]/95"
          }`}
        >
          {!quizId ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <span className="animate-spin text-4xl">⏳</span>
                <p className={`font-bold ${isNight ? "text-slate-400" : "text-gray-500"}`}>
                  Đang nạp dữ liệu bài làm...
                </p>
              </div>
            </div>
          ) : (
            <QuizView
              quiz={selectedQuiz}
              game={game}
              onUpdateMeta={updateQuizMeta}
              isSaving={isLoading}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default QuizPanel;