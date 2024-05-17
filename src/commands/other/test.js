const {
    SlashCommandBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const languageVi = require("../../../language/vi");
  
  module.exports = {
    data: () => {
      return new SlashCommandBuilder()
      .setName("test")
      .setDescription("CHECKED TEST")
    },
    async excute(params) {
      const { interaction } = params;
      await interaction.deferReply();
      await interaction.editReply("TEST SUCCESS");
    },
  };
  