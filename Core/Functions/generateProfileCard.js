import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "node:path";

GlobalFonts.registerFromPath(path.resolve("Assets/Fonts/Inter-24pt-Bold.ttf"), "Inter-Bold");
GlobalFonts.registerFromPath(path.resolve("Assets/Fonts/Inter-24pt-Regular.ttf"), "Inter-Regular");

export default {

    generateProfileCard: async ({ user, status = "offline" }) => {

        const avatarUrl = user.displayAvatarURL()
        const nameplateUrl = !user.collectibles?.nameplate ? null : `https://cdn.discordapp.com/media/v1/collectibles-shop/${user.collectibles?.nameplate.skuId}/static?format=png&size=128`
        const badgeUrl = user.guildTagBadgeURL({ extension: "png" })
        const badgeText = user.primaryGuild?.tag ?? null;
        const displayName = user.globalName || kullanici.username;
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
};