import React from "react";
import QuizPanel from "./components/QuizPanel";

const QuizTestPage = () => {
  return (
    <div className="h-screen w-full">
      <QuizPanel interactionId={1} onClose={() => {}} />
    </div>
  );
};

export default QuizTestPage;
