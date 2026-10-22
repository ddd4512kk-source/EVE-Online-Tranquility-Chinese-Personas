import path from "node:path";
import { expandSnapshot, readNames, readStoredCharacters } from "../../scripts/character-snapshot.mjs";

const peopleDir = path.resolve(import.meta.dirname, "../people");

export default function () {
  const characters = {};
  const names = readNames(path.resolve(import.meta.dirname, "../.."));
  for (const [id, character] of readStoredCharacters(peopleDir)) characters[id] = expandSnapshot(character, names);
  return characters;
}
