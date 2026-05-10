import axiosClient from "../../../api/axiosClient.js";

const PATH = "/study-activity";

const OPTION_TYPE = "MULTIPLE_CHOICE_QUESTIONS_CHOICE";

/**
 * Transform StudyActivityOutputComplete (exercise) thành dạng QuizQuestion
 */
export const transformBackendQuiz = (studyActivityComplete) => {
  if (!studyActivityComplete || !Array.isArray(studyActivityComplete.items)) {
    return [];
  }

  return studyActivityComplete.items.map((exerciseItem) => {
    const contents = Array.isArray(exerciseItem.contents)
      ? exerciseItem.contents
      : [];

    const options = contents.map((content) => ({
      id: content.id,
      content: content.content,
      isCorrect: content.is_correct ?? false, // Sẽ là null nếu chưa nộp bài
    }));

    return {
      id: exerciseItem.id,
      studyActivityId: studyActivityComplete.id,
      quizName: studyActivityComplete.name,
      quizDescription: studyActivityComplete.description,
      question: exerciseItem.question,
      maxScore: exerciseItem.max_score,
      userScore: exerciseItem.user_score,
      attempt: exerciseItem.attempt,
      options,
    };
  });
};

/**
 * Tạo quiz mới từ subject + context
 */
export const createQuiz = async (interactionId, quizParams) => {
  const { subject = "ENGLISH", context = "" } = quizParams || {};

  // Build prompt từ subject + optional context
  let promptText = `Tạo 5 câu trắc nghiệm cho môn ${subject}`;
  if (context.trim()) {
    promptText += ` về: ${context}`;
  }

  const payload = {
    prompt: promptText,
    activity_type: "EXERCISE",
    activity_format: "MULTIPLE_CHOICE_QUESTIONS",
    subject_type: subject,
  };

  const response = await axiosClient.post(
    `${PATH}/${interactionId}/create`,
    payload,
  );

  return transformBackendQuiz(response.data);
};

/**
 * Lấy một quiz chi tiết
 */
export const readQuiz = async (id) => {
  try {
    const response = await axiosClient.get(`${PATH}/${id}`);
    return transformBackendQuiz(response.data);
  } catch (error) {
    console.error("Error reading quiz:", error);
    return [];
  }
};

/**
 * Lấy tất cả quiz trong một interaction (chỉ EXERCISE loại)
 */
export const readAllQuizzes = async (interactionId) => {
  try {
    const response = await axiosClient.get(`${PATH}/${interactionId}/`);
    const activities = Array.isArray(response.data) ? response.data : [];

    // Filter chỉ lấy exercises format MULTIPLE_CHOICE_QUESTIONS
    const quizActivities = activities.filter(
      (activity) => activity.activity_type === "EXERCISE",
    );

    // Lấy chi tiết từng activity
    const completeActivities = await Promise.all(
      quizActivities.map((activity) => readQuiz(activity.id)),
    );

    return completeActivities.flat();
  } catch (error) {
    console.warn("Error reading all quizzes:", error);
    return [];
  }
};

/**
 * Xóa quiz
 */
export const deleteQuiz = async (quizId) => {
  try {
    const response = await axiosClient.delete(`${PATH}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

/**
 * Submit câu trả lời cho một exercise item
 */
export const submitAnswer = async (exerciseItemId, attempt) => {
  try {
    const response = await axiosClient.patch(
      `${PATH}/${exerciseItemId}/answer`,
      { attempt },
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};

/**
 * Nộp bài quiz (submit entire quiz)
 */
export const submitQuiz = async (quizId) => {
  try {
    const response = await axiosClient.patch(`${PATH}/${quizId}/submit`);
    return transformBackendQuiz(response.data);
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};
