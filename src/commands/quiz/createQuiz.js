const { SlashCommandBuilder } = require("discord.js");
const languageVi = require("../../../language/vi");
const options = require("./variables/optionsCreateQuiz");
const getChannelByName = require("../../../utils/getChannelByName");
const QuizModel = require("../../models/Quiz");
const parseDate = require("../../../utils/parseDate");
const shortid = require("shortid");
const formatText = require("../../../utils/formatText");



module.exports = {
  data: () => {
    const command = new SlashCommandBuilder()
      .setName("create_quiz")
      .setDescription("Trắc nghiệm mỗi ngày");
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
    const roles = interaction.member.guild.roles.cache.map(role => role.name)
    const canUser = roles.find((role) =>
      rolesCanUser.includes(role.toLowerCase())
    );

    if (!canUser) {
      await interaction.editReply("Bạn không có quyền thực hiện lệnh này !!!");
      return;
    }
    try {
      const [channel_name, title, questions, xp_num, end_date] =
        interaction.options._hoistedOptions.map((op) => op.value);
      console.log(channel_name, title, questions, xp_num, end_date);

      const timestampEndDate = parseDate(end_date);
      const [xp, requireCorrect] = xp_num.split("_").map((num) => parseInt(num))
      const newQuiz = new QuizModel({
        xp,
        requireCorrect,
        questions: JSON.parse(questions),
        end_date: timestampEndDate.toString(),
        quizId: shortid.generate(),
      });
      await newQuiz.save().then(async (quiz) => {
        console.log("Quiz created", quiz);
        await interaction.editReply("CREATED QUIZ SUCCESS");

        const formatListQuestion =
          `***QuizId: ${quiz.quizId}***\n` +
          quiz.questions
            .map((q, index) => {
              return (
                formatText(["codefix"], `Ques ${index + 1}: ${q.text}`) +
                q.choices
                  .map((c, i) => {
                    return `${c.id}. ${c.text}`;
                  })
                  .join("\n")
              );
            })
            .join("\n");
        console.log("FORMAT", formatListQuestion);
        const channel = await getChannelByName(client, channel_name);
        await channel.send({ content: formatListQuestion });
      });
    } catch (err) {
      console.log(err);
      await interaction.editReply(
        "Có lỗi xảy ra vui lòng kiểm tra lại các tham số hoặc cú pháp !!!"
      );
    }
  },
};
