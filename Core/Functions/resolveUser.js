export default {
  resolveUser1: async (client, interaction, userId, pro = false) => {
    let user = null;
    let status = "offline";

    // --- 1. Önce guild üzerinden member çekmeyi dene (status bilgisi için) ---
    if (interaction.guild) {
      try {
        const member = await interaction.guild.members.fetch(userId);
        user = member.user;
        status = member.presence?.status ?? "offline";
        console.log("kullanıcı guild üzerinden alındı")
      } catch (error) {
        // guild'de bulunamadı, client'a düşülecek
      }
    }

    // --- 2. Guild yoksa (DM) ya da fetch başarısız olduysa client'tan çek ---
    if (!user) {
      try {
        user = await client.users.fetch(userId);
        console.log("kullanıcı client üzerinden alındı")
      } catch (error) {
        console.log("Kullanıcı hiçbir şekilde bulunamadı:", error.message);
        return null; // ne guild'de ne client'ta bulunamadı
      }
    }

    return { user, status };
  },

  resolveUser: async (client, interaction, userId, pro = false) => {
      let user = null;
      let member = null;
      let status = "offline";

      // --- 1. Önce guild üzerinden member çekmeyi dene (status + member verisi için) ---
      if (interaction.guild) {
        try {
          member = await interaction.guild.members.fetch(userId);
          user = member.user;
          status = member.presence?.status ?? "offline";
        } catch (error) {
          // guild'de bulunamadı, client'a düşülecek
        }
      }

      // --- 2. Guild yoksa (DM) ya da fetch başarısız olduysa client'tan çek ---
      if (!user) {
        try {
          user = pro
            ? await client.users.fetch(userId, { force: true }) // pro modda banner için force gerekiyor
            : await client.users.fetch(userId);
        } catch (error) {
          console.log("Kullanıcı hiçbir şekilde bulunamadı:", error.message);
          return null;
        }
      } else if (pro) {
        // member üzerinden geldiyse bile, banner bilgisi için user'ı force ile tekrar çekmek gerekebilir
        try {
          user = await client.users.fetch(userId, { force: true });
        } catch (error) {
          // force fetch başarısız olursa, elimizdeki user ile devam et
        }
      }

      // --- Basit mod: eskisi gibi sade JSON dön ---
      if (!pro) {
        return { user, status };
      }

      // --- Pro mod: zengin JSON ---
      return {
        user,
        status,

        // Her zaman dolu (User nesnesinden geliyor, guild bağımsız)
        account: {
          id: user.id,
          username: user.username,
          globalName: user.globalName,
          displayName: user.globalName || user.username,
          avatarURL: user.displayAvatarURL({ size: 1024 }),
          bannerURL: user.bannerURL({ size: 1024 }) ?? null,
          accentColor: user.accentColor ?? null,
          createdAt: user.createdAt,
          createdTimestamp: user.createdTimestamp,
          flags: user.flags?.toArray() ?? [],
          avatarDecorationData: user.avatarDecorationData ?? null,
          collectibles: user.collectibles ?? null,
          primaryGuild: user.primaryGuild ?? null,
          bot: user.bot,
        },

        // Sadece guild üzerinden alındıysa dolu, yoksa tamamen null
        member: !member
          ? null
          : {
            nickname: member.nickname,
            displayName: member.displayName,
            displayAvatarURL: member.displayAvatarURL({ size: 1024 }),
            joinedAt: member.joinedAt,
            joinedTimestamp: member.joinedTimestamp,
            premiumSince: member.premiumSince,
            premiumSinceTimestamp: member.premiumSinceTimestamp,
            roles: member.roles.cache.map((role) => ({ id: role.id, name: role.name })),
            roleCount: member.roles.cache.size,
            highestRole: { id: member.roles.highest.id, name: member.roles.highest.name },
            permissions: member.permissions.toArray(),
            permissionCount: member.permissions.toArray().length,
            pending: member.pending,
            communicationDisabledUntil: member.communicationDisabledUntil,
            voice: member.voice?.channelId
              ? { channelId: member.voice.channelId, mute: member.voice.mute, deaf: member.voice.deaf }
              : null,
          },
      };
    },

};