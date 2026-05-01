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

export const caseNumber = (m: Mod): string => {
  const ordered = sortedMods();
  const idx = ordered.findIndex((x) => x.id === m.id);
  return String(idx + 1).padStart(2, "0");
};

export const dateLabel = (round: Round): string => {
  if (round.date) return round.date;
  return "intake";
};

export const roundOrdinal = (m: Mod, idx: number): string => {
  return `R${String(idx + 1).padStart(2, "0")}`;
};

export const allBugCategories = (): string[] => {
  const set = new Set<string>();
  for (const b of bugs) for (const c of b.categories) set.add(c);
  return Array.from(set).sort();
};
