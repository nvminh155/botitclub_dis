require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 1505;
const mongoose = require("mongoose");
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  IntentsBitField,
} = require("discord.js");

const languageVi = require("./language/vi");
const UserDiscord = require("./src/models/UserDiscord");
const Level = require("./src/models/Level");
const commands = new Collection();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
//change
const commandFolders = fs.readdirSync("./src/commands");
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./src/commands/${folder}/${file}`);

    commands.set(command.data().name, command);
  }
}

(async () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
    })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas", err));
})();

client.on("messageCreate", async (message) => {
  // console.log("🚀 ~ client.on ~ message:", message);

  if (message.author.verified === false) {
    await message.delete();
    const channel = await client.channels.fetch(message.channelId);
    await channel.send(
      `Xin chào, ${message.author.globalName}! Vui lòng xác thực tài khoản discord!`
    );
    return;
  }
  if (
    message.channelId === "1239579703539666984" &&
    message.interaction === null &&
    message.author.bot === false
  ) {
    const channel = await client.channels.fetch("1239579703539666984");
    await channel.send(
      `Xin chào, ${message.author.globalName}! Vui lòng dùng lệnh /verify để xác thực!`
    );
    await message.delete();
    return;
  }
});

client.once("ready", async (c) => {
  console.log("ready client");

  // const guild = client.guilds.cache.get(GUILD_ID);
  // guild.roles.cache.forEach((role) => {
  //   const { id, name } = role;
  //   console.log("🚀 ~ guild.roles.cache.forEach ~ id, name:", id, name);
  // });
  // guild.channels.cache.forEach((channel) => {
  //   if (channel.name === "") {
  //     channel.send(
  //       `${languageVi.global.welcome()}\n\n${languageVi.verify.require}\n\n${
  //         languageVi.verify.instrucsion
  //       }`
  //     );
  //   } else if (channel.name === "tainguyen") {
  //   }
  // });

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  console.log("OKOKOKKK");
  if (interaction.isButton()) {
    console.log(
      "🚀 ~ client.on ~ interaction:",
      interaction.component.disabled
    );
  }
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;
  if (user.verified === false) {
    await interaction.reply(
      "Vui lòng xác thực tài khoản discord của bạn trước!"
    );
    return;
  }
  const command = commands.get(commandName);
  if (!command) return;

  try {
    await command.excute({ interaction, client });
  } catch (err) {
    console.log(err);
    await interaction.editReply("Co loi xay ra khi thuc hien lenh nay!");
  }
});

client.login(BOT_TOKEN).then(() => {
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  const commandsArray = commands.map((command) => command.data().toJSON());
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commandsArray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on("guildMemberAdd", async (member) => {
  // console.log("🚀 ~ client.on ~ member:", member);
  try {
    const { user } = member;
    console.log("ROLESMEMBER", user);
    if (user.verified === false) return;
    const userExist = await UserDiscord.findOne({ userId: user.id });
    if (userExist) {
      if (!userExist.student_id) {
        member.roles.add(
          member.guild.roles.cache.find((role) => role.name === "Khách")
        );
        member.guild.channels.cache
          .get("1240328743206129754")
          .send(
            `Chào mừng ***${user.globalName}*** đã ghé thăm CLB IT! Hãy đến kênh verify để xác thực trước nhé ^^`
          );
      } else {
        member.roles.add(
          member.guild.roles.cache.find(
            (role) => role.name === `D${userExist.student_id.slice(0, 2)}`
          )
        );
      }

      const exitUserLevel = await Level.findOne({ userId: user.id });
      if (exitUserLevel) return;
      const createLevel = new Level({
        guildId: member.guild.id,
        userId: user.id,
        level: 1,
        xp: 0,
      });
      await createLevel.save();
      return;
    }
    const newUserJoinGuild = new UserDiscord({
      userId: user.id,
      username: user.username,
      globalName: user.globalName,
    });
    await newUserJoinGuild
      .save()
      .then(() => {
        member.roles.add(
          member.guild.roles.cache.find((role) => role.name === "Khách")
        );
        member.guild.channels.cache
          .get("1240328743206129754")
          .send(
            `Chào mừng ***${user.globalName}*** đã ghé thăm CLB IT! Hãy đến kênh verify để xác thực trước nhé ^^`
          );
      })
      .catch((err) => {
        console.log(err);
      });

    const exitUserLevel = await Level.findOne({ userId: user.id });
    if (exitUserLevel) return;
    const createLevel = new Level({
      guildId: member.guild.id,
      userId: user.id,
      level: 1,
      xp: 0,
    });
    await createLevel.save();
  } catch (error) {
    // console.error(`${language.__n(`global.server_register_error`)} ${guild.name} (ID: ${guild.id})`, error);
  }
});

client.on("guildMemberRemove", async (member) => {
  try {
    // console.log("🚀 ~ client.on ~ me111mber:", member);
    const { user } = member;

    await UserDiscord.deleteOne({ userId: user.id });
  } catch (error) {
    console.log("🚀 ~ client.on ~ error:", error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
