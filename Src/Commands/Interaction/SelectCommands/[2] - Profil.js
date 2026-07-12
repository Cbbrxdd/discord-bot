import { AttachmentBuilder } from "discord.js";

export default {
    customId: "userInfo-profil",
    execute: async (client, int, embed, emojis) => {
        const result = await global.functions.resolveUser(client, int, int.customId);

        if (!result) {
            return await int.update({
                embeds: [embed.setDescription("Kullanıcı bilgilerine ulaşılamadı.")],
                components: [],
            });
        }

        const { kullanici, status } = result;

        const buffer = await global.functions.generateProfileCard({ user: kullanici, status });
        const attachment = new AttachmentBuilder(buffer, { name: "cabbarxdd.png" });

        const userInfoMenü = global.functions.buildUserInfoMenu(int.customId, "userInfo-profil"); // aktif seçenek artık "profil"

        await int.update({
            embeds: [
                embed
                    .setDescription(`${kullanici.username} adlı kullanıcının profil kartı`)
                    .setImage("attachment://cabbarxdd.png"),
            ],
            components: [userInfoMenü], // bunu eklemeyi unutma!
            files: [attachment],
        });
    },
};