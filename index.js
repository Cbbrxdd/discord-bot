import "dotenv/config";
import { loadFiles } from "./Core/Utils/loadFiles.js";  // süslü parantezle, named export

global.config = {};
for (const { content } of await loadFiles("Core/Settings/**/*.js")) {
  Object.assign(global.config, content);
}

global.utils = {};
for (const { content } of await loadFiles("Core/Utils/**/*.js")) {
  Object.assign(global.utils, content);
}

global.functions = {};
for (const { content } of await loadFiles("Core/Functions/**/*.js")) {
  Object.assign(global.functions, content);
}

await global.functions.setupProxy(global.config);

import("./Src/bot.js");