const { Schema, model } = require("mongoose");

const rankingQuizFastSchema = new Schema({
  quizId: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: "",
  },
  point: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: String,
    default: "",
  },
});

module.exports = model("RankingQuizFast", rankingQuizFastSchema);
