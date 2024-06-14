const {
  SlashCommandBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const languageVi = require("../../../language/vi");
const User = require("../../models/User");
const UserDiscord = require("../../models/UserDiscord");

module.exports = {
  data: () => {
    return new SlashCommandBuilder()
      .setName("find_student")
      .setDescription("Tag người dùng với mã số sinh viên")
      .addStringOption((option) =>
        option
          .setName("type_id")
          .setDescription("Nhập mã số sinh viên của bạn để xác minh tài khoản")
          .setRequired(true)
      )
  },

  async excute(params) {
    const { interaction } = params;
    await interaction.deferReply();
    const student_id = interaction.options.getString("type_id");

    const student = await UserDiscord.findOne({
      student_id
    });
    
    if(!student) {
      await interaction.editReply("Không tìm thấy người dùng ! Vui lòng kiểm tra lại mã số sinh viên");
      return;
    }

    await interaction.editReply(`Chọn ***${student.username}*** để tag user ${student_id}...`);
  },
};
