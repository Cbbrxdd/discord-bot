import { Events } from "discord.js";

export default {
  name: Events.ClientReady,
  execute: async (client) => {

    client.application.commands.set(client.globalCommands);
    console.log(`Logged in as ${client.user.tag}!`);

  },
};
