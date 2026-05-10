import React, { useState } from "react";
import { SUBJECTS } from "../utils/quizHelpers";

const QuizGeneratorForm = ({ onCreateQuiz, isLoading }) => {
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
      className="grid gap-3 rounded-2xl border border-white/30 bg-white/40 p-4"
    >
      <div className="grid gap-2">
        <label className="text-xs font-bold uppercase text-gray-500">
          Mon hoc
        </label>
        <select
          value={subjectType}
          onChange={(event) => setSubjectType(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          {SUBJECTS.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-bold uppercase text-gray-500">
          Goi y
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Chu de hoac ghi chu ngan..."
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-[#4ecdc4] px-4 py-2 text-sm font-bold text-white transition hover:scale-105 disabled:opacity-60"
      >
        Tao quiz
      </button>
    </form>
  );
};

export default QuizGeneratorForm;
