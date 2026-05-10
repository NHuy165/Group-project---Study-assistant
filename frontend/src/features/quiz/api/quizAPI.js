import { buildQuizFromBank, computeScore } from "../utils/quizHelpers";

const STORAGE_KEY = "quiz_store_v1";

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { interactions: {} };
    return JSON.parse(raw);
  } catch {
    return { interactions: {} };
  }
};

const writeStore = (store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const getInteractionBucket = (store, interactionId) => {
  const key = String(interactionId || "default");
  if (!store.interactions[key]) {
    store.interactions[key] = [];
  }
  return { key, quizzes: store.interactions[key] };
};

export const readQuizzes = async (interactionId) => {
  const store = readStore();
  const { quizzes } = getInteractionBucket(store, interactionId);
  return quizzes;
};

export const createQuiz = async (interactionId, data) => {
  const store = readStore();
  const { key, quizzes } = getInteractionBucket(store, interactionId);

  const quiz = buildQuizFromBank(data);
  const next = [quiz, ...quizzes];
  store.interactions[key] = next;
  writeStore(store);

  return quiz;
};

export const readQuiz = async (interactionId, quizId) => {
  const quizzes = await readQuizzes(interactionId);
  return quizzes.find((item) => item.id === quizId) || null;
};

export const deleteQuiz = async (interactionId, quizId) => {
  const store = readStore();
  const { key, quizzes } = getInteractionBucket(store, interactionId);
  store.interactions[key] = quizzes.filter((item) => item.id !== quizId);
  writeStore(store);
  return true;
};

export const submitAnswer = async (
  interactionId,
  quizId,
  questionId,
  selectedIndex,
) => {
  const store = readStore();
  const { key, quizzes } = getInteractionBucket(store, interactionId);
  const updated = quizzes.map((quiz) => {
    if (quiz.id !== quizId) return quiz;
    return {
      ...quiz,
      answers: { ...quiz.answers, [questionId]: selectedIndex },
    };
  });
  store.interactions[key] = updated;
  writeStore(store);

  return updated.find((quiz) => quiz.id === quizId) || null;
};

export const submitQuiz = async (interactionId, quizId) => {
  const store = readStore();
  const { key, quizzes } = getInteractionBucket(store, interactionId);
  const updated = quizzes.map((quiz) => {
    if (quiz.id !== quizId) return quiz;
    const score = computeScore(quiz);
    return { ...quiz, isSubmitted: true, score };
  });
  store.interactions[key] = updated;
  writeStore(store);

  return updated.find((quiz) => quiz.id === quizId) || null;
};
