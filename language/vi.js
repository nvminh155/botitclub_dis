module.exports = {
  global: {
    welcome: (name = "USER") =>
      `Xin chào **${name} !** Rất vui khi bạn đã tham gia **CLB_IT**`,
  },
  verify: {
    description: "Xác minh tài khoản của bạn với Mã Số Sinh Viên",
    require:
      "Để thuận tiện trao đổi, bạn vui lòng xác minh bản thân với Mã Số Sinh Viên tại đây để tiếp tục sử dụng !!! Nếu trong vòng 1 phút bạn không xác minh, bạn sẽ bị **KICK** và phải tham gia lại từ đầu. \n\n Vui lòng đọc hướng dẫn để thực hiện. Trân trọng !",
    instrucsion:
      "**Hướng dẫn :** Gõ lệnh **/verify** sau đó nhập mã số sinh viên của bạn vào **type_id** để xác minh tài khoản",
    accept: "Xác minh người dùng thành công",
    reject: "Xác minh người dùng thất bại ! Vui lòng kiểm tra lại ***id*** và thử lại !",
    timeout: "Hết thời gian xác minh, vui lòng thử lại",
    verifyed: "Bạn đã xác minh tài khoản rồi !",
  },
  ranks: {
    descriptions: {
      rank_list: "Xem danh sách xếp hạng hiện tại",
      rank: "Xem xếp hạng của một người chơi",
    }
  },
  contest: {
    "set_contest": {
      description: "Gửi thông tin cuộc thi vào kênh khác với url tin nhắn",
      success: "Tạo cuộc thi thành công",
    }
  }
};
