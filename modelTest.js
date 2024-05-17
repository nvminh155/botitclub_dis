const QuizModel = require("./src/models/Quiz");
const newQuiz = new QuizModel({
  quizId: "quiz1",
  xp: 10,
  questions: [
    {
      correctId: "A",
      text: "What is the capital of France?",
      choices: [
        { id: "A", text: "Paris" },
        { id: "B", text: "Berlin" },
        { id: "C", text: "Madrid" },
        { id: "D", text: "Rome" },
      ],
    },
  ],
});
newQuiz.save();
