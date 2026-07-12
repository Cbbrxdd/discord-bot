// Core/Functions/userAssets.js

export default {

    getGuildTagBadgeUrl: (user) => {
        if (!user.primaryGuild?.identityEnabled) return null;
        const { identityGuildId, badge } = user.primaryGuild;
        return `https://cdn.discordapp.com/guild-tag-badges/${identityGuildId}/${badge}.png`;
    },

const getNameplateUrl = (user, size = 128) => {
if (!user.collectibles?.nameplate) return null;
const { skuId } = user.collectibles.nameplate;
return;
};

    getAvatarUrl: (user, size = 256) => {
        return user.displayAvatarURL({ size, extension: "png" });
    },

    getAvatarDecorationUrl: (user, size = 128) => {
        if (!user.avatarDecorationData?.skuId) return null;
        const { skuId } = user.avatarDecorationData;
        return `https://cdn.discordapp.com/media/v1/collectibles-shop/${skuId}/static?format=png&size=${size}`;
    },

};
