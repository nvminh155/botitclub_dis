const { Schema, model } = require("mongoose");

const codeDailySchema = new Schema({
  dailyId: {
    type: String,
    default: "",
  },
  point: {
    type: Number,
    default: 0,
  },
  ranking: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = model("CodeDaily", codeDailySchema);
