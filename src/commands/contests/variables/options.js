const { ApplicationCommandOptionType } = require("discord.js");

module.exports = [
  {
    name: "channel_name",
    description: "Tên kênh mà cuộc thi sẽ được thông báo",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "title",
    description: "Tiêu đề của cuộc thi",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "message_link",
    description:
      "Sao chép link của tin nhắn chứa thông tin cuộc thi ( Chuột phải vào tin nhắn -> Sao chép liên kết )",
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
    name: "end_register_date",
    description: "Thời gian kết thúc đăng ký (ví dụ: dd/MM/yyyy HH:mm) )",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
];
