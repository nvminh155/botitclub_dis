const { ApplicationCommandOptionType } = require("discord.js");

module.exports = [
  {
    name: "channel_name",
    description: "Tên kênh mà cuộc thi sẽ được thông báo",
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
      "Danh sách câu hỏi [{correct: 'A', text: 'Câu hỏi', choices: [{id: 'B',text: 'Câu trả lời A'}, ...]}]",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "xp_num",
    description:
      "Người nộp bài nhận được xp điểm kinh nghiệm nếu trả lời đúng >= num",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "end_date",
    description: "Thời gian kết thúc quiz (ví dụ: dd/MM/yyyy HH:mm) )",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
];
