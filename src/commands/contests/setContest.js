const {
  SlashCommandBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const shortId = require("shortid");

const parseDate = require("../../../utils/parseDate");
const fetchMessage = require("../../../utils/fetchMessage");
const languageVi = require("../../../language/vi");
const getChannelByName = require("../../../utils/getChannelByName");
const Contest = require("../../models/ContestRegister");
const options = require('./variables/options');

const addReactions = (message, reactions) => {
  message.react(reactions[0]);
  reactions.shift();

  if (reactions.length > 0) {
    setTimeout(() => {
      addReactions(message, reactions);
    }, 750);
  }
};

const onChangeRegisterContest = (reactionName, msg, user, userIdChange) => {
  const listRegister = Array.from({ length: 10 }, (_, i) => {
    return `#${i + 1} - User: ${i + 1}`;
  })
    .filter((u) => !u.includes(`User: ${userIdChange}`))
    .join("\n\n");
  const ember_register_contest = new EmbedBuilder()
    .setTitle("DANH SÁCH ĐÃ ĐĂNG KÝ")
    .setDescription("\n\n\n" + listRegister + "");

  return ember_register_contest;
};
const onChangeReaction = (reacted, msg, user, isEnd = false) => {
  const reaction = msg.reactions.cache.find(
    (reaction) =>
      (!isEnd
        ? reaction.emoji.name !== reacted.emoji.name
        : reaction.emoji.name === reacted.emoji.name) &&
      reaction.users.cache.has(user.id)
  );

  if (reaction) {
    reaction.users
      .remove(user.id)
      .then(() => console.log(`Removed reaction 🔥 from user ${user.tag}`))
      .catch(console.error);
  }
};

const buildContestEmbed = async (
  client,
  channel,
  channel_name,
  title,
  message_link,
  banner_link,
  timeout,
  interaction
) => {
  const currentDate = Date.now();
  const timeoutDate = parseDate(timeout);
  if (currentDate > timeoutDate) {
    await interaction.editReply(
      "Thời gian kết thúc phải lớn hơn thời gian hiện tại !!!"
    );
    return;
  }
  await fetchMessage(client, message_link)
    .then(async (message) => {
      console.log("🚀 ~ .then ~ message:", message);
      return await fetchMessage(client, banner_link).then((banner) => {
        return {
          message: message.reactions.message.content || message.content,
          bannerUrl: banner.attachments.first().url,
        };
      });
    })
    .then(async (result) => {
      const newContest = new Contest({ contestID: shortId.generate(), title });

      const embed_banner = new EmbedBuilder()
        .setColor("#5e90ee")
        .setImage(result.bannerUrl);
      const embed_infoContest = new EmbedBuilder()
        .setColor("#5e90ee")
        .setTitle(title)
        .setDescription(result.message);
      const embed_actions = new EmbedBuilder().setTitle(
        "🔥 : Tham gia\n❌ : Không tham gia"
      );

      const listRegister = Array.from({ length: 10 }, (_, i) => {
        return `#${i + 1} - User: ${i + 1}`;
      }).join("\n\n");
      const ember_register_contest = new EmbedBuilder()
        .setTitle("DANH SÁCH ĐÃ ĐĂNG KÝ")
        .setDescription("\n\n\n" + listRegister + "");

      await channel
        .send({ embeds: [embed_banner, embed_infoContest, embed_actions] })
        .then(async (msg) => {
          console.log("MSG", msg);
          await addReactions(msg, ["🔥", "❌"]);
          const collectorFilter = (reaction, user) => {
            return (
              ["🔥", "❌"].includes(reaction.emoji.name) &&
              user.id !== msg.client.user.id
            );
          };
          const collector = msg.createReactionCollector({
            filter: collectorFilter,
            time: timeoutDate - currentDate,
            endDate: timeoutDate,
          });
          await channel
            .send({ embeds: [onChangeRegisterContest(null, null, null, null)] })
            .then(async (messageReg) => {
              collector.on("collect", async (reaction, user) => {
                await onChangeReaction(reaction, msg, user);
                messageReg.edit({
                  embeds: [
                    onChangeRegisterContest(reaction, messageReg, user, 9),
                  ],
                });
                // console.log("🚀 ~ collector.on ~ collected:");
                // collector.collected
                //   .get("🔥")
                //   .users.fetch()
                //   .then((res) => console.log(res.get(user.id)));
                await msg.edit(
                  `User ${user.tag} reacted with ${reaction.emoji.name}`
                );
              });

              collector.on("end", (collected) => {
                console.log("🚀 ~ collector.on ~ collected:", collected);
                collected
                  .get("🔥")
                  .users.fetch()
                  .then((res) => console.log(res));
                msg.editReply(`Collected ${collected.size} reactions`);
              });
            });
        });

      await interaction.editReply(`Đã gửi cuộc thi vào kênh ${channel_name} !!!`);
    })
    .catch((err) => {
      interaction.editReply(
        `Có lỗi xảy ra ! Vui lòng kiểm tra lại các tham số hoặc cú pháp !`
      );
      console.log(err);
    });
};

module.exports = {
  data: () => {
    const command = new SlashCommandBuilder()
      .setName("set-contest")
      .setDescription(languageVi.contest["set_contest"].description);
    options.forEach((op) => {
      command.addStringOption((option) =>
        option
          .setName(op.name)
          .setDescription(op.description)
          .setRequired(op.required)
      );
    });

    return command;
  },

  async excute(params) {
    const { interaction, client } = params;
    await interaction.deferReply();
    try {
      const [channel_name, title, message_link, banner_link, timeout] =
        interaction.options._hoistedOptions.map((op) => op.value);
      console.log(channel_name, message_link, banner_link);

      const channel = await getChannelByName(client, channel_name);

      buildContestEmbed(
        client,
        channel,
        channel_name,
        title,
        message_link,
        banner_link,
        timeout,
        interaction
      );
    } catch (err) {
      console.log(err);
      await interaction.editReply(
        "Có lỗi xảy ra vui lòng kiểm tra lại các tham số hoặc cú pháp !!!"
      );
    }
  },
};
