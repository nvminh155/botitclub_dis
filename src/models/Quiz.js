const { Schema, model } = require("mongoose");

const quizSchema = new Schema({
  quizId: {
    type: String,
    default: "",
  },
  questions: { type: Array, default: [] },
  xp: {
    type: Number,
    default: 0,
  },
  requireCorrect: {
    type: Number,
    default: 0,
  },
  quizType: {
    type: String,
    default: "normal",
  },
  end_date: {
    type: String,
    default: "",
  },
});

module.exports = model("Quiz", quizSchema);
