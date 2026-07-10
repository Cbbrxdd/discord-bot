import { Events } from "discord.js";

export default {
  name: Events.ClientReady,
  execute: async (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
  },
};
