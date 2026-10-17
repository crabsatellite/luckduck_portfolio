import modsData from "../../data/mods.json";
import bugsData from "../../data/bugs.json";
import profileData from "../../data/profile.json";
import methodologyData from "../../data/methodology.json";
import remoteMetricsData from "../../data/remote-metrics.json";
import type { Lang } from "~/i18n/strings";

export type Round = {
  version: string;
  date: string | null;
  file: string;
  bug_count: number;
  label: "initial" | "regression" | string;
};

export type Mod = {
  id: string;
  name_zh: string;
  name_en: string;
  mcmod_url: string | null;
  versions: string[];
  rounds: Round[];
  total_bugs: number;
  depth_signals: string[];
  logo_local: string | null;
  logo_source?: string | null;
  mod_supported_versions: string[];
  mod_supported_versions_source?: string;
  mod_supported_versions_note?: string;
};

export type Severity = "S0" | "S1" | "S2" | "S3";

// One line of an original report. `status` is an annotation taken from
// the report itself; null means the report records no follow-up, which is
// not the same as "still open".
export type Bug = {
  mod_id: string;
  version: string;
  round_date: string | null;
  round_file: string;
  index: number;
  text_zh: string;
  categories: string[];
  severity: Severity;
  status: "fixed" | "unfixed" | "noted-not-bug" | null;
  regression_of: number | null;
};

export type Method = {
  id: string;
  category_id: string;
  name_zh: string;
  name_en: string;
  summary_zh: string;
  summary_en: string;
};

export const methods = methodologyData as Method[];

export type Profile = typeof profileData;

export type RemoteCurseForgeProject = {
  key: string;
  id: number;
  slug: string;
  title: string | null;
  url: string;
  downloads: number | null;
  thumbnail?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status: "ok" | "stale" | "error" | "pending" | string;
  error?: { message: string; at: string };
};

export type RemoteMetrics = {
  schema: number;
  fetched_at: string | null;
  sources: {
    curseforge: { status: string; method: string };
    github: { status: string; method: string; user: string; error?: { message: string; at: string } };
    pr_credits?: { status: string; method: string };
    tester_credits_live?: { status: string; method: string };
  };
  curseforge: {
    projects: Record<string, RemoteCurseForgeProject>;
  };
  github: {
    user: string;
    prs: { total: number; open: number; merged: number; closed_unmerged: number; items: Array<Record<string, unknown>> };
    issues: { total: number; open: number; closed: number; items: Array<Record<string, unknown>> };
    public_events: { count: number; items: Array<Record<string, unknown>> };
  };
  pr_credits?: Record<string, RemotePRCreditPR>;
  tester_credits_live?: Record<string, RemoteTesterLive>;
};

// Daily Wayback verification for a single CurseForge tester credit,
// written by scripts/update-remote-metrics.mjs.
export type RemoteTesterLive = {
  mod_url: string | null;
  mod: string | null;
  verified: boolean;
  verified_role: string | null;
  basis: "id+role" | "name+role" | "name-only" | "absent" | null;
  snapshot_url: string | null;
  snapshot_at: string | null;
  status: "ok" | "unverified" | "missing" | "stale" | "error" | "skipped";
  reason?: string;
  checked_at: string;
  error?: { message: string; at: string };
};

export type RemotePRCreditPR = {
  repo: string;
  number: number;
  state: "open" | "closed" | string;
  merged: boolean;
  merged_at: string | null;
  updated_at: string | null;
  status: "ok" | "stale" | "error" | string;
  error?: { message: string; at: string };
};

export type PRCreditPR = {
  number: number;
  title: string;
  url: string;
  author: string;
  state: "open" | "closed" | string;
  merged: boolean;
  merged_at: string | null;
  credit_excerpt: string;
};

export type PRCredit = {
  mod: string;
  mod_id: string;
  role: string;
  owner: string;
  repo: string;
  repo_url: string;
  mod_url: string;
  credit_form: string;
  credit_note?: string;
  prs: PRCreditPR[];
};

export type TesterCredit = Profile["curseforge"]["tester_credits"][number];

export const mods = modsData as Mod[];
export const bugs = bugsData as Bug[];
export const profile = profileData as Profile;
export const remoteMetrics = remoteMetricsData as unknown as RemoteMetrics;

// ---- dates -------------------------------------------------------------

export const isoDay = (iso: string | null | undefined): string | null => {
  if (!iso) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
};

/** Day the remote metrics (downloads, PR states, Wayback checks) were fetched. */
export const metricsDay = (): string | null => isoDay(remoteMetrics.fetched_at);

// ---- PR-body credits -----------------------------------------------------
// PR live state (merged / closed / open) is refreshed by the metrics
// workflow and merged in at read time.

type ProfileWithPRCredits = Profile & { pr_credits?: PRCredit[] };
const staticPRCredits = (profile as ProfileWithPRCredits).pr_credits ?? [];

const prKey = (repo: string, number: number) => `${repo}#${number}`;

export const prCredits = (): PRCredit[] => {
  const remote = remoteMetrics.pr_credits ?? {};
  return staticPRCredits.map((credit) => ({
    ...credit,
    prs: credit.prs.map((pr) => {
      const live = remote[prKey(credit.repo, pr.number)];
      if (!live || live.status === "error") return pr;
      return { ...pr, state: live.state, merged: live.merged, merged_at: live.merged_at };
    }),
  }));
};

export const prCreditsForMod = (modId: string): PRCredit | null =>
  prCredits().find((c) => c.mod_id === modId) ?? null;

export const mergedPRCount = (): number =>
  prCredits().reduce((sum, c) => sum + c.prs.filter((p) => p.merged).length, 0);

// ---- CurseForge member-list credits ---------------------------------------

const normalizeProjectName = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, "");

// `https://www.curseforge.com/minecraft/mc-mods/<slug>` -> normalised slug,
// the same key the metrics refresh script writes.
const curseforgeKeyFromUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const match = url.match(/curseforge\.com\/minecraft\/mc-mods\/([^/?#]+)/i);
  return match ? normalizeProjectName(match[1]) : null;
};

export const remoteProjectForCredit = (credit: TesterCredit): RemoteCurseForgeProject | null => {
  const projects = remoteMetrics.curseforge.projects;
  const fromUrl = curseforgeKeyFromUrl(credit.mod_url);
  if (fromUrl && projects[fromUrl]) return projects[fromUrl];
  const fromName = normalizeProjectName(credit.mod);
  if (fromName && projects[fromName]) return projects[fromName];
  return null;
};

/** Downloads from the latest metrics fetch, else the profile snapshot. */
export const creditDownloads = (credit: TesterCredit): { value: number; day: string | null } => {
  const remote = remoteProjectForCredit(credit);
  if (remote && typeof remote.downloads === "number") return { value: remote.downloads, day: metricsDay() };
  return { value: credit.downloads_at_snapshot, day: null };
};

export const liveTesterForCredit = (credit: TesterCredit): RemoteTesterLive | null => {
  const key = curseforgeKeyFromUrl(credit.mod_url);
  if (!key) return null;
  return remoteMetrics.tester_credits_live?.[key] ?? null;
};

const modNameKeys = (m: Mod) =>
  [m.name_en, m.name_zh.split("/").map((s) => s.trim()).pop() || ""].map((s) => s.toLowerCase().replace(/\s+/g, ""));

export const curseforgeCreditForMod = (m: Mod): TesterCredit | null => {
  const keys = new Set(modNameKeys(m));
  return profile.curseforge.tester_credits.find((c) => keys.has(c.mod.toLowerCase().replace(/\s+/g, ""))) ?? null;
};

export type ModCredit =
  | { kind: "curseforge"; credit: TesterCredit; live: RemoteTesterLive | null }
  | { kind: "pr"; credit: PRCredit };

/** The public tester credit recorded for a mod, if any. */
export const creditFor = (m: Mod): ModCredit | null => {
  const cf = curseforgeCreditForMod(m);
  if (cf) return { kind: "curseforge", credit: cf, live: liveTesterForCredit(cf) };
  const pr = prCreditsForMod(m.id);
  if (pr) return { kind: "pr", credit: pr };
  return null;
};

/** Mods with a recorded public credit (CurseForge member list or PR body). */
export const creditedModCount = (): number => mods.filter((m) => creditFor(m)).length;

export const getMcmodEntry = (m: Mod) => {
  const slugMap: Record<string, string> = {
    hotbath: "hotbath",
    shower_core: "showercore",
    instant_world_mirror: "instantworldmirror",
  };
  const target = slugMap[m.id];
  if (!target) return null;
  return profile.mcmod_cn.mods.find((x) => x.slug === target) || null;
};

// ---- team listing (case pages) ------------------------------------------------

export type TeamMember = {
  name: string;
  role: "owner" | "dev" | "art" | "design" | "tester" | "other";
  isLuck: boolean;
};

const ROLE_FROM_POSITION = (pos: string): TeamMember["role"] => {
  if (/owner|所有者/i.test(pos)) return "owner";
  if (/程序|dev|prog/i.test(pos)) return "dev";
  if (/美术|art/i.test(pos)) return "art";
  if (/策划|design|plan/i.test(pos)) return "design";
  if (/test|测试|qa/i.test(pos)) return "tester";
  return "other";
};

/** Members listed on the CurseForge page that carries the tester credit. */
export const curseforgeTeam = (m: Mod): TeamMember[] => {
  const credit = curseforgeCreditForMod(m);
  if (!credit) return [];
  return credit.all_team_members_on_mod.map((entry) => ({
    name: entry.name,
    role: ROLE_FROM_POSITION(entry.role),
    isLuck: entry.id === 136751338 || entry.name === "LUCK666DUCK",
  }));
};

// ---- totals ------------------------------------------------------------------

export const bugsForMod = (modId: string): Bug[] => bugs.filter((b) => b.mod_id === modId);
export const totalRounds = (): number => mods.reduce((sum, m) => sum + m.rounds.length, 0);
export const totalRegressionRounds = (): number =>
  mods.reduce((sum, m) => sum + m.rounds.filter((r) => r.label === "regression").length, 0);
export const totalBugs = (): number => mods.reduce((sum, m) => sum + m.total_bugs, 0);
export const hasRegression = (m: Mod): boolean => m.rounds.some((r) => r.label === "regression");
export const hasNoIssues = (m: Mod): boolean => m.total_bugs === 0;
export const testedVersions = (): string[] => [...new Set(mods.flatMap((m) => m.versions))].sort(compareVersion);

/** Mods ordered by number of logged entries. */
export const sortedMods = (): Mod[] => [...mods].sort((a, b) => b.total_bugs - a.total_bugs || a.name_en.localeCompare(b.name_en));

export const modMonogram = (m: Mod): string => m.name_en.trim().charAt(0).toUpperCase() || "?";

/** Display name: the Chinese name on Chinese pages, the English name otherwise. */
export const modName = (m: Mod, lang: Lang): string =>
  lang === "zh" ? m.name_zh.split(" / ")[0].trim() : m.name_en;

/** The other-language name, when it differs. */
export const modAltName = (m: Mod, lang: Lang): string | null => {
  const alt = lang === "zh" ? m.name_en : m.name_zh.split(" / ")[0].trim();
  return alt === modName(m, lang) ? null : alt;
};

// ---- rounds -----------------------------------------------------------------------

export type RoundGroup = { round: Round; n: number; entries: Bug[]; anchor: string };

/** A mod's entries grouped by the report they came from, in round order. */
export const roundsOf = (m: Mod): RoundGroup[] =>
  m.rounds.map((round, i) => ({
    round,
    n: i + 1,
    anchor: `r${i + 1}`,
    entries: bugs.filter((b) => b.mod_id === m.id && b.round_file === round.file).sort((a, b) => a.index - b.index),
  }));

export const entryAnchor = (m: Mod, b: Bug): string => {
  const i = m.rounds.findIndex((r) => r.file === b.round_file);
  return `r${i + 1}-${b.index}`;
};

// ---- categories --------------------------------------------------------------------

export const categoryCounts = (): Record<string, number> => {
  const m: Record<string, number> = {};
  for (const b of bugs) for (const c of b.categories) m[c] = (m[c] || 0) + 1;
  return m;
};

export const methodFor = (catId: string): Method | undefined => methods.find((m) => m.category_id === catId);

export const methodName = (catId: string, lang: Lang): string => {
  const m = methodFor(catId);
  return m ? (lang === "zh" ? m.name_zh : m.name_en) : catId;
};

export const methodsByCount = (): Array<Method & { count: number }> => {
  const counts = categoryCounts();
  return methods.map((m) => ({ ...m, count: counts[m.category_id] ?? 0 })).sort((a, b) => b.count - a.count);
};

export const bugsByCategory = (cat: string): Bug[] => bugs.filter((b) => b.categories.includes(cat));

/** Short, single-line entries for a category, one from each of the mods with the most. */
export const examplesFor = (cat: string, n = 2): Bug[] => {
  const pool = bugsByCategory(cat).filter(
    (b) => b.status !== "noted-not-bug" && !b.text_zh.includes("\n") && b.text_zh.length >= 16 && b.text_zh.length <= 72
  );
  const byMod = new Map<string, Bug[]>();
  for (const b of pool) byMod.set(b.mod_id, [...(byMod.get(b.mod_id) ?? []), b]);
  return [...byMod.values()]
    .sort((x, y) => y.length - x.length)
    .slice(0, n)
    .map((list) => list.find((b) => b.categories[0] === cat) ?? list[0]);
};

export const modCountsForCategory = (cat: string): Array<{ mod: Mod; count: number }> =>
  mods
    .map((mod) => ({ mod, count: bugsForMod(mod.id).filter((b) => b.categories.includes(cat)).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

export const modCategoryBreakdown = (modId: string): Array<{ cat: string; count: number }> => {
  const counts: Record<string, number> = {};
  for (const b of bugsForMod(modId)) for (const c of b.categories) counts[c] = (counts[c] || 0) + 1;
  return Object.entries(counts)
    .map(([cat, count]) => ({ cat, count }))
    .sort((a, b) => b.count - a.count);
};

// ---- coverage signals ----------------------------------------------------------------

const COMPAT_NAMES: Record<string, string> = {
  carryon: "Carry On",
  "serene-seasons": "Serene Seasons",
  "cold-sweat": "Cold Sweat",
  toughasnails: "Tough As Nails",
  "legendary-survival-overhaul": "Legendary Survival Overhaul",
};

export const signalLabel = (signal: string, lang: Lang): string => {
  const zh = lang === "zh";
  if (signal.startsWith("mod-compat:")) {
    const name = COMPAT_NAMES[signal.slice(11)] ?? signal.slice(11);
    return zh ? `兼容：${name}` : `With ${name}`;
  }
  const map: Record<string, [string, string]> = {
    "multi-version": ["1.20.1 与 1.21.1 对照", "1.20.1 vs 1.21.1"],
    "shader-tested": ["光影下测试", "Tested under shaders"],
    "cross-mod-with-alex-mods": ["兼容：Alex 系列", "With Alex's mods"],
    "regression-rounds": ["修复后复测", "Retested after fixes"],
    "i18n-zh-hk": ["繁中（香港）文本", "zh-HK text"],
    "i18n-zh-tw": ["繁中（台湾）文本", "zh-TW text"],
    "i18n-ja": ["日文文本", "Japanese text"],
    "no-issues-found": ["未发现问题", "No issues found"],
  };
  const pair = map[signal];
  return pair ? pair[zh ? 0 : 1] : signal;
};

// ---- versions -------------------------------------------------------------------------

const versionKey = (v: string): number[] =>
  v.split(".").map((n) => {
    const num = parseInt(n, 10);
    return Number.isFinite(num) ? num : 0;
  });
function compareVersion(a: string, b: string): number {
  const ak = versionKey(a), bk = versionKey(b);
  for (let i = 0; i < Math.max(ak.length, bk.length); i++) {
    const av = ak[i] ?? 0, bv = bk[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}
const minMaxVersion = (vs: string[]): { min: string; max: string } | null => {
  if (vs.length === 0) return null;
  const sorted = [...vs].sort(compareVersion);
  return { min: sorted[0], max: sorted[sorted.length - 1] };
};

// How a tested version beyond the canonical release was obtained.
const TESTED_QUALIFIER: Record<string, [string, string]> = {
  alex_caves: ["非官方移植", "unofficial port"],
  alex_mobs: ["社区移植", "community port"],
  sakura: ["私有构建", "private build"],
  villager_tourism: ["私有构建", "private build"],
  ping_system: ["私有构建", "private build"],
  construction_wand: ["KOTS 分支", "KOTS fork"],
};

export type VersionInfo = {
  tested: string[];
  supported: { min: string; max: string } | null;
  /** Set when a tested version is newer than the canonical release supports. */
  beyond: string | null;
};

export const versionInfo = (m: Mod, lang: Lang): VersionInfo => {
  const supported = minMaxVersion(m.mod_supported_versions);
  const tMax = minMaxVersion(m.versions)?.max;
  const beyondCanon = supported && tMax !== undefined && compareVersion(tMax, supported.max) > 0;
  const q = TESTED_QUALIFIER[m.id] ?? ["社区移植", "community port"];
  return { tested: m.versions, supported, beyond: beyondCanon ? q[lang === "zh" ? 0 : 1] : null };
};

/**
 * Scene previews. Set `real: true` only when an actual gameplay
 * screenshot has been captured and dropped into `public/scenes/<file>`.
 * The case page renders the figure only for `real: true` entries, so
 * generated stand-ins are never presented as captures.
 */
export interface SceneInfo {
  file: string;
  real: boolean;
}

export const SCENE_MAP: Record<string, SceneInfo> = {
  hotbath: { file: "hot-bath-scene.png", real: false },
  shower_core: { file: "shower-scene.png", real: false },
  alex_caves: { file: "caves-scene.png", real: false },
  alex_mobs: { file: "mobs-scene.png", real: false },
  pelagic_prehistory: { file: "prehistoric-scene.png", real: false },
};

export const sceneForMod = (m: Mod): SceneInfo | null => {
  const info = SCENE_MAP[m.id];
  if (!info || !info.real) return null;
  return info;
};

// ---- curated excerpts ----------------------------------------------------------------

export type EntryRef = { mod: string; file: string; index: number };

export const findEntry = (ref: EntryRef): { mod: Mod; bug: Bug } => {
  const mod = mods.find((m) => m.id === ref.mod);
  const bug = bugs.find((b) => b.mod_id === ref.mod && b.round_file === ref.file && b.index === ref.index);
  if (!mod || !bug) throw new Error(`Curated entry not found: ${ref.mod} / ${ref.file} #${ref.index}`);
  return { mod, bug };
};

export const roundOf = (m: Mod, b: Bug): { round: Round; n: number } => {
  const i = m.rounds.findIndex((r) => r.file === b.round_file);
  return { round: m.rounds[i], n: i + 1 };
};
