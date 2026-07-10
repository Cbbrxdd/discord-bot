import "dotenv/config";
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { globSync } from "glob";
import path from "node:path";
import { pathToFileURL } from "node:url";

const client = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages ],
  presence: { activities: [{ name: "Tüm Sunucuları", type: ActivityType.Watching, state: "💞 Cabbarxdd" }] },
});

const eventFiles = globSync("Src/Events/**/*.js");
for (const file of eventFiles) {
  const { default: event } = await import(pathToFileURL(path.resolve(file)));
  client.on(event.name, event.execute);
}

client.login(process.env.token);
