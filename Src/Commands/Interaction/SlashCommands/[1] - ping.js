import { SlashCommandBuilder } from "discord.js"

export default {
    name: "ping",
    commandData: new SlashCommandBuilder().setName("ping").setDescription("Bot'un ve Discord'un ping değerlerini gönderir."),
    execute: async (client, int, embed) => {
        try {
            
            await int.followUp({ content: "Deneme" })

        } catch (error) {
            console.log(error)
        }
    }
}