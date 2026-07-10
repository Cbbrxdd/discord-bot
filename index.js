import "dotenv/config";
import { ActivityType, Client, Partials, Collection } from "discord.js";
import { globSync } from "glob";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ProxyAgent } from "undici";

const USE_PROXY = process.env.USE_PROXY === "true";
const PROXY_URL = process.env.PROXY_URL;

const clientOptions = {
  intents: [3276799],
  partials: [Partials.Channel, Partials.GuildMember, Partials.User],
  presence: {
    activities: [{ name: "Tüm Sunucuları", type: ActivityType.Watching, state: "💞 Cabbarxdd" }],
  },
};

if (USE_PROXY) {
  if (!PROXY_URL) {
    throw new Error("USE_PROXY=true ama PROXY_URL .env dosyasında tanımlı değil!");
  }

  // Gateway (WebSocket) bağlantısı için: Node'un http/https globalAgent'ını proxy'li agent ile değiştiriyoruz.
  const { default: https } = await import("node:https");
  const { default: http } = await import("node:http");
  const { HttpsProxyAgent } = await import("https-proxy-agent");

  const proxyAgent = new HttpsProxyAgent(PROXY_URL);
  https.globalAgent = proxyAgent;
  http.globalAgent = proxyAgent;

  // REST (undici) çağrıları için ayrı proxy agent
  clientOptions.rest = { agent: new ProxyAgent(PROXY_URL) };

  console.log("🔌 Proxy aktif:", PROXY_URL.replace(/:\/\/.*@/, "://***@")); // şifreyi loglamadan bilgi ver
} else {
  console.log("🔌 Proxy kapalı, doğrudan bağlanılıyor.");
}

const client = new Client(clientOptions);

const eventFiles = globSync("Src/Events/**/*.js");
for (const file of eventFiles) {
  const { default: event } = await import(pathToFileURL(path.resolve(file)));
  client.on(event.name, event.execute);
}

client.messageCommands = new Collection();
const messageCommandFiles = globSync("Src/Commands/Message/**/*.js");
for (const file of messageCommandFiles) {
  const { default: command } = await import(pathToFileURL(path.resolve(file)));
  client.messageCommands.set(command.name, command);
}

client.login(process.env.token);