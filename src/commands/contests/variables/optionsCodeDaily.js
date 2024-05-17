const { ApplicationCommandOptionType } = require("discord.js");

module.exports = [
  {
    name: "channel_name",
    description: "Tên kênh mà cuộc thi sẽ được thông báo",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "message_link",
    description:
      "Địa chỉ đề bài",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "banner_link",
    description:
      "Gửi ảnh vào khung chat -> Chuột phải -> Sao chép liên kết nếu không có ảnh nào thì ghi NONE",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "day",
    description:
      "Ngày thứ mấy của contest ? ",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
];
