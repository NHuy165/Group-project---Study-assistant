import React from "react";

const QuestionCard = ({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted,
}) => {
  if (!question) return null;

  return (
    <div className="rounded-2xl border border-white/20 bg-white/60 p-5 shadow-md">
      <p className="text-lg font-semibold text-gray-800">{question.text}</p>
      <div className="mt-4 grid gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = question.correctIndex === index;
          const showCorrect = isSubmitted && isCorrect;
          const showWrong = isSubmitted && isSelected && !isCorrect;

          return (
            <button
              key={option}
              onClick={() => onSelectOption(index)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all
                ${isSelected ? "border-[#4ecdc4] bg-[#4ecdc4]/20" : "border-gray-200 bg-white"}
                ${showCorrect ? "border-green-500 bg-green-100" : ""}
                ${showWrong ? "border-red-500 bg-red-100" : ""}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
