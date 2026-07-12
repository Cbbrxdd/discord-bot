import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default {
  buildUserInfoMenu: (userId, activeValue = "userInfo-avatar") => {
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(userId)
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setEmoji("🧸")
            .setValue("userInfo-avatar")
            .setLabel("Avatar")
            .setDefault(activeValue === "userInfo-avatar"),
          new StringSelectMenuOptionBuilder()
            .setEmoji("🌐")
            .setValue("userInfo-profil")
            .setLabel("Profil")
            .setDefault(activeValue === "userInfo-profil"),
        ])
    );
  },
};