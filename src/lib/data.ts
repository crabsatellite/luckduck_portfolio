import modsData from "../../data/mods.json";
import bugsData from "../../data/bugs.json";
import profileData from "../../data/profile.json";

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

export type Bug = {
  mod_id: string;
  version: string;
  round_date: string | null;
  round_file: string;
  index: number;
  text_zh: string;
  categories: string[];
  status: "fixed" | "unfixed" | "noted-not-bug" | null;
  regression_of: number | null;
};

export type Profile = typeof profileData;

export const mods = modsData as Mod[];
export const bugs = bugsData as Bug[];
export const profile = profileData as Profile;

const creditedSet = new Set(
  profile.curseforge.tester_credits.map((c) => c.mod.toLowerCase().replace(/\s+/g, ""))
);

const modNameKeys = (m: Mod) =>
  [m.name_en, m.name_zh.split("/").map((s) => s.trim()).pop() || ""].map((s) =>
    s.toLowerCase().replace(/\s+/g, "")
  );

export const isCredited = (m: Mod): boolean =>
  modNameKeys(m).some((k) => creditedSet.has(k));

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

export const SCENE_MAP: Record<string, string> = {
  hotbath: "hot-bath-scene.png",
  shower_core: "shower-scene.png",
  alex_caves: "caves-scene.png",
  alex_mobs: "mobs-scene.png",
  pelagic_prehistory: "prehistoric-scene.png",
};

export const sceneForMod = (m: Mod): string | null => SCENE_MAP[m.id] ?? null;

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
  const mcmod = getMcmodEntry(m);
  if (mcmod && mcmod.authors) {
    return mcmod.authors.map((a) => ({
      name: a.name,
      role: ROLE_FROM_POSITION(a.position),
      isLuck: false,
      emoji: "👤",
    }));
  }
  return [];
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
