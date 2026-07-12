import { AttachmentBuilder } from "discord.js";

export default {
    customId: "userInfo-profil",
    execute: async (client, int, embed, emojis) => {
        const userId = int.customId;

        let kullanici;
        let status = "offline"; // varsayılan: presence bilgisi yoksa

        // --- 1. Önce guild üzerinden member çekmeyi dene (status bilgisi için) ---
        if (int.guild) {
            try {
                const member = await int.guild.members.fetch(userId);
                kullanici = member.user;
                status = member.presence?.status ?? "offline";
            } catch (error) { }
        }

        // --- 2. Guild yoksa (DM) ya da fetch başarısız olduysa client'tan çek ---
        if (!kullanici) {
            try {
                kullanici = await client.users.fetch(userId);
                // client.users.fetch ile presence bilgisi asla gelmez, status "offline" kalır
            } catch (error) {
                console.log(error);
                return await int.update({
                    embeds: [embed.setDescription("Kullanıcı bilgilerine ulaşılamadı.")],
                    components: [],
                });
            }
        }

        // --- Görsel oluşturma ---

        const buffer = await global.functions.generateProfileCard({ user: kullanici, status });
        const attachment = new AttachmentBuilder(buffer, { name: "cabbarxdd.png" });

        await int.update({
            embeds: [
                embed
                    .setDescription(`${kullanici.username} adlı kullanıcının profil kartı`)
                    .setImage("attachment://cabbarxdd.png"),
            ],
            files: [attachment],
        });
    },
};