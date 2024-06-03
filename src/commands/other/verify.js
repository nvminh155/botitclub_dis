const {
  SlashCommandBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const languageVi = require("../../../language/vi");
const User = require("../../models/User");
const UserDiscord = require("../../models/UserDiscord");

const allowedRoles = [];

// {
//   "classId": "D13HHC01",
//   "displayName": "Lê Văn Thường",
//   "name": "Thường",
//   "surname": "Lê Văn",
//   "major": "ĐH Hóa học chuyên ngành hữu cơ",
//   "email": "1324401120100@student.tdmu.edu.vn"
// },

module.exports = {
  data: () => {
    return new SlashCommandBuilder()
      .setName("verify")
      .setDescription(languageVi.verify.description)
      .addStringOption((option) =>
        option
          .setName("type_id")
          .setDescription("Nhập mã số sinh viên của bạn để xác minh tài khoản")
          .setRequired(true)
      );
  },
  async excute(params) {
    const { interaction } = params;
    await interaction.deferReply();
    const student_id = interaction.options.getString("type_id");

    const student = await User.findOne({ email: `${student_id}@student.tdmu.edu.vn` });
    if (!student) {
      await interaction.editReply(languageVi.verify.reject);
      return;
    }
    const { user } = interaction;
    const checkExitUserDiscord = await UserDiscord.findOne({
      student_id: student_id,
    });

    if (checkExitUserDiscord) {
      if (checkExitUserDiscord.userId === user.id) {
        await interaction.editReply("Bạn đã xác minh tài khoản trước đó !!! Nếu có sự nhầm lẫn vui lòng liên hệ với ***ADMIN***");
      } else {
        await interaction.editReply(
          "Mã số sinh viên đã được xác minh bởi người khác !!!"
        );
      }
      return;
    }
    
    const mainUser = await UserDiscord.findOne({ userId: user.id });
    if (mainUser && mainUser.student_id) {
      await interaction.editReply("Bạn đã xác minh tài khoản trước đó !!! Nếu có sự nhầm lẫn vui lòng liên hệ với ***ADMIN***");
      return;
    }
    const verifyUserDiscord = await UserDiscord.findOneAndUpdate(
      { userId: user.id },
      { student_id: student_id }
    );

    await interaction.guild.roles.cache.forEach(async (role) => {
      const { id, name } = role;
      console.log(name, `D${student_id.slice(0, 2)}`);
      if (name === `D${student_id.slice(0, 2)}`) {
        await interaction.member.roles.add(role);
       
      } 
    });
    await interaction.guild.roles.cache.forEach(async (role) => {
      const { id, name } = role;
      if (name === `Khách`) {
        await interaction.member.roles.remove(role);
       
      } 
    });
    await interaction.editReply(languageVi.verify.accept);
  },
};
