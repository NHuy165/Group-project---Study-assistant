import React from "react";

const QuestionCard = ({
  question,
  onSelectOption,
  selectedOption,
  isSubmitted,
}) => {
  if (!question) {
    return <div className="text-center text-gray-500">Không có câu hỏi</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {question.question}
        </h2>
        <div className="text-sm text-gray-500">
          Điểm tối đa: <span className="font-medium">{question.maxScore}</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options &&
          question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => !isSubmitted && onSelectOption(option.id)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedOption === String(option.id)
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${isSubmitted ? "cursor-not-allowed opacity-75" : "cursor-pointer"} ${
                isSubmitted && option.isCorrect
                  ? "border-green-500 bg-green-50"
                  : isSubmitted &&
                      selectedOption === String(option.id) &&
                      !option.isCorrect
                    ? "border-red-500 bg-red-50"
                    : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    selectedOption === String(option.id)
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  }`}
                />
                <span className="text-gray-800">{option.content}</span>

                {/* Show correctness after submission */}
                {isSubmitted && (
                  <span className="ml-auto flex-shrink-0">
                    {option.isCorrect && (
                      <span className="text-green-600 font-semibold">
                        ✓ Đúng
                      </span>
                    )}
                    {!option.isCorrect &&
                      selectedOption === String(option.id) && (
                        <span className="text-red-600 font-semibold">
                          ✗ Sai
                        </span>
                      )}
                  </span>
                )}
              </div>
            </button>
          ))}
      </div>

      {/* Answer feedback after submission */}
      {isSubmitted && question.attempt && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Câu trả lời của bạn:</span>{" "}
            {question.attempt}
            {question.userScore !== undefined && (
              <span className="ml-2">
                | Điểm:{" "}
                <span className="font-semibold">
                  {question.userScore}/{question.maxScore}
                </span>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
