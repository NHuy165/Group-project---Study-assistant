import React from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuestionCard = ({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted,
}) => {
  const { isNight } = useTheme();
  if (!question) return null;

  return (
    <div
      className={`rounded-3xl border p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${
        isNight
          ? "border-[#7d95e2]/40 bg-[#111a38]/90"
          : "border-[#7adfd9]/45 bg-gradient-to-br from-white via-[#fff3e6] to-[#e0f2fe] ring-1 ring-[#9be7e2]/40"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <p
          className={`text-xl font-semibold ${isNight ? "text-slate-100" : "text-gray-800"}`}
        >
          {question.text}
        </p>

        {/* Hien thi diem cua cau hoi neu da nop bai */}
        {isSubmitted && question.userScore !== undefined && (
          <span
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-bold ${
              question.userScore > 0
                ? "border-green-300 bg-green-100 text-green-700"
                : "border-red-300 bg-red-100 text-red-700"
            }`}
          >
            {question.userScore} / {question.maxScore} pts
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showCorrect = isSubmitted && option.isCorrect;
          const showWrong =
            isSubmitted && isSelected && option.isCorrect === false;

          const defaultClass = isNight
            ? "border-[#7d95e2]/40 bg-[#1a254f]/70 text-slate-100 hover:bg-[#1a254f]"
            : "border-[#9adfd8]/50 bg-white/90 text-gray-700 hover:border-[#4ecdc4]/60 hover:bg-[#eafffb]";

          const selectedClass = isNight
            ? "border-[#4ecdc4] bg-[#183a63] text-slate-100"
            : "border-[#4ecdc4] bg-gradient-to-r from-[#d7fff8] to-[#b8f5ea] text-[#0f3f4f] shadow-[0_10px_20px_rgba(78,205,196,0.25)]";

          let stateClass = isSelected ? selectedClass : defaultClass;

          // Backend tra ve isCorrect nen UI to mau tuong ung
          if (showCorrect) {
            stateClass = isNight
              ? "border-emerald-400 bg-emerald-500/25 text-emerald-50 shadow-[0_12px_22px_rgba(16,185,129,0.35)]"
              : "border-green-500 bg-green-100 text-green-900";
          } else if (showWrong) {
            stateClass = isNight
              ? "border-rose-400 bg-rose-500/25 text-rose-50 shadow-[0_12px_22px_rgba(244,63,94,0.35)]"
              : "border-red-500 bg-red-100 text-red-900";
          }

          return (
            <button
              key={option.id}
              onClick={() => !isSubmitted && onSelectOption(option.id)}
              disabled={isSubmitted}
              className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left font-medium transition-all duration-200 ${stateClass} ${
                isSubmitted
                  ? "cursor-default"
                  : "cursor-pointer hover:shadow-md"
              }`}
            >
              <span>{option.content}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
