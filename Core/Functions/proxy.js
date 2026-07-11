export default {
  setupProxy: async (config) => {
    const { USE_PROXY, PROXY_URL } = config;

    if (!USE_PROXY) {
      console.log("🔌 Proxy kapalı, doğrudan bağlanılıyor.");
      return;
    }

    if (!PROXY_URL) {
      throw new Error("USE_PROXY=true ama PROXY_URL .env dosyasında tanımlı değil!");
    }

    const { default: https } = await import("node:https");
    const { default: http } = await import("node:http");
    const { HttpsProxyAgent } = await import("https-proxy-agent");
    const { ProxyAgent } = await import("undici");

    const proxyAgent = new HttpsProxyAgent(PROXY_URL);
    https.globalAgent = proxyAgent;
    http.globalAgent = proxyAgent;
    config.clientOptions.rest = { agent: new ProxyAgent(PROXY_URL) };

    console.log("🔌 Proxy aktif:", PROXY_URL.replace(/:\/\/.*@/, "://***@"));
  },
};