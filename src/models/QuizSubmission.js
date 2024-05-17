const { Schema, model } = require("mongoose");

const quizSubmissionSchema = new Schema({
  submissionId: {
    type: String,
    default: "",
  },
  quizId: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: "",
  },
  answers: { type: Array, default: [] },
  createdAt: {
    type: String,
    default: "",
  },
});

module.exports = model("QuizSubmission", quizSubmissionSchema);
