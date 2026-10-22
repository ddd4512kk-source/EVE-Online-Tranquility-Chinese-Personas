import path from "node:path";
import { readAllIdentities } from "../../scripts/person-identity.mjs";

export default function () {
  return Object.fromEntries(readAllIdentities(path.resolve(import.meta.dirname, "../..")));
}
