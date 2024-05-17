const {
  SlashCommandBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const Level = require("../../models/Level");
const languageVi = require("../../../language/vi");
const randomNumber = require("../../../utils/randomNumber");
const calculateLevelXp = require("../../../utils/calculateLevelXp");

/**
 *
 */

module.exports = {
  data: () => {
    return new SlashCommandBuilder()
    .setName("work")
    .setDescription("WORK TO UP XP")
    .addStringOption((option) =>
      option
        .setName("xp")
        .setDescription("Nhập số xp muốn tăng")
        .setRequired(true)
    )
  },
  async excute(params) {
    const { interaction } = params;
    await interaction.deferReply();
    const query = {
      userID: interaction.user.id,
      guildID: interaction.member.guild.id,
    };
    const xpToGive = parseInt(interaction.options.getString("xp")) || 0;

    try {
      const userLevel = await Level.findOne(query);

      if (userLevel) {
        userLevel.xp += xpToGive;

        if (userLevel.xp >= calculateLevelXp(userLevel.level)) {
          userLevel.xp = 0;
          userLevel.level++;
          await interaction
            .editReply(
              `Xin chúc mừng ${interaction.user.globalName} đã thăng cấp lên cấp ${userLevel.level}`
            )
            .then(() => {});
        }

        await userLevel
          .save()
          .catch((err) => console.log("Qua trinh luu user level bi loi"));
      } else {
        const newUserLevel = new Level({
          ...query,
          xp: xpToGive,
        });
        await newUserLevel.save().catch((err) => {
          console.log("Add User Level Failed");
        });
      }
    } catch (err) {
      console.log("Error in work command");
      await interaction.editReply("Co loi xay ra").then(() => {});
    }
  },
};
