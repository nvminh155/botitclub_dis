require("dotenv").config();
const { Client } = require("discord.js");
/**
 * @param {Client} client
 */

const {GUILD_ID} = process.env
module.exports = (client, channel_name) => {
  const guild = client.guilds.cache.get(GUILD_ID);
  const channel = guild.channels.cache.find(channel => {
    return channel.name === channel_name
  })
  
  return channel;
}