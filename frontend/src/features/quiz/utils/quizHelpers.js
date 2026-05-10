export const SUBJECTS = [
  { id: "ENGLISH", label: "Tieng Anh" },
  { id: "MATH", label: "Toan" },
  { id: "VIETNAMESE", label: "Tieng Viet" },
];

const QUIZ_BANK = {
  ENGLISH: [
    {
      id: "en-1",
      text: "Choose the correct word: She ___ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correctIndex: 1,
    },
    {
      id: "en-2",
      text: "Which sentence is correct?",
      options: [
        "He don't like apples.",
        "He doesn't likes apples.",
        "He doesn't like apples.",
        "He not like apples.",
      ],
      correctIndex: 2,
    },
    {
      id: "en-3",
      text: "Choose the synonym of 'happy'.",
      options: ["sad", "angry", "glad", "tired"],
      correctIndex: 2,
    },
    {
      id: "en-4",
      text: "Fill in the blank: I have lived here ___ 2020.",
      options: ["since", "for", "by", "from"],
      correctIndex: 0,
    },
    {
      id: "en-5",
      text: "Which word is a noun?",
      options: ["run", "beautiful", "teacher", "quickly"],
      correctIndex: 2,
    },
  ],
  MATH: [
    {
      id: "math-1",
      text: "5 + 7 = ?",
      options: ["10", "11", "12", "13"],
      correctIndex: 2,
    },
    {
      id: "math-2",
      text: "Which is the smallest number?",
      options: ["0.5", "0.05", "0.15", "0.25"],
      correctIndex: 1,
    },
    {
      id: "math-3",
      text: "A rectangle has width 4 and height 3. Area = ?",
      options: ["7", "12", "14", "24"],
      correctIndex: 1,
    },
    {
      id: "math-4",
      text: "12 / 3 = ?",
      options: ["2", "3", "4", "5"],
      correctIndex: 2,
    },
    {
      id: "math-5",
      text: "Which number is prime?",
      options: ["9", "12", "15", "17"],
      correctIndex: 3,
    },
  ],
  VIETNAMESE: [
    {
      id: "vi-1",
      text: "Tu nao la danh tu?",
      options: ["chay", "dep", "hoc sinh", "nhanh"],
      correctIndex: 2,
    },
    {
      id: "vi-2",
      text: "Chon tu dong nghia voi 'bat dau'.",
      options: ["ket thuc", "khoi dau", "dung", "dap"],
      correctIndex: 1,
    },
    {
      id: "vi-3",
      text: "Cau nao dung chinh ta?",
      options: [
        "troi nang dep",
        "troi nangdep",
        "troi nang dep!",
        "troi nang dep?",
      ],
      correctIndex: 0,
    },
    {
      id: "vi-4",
      text: "Tu trai nghia voi 'cao' la gi?",
      options: ["thap", "rong", "to", "dai"],
      correctIndex: 0,
    },
    {
      id: "vi-5",
      text: "Cau nao la cau hoi?",
      options: [
        "Hom nay troi dep.",
        "Ban ten gi?",
        "Toi an com.",
        "Chung ta di hoc.",
      ],
      correctIndex: 1,
    },
  ],
};

const toSubjectLabel = (subjectType) =>
  SUBJECTS.find((item) => item.id === subjectType)?.label || "Khac";

export const buildQuizFromBank = ({ subjectType, prompt }) => {
  const now = new Date();
  const questions = QUIZ_BANK[subjectType] || [];

  return {
    id: `quiz-${now.getTime()}`,
    subjectType,
    title: `Quiz ${toSubjectLabel(subjectType)}`,
    prompt: prompt || "",
    createdAt: now.toISOString(),
    isSubmitted: false,
    score: null,
    answers: {},
    questions,
  };
};

export const computeScore = (quiz) => {
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((count, question) => {
    const selected = quiz.answers[question.id];
    return selected === question.correctIndex ? count + 1 : count;
  }, 0);

  return {
    total,
    correct,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
};
