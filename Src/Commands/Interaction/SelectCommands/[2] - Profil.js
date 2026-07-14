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
            `${emojis("glowdotblue")} **Kullanıcı ID:** [**${account.id}**](https://dprm.click/)`,
            `${emojis("glowdotblue")} **Kullanıcı Adı:** [**${account.username}**](https://dprm.click/)`,
            `${emojis("glowdotblue")} **Görünen Ad:** <@${account.id}>`,
            `${emojis("glowdotblue")} **Hesap Oluşturulma:** <t:${Math.floor(account.createdTimestamp / 1000)}:D> (<t:${Math.floor(account.createdTimestamp / 1000)}:R>)`,
        ];


        if (account.bot) { accountLines.push(`${emojis("glowdotblue")} **Bot mu:** ${account.bot ? emojis("yes") : emojis("no")}`) }
        if (account.flags && account.flags.length > 0) {
            const badgeEmojis = account.flags
                .map((flag) => {
                    if (flag === "VerifiedBot") {
                        return `${emojis("verifiedbot1")}${emojis("verifiedbot2")}${emojis("verifiedbot3")}`;
                    }
                    return emojis(flag);
                })
                .filter(Boolean)
                .join(" ");

            if (badgeEmojis) {
                accountLines.push(`${emojis("glowdotblue")} **Rozetler:** ${badgeEmojis}`);
            }
        }
        if (account.primaryGuild?.identityEnabled) { accountLines.push(`${emojis("glowdotblue")} **Sunucu Etiketi:** \`${account.primaryGuild.tag}\``) }
        // if (account.collectibles?.nameplate) { accountLines.push(`${emojis("glowdotblue")} **Nameplate:** \`${account.collectibles.nameplate.asset}\``) }
        // if (account.avatarDecorationData) { accountLines.push(`${emojis("glowdotblue")} **Avatar Dekorasyonu:** Var`) }
        if (account.accentColor) { accountLines.push(`${emojis("glowdotblue")} **Profil Rengi:** \`#${account.accentColor.toString(16).padStart(6, "0")}\``) }
        if (account.bannerURL) { accountLines.push(`${emojis("glowdotblue")} **Banner:** [Görseli Aç](${account.bannerURL})`) }

        // Sunucu bilgileri (sadece guild üzerinden alındıysa)
        if (member) {
            const criticalPerms = global.config?.criticalPerms || {};
            const memberPerms = member.permissions
            const totalPermCount = memberPerms.length;

            let permText;
            if (memberPerms.includes("Administrator")) {
                permText = `[**Administrator**](https://dprm.click/)`;
            } else {
                const foundCritical = memberPerms
                    .filter((p) => criticalPerms[p])
                    .map((p) => `[${criticalPerms[p]}](https://dprm.click/)`);

                if (foundCritical.length > 0) {
                    permText = `${foundCritical.slice(0, 4).join(", ")}${foundCritical.length > 4 ? ` +${totalPermCount - 4} diğer` : ""}`;
                } else {
                    permText = `${totalPermCount} yetki`;
                }
            }

            const memberLines = [
                `${emojis("glowdotblue")} **Sunucuya Katılım:** <t:${Math.floor(member.joinedTimestamp / 1000)}:D> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`,
                `${emojis("glowdotblue")} **Sunucu Takma Adı:** \`${member.nickname ?? "yok"}\``,
                // `${emojis("glowdotblue")} **Rol Sayısı:** \`${member.roleCount - 1}\``,
                `${emojis("glowdotblue")} **En Yüksek Rol:** ${member.highestRole.id !== int.guild.id ? `<@&${member.highestRole.id}>` : "yok"}`,
                `${emojis("glowdotblue")} **Yetkiler:** ${permText}`,
                // `${emojis("glowdotblue")} **Onay Bekliyor mu:** ${member.pending ? "Evet" : "Hayır"}`,
            ];

            if (member.premiumSince) { memberLines.push(`**Boost Ediyor:** <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`) }
            if (member.communicationDisabledUntil) { memberLines.push(`**Susturulma Bitişi:** <t:${Math.floor(new Date(member.communicationDisabledUntil).getTime() / 1000)}:R>`) }
            if (member.voice) { memberLines.push(`**Ses Kanalı:** <#${member.voice.channelId}> ${member.voice.mute ? "🔇" : ""} ${member.voice.deaf ? "🔕" : ""}`) }

            infoEmbed.setDescription(`## ${emojis("emojis14")} Hesap Bilgileri\n` + accountLines.join("\n") + "\n" + `## ${emojis("emojis13")} Sunucu Bilgileri\n` + memberLines.join("\n"));

            // Rolleri ayrı bir alanda göster (çok fazla olabileceği için sınırlı)
            // if (member.roles.length > 1) {
            //     const filteredRoles = member.roles.filter((r) => r.id !== int.guild.id);
            //     const roleMentions = filteredRoles.slice(0, 15).map((r) => `<@&${r.id}>`).join(", ");
            //     infoEmbed.addFields({ name: `${emojis("emojis7")} Roller (${filteredRoles.length})`, value: roleMentions || "Rol yok" });
            // }

        } else {

            infoEmbed.setDescription(`## ${emojis("emojis14")} Hesap Bilgileri\n` + accountLines.join("\n")/* + "\n" + `## ${emojis("emojis13")} Sunucu Bilgileri\n` + "Bu kullanıcı bir sunucu üzerinden alınmadı (DM ya da sunucuda bulunamadı), sunucuya özel veriler mevcut değil."*/);

        }

        const userInfoMenü = global.functions.buildUserInfoMenu(int.customId, "userInfo-profil");

        await int.update({
            embeds: [infoEmbed.setImage("attachment://cabbarxdd.png")], //imageEmbed
            components: [userInfoMenü],
            files: [attachment],
            attachments: [],
        });
    },
};