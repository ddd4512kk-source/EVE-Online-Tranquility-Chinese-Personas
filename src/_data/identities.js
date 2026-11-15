import path from "node:path";
import { readSiteIdentities } from "../../scripts/person-identity.mjs";

export default function () {
  return Object.fromEntries(readSiteIdentities(path.resolve(import.meta.dirname, "../..")));
}
