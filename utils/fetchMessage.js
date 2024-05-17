module.exports = async (client, url) => {
    console.log("🚀 ~ module.exports= ~ url:", url.split("/"), url.split("/").slice(-3))
    const [guildID, channelID, messageID] = url.split("/").slice(-3);
    console.log("🚀 ~ module.exports= ~ guildID, channelID, messageID:", guildID, channelID, messageID)
    const guild = await client.guilds.fetch(guildID);
    const channel = await guild.channels.fetch(channelID);
    const message = await channel.messages.fetch(messageID);

    return message;
}