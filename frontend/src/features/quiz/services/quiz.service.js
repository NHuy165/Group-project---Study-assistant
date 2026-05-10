import * as quizAPI from "../api/quizAPI";

export const quizService = {
  readQuizzes: (interactionId) => quizAPI.readQuizzes(interactionId),
  createQuiz: (interactionId, data) => quizAPI.createQuiz(interactionId, data),
  readQuiz: (interactionId, quizId) => quizAPI.readQuiz(interactionId, quizId),
  deleteQuiz: (interactionId, quizId) =>
    quizAPI.deleteQuiz(interactionId, quizId),
  submitAnswer: (interactionId, quizId, questionId, selectedIndex) =>
    quizAPI.submitAnswer(interactionId, quizId, questionId, selectedIndex),
  submitQuiz: (interactionId, quizId) =>
    quizAPI.submitQuiz(interactionId, quizId),
};
