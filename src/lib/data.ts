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
  // The 4 most-active right now: top by `total_bugs` for credited and recent regression
  // → Hot Bath / Shower Core / Alex's Caves / Alex's Mobs (matches concept-v2 §3 hero sketch)
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

// emoji map per mod — concept-v2 §5 mod logo fallback
export const MOD_EMOJI: Record<string, string> = {
  hotbath: "🛁",
  shower_core: "🚿",
  alex_caves: "💎",
  alex_mobs: "🐾",
  pelagic_prehistory: "🐟",
  instant_world_mirror: "🪞",
  ok_orefinder: "⛏",
  sakura: "🌸",
  villager_tourism: "🧳",
  radios: "📻",
  leaning_tower: "🗼",
  ping_system: "📡",
  construction_wand: "🪄",
};

export const modEmoji = (m: Mod): string => MOD_EMOJI[m.id] ?? "🎮";

// in-game scene placeholder filename per mod (only the 4 large case files have a scene)
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

// Use the publicly verified members panel from CurseForge for credited mods,
// fall back to mcmod.cn for non-credited zh-side authors.
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

// Featured bug picker — pick first non-noted bug per mod. Prefer crash if any.
export const featuredBug = (m: Mod): Bug | null => {
  const all = bugsForMod(m).filter((b) => b.status !== "noted-not-bug");
  if (all.length === 0) return null;
  const crash = all.find((b) => b.categories.includes("crash"));
  return crash ?? all[0];
};

// helper: did this mod's later rounds contain regressions of `index`?
export const isUnfixedAcrossRounds = (m: Mod): number => {
  return bugsForMod(m).filter((b) => b.status === "unfixed").length;
};
