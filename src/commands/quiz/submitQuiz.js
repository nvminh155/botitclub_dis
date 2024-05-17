const { SlashCommandBuilder } = require("discord.js");
const languageVi = require("../../../language/vi");
const options = require("./variables/optionsSubmitQuiz");
const getChannelByName = require("../../../utils/getChannelByName");
const QuizModel = require("../../models/Quiz");
const parseDate = require("../../../utils/parseDate");
const shortid = require("shortid");
const formatText = require("../../../utils/formatText");
const QuizSubmission = require("../../models/QuizSubmission");
const Level = require("../../models/Level");

module.exports = {
  data: () => {
    const command = new SlashCommandBuilder()
      .setName("submit_quiz")
      .setDescription("Nộp bài trắc nghiệm");
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
    const { user } = interaction;
    await interaction.deferReply();
    try {
      const [quizId, answers] = interaction.options._hoistedOptions.map(
        (op) => op.value
      );
      // console.log(quizId, answers);

      const quiz = await QuizModel.findOne({ quizId });
      const check_submitted = await QuizSubmission.findOne({ userId: user.id, quizId });
      // console.log("🚀 ~ excute ~ check_submitted:", check_submitted)

      if (check_submitted) {
        await interaction.editReply("Bạn chỉ được làm một lần");
        return;
      }

      if (quiz.questions.length !== answers.split(",").length) {
        await interaction.editReply(
          "Số lượng câu trả lời không đúng với số lượng câu hỏi !!!"
        );
        return;
      }

      const correct = answers.split(",").filter((answer, index) => {
        return (
          answer.trim().toLowerCase() ===
          quiz.questions[index].correctId.toLowerCase()
        );
      });
      await interaction.editReply(
        `🎉 Bạn đúng ***${correct.length}/${quiz.questions.length}*** câu hỏi 🎉`
      );
      if (correct.length >= quiz.requireCorrect) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const channel = guild.channels.cache.get(interaction.channelId);
        await channel.send({
          content: `Bạn nhận được ${quiz.xp} điểm kinh nghiệm`,
        });
        await Level.findOneAndUpdate(
          { userId: user.id },
          { $inc: { xp: quiz.xp } },
          { upsert: true }
        );
      }
      const newQuizSubmission = new QuizSubmission({
        submissionId: shortid.generate(),
        quizId,
        userId: user.id,
        answers: answers.split(",").map((ans) => ans.trim()),
        createdAt: Date.now().toString(),
      });
      await newQuizSubmission.save();
      //   const channel = await getChannelByName(client, channel_name);
      //   await channel.send({ content: "" });
    } catch (err) {
      console.log(err);
      await interaction.editReply(
        "Có lỗi xảy ra vui lòng kiểm tra lại các tham số hoặc cú pháp !!!"
      );
    }
  },
};
