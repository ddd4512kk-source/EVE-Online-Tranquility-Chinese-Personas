// 抓取并缓存列传人物的游戏数据（头像、创号时间、雇佣记录、军团/联盟）。
//
// 数据是一次性快照，提交进仓库；构建时不访问第三方网站。
// 默认只抓取尚无缓存的角色。
//
//   npm run fetch                      抓取缺失的角色
//   npm run fetch -- --refresh         重新抓取全部角色
//   npm run fetch -- --refresh 123 456 只重新抓取指定角色
//   npm run fetch -- --check           只校验，不联网（缺数据则报错）

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const PEOPLE_DIR = path.join(ROOT, "src/people");
const DATA_DIR = path.join(ROOT, "src/_data/characters");
const PORTRAIT_DIR = path.join(ROOT, "src/portraits");

const ESI = "https://esi.evetech.net/latest";
const EVEWHO = "https://evewho.com/api";
const IMAGES = "https://images.evetech.net";
const USER_AGENT =
  "EVE-Online-Tranquility-Chinese-Personas (+https://github.com/ddd4512kk-source/EVE-Online-Tranquility-Chinese-Personas)";

// NPC 军团的 ID 落在 1000000–1999999 区间
const isNpcCorp = (id) => id >= 1_000_000 && id < 2_000_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(url, init = {}, { tries = 3 } = {}) {
  for (let i = 1; ; i++) {
    const res = await fetch(url, {
      ...init,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...init.headers },
    });
    if (res.ok) return res;
    if (res.status === 404 || i >= tries) {
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

  const history = (who.history ?? [])
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
    current_corporation: {
      id: currentCorpId,
      name: name(currentCorpId),
      npc: isNpcCorp(currentCorpId),
    },
    affiliation,
    history: history.map((h) => ({
      corporation_id: h.corporation_id,
      name: name(h.corporation_id),
      npc: isNpcCorp(h.corporation_id),
      start: h.start,
      end: h.end,
    })),
    fetched_at: new Date().toISOString().slice(0, 10),
  };
}

async function fetchPortrait(id) {
  const res = await request(`${IMAGES}/characters/${id}/portrait?size=256`, {
    headers: { Accept: "image/jpeg" },
  });
  await fs.writeFile(path.join(PORTRAIT_DIR, `${id}.jpg`), Buffer.from(await res.arrayBuffer()));
}

// ---------- 主流程 ----------

// ---------- 列传文件校验 ----------

const FIELDS = {
  character_id: "必填，游戏角色 ID（数字）",
  cn_name: "可选，中文名（字符串）",
  aliases: "可选，外号列表",
  epithet: "可选，一句话锐评（字符串）",
  tags: "可选，标签列表",
};
const isStrList = (v) => Array.isArray(v) && v.every((x) => typeof x === "string" && x.trim());

function validate(file, data, body, lineOffset) {
  const errs = [];
  for (const k of Object.keys(data)) {
    if (!(k in FIELDS)) errs.push(`未知字段 "${k}"（允许的字段：${Object.keys(FIELDS).join(", ")}）`);
  }
  if (data.cn_name != null && typeof data.cn_name !== "string") errs.push("cn_name 必须是字符串");
  if (data.epithet != null && typeof data.epithet !== "string") errs.push("epithet 必须是字符串");
  if (data.aliases != null && !isStrList(data.aliases)) errs.push("aliases 必须是字符串列表，如 [外号一, 外号二]");
  if (data.tags != null) {
    if (!isStrList(data.tags)) errs.push("tags 必须是字符串列表，如 [标签一, 标签二]");
    else if (data.tags.some((t) => /[\/\\?#%]/.test(t))) errs.push("标签里不能含 / \\ ? # % 字符");
  }
  // ::: 块必须成对且只用已知类型
  let depth = 0;
  body.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(/^:::\s*(\S.*)?$/);
    if (!m) return;
    if (m[1]) {
      const kind = m[1].split(/\s+/)[0];
      if (!["红料", "黑料", "评"].includes(kind)) errs.push(`第 ${i + 1 + lineOffset} 行：未知块类型 "::: ${kind}"（只能是 红料 / 黑料 / 评）`);
      if (depth > 0) errs.push(`第 ${i + 1 + lineOffset} 行：上一个 ::: 块还没有用单独一行 ::: 关闭`);
      depth++;
    } else if (depth === 0) {
      errs.push(`第 ${i + 1 + lineOffset} 行：多余的 ::: 关闭行`);
    } else {
      depth--;
    }
  });
  if (depth > 0) errs.push("有 ::: 块没有关闭（每个块结尾需要单独一行 :::）");
  return errs.map((e) => `${file}：${e}`);
}

async function readPeople() {
  const files = (await fs.readdir(PEOPLE_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const people = [];
  const errors = [];
  const seen = new Map();
  for (const file of files) {
    let parsed, raw;
    try {
      raw = await fs.readFile(path.join(PEOPLE_DIR, file), "utf8");
      parsed = matter(raw);
    } catch (e) {
      errors.push(`${file}：front matter 格式错误（YAML）：${e.message}`);
      continue;
    }
    const { data, content } = parsed;
    // 报错行号按整个文件计（加上 front matter 的行数）
    const lineOffset = raw.slice(0, raw.length - content.length).split("\n").length - 1;
    errors.push(...validate(file, data, content, lineOffset));
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
    people.push({ file, id });
  }
  return { people, errors };
}

const exists = (p) => fs.access(p).then(() => true, () => false);

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");
  const refresh = args.includes("--refresh");
  const refreshIds = new Set(args.filter((a) => /^\d+$/.test(a)).map(Number));

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(PORTRAIT_DIR, { recursive: true });

  const { people, errors } = await readPeople();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const todo = [];
  for (const p of people) {
    const dataFile = path.join(DATA_DIR, `${p.id}.json`);
    const portrait = path.join(PORTRAIT_DIR, `${p.id}.jpg`);
    const forced = refresh && (refreshIds.size === 0 || refreshIds.has(p.id));
    if (forced || !(await exists(dataFile)) || !(await exists(portrait))) todo.push(p);
  }

  if (!todo.length) {
    console.log(`角色数据齐全（${people.length} 人），无需抓取。`);
    return;
  }
  if (checkOnly) {
    console.error(`缺少以下角色的数据，请运行 npm run fetch：\n` + todo.map((p) => `  ${p.file} (${p.id})`).join("\n"));
    process.exit(1);
  }

  let failed = 0;
  for (const [i, p] of todo.entries()) {
    console.log(`[${i + 1}/${todo.length}] ${p.file} → ${p.id}`);
    try {
      const data = await fetchCharacter(p.id);
      await fetchPortrait(p.id);
      await fs.writeFile(path.join(DATA_DIR, `${p.id}.json`), JSON.stringify(data, null, 2) + "\n");
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
}

main();
