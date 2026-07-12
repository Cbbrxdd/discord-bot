import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

export default {
  name: "ping",
  commandData: new SlashCommandBuilder().setName("ping").setDescription("Bot'un ve Discord'un ping değerlerini gönderir."),
  execute: async (client, int, embed, emojis) => {
    const sent = await int.followUp({embeds: [new EmbedBuilder().setDescription("⏳Ping Hesaplanıyor...").setColor(Colors.Gold)]});

    await int.editReply({
      embeds: [
        new EmbedBuilder().setColor(Colors.Green).setFields([
          {
            name: `${emojis("917756discord")} Discord Ping`,
            value: `${client.ws.ping}ms`,
            inline: true,
          },
          {
            name: `\u200b`,
            value: `\u200b`,
            inline: true,
          },
          {
            name: `${emojis("521449bot")} Bot Ping`,
            value: `${sent.createdTimestamp - int.createdTimestamp}ms`,
            inline: true,
          },
        ]),
      ],
    });
  },
};