import fs from "node:fs";
import path from "node:path";

const peopleDir = path.resolve(import.meta.dirname, "../people");

export default function () {
  const characters = {};
  for (const entry of fs.readdirSync(peopleDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(peopleDir, entry.name);
    for (const file of fs.readdirSync(directory)) {
      if (!/^\d+\.json$/.test(file)) continue;
      const character = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
      const id = file.slice(0, -5);
      if (characters[id]) throw new Error(`角色 ${id} 的缓存文件重复`);
      if (String(character.id) !== id) throw new Error(`${file}：文件名与角色 ID 不一致`);
      characters[id] = character;
    }
  }
  return characters;
}
