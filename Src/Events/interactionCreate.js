import { Events, EmbedBuilder, Colors, Embed } from "discord.js";

export default {
  name: Events.InteractionCreate,
  execute: async (int) => {


    const client = int.client;
    const embed = new EmbedBuilder()
    .setColor(Colors.DarkBlue)
    .setAuthor({ name: int.user.username, iconURL: int.user.avatarURL()})
    .setFooter({ text: `${client.user.username} 💞 Cabbarxdd`})

    return await int.reply({ embeds: [embed], emhemeral: true })

  },
};
