import { Events } from "discord.js";

export default {
    name: Events.MessageCreate,
    execute: async (msg) => {
        if (msg.author.bot) return; // bot mesajlarını yoksay, sonsuz döngü riskine karşı
        if (!msg.content.startsWith("!")) return;

        const args = msg.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = msg.client.messageCommands.get(commandName);
        if (!command) return; // böyle bir komut yok, sessizce çık

        try {
            await command.execute(msg, args, msg.client);
        } catch (error) {
            console.error(error);
            msg.reply("Komut çalıştırılırken bir hata oluştu.");
        }
    }
};