import modsData from "../../data/mods.json";
import bugsData from "../../data/bugs.json";
import profileData from "../../data/profile.json";
import methodologyData from "../../data/methodology.json";
import remoteMetricsData from "../../data/remote-metrics.json";

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
    prs: {
      total: number;
      open: number;
      merged: number;
      closed_unmerged: number;
      items: Array<Record<string, unknown>>;
    };
    issues: {
      total: number;
      open: number;
      closed: number;
      items: Array<Record<string, unknown>>;
    };
    public_events: {
      count: number;
      items: Array<Record<string, unknown>>;
    };
  };
  pr_credits?: Record<string, RemotePRCreditPR>;
  tester_credits_live?: Record<string, RemoteTesterLive>;
};

// Daily Wayback verification for a single CurseForge tester credit.
// Written by scripts/update-remote-metrics.mjs after probing
// archive.org for the closest snapshot of the mod page and checking
// that the user's id + Tester role still co-occur in the rendered
// member panel payload.
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

// PR-mode credits live alongside CurseForge tester credits. Each entry
// points at a mod and lists merged PRs whose body explicitly credits
// LUCK666DUCK as Tester. The PR live state (merged / closed / open)
// is refreshed daily via `update-remote-metrics.mjs` and merged in
// at read time so the surface never goes stale.
type ProfileWithPRCredits = Profile & { pr_credits?: PRCredit[] };
const staticPRCredits = (profile as ProfileWithPRCredits).pr_credits ?? [];

const remotePRMap = (): Record<string, RemotePRCreditPR> => {
  return remoteMetrics.pr_credits ?? {};
};

const prKey = (repo: string, number: number) => `${repo}#${number}`;

export const prCredits = (): PRCredit[] => {
  const remote = remotePRMap();
  return staticPRCredits.map((credit) => ({
    ...credit,
    prs: credit.prs.map((pr) => {
      const live = remote[prKey(credit.repo, pr.number)];
      if (!live || live.status === "error") return pr;
      return {
        ...pr,
        state: live.state,
        merged: live.merged,
        merged_at: live.merged_at,
      };
    }),
  }));
};

export const prCreditsForMod = (modId: string): PRCredit | null => {
  return prCredits().find((c) => c.mod_id === modId) ?? null;
};

// Total number of mods with a publicly verifiable Tester credit
// (CurseForge member panel + merged-PR body, deduped by mod_id).
export const hardCreditModCount = (): number => {
  const modIds = new Set<string>();
  for (const c of profile.curseforge.tester_credits) {
    const key = c.mod.toLowerCase().replace(/[^a-z0-9]/g, "");
    modIds.add(key);
  }
  for (const c of staticPRCredits) {
    modIds.add(c.mod_id);
  }
  return modIds.size;
};

export const mergedPRCount = (): number =>
  staticPRCredits.reduce(
    (sum, c) => sum + c.prs.filter((p) => p.merged).length,
    0
  );

const normalizeProjectName = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

// Pull the CurseForge slug out of a mod URL like
// `https://www.curseforge.com/minecraft/mc-mods/<slug>`. This is the
// same key the daily refresh script uses when writing remote-metrics,
// so any new tester credit added to profile.json resolves
// automatically as long as it has a valid mod_url.
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

export const creditDownloads = (credit: TesterCredit): number => {
  const remote = remoteProjectForCredit(credit);
  if (remote && typeof remote.downloads === "number") return remote.downloads;
  return credit.downloads_at_snapshot;
};

export const formatCompactNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString("en-US");
};

export const creditDownloadsLabel = (credit: TesterCredit): string =>
  `${creditDownloads(credit).toLocaleString("en-US")} DL`;

export const creditDownloadsCompactLabel = (credit: TesterCredit): string =>
  `${formatCompactNumber(creditDownloads(credit))} DL`;

export const hotBathDownloadsCompactLabel = (): string => {
  const credit = profile.curseforge.tester_credits.find(
    (c) => curseforgeKeyFromUrl(c.mod_url) === "hotbath"
  );
  return credit ? creditDownloadsCompactLabel(credit) : "1M+ DL";
};

const creditedSet = new Set(
  profile.curseforge.tester_credits.map((c) => c.mod.toLowerCase().replace(/\s+/g, ""))
);

const modNameKeys = (m: Mod) =>
  [m.name_en, m.name_zh.split("/").map((s) => s.trim()).pop() || ""].map((s) =>
    s.toLowerCase().replace(/\s+/g, "")
  );

export const isCredited = (m: Mod): boolean =>
  modNameKeys(m).some((k) => creditedSet.has(k));

// Wayback live-verification helpers. The case page can use these to
// render "verified · YYYY-MM-DD" alongside the static badge so the
// reader sees a real, dated proof rather than a months-old curation.
const liveTesterMap = (): Record<string, RemoteTesterLive> =>
  remoteMetrics.tester_credits_live ?? {};

export const liveTesterForCredit = (credit: TesterCredit): RemoteTesterLive | null => {
  const key = curseforgeKeyFromUrl(credit.mod_url);
  if (!key) return null;
  return liveTesterMap()[key] ?? null;
};

const creditsForMod = (mod: Mod): TesterCredit[] => {
  const keys = new Set(modNameKeys(mod));
  return profile.curseforge.tester_credits.filter((c) =>
    keys.has(c.mod.toLowerCase().replace(/\s+/g, ""))
  );
};

export const liveTesterForMod = (mod: Mod): RemoteTesterLive | null => {
  for (const credit of creditsForMod(mod)) {
    const live = liveTesterForCredit(credit);
    if (live) return live;
  }
  return null;
};

export const formatVerifiedDate = (iso: string | null | undefined): string | null => {
  if (!iso) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
};

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

export const sortedMods = (): Mod[] => {
  return [...mods].sort((a, b) => {
    const ac = isCredited(a) ? 1 : 0;
    const bc = isCredited(b) ? 1 : 0;
    if (ac !== bc) return bc - ac;
    return b.total_bugs - a.total_bugs;
  });
};

export const activeMods = (): Mod[] => {
  const wanted = ["hotbath", "shower_core", "alex_caves", "alex_mobs"];
  return wanted
    .map((id) => mods.find((m) => m.id === id))
    .filter((m): m is Mod => Boolean(m));
};

export const bugsForMod = (modId: string): Bug[] => {
  return bugs.filter((b) => b.mod_id === modId);
};

export const totalRounds = (): number => mods.reduce((sum, m) => sum + m.rounds.length, 0);

export const totalRegressionRounds = (): number =>
  mods.reduce((sum, m) => sum + m.rounds.filter((r) => r.label === "regression").length, 0);

export const totalBugs = (): number => mods.reduce((sum, m) => sum + m.total_bugs, 0);

export const hasRegression = (m: Mod): boolean =>
  m.rounds.some((r) => r.label === "regression");

export const hasNoIssues = (m: Mod): boolean =>
  m.total_bugs === 0;

export const logNumber = (m: Mod): string => {
  const ordered = sortedMods();
  const idx = ordered.findIndex((x) => x.id === m.id);
  return String(idx + 1).padStart(2, "0");
};

export const allBugCategories = (): string[] => {
  const set = new Set<string>();
  for (const b of bugs) for (const c of b.categories) set.add(c);
  return Array.from(set).sort();
};

// Monogram fallback letter (first char of name_en, uppercase) for mods
// that have no raster logo. Used by ModCard.
export const modMonogram = (m: Mod): string => {
  const c = m.name_en.trim().charAt(0).toUpperCase();
  return c || "?";
};

// Semver-ish ordering for MC version strings like "1.20.1", "1.21.3", "1.16.5".
const versionKey = (v: string): number[] => {
  return v.split(".").map((n) => {
    const num = parseInt(n, 10);
    return Number.isFinite(num) ? num : 0;
  });
};
const compareVersion = (a: string, b: string): number => {
  const ak = versionKey(a), bk = versionKey(b);
  for (let i = 0; i < Math.max(ak.length, bk.length); i++) {
    const av = ak[i] ?? 0, bv = bk[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
};
const minMaxVersion = (vs: string[]): { min: string; max: string } | null => {
  if (vs.length === 0) return null;
  const sorted = [...vs].sort(compareVersion);
  return { min: sorted[0], max: sorted[sorted.length - 1] };
};

// Per-mod qualifier text when tested goes beyond canonical supported max.
const TESTED_QUALIFIER: Record<string, string> = {
  alex_caves: "unofficial port",
  alex_mobs: "community port",
  sakura: "private build",
  villager_tourism: "private build",
  ping_system: "private build",
  construction_wand: "KOTS fork",
};

// Render the version meta line for a mod card or case header.
//
// Rules:
// - supported empty → "tested X / Y"
// - tested_max > supported_max → "MC {min} → {max} (canonical) · tested X / Y ({qualifier})"
// - else → "MC {min} → {max} · tested X / Y"
export const modVersionMeta = (m: Mod): string => {
  const tested = m.versions;
  const supported = m.mod_supported_versions;
  if (supported.length === 0) {
    return `tested ${tested.join(" / ")}`;
  }
  const sRange = minMaxVersion(supported)!;
  const tMax = minMaxVersion(tested)?.max;
  const beyond = tMax !== undefined && compareVersion(tMax, sRange.max) > 0;

  if (beyond) {
    const q = TESTED_QUALIFIER[m.id] ?? "community port";
    return `MC ${sRange.min} → ${sRange.max} (canonical) · tested ${tested.join(" / ")} (${q})`;
  }
  return `MC ${sRange.min} → ${sRange.max} · tested ${tested.join(" / ")}`;
};

// Same data, zh-styled separator.
export const modVersionMetaZh = (m: Mod): string => {
  const tested = m.versions;
  const supported = m.mod_supported_versions;
  if (supported.length === 0) {
    return `测试 ${tested.join(" / ")}`;
  }
  const sRange = minMaxVersion(supported)!;
  const tMax = minMaxVersion(tested)?.max;
  const beyond = tMax !== undefined && compareVersion(tMax, sRange.max) > 0;
  const QUAL_ZH: Record<string, string> = {
    alex_caves: "非官方移植",
    alex_mobs: "社区移植",
    sakura: "私有构建",
    villager_tourism: "私有构建",
    ping_system: "私有构建",
    construction_wand: "KOTS 分支",
  };
  if (beyond) {
    const q = QUAL_ZH[m.id] ?? "社区移植";
    return `MC ${sRange.min} → ${sRange.max} (官方) · 测试 ${tested.join(" / ")} (${q})`;
  }
  return `MC ${sRange.min} → ${sRange.max} · 测试 ${tested.join(" / ")}`;
};

// Aggregate min/max across ALL mods for the about + footer "version-agnostic" copy.
export const allMcVersionRange = (): { min: string; max: string } | null => {
  const all: string[] = [];
  for (const m of mods) {
    all.push(...m.mod_supported_versions);
    all.push(...m.versions);
  }
  return minMaxVersion(all);
};

/**
 * Each mod can declare a scene preview image. Set `real: true` only
 * when an actual gameplay screenshot has been captured and dropped
 * into `public/scenes/<file>`. The case page renders the scene
 * figure only for entries flagged `real: true` — placeholder
 * stand-ins stay hidden so the page never advertises art that
 * isn't really there.
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

export type TeamMember = {
  name: string;
  role: "owner" | "dev" | "art" | "design" | "tester" | "other";
  isLuck: boolean;
  emoji: string;
};

const ROLE_FROM_POSITION = (pos: string): TeamMember["role"] => {
  if (/owner|所有者/i.test(pos)) return "owner";
  if (/程序|dev|prog/i.test(pos)) return "dev";
  if (/美术|art/i.test(pos)) return "art";
  if (/策划|design|plan/i.test(pos)) return "design";
  if (/test|测试|qa/i.test(pos)) return "tester";
  return "other";
};

export const teamForMod = (m: Mod): TeamMember[] => {
  const credit = profile.curseforge.tester_credits.find((c) => {
    const k = c.mod.toLowerCase().replace(/\s+/g, "");
    return modNameKeys(m).includes(k);
  });
  if (credit) {
    return credit.all_team_members_on_mod.map((entry) => {
      const role = ROLE_FROM_POSITION(entry.role);
      const isLuck = entry.id === 136751338 || entry.name === "LUCK666DUCK";
      return {
        name: entry.name,
        role,
        isLuck,
        emoji: isLuck ? "🦆" : "👤",
      };
    });
  }

  // PR-credited mods (Alex's Caves / Mobs): start from the mcmod
  // author list when available, then append LUCK666DUCK as tester
  // so the case page reflects the public PR credit.
  const prCredit = prCreditsForMod(m.id);
  const mcmod = getMcmodEntry(m);
  let base: TeamMember[] = [];
  if (mcmod && mcmod.authors) {
    base = mcmod.authors.map((a) => ({
      name: a.name,
      role: ROLE_FROM_POSITION(a.position),
      isLuck: false,
      emoji: "👤",
    }));
  }
  if (prCredit) {
    const already = base.some((b) => b.name === "LUCK666DUCK");
    if (!already) {
      base.push({
        name: "LUCK666DUCK",
        role: "tester",
        isLuck: true,
        emoji: "🦆",
      });
    }
  }
  return base;
};

export const featuredBug = (m: Mod): Bug | null => {
  const all = bugsForMod(m.id).filter((b) => b.status !== "noted-not-bug");
  if (all.length === 0) return null;
  const crash = all.find((b) => b.categories.includes("crash"));
  return crash ?? all[0];
};

export const isUnfixedAcrossRounds = (m: Mod): number => {
  return bugsForMod(m.id).filter((b) => b.status === "unfixed").length;
};

// ---- methodology / category aggregation ------------------------------------

export const bugsByCategory = (cat: string): Bug[] =>
  bugs.filter((b) => b.categories.includes(cat));

export const categoryCounts = (): Record<string, number> => {
  const m: Record<string, number> = {};
  for (const b of bugs) for (const c of b.categories) m[c] = (m[c] || 0) + 1;
  return m;
};

export const methodFor = (catId: string): Method | undefined =>
  methods.find((m) => m.category_id === catId);

// Per-mod category breakdown used in case page sidebar.
export const modCategoryBreakdown = (modId: string): Array<{ cat: string; count: number }> => {
  const counts: Record<string, number> = {};
  for (const b of bugsForMod(modId)) {
    for (const c of b.categories) counts[c] = (counts[c] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([cat, count]) => ({ cat, count }))
    .sort((a, b) => b.count - a.count);
};

// Featured cases for home page — manually curated to highlight depth.
export const featuredMods = (): Mod[] => {
  const wanted = ["hotbath", "alex_caves", "shower_core"];
  return wanted
    .map((id) => mods.find((m) => m.id === id))
    .filter((m): m is Mod => Boolean(m));
};
