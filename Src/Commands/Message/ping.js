import { EmbedBuilder, Colors, Embed } from "discord.js";


export default {
  name: "ping",
  execute: async (msg, args, client, embed, emojis) => {
    const sent = await msg.reply({
      embeds: [new EmbedBuilder().setDescription("⏳Ping Hesaplanıyor...").setColor(Colors.Gold)],
    });

    const botPing = sent.createdTimestamp - msg.createdTimestamp;

    await sent.edit({
      embeds: [
        new EmbedBuilder().setColor(Colors.Green).setFields([
            { name: `${emojis("917756discord")} Discord Ping`, value: `${client.ws.ping}ms`, inline: true },
            { name: `${emojis("521449bot")} Bot Ping`, value: `${botPing}ms`, inline: true },
        ]),
      ],
    });
  },
};
