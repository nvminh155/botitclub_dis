const { ApplicationCommandOptionType } = require("discord.js");

module.exports = [
  {
    name: "quiz_id",
    description: "ID của quiz",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "answers",
    description: "Đáp án của người chơi (ví dụ: câu 1->5 a,b,c,,e)",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
];
