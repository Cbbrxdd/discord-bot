import { Events, EmbedBuilder, Colors, MessageFlags } from "discord.js";

const interactionHandlers = [
  { check: (i) => i.isChatInputCommand(), map: "SlashCommands", key: (i) => i.commandName },
  { check: (i) => i.isButton(), map: "ButtonCommands", key: (i) => i.customId },
  { check: (i) => i.isModalSubmit(), map: "ModalCommands", key: (i) => i.customId },
  { check: (i) => i.isStringSelectMenu(), map: "SelectCommands", key: (i) => i.values[0] },
];

export default {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    const client = interaction.client;
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkBlue)
      .setFooter({ text: `${client.user.username} 💞 Cabbarxdd`, iconURL: client.user.displayAvatarURL({ size: 1024 }) });

    const handler = interactionHandlers.find((h) => h.check(interaction));
    if (!handler) return;

    const command = client[handler.map].get(handler.key(interaction));
    if (!command) return;

    try {
      if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ flags: command.flags || 0 });
      }
      await command.execute(client, interaction, embed, global.functions.emojis);
    } catch (error) {
      console.error(error);
      await errorMessage(interaction, embed);
    }
  },
};

const errorMessage = async (interaction, embed) => {
  const payload = {
    embeds: [
      embed.setDescription(
        "Bir hata oluştu. Lütfen daha sonra tekrar deneyin. Sorun devam ederse destek ekibiyle iletişime geçiniz."
      ),
    ],
    flags: MessageFlags.Ephemeral
  };

  try {
    if (interaction.deferred || interaction.replied) {
      return await interaction.followUp(payload);
    }
    return await interaction.reply(payload);
  } catch (error) {
    console.error("Hata mesajı gönderilemedi:", error);
  }
};