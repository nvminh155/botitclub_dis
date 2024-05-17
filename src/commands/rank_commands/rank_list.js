const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const languageVi = require("../../../language/vi");
const Level = require("../../models/Level");
const UserDiscord = require("../../models/UserDiscord");

module.exports = {
  data: () => {
    return new SlashCommandBuilder()
      .setName("rank_list")
      .setDescription(`${languageVi.ranks.descriptions.rank_list}`);
  },

  async excute(params) {
    const { interaction } = params;
    await interaction.deferReply();
    const allLevel = await Level.find({ guildId: interaction.guildId });
    allLevel.sort((a, b) => {
      if (a.level === b.level) return b.xp - a.xp;
      return b.level - a.level;
    });

    let rankList = allLevel.map( async (lvl, index) => {
      const member = await interaction.guild.members.fetch(lvl.userId);
      const {user} = member;
      if(index === 0) return `🥇\t\t${user.globalName}`
      else if(index === 1) return `🥈\t\t${user.globalName}`
      else if(index === 2) return `🥉\t\t${user.globalName}`
      return `#${index + 1}\t\t${user.globalName}`
    })

    Promise.all(rankList).then(async (rankTable) => {
      await interaction.editReply(`***Rank***\t***Username***\n\n` + rankTable.join("\n\n"))
    })
  },
};
