import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js"

export default {
    name: "avatar",
    flags: MessageFlags.Ephemeral,
    commandData: new SlashCommandBuilder().setName("avatar").setDescription("Kullanıcı avatarını verir.")
    .addUserOption(opt => opt.setName("kullanıcı").setDescription("Bir kullanıcı etiketleyin")),
    execute: async (client, int, embed, emojis) => {

        const kullanici = int.options.getUser("kullanıcı") ?? int.user;

        const embeds = [ embed.setAuthor({ name: int.user.globalName || int.user.username, iconURL: int.user.displayAvatarURL() }).setDescription(`${kullanici.globalName || kullanici.username} isimli kullanıcıya ait avatar.\n[🔗 Avatar Url](${kullanici.displayAvatarURL({ size: 1024 })})`).setImage(kullanici.displayAvatarURL({ size: 1024 }))]

        await int.followUp({ embeds });
    
    }
}