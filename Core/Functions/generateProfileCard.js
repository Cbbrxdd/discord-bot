// Core/Functions/generateProfileCard.js
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "node:path";

GlobalFonts.registerFromPath(path.resolve("Assets/Fonts/Inter-24pt-Bold.ttf"), "Inter-Bold");
GlobalFonts.registerFromPath(path.resolve("Assets/Fonts/Inter-24pt-Regular.ttf"), "Inter-Regular");

// --- Buraya kendi badge URL'lerini/dosya yollarını gir ---
const FLAG_BADGE_URLS = {
    Staff: path.resolve("Assets/Badges/staff.png"),                      // Discord Staff
    Partner: path.resolve("Assets/Badges/partner.png"),                    // Discord Partner
    Hypesquad: path.resolve("Assets/Badges/hypesquad.png"),                  // HypeSquad Events
    BugHunterLevel1: path.resolve("Assets/Badges/bughunter1.png"),            // Bug Hunter (1. seviye)
    BugHunterLevel2: path.resolve("Assets/Badges/bughunter2.png"),            // Bug Hunter (2. seviye, altın)
    HypeSquadOnlineHouse1: path.resolve("Assets/Badges/hypesquadbravery.png"),      // Bravery (mor kalkan)
    HypeSquadOnlineHouse2: path.resolve("Assets/Badges/hypesquadbrilliance.png"),      // Brilliance (mercan daire)
    HypeSquadOnlineHouse3: path.resolve("Assets/Badges/hypesquadbalance.png"),      // Balance (turkuaz elmas)
    PremiumEarlySupporter: path.resolve("Assets/Badges/earlysupporter.png"),      // Early Supporter
    VerifiedDeveloper: path.resolve("Assets/Badges/activedeveloper.png"),          // Erken Doğrulanmış Bot Geliştiricisi
    CertifiedModerator: path.resolve("Assets/Badges/certifiedmoderator.png"),         // Moderatör Programı Mezunu
    ActiveDeveloper: path.resolve("Assets/Badges/activedeveloper.png"),            // Aktif Geliştirici
};

export default {

        generateProfileCard: async ({ user, status = "offline" }) => {

            const avatarUrl = user.displayAvatarURL()
            const nameplateUrl = !user.collectibles?.nameplate ? null : `https://cdn.discordapp.com/media/v1/collectibles-shop/${user.collectibles?.nameplate.skuId}/static?format=png&size=128`
            const badgeUrl = user.guildTagBadgeURL({ extension: "png" })
            const badgeText = user.primaryGuild?.tag ?? null;
            const displayName = user.globalName || user.username;
            const username = user.username;

            const scale = 2;
            const width = 600;
            const height = 100;
            const backgroundColor = "#18191c";

            const canvas = createCanvas(width * scale, height * scale);
            const ctx = canvas.getContext("2d");
            ctx.scale(scale, scale);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            // --- Kartın tamamı için yuvarlak köşe clip alanı ---
            const radius = 16;
            ctx.beginPath();
            ctx.roundRect(0, 0, width, height, radius);
            ctx.closePath();
            ctx.clip();
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);

            // --- Arka plan (nameplate varsa onu kullan, yoksa düz renk) ---
            if (nameplateUrl) {
                try {
                    const nameplate = await loadImage(nameplateUrl);
                    ctx.drawImage(nameplate, 0, 0, width, height);
                } catch (error) {
                    console.log("Nameplate yüklenemedi:", error.message);
                }
            } else {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            // --- Avatar (yuvarlak) ---
            const avatarSize = 70;
            const avatarX = 25;
            const avatarY = (height - avatarSize) / 2;

            try {
                const avatar = await loadImage(avatarUrl);
                ctx.save();
                ctx.beginPath();
                ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
                ctx.restore();
            } catch (error) {
                console.log("Avatar yüklenemedi:", error.message);
            }

            // --- Durum noktası (avatarın sağ altına) — offline ise hiç çizilmez ---
            if (status && status !== "offline") {
                const statusColors = {
                    online: "#23a55a",
                    idle: "#f0b232",
                    dnd: "#f23f43",
                };

                const statusColor = statusColors[status];
                const statusSize = 18;
                const statusX = avatarX + avatarSize - statusSize / 2;
                const statusY = avatarY + avatarSize - statusSize / 2;

                // Kesme efekti (arka plan rengiyle biraz büyük daire)
                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                ctx.arc(statusX, statusY, statusSize / 2 + 3, 0, Math.PI * 2);
                ctx.fill();

                // Asıl durum noktası
                ctx.fillStyle = statusColor;
                ctx.beginPath();
                ctx.arc(statusX, statusY, statusSize / 2, 0, Math.PI * 2);
                ctx.fill();

                // dnd için özel kesik çizgi
                if (status === "dnd") {
                    ctx.fillStyle = backgroundColor;
                    ctx.beginPath();
                    ctx.roundRect(statusX - statusSize / 4, statusY - 2, statusSize / 2, 4, 2);
                    ctx.fill();
                }

                // idle için hilal (ay) efekti
                if (status === "idle") {
                    const cutOffsetX = -statusSize / 3.2; // sola kaydırma miktarı
                    const cutOffsetY = -statusSize / 3.2; // yukarı kaydırma miktarı
                    const cutRadius = statusSize / 2.6; // "delik" dairesinin boyutu

                    ctx.fillStyle = backgroundColor;
                    ctx.beginPath();
                    ctx.arc(statusX + cutOffsetX, statusY + cutOffsetY, cutRadius, 0, Math.PI * 2);
                    ctx.fill();
                }


            }

            // --- İsim ---
            const textX = avatarX + avatarSize + 20;
            ctx.font = "26px Inter-Bold";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(displayName, textX, height / 2 - 5);

            // --- Badge (isim yanında, pill şeklinde kapsül içinde) ---
            if (badgeUrl && badgeText) {
                const nameWidth = ctx.measureText(displayName).width;
                const badgeX = textX + nameWidth + 15;
                const badgeY = height / 2 - 20;

                const badgeIconSize = 20;
                ctx.font = "16px Inter-Bold";
                const badgeTextWidth = ctx.measureText(badgeText).width;
                const pillPadding = 10;
                const pillWidth = badgeIconSize + badgeTextWidth + pillPadding * 3;
                const pillHeight = 32;

                // Pill arka planı
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, pillWidth, pillHeight, pillHeight / 2);
                ctx.fill();

                // Badge ikonu
                try {
                    const badge = await loadImage(badgeUrl);
                    ctx.drawImage(
                        badge,
                        badgeX + pillPadding,
                        badgeY + (pillHeight - badgeIconSize) / 2,
                        badgeIconSize,
                        badgeIconSize
                    );
                } catch (error) {
                    console.log("Badge yüklenemedi:", error.message);
                }

                // Badge metni
                ctx.fillStyle = "#ffffff";
                ctx.font = "16px Inter-Bold";
                ctx.fillText(badgeText, badgeX + pillPadding + badgeIconSize + 8, badgeY + pillHeight / 2 + 5);
            }

            // --- Kullanıcı adı (isim altında) ---
            ctx.font = "16px Inter-Regular";
            ctx.fillStyle = "#b5b5b5";
            ctx.fillText(`@${username}`, textX, height / 2 + 25);

            return canvas.toBuffer("image/png");
        },

    generateProfileCard2: async (result) => {
        const { user, status, account, member } = result;

        const avatarUrl = account.avatarURL;
        const bannerUrl = account.bannerURL;
        const nameplateUrl = account.collectibles?.nameplate
            ? `https://cdn.discordapp.com/media/v1/collectibles-shop/${account.collectibles.nameplate.skuId}/static?format=png&size=512`
            : null;
        const badgeUrl = user.guildTagBadgeURL?.({ extension: "png" }) ?? null;
        const badgeText = account.primaryGuild?.tag ?? null;
        const displayName = account.displayName;
        const username = account.username;

        const scale = 2;
        const width = 600;
        const height = 220;
        const backgroundColor = "#18191c";
        const bannerHeight = 90;

        const canvas = createCanvas(width * scale, height * scale);
        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // --- Kartın tamamı için yuvarlak köşe clip alanı ---
        const radius = 16;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, radius);
        ctx.closePath();
        ctx.clip();

        // --- Genel arka plan ---
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // --- Banner (üst kısımda, varsa) ---
        if (bannerUrl) {
            try {
                const banner = await loadImage(bannerUrl);
                ctx.drawImage(banner, 0, 0, width, bannerHeight);

                const gradient = ctx.createLinearGradient(0, bannerHeight - 40, 0, bannerHeight);
                gradient.addColorStop(0, "rgba(24, 25, 28, 0)");
                gradient.addColorStop(1, "rgba(24, 25, 28, 1)");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, bannerHeight - 40, width, 40);
            } catch (error) {
                console.log("Banner yüklenemedi:", error.message);
            }
        } else if (account.accentColor) {
            ctx.fillStyle = `#${account.accentColor.toString(16).padStart(6, "0")}`;
            ctx.fillRect(0, 0, width, bannerHeight);
        }

        // --- Nameplate (hafif saydam overlay) ---
        if (nameplateUrl) {
            try {
                const nameplate = await loadImage(nameplateUrl);
                ctx.globalAlpha = 0.25;
                ctx.drawImage(nameplate, 0, bannerHeight, width, height - bannerHeight);
                ctx.globalAlpha = 1;
            } catch (error) {
                console.log("Nameplate yüklenemedi:", error.message);
            }
        }

        // --- Avatar (banner'ın üstüne taşan, çerçeveli) ---
        const avatarSize = 80;
        const avatarX = 25;
        const avatarY = bannerHeight - avatarSize / 2;

        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
        ctx.fill();

        try {
            const avatar = await loadImage(avatarUrl);
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
            ctx.restore();
        } catch (error) {
            console.log("Avatar yüklenemedi:", error.message);
        }

        // --- Durum noktası ---
        if (status && status !== "offline") {
            const statusColors = { online: "#23a55a", idle: "#f0b232", dnd: "#f23f43" };
            const statusColor = statusColors[status];
            const statusSize = 20;
            const statusX = avatarX + avatarSize - statusSize / 2;
            const statusY = avatarY + avatarSize - statusSize / 2;

            ctx.fillStyle = backgroundColor;
            ctx.beginPath();
            ctx.arc(statusX, statusY, statusSize / 2 + 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = statusColor;
            ctx.beginPath();
            ctx.arc(statusX, statusY, statusSize / 2, 0, Math.PI * 2);
            ctx.fill();

            if (status === "dnd") {
                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                ctx.roundRect(statusX - statusSize / 4, statusY - 2, statusSize / 2, 4, 2);
                ctx.fill();
            }

            if (status === "idle") {
                const cutOffsetX = -statusSize / 3.2;
                const cutOffsetY = -statusSize / 3.2;
                const cutRadius = statusSize / 2.6;
                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                ctx.arc(statusX + cutOffsetX, statusY + cutOffsetY, cutRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // --- İsim ve kullanıcı adı ---
        const textX = avatarX + avatarSize + 20;
        const nameY = avatarY + avatarSize / 2 + 5;

        ctx.font = "24px Inter-Bold";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(displayName, textX, nameY - 15);

        ctx.font = "15px Inter-Regular";
        ctx.fillStyle = "#b5b5b5";
        ctx.fillText(`@${username}`, textX, nameY + 8);

        // --- Sunucu tag badge'i (varsa), kullanıcı adının sağına ---
        if (badgeUrl && badgeText) {
            ctx.font = "24px Inter-Bold";
            const boldNameWidth = ctx.measureText(displayName).width;
            const badgeX = textX + boldNameWidth + 12;
            const badgeY = nameY - 15 - 18;

            const pillHeight = 26;
            ctx.font = "13px Inter-Bold";
            const badgeTextWidth = ctx.measureText(badgeText).width;
            const iconSize = 16;
            const pillPadding = 8;
            const pillWidth = iconSize + badgeTextWidth + pillPadding * 3;

            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, pillWidth, pillHeight, pillHeight / 2);
            ctx.fill();

            try {
                const badge = await loadImage(badgeUrl);
                ctx.drawImage(badge, badgeX + pillPadding, badgeY + (pillHeight - iconSize) / 2, iconSize, iconSize);
            } catch (error) {
                console.log("Sunucu tag badge'i yüklenemedi:", error.message);
            }

            ctx.fillStyle = "#ffffff";
            ctx.font = "13px Inter-Bold";
            ctx.fillText(badgeText, badgeX + pillPadding + iconSize + 6, badgeY + pillHeight / 2 + 5);
        }

        // --- Hesap rozetleri (flags) — gerçek PNG görselleri olarak ---
        if (account.flags && account.flags.length > 0) {
            const badgeIconSize = 20;
            const badgeGap = 6;
            let flagX = textX;
            const flagY = nameY + 18;

            for (const flag of account.flags) {
                const badgeSource = FLAG_BADGE_URLS[flag];
                if (!badgeSource) continue; // URL boşsa (henüz doldurulmadıysa) atla

                try {
                    const badgeImg = await loadImage(badgeSource);
                    ctx.drawImage(badgeImg, flagX, flagY, badgeIconSize, badgeIconSize);
                    flagX += badgeIconSize + badgeGap;
                } catch (error) {
                    console.log(`${flag} rozeti çizilemedi:`, error.message);
                }
            }
        }

        // --- Alt bilgi çubuğu: sunucuya katılma / boost bilgisi (member varsa) ---
        if (member) {
            const infoY = height - 25;
            ctx.font = "13px Inter-Regular";
            ctx.fillStyle = "#949ba4";

            const joinedDate = member.joinedAt
                ? new Date(member.joinedAt).toLocaleDateString("tr-TR")
                : "bilinmiyor";

            let infoText = `📅 Sunucuya katılım: ${joinedDate}`;
            if (member.premiumSince) {
                infoText += `   💎 Boost ediyor`;
            }

            ctx.fillText(infoText, avatarX, infoY);
        }

        return canvas.toBuffer("image/png");
    },
};