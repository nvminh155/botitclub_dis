const { Schema, model } = require("mongoose");

const userDiscordSchma = new Schema({
  userId: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
  globalName: {
    type: String,
    default: "",
  },
  student_id: {
    type: String,
    default: "",
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
});

module.exports = model("UserDiscord", userDiscordSchma);
