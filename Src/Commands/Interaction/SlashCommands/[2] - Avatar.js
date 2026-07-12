import { SlashCommandBuilder } from "discord.js"

export default {
    name: "avatar",
    commandData: new SlashCommandBuilder().setName("avatar").setDescription("Kullanıcı avatarını verir.")
    .addUserOption(opt => opt.setName("kullanici").setDescription("Bir kullanıcı etiketleyin")),
    execute: async (client, int, embed, emojis) => {

        const kullanici = int.options.getUser("kullanici") ?? int.user;
        await int.followUp({ content: `Avatar: ${kullanici.displayAvatarURL({ size: 1024 })}` });
    
    }
}