import { Client, Collection } from "discord.js";
import path from "node:path";
import { loadFiles } from "../Core/Utils/loadFiles.js";

const client = new Client(global.config.clientOptions);

client.messageCommands = new Collection();
client.SlashCommands = new Collection();
client.ButtonCommands = new Collection();
client.ModalCommands = new Collection();
client.SelectCommands = new Collection();
client.globalCommands = [];

// --- Event'leri yükle ---
for (const { content: event } of await loadFiles("Src/Events/**/*.js")) {
  client.on(event.name, event.execute);
}

// --- Mesaj komutlarını yükle ---
for (const { content: command } of await loadFiles("Src/Commands/Message/**/*.js")) {
  client.messageCommands.set(command.name, command);
}

// --- Interaction komutlarını yükle ---
for (const { file, content: command } of await loadFiles("Src/Commands/Interaction/**/*.js")) {
  const type = path.basename(path.dirname(file));

  if (type === "SlashCommands") {
    client.SlashCommands.set(command.name, command);
    client.globalCommands.push(command.commandData);
  } else if (client[type]) {
    client[type].set(command.customId, command);
  } else {
    console.warn(`⚠️ Bilinmeyen komut tipi: ${type} (${file})`);
  }
}

await client.login(process.env.token);

export default client;