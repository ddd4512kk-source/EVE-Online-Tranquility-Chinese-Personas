// 抓取并缓存列传人物的游戏数据（头像、创号时间、雇佣记录、军团/联盟）。
//
// 数据是一次性快照，提交进仓库；构建时不访问第三方网站。
// 默认只抓取尚无缓存的角色。
//
//   npm run fetch                      抓取缺失的角色
//   npm run fetch -- --refresh         重新抓取全部角色
//   npm run fetch -- --refresh 123 456 只重新抓取指定角色
//   npm run fetch -- --check           只校验，不联网（缺数据则报错）

import "./runtime.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { validateCorporationTags } from "./corporation-tags.mjs";
import { bodyLineOffset, validateBlocks } from "./blocks.mjs";
import { compactSnapshot, expandSnapshot, isNpcCorp, mergeNames, readNames, writeNames } from "./character-snapshot.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PEOPLE_DIR = path.join(ROOT, "src/people");

const ESI = "https://esi.evetech.net/latest";
const EVEWHO = "https://evewho.com/api";
const IMAGES = "https://images.evetech.net";
const USER_AGENT =
  "EVE-Online-Tranquility-Chinese-Personas (+https://github.com/ddd4512kk-source/EVE-Online-Tranquility-Chinese-Personas)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(url, init = {}, { tries = 3 } = {}) {
  for (let i = 1; ; i++) {
    const res = await fetch(url, {
      ...init,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...init.headers },
    });
    if (res.ok) return res;
    if ([403, 404, 429, 412].includes(res.status) || i >= tries) {
      throw new Error(`${res.status} ${res.statusText} — ${url}`);
    }
    await sleep(1000 * i);
  }
}
const getJson = async (url) => (await request(url)).json();

// ---------- 名称解析（带缓存，单次运行内复用） ----------

const nameCache = new Map();

async function resolveNames(ids) {
  const todo = [...new Set(ids)].filter((id) => id && !nameCache.has(id));
  if (todo.length) {
    try {
      const res = await request(`${ESI}/universe/names/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });
      for (const { id, name } of await res.json()) nameCache.set(id, name);
    } catch {
      // 批量里只要有一个无效 ID，ESI 就整批 404；退回逐个解析
      for (const id of todo) {
        try {
          const res = await request(`${ESI}/universe/names/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([id]),
          });
          nameCache.set(id, (await res.json())[0]?.name ?? null);
        } catch {
          nameCache.set(id, null);
        }
      }
    }
  }
  return (id) => nameCache.get(id) ?? `未知 (${id})`;
}

const corpCache = new Map();
const getCorp = async (id) => {
  if (!corpCache.has(id)) corpCache.set(id, await getJson(`${ESI}/corporations/${id}/`));
  return corpCache.get(id);
};

async function getAllianceTicker(id) {
  try {
    return (await getJson(`${ESI}/alliances/${id}/`)).ticker;
  } catch {
    return null;
  }
}

// 某军团在时刻 t 所属的联盟（t 为 null 表示当前）
async function allianceOfCorpAt(corpId, t) {
  if (!t) return (await getCorp(corpId)).alliance_id ?? null;
  const hist = await getJson(`${ESI}/corporations/${corpId}/alliancehistory/`);
  const at = Date.parse(t);
  const rec = hist
    .filter((r) => Date.parse(r.start_date) <= at)
    .sort((a, b) => Date.parse(b.start_date) - Date.parse(a.start_date))[0];
  return rec?.alliance_id ?? null;
}

// EveWho 的时间格式是 "2009/08/10 06:34"（UTC）
const evewhoDate = (s) => (s ? s.replace(/\//g, "-").replace(" ", "T") + ":00Z" : null);

// ---------- 抓取单个角色 ----------

async function fetchCharacter(id) {
  const who = await getJson(`${EVEWHO}/character/${id}`);
  const info = who.info?.[0];
  if (!info) throw new Error(`EveWho 查无此角色：${id}`);

  let esi = null;
  try {
    esi = await getJson(`${ESI}/characters/${id}/`);
  } catch (e) {
    console.warn(`  ESI 无法获取角色 ${id}（可能已删号），改用 EveWho 数据：${e.message}`);
  }

  // 雇佣记录优先用 ESI（实时）；EveWho 更新滞后，只在 ESI 拿不到时兜底
  let esiHistory = null;
  if (esi) {
    try {
      esiHistory = await getJson(`${ESI}/characters/${id}/corporationhistory/`);
    } catch (e) {
      console.warn(`  ESI 无法获取角色 ${id} 的雇佣记录，改用 EveWho：${e.message}`);
    }
  }

  const history = esiHistory?.length
    ? [...esiHistory]
        .sort((a, b) => a.record_id - b.record_id)
        .map((h) => ({ corporation_id: h.corporation_id, start: h.start_date }))
        .map((h, i, arr) => ({ ...h, end: arr[i + 1]?.start ?? null }))
    : (who.history ?? [])
        .map((h) => ({
          corporation_id: h.corporation_id,
          start: evewhoDate(h.start_date),
          end: evewhoDate(h.end_date),
        }))
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

  const currentCorpId = esi?.corporation_id ?? info.corporation_id;
  const birthday = esi?.birthday ?? history[0]?.start ?? null;

  // 展示用的军团：当前军团；若在 NPC 军团，则取最近的玩家军团
  let shown = null;
  if (!isNpcCorp(currentCorpId)) {
    shown = { corporation_id: currentCorpId, left_at: null };
  } else {
    const last = [...history].reverse().find((h) => !isNpcCorp(h.corporation_id));
    if (last) shown = { corporation_id: last.corporation_id, left_at: last.end };
  }

  let allianceId = null;
  if (shown) {
    try {
      allianceId = await allianceOfCorpAt(shown.corporation_id, shown.left_at);
    } catch (e) {
      console.warn(`  无法获取军团 ${shown.corporation_id} 的联盟信息：${e.message}`);
    }
  }

  const name = await resolveNames([
    currentCorpId,
    ...history.map((h) => h.corporation_id),
    ...(allianceId ? [allianceId] : []),
  ]);

  let affiliation = null;
  if (shown) {
    let corpTicker = null;
    try {
      corpTicker = (await getCorp(shown.corporation_id)).ticker;
    } catch {}
    affiliation = {
      corporation: { id: shown.corporation_id, name: name(shown.corporation_id), ticker: corpTicker },
      alliance: allianceId
        ? { id: allianceId, name: name(allianceId), ticker: await getAllianceTicker(allianceId) }
        : null,
      // left_at 非空 = 已离开该军团，目前在 NPC 军团
      left_at: shown.left_at,
    };
  }

  return {
    id,
    name: esi?.name ?? info.name,
    birthday,
    current_corporation: { id: currentCorpId, name: name(currentCorpId) },
    affiliation,
    history: history.map((h) => ({ ...h, name: name(h.corporation_id) })),
    fetched_at: new Date().toISOString().slice(0, 10),
  };
}

async function fetchPortrait(id, directory) {
  const res = await request(`${IMAGES}/characters/${id}/portrait?size=256`, {
    headers: { Accept: "image/jpeg" },
  });
  await fs.writeFile(path.join(directory, `portrait-${id}.jpg`), Buffer.from(await res.arrayBuffer()));
}

// ---------- 主流程 ----------

// ---------- 列传文件校验 ----------

const FIELDS = {
  character_id: "必填，游戏角色 ID（数字）",
  cn_name: "可选，中文名（字符串）",
  aliases: "可选，外号列表",
  epithet: "可选，一句话锐评（字符串）",
  tags: "可选，标签列表",
  alts: "可选，本人小号的角色 ID 列表；战役战报据此认人",
};
const isStrList = (v) => Array.isArray(v) && v.every((x) => typeof x === "string" && x.trim());
const isIdList = (v) => Array.isArray(v) && v.every((x) => Number.isInteger(x) && x > 0);

function validate(file, data, body, lineOffset) {
  const errs = [];
  for (const k of Object.keys(data)) {
    if (!(k in FIELDS)) errs.push(`未知字段 "${k}"（允许的字段：${Object.keys(FIELDS).join(", ")}）`);
  }
  if (data.cn_name != null && typeof data.cn_name !== "string") errs.push("cn_name 必须是字符串");
  if (data.epithet != null && typeof data.epithet !== "string") errs.push("epithet 必须是字符串");
  if (data.aliases != null && !isStrList(data.aliases)) errs.push("aliases 必须是字符串列表，如 [外号一, 外号二]");
  if (data.alts != null && !isIdList(data.alts)) errs.push("alts 必须是角色 ID 列表，如 [2114818738]");
  if (data.tags != null) {
    if (!isStrList(data.tags)) errs.push("tags 必须是字符串列表，如 [标签一, 标签二]");
    else if (data.tags.some((t) => /[\/\\?#%]/.test(t))) errs.push("标签里不能含 / \\ ? # % 字符");
  }
  errs.push(...validateBlocks(body, lineOffset));
  return errs.map((e) => `${file}：${e}`);
}

async function readPeople() {
  const directories = (await fs.readdir(PEOPLE_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name);
  const people = [];
  const errors = [];
  const seen = new Map();
  for (const slug of directories) {
    const file = `${slug}/${slug}.md`;
    const directory = path.join(PEOPLE_DIR, slug);
    if (!(await fs.access(path.join(PEOPLE_DIR, file)).then(() => true, () => false))) {
      errors.push(`${file}：缺少列传 Markdown 文件`);
      continue;
    }
    let parsed, raw;
    try {
      raw = await fs.readFile(path.join(PEOPLE_DIR, file), "utf8");
      parsed = matter(raw);
    } catch (e) {
      errors.push(`${file}：front matter 格式错误（YAML）：${e.message}`);
      continue;
    }
    const { data, content } = parsed;
    errors.push(...validate(file, data, content, bodyLineOffset(raw, content)));
    const id = Number(data.character_id);
    if (!Number.isInteger(id) || id <= 0) {
      errors.push(`${file}：缺少或无效的 character_id`);
      continue;
    }
    if (seen.has(id)) {
      errors.push(`${file}：character_id ${id} 与 ${seen.get(id)} 重复`);
      continue;
    }
    seen.set(id, file);
    people.push({ file, id, directory, tags: data.tags ?? [], alts: isIdList(data.alts) ? data.alts : [] });
  }
  // 小号只归一人，也不能是别人的收录角色
  const altOwner = new Map();
  for (const p of people) {
    for (const alt of p.alts) {
      if (seen.has(alt)) errors.push(`${p.file}：alts 里的 ${alt} 是 ${seen.get(alt)} 的收录角色`);
      else if (altOwner.has(alt)) errors.push(`${p.file}：alts 里的 ${alt} 已列在 ${altOwner.get(alt)}`);
      else altOwner.set(alt, p.file);
    }
  }
  return { people, errors };
}

const exists = (p) => fs.access(p).then(() => true, () => false);

async function checkCorporationTags(people) {
  const names = readNames(ROOT);
  const snapshots = await Promise.all(people.map(async (p) =>
    expandSnapshot(JSON.parse(await fs.readFile(path.join(p.directory, `${p.id}.json`), "utf8")), names)));
  const corporations = snapshots.map((c) => c.affiliation?.corporation).filter(Boolean);
  const errors = people.flatMap((p, i) =>
    validateCorporationTags(p.tags, snapshots[i], corporations).map((e) => `${p.file}：${e}`));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");
  const refresh = args.includes("--refresh");
  const refreshIds = new Set(args.filter((a) => /^\d+$/.test(a)).map(Number));

  const { people, errors } = await readPeople();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const todo = [];
  for (const p of people) {
    const dataFile = path.join(p.directory, `${p.id}.json`);
    const portrait = path.join(p.directory, `portrait-${p.id}.jpg`);
    const forced = refresh && (refreshIds.size === 0 || refreshIds.has(p.id));
    if (forced || !(await exists(dataFile)) || !(await exists(portrait))) todo.push(p);
  }

  if (!todo.length) {
    await checkCorporationTags(people);
    console.log(`角色数据齐全（${people.length} 人），无需抓取。`);
    return;
  }
  if (checkOnly) {
    console.error(`缺少以下角色的数据，请运行 npm run fetch：\n` + todo.map((p) => `  ${p.file} (${p.id})`).join("\n"));
    process.exit(1);
  }

  let failed = 0;
  const names = readNames(ROOT);
  for (const [i, p] of todo.entries()) {
    console.log(`[${i + 1}/${todo.length}] ${p.file} → ${p.id}`);
    try {
      const data = await fetchCharacter(p.id);
      await fetchPortrait(p.id, p.directory);
      const { snapshot, names: own } = compactSnapshot(data);
      writeNames(ROOT, mergeNames(names, own));
      await fs.writeFile(path.join(p.directory, `${p.id}.json`), JSON.stringify(snapshot, null, 2) + "\n");
      console.log(`  ✓ ${data.name}，创号 ${data.birthday?.slice(0, 10)}`);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${e.message}`);
    }
    await sleep(300);
  }
  if (failed) {
    console.error(`${failed} 个角色抓取失败。`);
    process.exit(1);
  }
  await checkCorporationTags(people);
}

main();
