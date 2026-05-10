import React, { useState } from "react";

const QuizGeneratorForm = ({ isLoading, error, onCreateQuiz }) => {
  const [subject, setSubject] = useState("ENGLISH");
  const [context, setContext] = useState("");

  const subjects = [
    { value: "ENGLISH", label: "📚 Tiếng Anh" },
    { value: "VIETNAMESE", label: "🇻🇳 Tiếng Việt" },
    { value: "MATHS", label: "🔢 Toán" },
  ];

  const handleCreateQuiz = () => {
    if (!subject) {
      return;
    }
    onCreateQuiz({ subject, context });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-dashed border-indigo-300 shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-indigo-600">
        ✨ Tạo Quiz với AI
      </h2>

      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Subject Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Chọn môn học
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isLoading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          {subjects.map((sub) => (
            <option key={sub.value} value={sub.value}>
              {sub.label}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Context */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Chi tiết (tùy chọn)
        </label>
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          placeholder="VD: Ngữ pháp câu điều kiện, từ vựng nâng cao..."
          rows="3"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleCreateQuiz}
        disabled={isLoading || !subject}
        className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-medium"
      >
        {isLoading ? "⏳ AI đang suy nghĩ..." : "🚀 Tạo quiz ngay"}
      </button>
    </div>
  );
};

export default QuizGeneratorForm;
