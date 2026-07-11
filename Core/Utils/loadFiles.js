import { globSync } from "glob";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function loadFiles(pattern) {
  const files = globSync(pattern);
  const loaded = [];
  for (const file of files) {
    const { default: content } = await import(pathToFileURL(path.resolve(file)));
    loaded.push({ file, content });
  }
  return loaded;
}

export default { loadFiles };