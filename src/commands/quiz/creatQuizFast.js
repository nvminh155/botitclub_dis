const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRow,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const languageVi = require("../../../language/vi");
const options = require("./variables/optionsCreateQuizFast");
const getChannelByName = require("../../../utils/getChannelByName");
const QuizModel = require("../../models/Quiz");
const parseDate = require("../../../utils/parseDate");
const shortid = require("shortid");
const formatText = require("../../../utils/formatText");
const formatDate = require("../.././../utils/formatDate");
const delay = require("../../../utils/delay");

module.exports = {
  data: () => {
    const command = new SlashCommandBuilder()
      .setName("create_quiz_fast")
      .setDescription("Trắc nghiệm (kahoot) ");
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
    const rolesCanUser = ["admin", "bcn"];
    const roles = interaction.member.guild.roles.cache.map((role) => role.name);
    const canUser = roles.find((role) =>
      rolesCanUser.includes(role.toLowerCase())
    );

    if (!canUser) {
      await interaction.editReply("Bạn không có quyền thực hiện lệnh này !!!");
      return;
    }
    try {
      const [channel_name, description, questions, xp] =
        interaction.options._hoistedOptions.map((op) => op.value);
      // console.log(channel_name, description, questions, xp);

      const newQuiz = new QuizModel({
        xp,
        requireCorrect: 0,
        questions: JSON.parse(questions),
        end_date: Date.now().toString(),
        quizId: shortid.generate(),
        quizType: "fast",
      });
      await newQuiz.save().then(async (quiz) => {
        // console.log("Quiz created", quiz);
        await interaction.editReply("CREATED QUIZ FAST SUCCESS");

        const channel = await getChannelByName(client, channel_name);
        const embedDescriptionQuiz = new EmbedBuilder()
          .setTitle(description)
          .setColor("#FF0000");
        await channel.send({ embeds: [embedDescriptionQuiz] });
        const threadSubmit = await channel.threads.create({
          name: `Quiz Fast - ${quiz.quizId} - ${formatDate(Date.now()).DDMYTS}`,
          autoArchiveDuration: 60, // 60 minutes
          reason: "Needed a separate thread for discussion",
          quizId: quiz.quizId,
        });
        
        async function get() {
          let noQuiz = 1;
          for (const ques of quiz.questions) {
            // const row = new ActionRowBuilder();
            // const buttons = ques.choices.map((choice, index) => {
            //   const button = new ButtonBuilder()
            //     .setCustomId(choice.id)
            //     .setLabel(choice.text);

            //   if (index === 0) button.setStyle(ButtonStyle.Primary);
            //   else if (index === 1) button.setStyle(ButtonStyle.Secondary);
            //   else if (index === 2) button.setStyle(ButtonStyle.Success);
            //   else if (index === 3) button.setStyle(ButtonStyle.Danger);

            //   return button;
            // });
            // row.addComponents(buttons);

            const formatListQuestion =
              `***QuizId: ${quiz.quizId}***\n` +
              formatText(["codefix"], `Ques ${noQuiz}: ${ques.text}`) +
              ques.choices
                .map((c, i) => {
                  return `${c.id}. ${c.text}`;
                })
                .join("\n");

            const embedSubmitted = new EmbedBuilder()
              .setTitle("Tên những người đã chọn đáp án")
              .setDescription("Chưa có ai")
              .setColor("#FF0000");

            await channel
              .send({
                content: formatListQuestion,
                embeds: [embedSubmitted],
              })
              .then(async (msg) => {
               
             
              });

            await delay(ques.time * 1000).then(async () => {
              noQuiz++;
            });
          }
        }

        get();
      });
    } catch (err) {
      console.log(err);
      await interaction.editReply(
        "Có lỗi xảy ra vui lòng kiểm tra lại các tham số hoặc cú pháp !!!"
      );
    }
  },
};
