const {
  SlashCommandBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const languageVi = require("../../../language/vi");
const Level = require("../../models/Level");
const canvacord = require("canvacord");
const formatText = require("../../../utils/formatText");

module.exports = {
  data: () => {
    return new SlashCommandBuilder()
      .setName("level")
      .setDescription("Xem level của bạn");
  },

  async excute(params) {
    const { interaction } = params;

    await interaction.deferReply();
    const { user } = interaction;
    console.log("🚀 ~ excute ~ interaction:", interaction);

    const userLevel = await Level.findOne({
      guildId: interaction.guildId,
      userId: user.id,
    });

    if (!userLevel) {
      await interaction.editReply({ content: "Chua co level" });
      return;
    }

    const allLevel = await Level.find({ guildId: interaction.guildId });
    allLevel.sort((a, b) => {
      if (a.level === b.level) return b.xp - a.xp;
      return b.level - a.level;
    });

    const currentRank = allLevel.findIndex((lvl) => lvl.userId === user.id) + 1;

    // const rank = new canvacord.RankCardBuilder()
    //   .setRank(currentRank.toString())
    //   .setAvatar(user.displayAvatarURL({ dynamic: true, size: 256 }))
    //   .setLevel(userLevel.level.toString())
    //   .setCurrentXP(userLevel.xp.toString())
    //   .setRequiredXP((100 * userLevel.level).toString())
    //   .setUsername(user.globalName);

    await interaction
      .editReply(
        formatText(
          ["codefix"],
          `🌸 Username: ${user.globalName}\n🎖️ RANK #${currentRank}\tLevel ${
            userLevel.level
          }\n🏁 Process: ${userLevel.xp}/${userLevel.level * 100}`
        )
      )
      .then(() => {});
  },
};
