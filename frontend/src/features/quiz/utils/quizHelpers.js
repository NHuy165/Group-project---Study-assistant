export const SUBJECTS = [
  { id: "ENGLISH", label: "Tieng Anh" },
  { id: "MATHS", label: "Toan" },
  { id: "VIETNAMESE", label: "Tieng Viet" },
];

const toSubjectLabel = (subjectType) =>
  SUBJECTS.find((item) => item.id === subjectType)?.label || "Khac";

const parseAttempt = (attempt) => {
  if (attempt === null || attempt === undefined || attempt === "") return null;
  const numberValue = Number(attempt);
  return Number.isNaN(numberValue) ? attempt : numberValue;
};

export const transformExerciseItem = (item) => ({
  id: item.id,
  text: item.question,
  maxScore: item.max_score,
  attemptId: parseAttempt(item.attempt),
  options: (item.contents || []).map((content) => ({
    id: content.id,
    content: content.content,
    isCorrect: content.is_correct ?? null,
  })),
});

export const transformStudyActivitySummary = (activity) => ({
  id: activity.id,
  name: activity.name,
  description: activity.description,
  prompt: activity.prompt,
  subjectType: activity.subject_type,
  activityType: activity.activity_type,
  activityFormat: activity.activity_format,
  createdAt: activity.created_at,
  isSubmitted: activity.is_submitted,
  submittedAt: activity.submitted_at,
  score: null,
  questions: [],
  hasDetails: false,
  title: activity.name || `Quiz ${toSubjectLabel(activity.subject_type)}`,
});

export const computeScoreFromQuestions = (questions) => {
  const scored = questions.filter((question) =>
    question.options.some((option) => option.isCorrect !== null),
  );
  const total = scored.length;
  if (total === 0) return { total: 0, correct: 0, percent: 0 };

  const correct = scored.reduce((count, question) => {
    const selected = question.attemptId;
    const matched = question.options.find((option) => option.id === selected);
    return matched?.isCorrect ? count + 1 : count;
  }, 0);

  return {
    total,
    correct,
    percent: Math.round((correct / total) * 100),
  };
};

export const transformStudyActivityDetail = (activity) => {
  const questions = (activity.items || []).map(transformExerciseItem);
  const score = activity.is_submitted
    ? computeScoreFromQuestions(questions)
    : null;

  return {
    ...transformStudyActivitySummary(activity),
    questions,
    score,
    hasDetails: true,
  };
};

export const mergeExerciseItem = (quiz, updatedItem) => {
  const nextQuestions = quiz.questions.map((question) =>
    question.id === updatedItem.id ? updatedItem : question,
  );

  return {
    ...quiz,
    questions: nextQuestions,
  };
};
