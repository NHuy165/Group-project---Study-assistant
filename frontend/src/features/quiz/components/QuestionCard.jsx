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
          : "border-[#7adfd9]/35 bg-gradient-to-br from-[#ffffff]/95 via-[#f6fffd]/92 to-[#eefbff]/95"
      }`}
    >
      <p
        className={`text-xl font-semibold ${isNight ? "text-slate-100" : "text-gray-800"}`}
      >
        {question.text}
      </p>
      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showCorrect = isSubmitted && option.isCorrect;
          const showWrong =
            isSubmitted && isSelected && option.isCorrect === false;
          const defaultClass = isNight
            ? "border-[#7d95e2]/40 bg-[#1a254f]/70 text-slate-100"
            : "border-[#9adfd8]/40 bg-white/90 text-gray-700";
          const selectedClass = isNight
            ? "border-[#4ecdc4] bg-[#183a63] text-slate-100"
            : "border-[#4ecdc4] bg-[#dffffa] text-[#0f3f4f]";

          let stateClass = isSelected ? selectedClass : defaultClass;
          if (showCorrect) {
            stateClass = "border-green-500 bg-green-100 text-green-900";
          } else if (showWrong) {
            stateClass = "border-red-500 bg-red-100 text-red-900";
          }

          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all
                ${stateClass}
                hover:-translate-y-0.5 hover:shadow-md
              `}
            >
              {option.content}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
