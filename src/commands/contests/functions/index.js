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
      await interaction.reply(
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
        const newContest = new Contest({contestID: shortId.generate(), title, });
  
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
                  messageReg.edit({embeds: [onChangeRegisterContest(reaction, messageReg, user, 9)]});
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
                  msg.reply(`Collected ${collected.size} reactions`);
                });
              });
          });
  
        await interaction.reply(`Đã gửi cuộc thi vào kênh ${channel_name} !!!`);
      })
      .catch((err) => {
        interaction.reply(
          `Có lỗi xảy ra ! Vui lòng kiểm tra lại các tham số hoặc cú pháp !`
        );
        console.log(err);
      });
  };