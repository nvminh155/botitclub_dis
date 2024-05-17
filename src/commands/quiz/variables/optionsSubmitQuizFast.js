const { ApplicationCommandOptionType } = require("discord.js");

module.exports = [
  {
    name: "quiz_id",
    description: "ID của quiz",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "answer",
    description: "Đáp án của người chơi (điền từ a->d)",
    type: ApplicationCommandOptionType.String,
    choices: [
      { name: "A", value: "A" },
      { name: "B", value: "B" },
      { name: "C", value: "C" },
      { name: "D", value: "D" },
    ],
    required: true,
  },
];
