const { SlashCommandBuilder } = require("discord.js");
const languageVi = require("../../../language/vi");
const options = require("./variables/optionsCodeDaily");
const CodeDaily = require("../../models/CodeDaily");
const getChannelByName = require("../../../utils/getChannelByName");

const buildDailyEmbed = async (
  client,
  channel,
  channel_name,
  message_link,
  banner_link,
  day,
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
      const embed_banner = new EmbedBuilder()
        .setColor("#5e90ee")
        .setImage(result.bannerUrl);
      const embed_infoContest = new EmbedBuilder()
        .setColor("#5e90ee")
        .setTitle(`Mỗi ngày một giờ lập trình - Ngày ${day}`)
        .setDescription(result.message);

      await channel
        .send({ embeds: [embed_banner, embed_infoContest] })
        .then(async (msg) => {});

      await interaction.editReply(
        `Đã gửi cuộc thi vào kênh ${channel_name} !!!`
      );
    }) //contienu
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
      .setName("a_code_daily")
      .setDescription("Vấn đề mỗi ngày");
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
    const { interaction } = params;
    await interaction.deferReply();
    try {
      const [channel_name, message_link, banner_link, day] =
        interaction.options._hoistedOptions.map((op) => op.value);
      console.log(channel_name, message_link, banner_link, day);

      const newCodeDaily = new CodeDaily({
        dailyId: `Ngày ${day}`,
        ranking: [],
      });
      await newCodeDaily.save().then(async () => {
        console.log("New CodeDaily created");
        const channel = await getChannelByName(client, channel_name);

        await channel.send({});
      });
      await interaction.editReply("PING SUCCESS");
    } catch (err) {
      console.log(err);
      await interaction.editReply(
        "Có lỗi xảy ra vui lòng kiểm tra lại các tham số hoặc cú pháp !!!"
      );
    }
  },
};
