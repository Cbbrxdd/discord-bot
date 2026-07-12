import { Events } from "discord.js";

export default {
  name: Events.ClientReady,
  execute: async (client) => {
    const appEmojis = await client.application.emojis.fetch();
    const emojis = (n) => {
      try {
        const { id, name } = appEmojis.find((e) => e.name === n);
        return `<:${name}:${id}>`;
      } catch (error) {
        return "";
      }
    };
    await Object.assign(global.functions, { emojis });

    client.application.commands.set(client.globalCommands);
    console.log(`Logged in as ${client.user.tag}!`);
  },
};
