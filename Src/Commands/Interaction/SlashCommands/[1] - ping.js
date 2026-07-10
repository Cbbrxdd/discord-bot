import { SlashCommandBuilder } from "discord.js"

export default {
    name: "ping",
    commandData: new SlashCommandBuilder().setName("ping").setDescription("Bot'un ve Discord'un ping değerlerini gönderir."),
    execute: async (int) => {
        try {
            
            await int.reply("Deneme")

        } catch (error) {
            console.log(error)
        }
    }
}