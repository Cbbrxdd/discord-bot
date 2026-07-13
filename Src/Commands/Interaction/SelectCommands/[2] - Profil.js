import { AttachmentBuilder, EmbedBuilder, Colors } from "discord.js";

export default {
    customId: "userInfo-profil",
    execute: async (client, int, embed, emojis) => {
        const result = await global.functions.resolveUser(client, int, int.customId, true);

        if (!result) {
            return await int.update({
                embeds: [embed.setDescription("Kullanıcı bilgilerine ulaşılamadı.")],
                components: [],
                attachments: [],
            });
        }

        const { user, account, member } = result;

        // --- 1. Görsel embed (eski, basit canvas — sen kendi haline döndüreceksin) ---
        const buffer = await global.functions.generateProfileCard(result);
        const attachment = new AttachmentBuilder(buffer, { name: "cabbarxdd.png" });

        const imageEmbed = embed
            .setTitle(`${user.globalName} adlı kullanıcının profil kartı`)
            .setImage("attachment://cabbarxdd.png")

        const infoEmbed = new EmbedBuilder().setColor(Colors.DarkBlue);
        const accountLines = [
            `${emojis("glowdotblue")} **Kullanıcı ID:** \`${account.id}\``,
            `${emojis("glowdotblue")} **Kullanıcı Adı:** \`${account.username}\``,
            `${emojis("glowdotblue")} **Görünen Ad:** \`${account.globalName ?? "yok"}\``,
            `${emojis("glowdotblue")} **Bot mu:** ${account.bot ? "Evet" : "Hayır"}`,
            `${emojis("glowdotblue")} **Hesap Oluşturulma:** <t:${Math.floor(account.createdTimestamp / 1000)}> (<t:${Math.floor(account.createdTimestamp / 1000)}:R>)`,
        ];

        if (account.flags && account.flags.length > 0) { accountLines.push(`${emojis("glowdotblue")} **Rozetler:** ${account.flags.join(", ")}`) }
        if (account.primaryGuild?.identityEnabled) { accountLines.push(`${emojis("glowdotblue")} **Sunucu Etiketi:** \`${account.primaryGuild.tag}\``) }
        if (account.collectibles?.nameplate) { accountLines.push(`${emojis("glowdotblue")} **Nameplate:** \`${account.collectibles.nameplate.asset}\``) }
        if (account.avatarDecorationData) { accountLines.push(`${emojis("glowdotblue")} **Avatar Dekorasyonu:** Var`) }
        if (account.accentColor) { accountLines.push(`${emojis("glowdotblue")} **Profil Rengi:** \`#${account.accentColor.toString(16).padStart(6, "0")}\``) }
        if (account.bannerURL) { accountLines.push(`${emojis("glowdotblue")} **Banner:** [Görseli Aç](${account.bannerURL})`) }

        // Sunucu bilgileri (sadece guild üzerinden alındıysa)
        if (member) {
            const memberLines = [
                `${emojis("glowdotblue")} **Sunucuya Katılım:** <t:${Math.floor(member.joinedTimestamp / 1000)}> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`,
                `${emojis("glowdotblue")} **Sunucu Takma Adı:** \`${member.nickname ?? "yok"}\``,
                `${emojis("glowdotblue")} **Rol Sayısı:** \`${member.roleCount}\``,
                `${emojis("glowdotblue")} **En Yüksek Rol:** ${member.highestRole.id !== int.guild.id ? `<@&${member.highestRole.id}>` : "yok"}`,
                `${emojis("glowdotblue")} **İzin Sayısı:** \`${member.permissionCount}\``,
                `${emojis("glowdotblue")} **Onay Bekliyor mu:** ${member.pending ? "Evet" : "Hayır"}`,
            ];

            if (member.premiumSince) { memberLines.push(`**Boost Ediyor:** <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`) }
            if (member.communicationDisabledUntil) { memberLines.push(`**Susturulma Bitişi:** <t:${Math.floor(new Date(member.communicationDisabledUntil).getTime() / 1000)}:R>`) }
            if (member.voice) { memberLines.push(`**Ses Kanalı:** <#${member.voice.channelId}> ${member.voice.mute ? "🔇" : ""} ${member.voice.deaf ? "🔕" : ""}`) }

            infoEmbed.setDescription(`### ${emojis("discord")} Hesap Bilgileri\n` + accountLines.join("\n") + "\n" + "### 🏠 Sunucu Bilgileri\n" + memberLines.join("\n"));

            // Rolleri ayrı bir alanda göster (çok fazla olabileceği için sınırlı)
            if (member.roles.length > 0) {
                const roleMentions = member.roles.slice(0, 15).map((r) => `<@&${r.id}>`).join(", ");
                infoEmbed.addFields({ name: `Roller (${member.roleCount})`, value: roleMentions || "Rol yok" });
            }

        } else {

            infoEmbed.setDescription(`### ${emojis("discord")} Hesap Bilgileri\n` + accountLines.join("\n") + "\n" + "### 🏠 Sunucu Bilgileri\n" + "Bu kullanıcı bir sunucu üzerinden alınmadı (DM ya da sunucuda bulunamadı), sunucuya özel veriler mevcut değil.");

        }

        const userInfoMenü = global.functions.buildUserInfoMenu(int.customId, "userInfo-profil");

        await int.update({
            embeds: [infoEmbed, imageEmbed],
            components: [userInfoMenü],
            files: [attachment],
            attachments: [],
        });
    },
};