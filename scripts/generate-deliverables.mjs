// scripts/generate-deliverables.mjs
//
// Reconstructs mod-test deliverable repos from data/bugs.json + mods.json.
// Each target mod gets a self-contained repo folder with:
//   README.md
//   rounds/<seq>-<version>-<label>[-date]/log.txt
//   rounds/<seq>-<version>-<label>[-date]/ledger.md
//   meta.json
//
// Output: d:/Projects/may-plan/luckduck-deliverables/<repo-slug>/
//
// Re-run any time bugs.json changes — generator is idempotent: it wipes the
// rounds/ tree under each repo and rebuilds. README.md is regenerated too.
// Hand-written content (e.g. featured bug write-ups) belongs OUTSIDE rounds/.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "..", "data");
const outRoot = resolve(here, "..", "..", "luckduck-deliverables");

const mods = JSON.parse(readFileSync(join(dataDir, "mods.json"), "utf8"));
const bugs = JSON.parse(readFileSync(join(dataDir, "bugs.json"), "utf8"));
const methods = JSON.parse(readFileSync(join(dataDir, "methodology.json"), "utf8"));

// repo slug -> mod_id mapping (matches data/deliverables.json)
const TARGETS = [
  { slug: "hot-bath-tester-log",      mod_id: "hotbath",      name: "Hot Bath" },
  { slug: "shower-core-tester-log",   mod_id: "shower_core",  name: "Shower Core" },
  { slug: "alex-caves-bug-archive",   mod_id: "alex_caves",   name: "Alex's Caves" },
  { slug: "alex-mobs-bug-archive",    mod_id: "alex_mobs",    name: "Alex's Mobs" },
];

const PORTFOLIO_URL = "https://crabsatellite.github.io/luckduck_portfolio";

const LICENSE_TEXT = `Copyright © 2026 LUCK666DUCK.

The bug reports and tester logs in this repository were authored and filed
by LUCK666DUCK. They are released for reference and review under the
following terms:

1. You may read, reference, and cite these test records in technical
   discussions, mod issue trackers, and academic / journalistic work.

2. You may not redistribute the bug texts as your own work, or as part of
   a paid product or service, without explicit written permission.

3. Mod names, mod artwork, and mod-specific terminology referenced in
   these records remain the property of their respective mod authors and
   are used here only to identify the subject of testing.

4. The Minecraft name and trademarks are the property of Mojang Studios
   and Microsoft. Use of the name here is descriptive only and does not
   imply endorsement.

Contact: https://crabsatellite.github.io/luckduck_portfolio
`;

const GITIGNORE_TEXT = `.DS_Store
Thumbs.db
*.swp
.vscode/
.idea/

# private staging — drafts not yet filed
_draft/
_private/

# never commit raw mod files / saves
*.jar
*.zip
saves/
`;

// ---------- helpers ---------------------------------------------------------

function extractDate(file) {
  // "2026.4.5" or "2026.4.18" etc embedded in filename
  const m = file.match(/(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

function roundSlug(seq, round) {
  const date = extractDate(round.file);
  const ver = round.version.replace(/\./g, "_");
  const parts = [String(seq).padStart(2, "0"), ver, round.label];
  if (date) parts.push(date);
  return parts.join("-");
}

function methodNameZh(catId) {
  const m = methods.find((x) => x.category_id === catId);
  return m ? m.name_zh : catId;
}

function bugId(b) {
  return `#${String(b.index).padStart(3, "0")}`;
}

function severityLabel(sev) {
  return sev || "—";
}

// ---------- per-round renderers --------------------------------------------

function renderLogTxt(roundBugs, round, mod) {
  // mirrors original raw-log style: numbered list, one bug per item, blank
  // line between, no metadata. Preserves exact text_zh.
  const lines = [];
  lines.push(`# ${mod.name_zh}`);
  lines.push(`# 版本 ${round.version} · ${round.label === "regression" ? "回归" : "首轮"}`);
  if (extractDate(round.file)) lines.push(`# 日期 ${extractDate(round.file)}`);
  lines.push(`# 共 ${roundBugs.length} 条`);
  lines.push("");
  roundBugs
    .sort((a, b) => a.index - b.index)
    .forEach((b) => {
      lines.push(`${b.index}. ${b.text_zh}`);
      lines.push("");
    });
  return lines.join("\n").trimEnd() + "\n";
}

function renderLedgerMd(roundBugs, round, mod, seq) {
  const date = extractDate(round.file);
  const lines = [];
  lines.push(`# ${mod.name_zh} — round ${seq} · ${round.version} · ${round.label === "regression" ? "regression" : "intake"}`);
  lines.push("");
  lines.push("## meta");
  lines.push("");
  lines.push(`- **mod**: ${mod.name_en} (${mod.name_zh})`);
  lines.push(`- **version**: ${round.version}`);
  lines.push(`- **label**: ${round.label}`);
  if (date) lines.push(`- **date**: ${date}`);
  lines.push(`- **bug count**: ${roundBugs.length}`);
  lines.push(`- **source file**: \`${round.file}\``);
  lines.push("");

  // severity / method distribution
  const sevCount = { S0: 0, S1: 0, S2: 0, S3: 0 };
  const methodCount = {};
  roundBugs.forEach((b) => {
    sevCount[b.severity] = (sevCount[b.severity] || 0) + 1;
    b.categories.forEach((c) => { methodCount[c] = (methodCount[c] || 0) + 1; });
  });
  lines.push("## distribution");
  lines.push("");
  lines.push("| severity | count |");
  lines.push("|---|---|");
  ["S0", "S1", "S2", "S3"].forEach((s) => {
    if (sevCount[s] > 0) lines.push(`| ${s} | ${sevCount[s]} |`);
  });
  lines.push("");
  lines.push("| method | count |");
  lines.push("|---|---|");
  Object.entries(methodCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, n]) => lines.push(`| ${cat} | ${n} |`));
  lines.push("");

  // featured: any S0 / S1 bug
  const featured = roundBugs.filter((b) => b.severity === "S0" || b.severity === "S1");
  if (featured.length > 0) {
    lines.push("## featured (S0 / S1)");
    lines.push("");
    featured
      .sort((a, b) => a.severity.localeCompare(b.severity) || a.index - b.index)
      .forEach((b) => {
        lines.push(`### ${bugId(b)} · ${b.severity} · ${b.categories.join(" / ")}`);
        lines.push("");
        lines.push(`> ${b.text_zh.replace(/\n/g, "\n> ")}`);
        lines.push("");
        if (b.status) lines.push(`**author response**: ${b.status}`);
        lines.push("");
      });
  }

  // full ledger table
  lines.push("## ledger");
  lines.push("");
  lines.push("| id | sev | method | status | description |");
  lines.push("|---|---|---|---|---|");
  roundBugs
    .sort((a, b) => a.index - b.index)
    .forEach((b) => {
      const text = b.text_zh
        .replace(/\|/g, "\\|")
        .replace(/\n/g, " ↵ ")
        .slice(0, 200) + (b.text_zh.length > 200 ? "…" : "");
      lines.push(`| ${bugId(b)} | ${severityLabel(b.severity)} | ${b.categories.join(", ")} | ${b.status || ""} | ${text} |`);
    });
  lines.push("");
  return lines.join("\n");
}

// ---------- per-repo ---------------------------------------------------------

function renderReadme(slug, mod, roundsInfo) {
  const lines = [];
  lines.push(`# ${slug}`);
  lines.push("");
  lines.push(`Test records for **${mod.name_en}** (${mod.name_zh}), filed by LUCK666DUCK.`);
  lines.push("");
  lines.push("## what's here");
  lines.push("");
  lines.push("Each round of testing has its own folder under `rounds/`:");
  lines.push("");
  lines.push("- `log.txt` — bug list as filed, original Chinese, one numbered entry per bug");
  lines.push("- `ledger.md` — same bugs in markdown with severity (S0–S3), method tags, and author-response status");
  lines.push("");
  lines.push("## rounds");
  lines.push("");
  lines.push("| # | version | label | date | bugs | folder |");
  lines.push("|---|---|---|---|---|---|");
  roundsInfo.forEach((r) => {
    lines.push(`| ${r.seq} | ${r.version} | ${r.label} | ${r.date || "—"} | ${r.count} | [\`${r.slug}\`](rounds/${r.slug}/) |`);
  });
  lines.push("");
  lines.push("## methodology");
  lines.push("");
  lines.push("All entries here are filed under the 13-method test rubric and S0–S3 severity scale documented at:");
  lines.push("");
  lines.push(`<${PORTFOLIO_URL}/methodology>`);
  lines.push("");
  lines.push("## status");
  lines.push("");
  lines.push("Every entry below is a **closed report** — already filed to the mod author. The `status` column on each row is the author's *public response* (fixed / unfixed / noted-not-bug), blank where no public response is on record.");
  lines.push("");
  lines.push("## author");
  lines.push("");
  lines.push("- **portfolio**: " + PORTFOLIO_URL);
  lines.push("- **github**: <https://github.com/LUCK666DUCK>");
  lines.push("- **curseforge**: <https://www.curseforge.com/members/luck666duck>");
  lines.push("");
  lines.push("## license");
  lines.push("");
  lines.push("Bug reports remain authored by their filer. Mod names and trademarks belong to their respective authors.");
  lines.push("");
  return lines.join("\n");
}

function renderMetaJson(slug, mod, roundsInfo) {
  return JSON.stringify({
    slug,
    mod_id: mod.id,
    mod_name_zh: mod.name_zh,
    mod_name_en: mod.name_en,
    mod_supported_versions: mod.mod_supported_versions,
    tested_versions: mod.versions,
    total_bugs: mod.total_bugs,
    depth_signals: mod.depth_signals,
    rounds: roundsInfo,
    portfolio_url: PORTFOLIO_URL,
    generated_at: new Date().toISOString().slice(0, 10),
  }, null, 2) + "\n";
}

// ---------- main -------------------------------------------------------------

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

function generateRepo(target) {
  const mod = mods.find((m) => m.id === target.mod_id);
  if (!mod) throw new Error("mod not found: " + target.mod_id);
  const repoRoot = join(outRoot, target.slug);
  const roundsRoot = join(repoRoot, "rounds");

  ensureDir(repoRoot);
  if (existsSync(roundsRoot)) rmSync(roundsRoot, { recursive: true, force: true });
  ensureDir(roundsRoot);

  const roundsInfo = [];
  mod.rounds.forEach((round, idx) => {
    const seq = idx + 1;
    const slug = roundSlug(seq, round);
    const dir = join(roundsRoot, slug);
    ensureDir(dir);

    const roundBugs = bugs.filter(
      (b) => b.mod_id === mod.id &&
             b.round_file === round.file &&
             b.version === round.version
    );

    writeFileSync(join(dir, "log.txt"), renderLogTxt(roundBugs, round, mod), "utf8");
    writeFileSync(join(dir, "ledger.md"), renderLedgerMd(roundBugs, round, mod, seq), "utf8");

    roundsInfo.push({
      seq,
      slug,
      version: round.version,
      label: round.label,
      date: extractDate(round.file),
      count: roundBugs.length,
      source_file: round.file,
    });
  });

  writeFileSync(join(repoRoot, "README.md"), renderReadme(target.slug, mod, roundsInfo), "utf8");
  writeFileSync(join(repoRoot, "meta.json"), renderMetaJson(target.slug, mod, roundsInfo), "utf8");
  writeFileSync(join(repoRoot, "LICENSE"), LICENSE_TEXT, "utf8");
  writeFileSync(join(repoRoot, ".gitignore"), GITIGNORE_TEXT, "utf8");

  console.log(`✓ ${target.slug} (${roundsInfo.length} rounds, ${mod.total_bugs} bugs)`);
}

ensureDir(outRoot);
TARGETS.forEach(generateRepo);
console.log("\ndone → " + outRoot);
