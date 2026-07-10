export default {
    name: "ping",
    execute: async (msg, args, client) => {
        const sent = await msg.reply("🏓 Ping hesaplanıyor...");

        const botPing = sent.createdTimestamp - msg.createdTimestamp;
        const discordPing = client.ws.ping;

        const discordPingText = discordPing === -1
            ? "Hesaplanıyor... (bot yeni başladı, birkaç saniye sonra tekrar dene)"
            : `${discordPing}ms`;

        await sent.edit(
            `🏓 Pong!\n` +
            `**Bot Ping:** ${botPing}ms\n` +
            `**Discord Ping:** ${discordPingText}`
        );
    }
};