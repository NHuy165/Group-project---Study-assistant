import React, { useState } from "react";
import { SUBJECTS } from "../utils/quizHelpers";
import { useTheme } from "../../../components/theme/ThemeWrapper";

const QuizGeneratorForm = ({ onCreateQuiz, isLoading }) => {
  const { isNight } = useTheme();
  const [subjectType, setSubjectType] = useState("ENGLISH");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreateQuiz({ subjectType, prompt });
    setPrompt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-3 rounded-2xl border p-4 ${
        isNight
          ? "border-[#7d95e2]/40 bg-[#19244a]/65"
          : "border-[#8ce1d8]/35 bg-gradient-to-br from-white/92 to-[#eefbff]/84"
      }`}
    >
      <div className="grid gap-2">
        <label
          className={`text-xs font-bold uppercase ${isNight ? "text-slate-300" : "text-gray-500"}`}
        >
          Môn học
        </label>
        <select
          value={subjectType}
          onChange={(event) => setSubjectType(event.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium ${
            isNight
              ? "border-[#7d95e2]/45 bg-[#111a38] text-slate-100"
              : "border-gray-200 bg-white text-gray-700"
          }`}
        >
          {SUBJECTS.map((subject) => (
            <option
              key={subject.id}
              value={subject.id}
              className={
                isNight
                  ? "bg-[#111a38] text-slate-100"
                  : "bg-white text-gray-700"
              }
            >
              {subject.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label
          className={`text-xs font-bold uppercase ${isNight ? "text-slate-300" : "text-gray-500"}`}
        >
          Gợi ý
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Chủ đề hoặc ghi chú ngắn..."
          className={`rounded-xl border px-3 py-2 text-sm ${
            isNight
              ? "border-[#7d95e2]/45 bg-[#111a38] text-slate-100 placeholder:text-slate-400"
              : "border-gray-200 bg-white text-gray-700 placeholder:text-gray-400"
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-[#4ecdc4] px-4 py-2 text-sm font-bold text-white transition hover:scale-105 disabled:opacity-60"
      >
        Tạo quiz
      </button>
    </form>
  );
};

export default QuizGeneratorForm;
