import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export default {
    customId: "userInfo-avatar",
    execute: async (client, int, embed, emojis) => {

        const result = await global.functions.resolveUser(client, int, int.customId);

        if (!result) {
            return await int.update({
                embeds: [embed.setDescription("Kullanıcı bilgilerine ulaşılamadı.")],
                components: [],
            });
        }

        const { user, status } = result;

        const userInfoMenü = global.functions.buildUserInfoMenu(int.customId, "userInfo-avatar"); // aktif seçenek artık "profil"

        const embeds = [
            embed
                .setAuthor({ name: int.user.globalName || int.user.username, iconURL: int.user.displayAvatarURL() })
                .setDescription(`${user.globalName || user.username} isimli kullanıcıya ait avatar.\n[🔗 Avatar Url](${user.displayAvatarURL({ size: 1024 })})`)
                .setImage(user.displayAvatarURL({ size: 1024 })),
        ]

        await int.update({ embeds, components: [userInfoMenü], attachments: [] });

    }
}