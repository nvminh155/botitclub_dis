const {
    SlashCommandBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const languageVi = require("../../../language/vi");
  
  module.exports = {
    data: () => {
      return new SlashCommandBuilder()
      .setName("ping")
      .setDescription("CHECKED PING")
    },
    async excute(params) {
      const { interaction } = params;
   
      await interaction.deferReply();
      await interaction.editReply("PING SUCCESS");
    },
  };
  