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

// Map data from backend, including user_score and max_score
export const transformExerciseItem = (item) => ({
  id: item.id,
  text: item.question,
  maxScore: item.max_score,
  userScore: item.user_score,
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

// Compute final score using accurate graded values from backend
const parseScoreValue = (value) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const normalizeScorePayload = (payload) => {
  if (!payload) return {};
  if (typeof payload === "number") return { totalScore: payload };
  if (typeof payload !== "object") return {};

  return {
    totalScore: parseScoreValue(payload.total_score ?? payload.totalScore),
    totalMaxScore: parseScoreValue(
      payload.total_max_score ?? payload.totalMaxScore,
    ),
    percent: parseScoreValue(
      payload.percent ?? payload.score_percent ?? payload.percentScore,
    ),
    correct: parseScoreValue(payload.correct ?? payload.correctCount),
    total: parseScoreValue(payload.total ?? payload.totalQuestions),
  };
};

export const computeScoreFromQuestions = (questions) => {
  let totalScore = 0;
  let totalMaxScore = 0;
  let correct = 0;

  questions.forEach((q) => {
    totalMaxScore += q.maxScore || 0;
    totalScore += q.userScore || 0;
    if (q.userScore !== null && q.userScore !== undefined && q.maxScore) {
      if (q.userScore >= q.maxScore) correct += 1;
    }
  });

  return {
    totalScore,
    totalMaxScore,
    percent:
      totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
    correct,
    total: questions.length,
  };
};

export const transformStudyActivityDetail = (activity) => {
  const questions = (activity.items || []).map(transformExerciseItem);

  const computedScore = computeScoreFromQuestions(questions);
  const topLevelScore = {
    totalScore: parseScoreValue(activity.total_score ?? activity.totalScore),
    totalMaxScore: parseScoreValue(
      activity.total_max_score ?? activity.totalMaxScore,
    ),
    percent: parseScoreValue(activity.percent ?? activity.score_percent),
    correct: parseScoreValue(activity.correct ?? activity.correctCount),
    total: parseScoreValue(activity.total ?? activity.totalQuestions),
  };
  const payloadScore = normalizeScorePayload(activity.score);
  const mergedScore = { ...topLevelScore, ...payloadScore };

  // Calculate score only if the user has submitted the quiz
  const score = activity.is_submitted
    ? {
        totalScore: mergedScore.totalScore ?? computedScore.totalScore,
        totalMaxScore: mergedScore.totalMaxScore ?? computedScore.totalMaxScore,
        percent: mergedScore.percent ?? computedScore.percent,
        correct: mergedScore.correct ?? computedScore.correct,
        total: mergedScore.total ?? computedScore.total,
      }
    : null;

  return {
    ...transformStudyActivitySummary(activity),
    questions,
    score,
    hasDetails: true,
  };
};

// Helper for optimistic UI updates
export const mergeExerciseItem = (quiz, updatedItem) => {
  if (!quiz) return null;
  return {
    ...quiz,
    questions: quiz.questions.map((q) =>
      q.id === updatedItem.id ? updatedItem : q,
    ),
  };
};
