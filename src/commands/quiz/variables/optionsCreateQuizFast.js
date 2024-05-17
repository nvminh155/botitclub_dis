const { ApplicationCommandOptionType } = require("discord.js");

module.exports = [
  {
    name: "channel_name",
    description: "Tên kênh mà cuộc thi sẽ được gửi vào",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "description",
    description: "Mô tả quiz",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "questions",
    description:
      "Danh sách câu hỏi",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "xp",
    description:
      "Số kinh nghiệm nhận được",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
];
