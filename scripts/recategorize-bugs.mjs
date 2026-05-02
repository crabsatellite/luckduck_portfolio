// scripts/recategorize-bugs.mjs
//
// Rewrites data/bugs.json with:
//   - cleaner category taxonomy (13 mutually-recognizable test-type tags)
//   - severity grade S0..S3 per bug
//
// Source of truth: text_zh + existing categories + existing status.
// Strategy: layered pattern matching — strongest signal wins for severity,
// every matched signal contributes a category. Manual escape hatches keyed
// on (mod_id, index, round_file) for the few bugs the heuristic gets wrong.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const bugsPath = resolve(here, "..", "data", "bugs.json");
const bugs = JSON.parse(readFileSync(bugsPath, "utf8"));

// ---------- pattern banks ----------------------------------------------------

const PATTERNS = {
  crash: [
    /闪退|崩溃|掉线|卡死|死循环|崩端|崩服|crash/i,
    /核爆.*掉线/,
  ],
  multiplayer: [
    /多人模式|服务端|联机|客户端.*服务器|服务器.*客户端|host|多人/,
  ],
  "mod-compat": [
    /兼容|carryon|cold\s*sweat|tough\s*as\s*nails|legendary\s*survival|serene\s*seasons|静谧四季|alex.*(?:caves|mobs).*(?:hot\s*bath|shower)|hot\s*bath.*alex|shower.*alex|mod\s*compat/i,
  ],
  achievement: [
    /成就|进度|advancement|achievement/i,
  ],
  i18n: [
    /翻译|本地化|繁中|繁体|繁體|简体|简中|日文|日語|英文|locale|i18n|缺失.*文本|文本.*缺失|歧义|歧義/,
    /语序|語序|文案/,
  ],
  recipe: [
    /配方|合成|酿造|堆肥(?!桶)|配料|烹饪|烹飪/,
    /堆肥桶/,
    /shapeless|shaped/i,
  ],
  shader: [
    /shader|光影|iris|optifine|sodium|rubidium/i,
  ],
  animation: [
    /动画|动作|挥舞|举起.*放下|放下.*举起|蓄力|拉弓|不下落|不落下|屏幕.*震动|震动.*屏幕|视角|第一人称|第三人称|越肩|旁观者视角|位置.*不对.*高度|高度.*不对|沉进地面|沉入地面|穿模|模型/,
  ],
  visual: [
    /贴图|颜色.*一样|颜色.*过浅|颜色.*过深|字体.*颜色|字体颜色|文字.*颜色|颜色.*相同|材质|纹理|UI|HUD|界面|渲染|图标/,
  ],
  "loot-drops": [
    /掉落|drop|战利品|精准采集|时运|抢夺|被击杀.*没有|击杀.*掉落/,
  ],
  "entity-behavior": [
    /生物.*行为|AI|寻路|繁殖|驯服|喂食|喂.*右键|生成.*生物|刷怪|不会(攻击|跟随|靠近|追)|怪物.*行为|放置.*地面|不会.*呼吸|呼吸.*不(对|正常)|不会保护|不会帮助/,
    /\b(ai|pathfind)/i,
  ],
  mechanic: [
    /右键|左键|shift\+|不能(食用|使用|放入|打开|开关|攻击|射击|防御|格挡|喂)|无法(食用|使用|放入|打开|开关|攻击|射击|防御|格挡|喂|进行|填充|放进|消耗|消耗经验|开门|开关门)|未实现|没有(?:实现|效果|功能)|不会触发|附魔.*冲突|可以同时附魔|buff.*(?:不|异常|错误|永久|没.*效果|没实现|失效)|效果.*没有(?:实现|生效)|经验.*消耗|长按右键|单击右键/,
    /传送门.*没.*形成|不会.*形成传送门|无法防御/,
  ],
  "spec-mismatch": [
    /应该.*却|本应.*却|实测.*不符|实测.*而非|不符合|不一致|wiki|百科|描述.*有误|文本.*有误|文本错误|描述错误|记录有误|说明.*不(对|符)|文本.*不(对|符)|应为.*实测|实测.*应为|应该掉落.*而不是|应该.*而非|本应只|应为|实测.*为|描述为.*实测/,
    /应该.*而不是/,
  ],
  regression: [
    /修复后.*第.*次检测|回归.*未修复|再次检测|二次检测|三次检测|依旧.*未修复|此条.*未修复|仍未修复/,
  ],
};

// Severity priority — first match wins.
// Each entry: { sev, test(text, cats) }
const SEVERITY_RULES = [
  { sev: "S0", test: (t, c) => c.has("crash") },
  { sev: "S0", test: (t) => /核爆.*掉线|存档.*损坏|存档.*丢失|无法保存|存档无法/.test(t) },
  { sev: "S1", test: (t, c) => c.has("multiplayer") && /掉线|不同步|卡死/.test(t) },
  { sev: "S1", test: (t, c) => c.has("achievement") && /(自动解锁|自动触发|未触发|没有触发)/.test(t) },
  { sev: "S1", test: (t, c) => c.has("mechanic") && /(未实现|没有实现|不会触发|无法.*打开|无法.*使用|无法.*放入|无法.*射击|无法.*开关门|无法防御|不能进入)/.test(t) },
  { sev: "S1", test: (t, c) => c.has("mod-compat") },
  { sev: "S2", test: (t, c) => c.has("entity-behavior") },
  { sev: "S2", test: (t, c) => c.has("loot-drops") },
  { sev: "S2", test: (t, c) => c.has("recipe") },
  { sev: "S2", test: (t, c) => c.has("spec-mismatch") },
  { sev: "S2", test: (t, c) => c.has("animation") },
  { sev: "S2", test: (t, c) => c.has("mechanic") },
  { sev: "S3", test: (t, c) => c.has("visual") },
  { sev: "S3", test: (t, c) => c.has("shader") },
  { sev: "S3", test: (t, c) => c.has("i18n") },
];

// ---------- manual overrides for ambiguous cases -----------------------------
// Only used when heuristic produces zero categories or wrong severity.
const MANUAL_CATEGORY_OVERRIDES = {
  // shape: "<mod_id>:<round_file>:<index>": ["cat1", "cat2"]
};

// ---------- per-bug classification ------------------------------------------

function classify(bug) {
  const text = bug.text_zh || "";
  const existing = new Set(bug.categories || []);
  const cats = new Set();

  // 1) carry forward explicit existing categories that are still valid
  const VALID_NEW = new Set([
    "crash", "multiplayer", "mod-compat", "achievement",
    "i18n", "recipe", "shader", "animation", "visual",
    "loot-drops", "entity-behavior", "mechanic", "spec-mismatch",
  ]);
  for (const c of existing) {
    if (VALID_NEW.has(c)) cats.add(c);
    // map old → new where needed
    if (c === "wiki-vs-impl") cats.add("spec-mismatch");
    if (c === "data-pack") cats.add("mechanic");
    if (c === "regression-tracked") {
      // not a category in the new model — we surface regression via status,
      // but if a bug carries this we keep mechanic/spec-mismatch context.
    }
  }

  // 2) apply text patterns
  for (const [cat, patterns] of Object.entries(PATTERNS)) {
    if (cat === "regression") continue; // handled via status
    for (const re of patterns) {
      if (re.test(text)) {
        cats.add(cat);
        break;
      }
    }
  }

  // 3) cleanup conflicting tags — when both visual and animation match,
  // prefer animation if text mentions movement/action.
  if (cats.has("visual") && cats.has("animation")) {
    if (/动画|挥舞|举起|放下|蓄力|视角|震动/.test(text)) {
      cats.delete("visual");
    }
  }

  // 4) entity-behavior + loot-drops both common; if "击杀.*掉落" prefer loot
  if (cats.has("entity-behavior") && cats.has("loot-drops") &&
      /击杀.*掉落|掉落.*击杀/.test(text) && !/AI|繁殖|驯服|寻路/.test(text)) {
    cats.delete("entity-behavior");
  }

  // 5) "右键无效" with no entity context => mechanic, not entity-behavior
  if (cats.has("entity-behavior") && /右键|左键/.test(text) &&
      !/(生物|怪物|动物|刷怪|繁殖|驯服|寻路|喂.*右键)/.test(text)) {
    cats.delete("entity-behavior");
    cats.add("mechanic");
  }

  // 6) manual override (last word)
  const key = `${bug.mod_id}:${bug.round_file}:${bug.index}`;
  if (MANUAL_CATEGORY_OVERRIDES[key]) {
    cats.clear();
    for (const c of MANUAL_CATEGORY_OVERRIDES[key]) cats.add(c);
  }

  // 7) backstop: if still empty, classify by structural cues
  if (cats.size === 0) {
    if (/右键|左键|shift\+|不能|无法|未实现|没有(?:实现|效果)/.test(text)) cats.add("mechanic");
    else if (/掉落|战利品/.test(text)) cats.add("loot-drops");
    else if (/生物|怪物|刷怪|繁殖|驯服|寻路|动物|生成/.test(text)) cats.add("entity-behavior");
    else if (/贴图|颜色|字体|UI|HUD|界面|渲染|图标|文字.*颜色/.test(text)) cats.add("visual");
    else if (/应该|本应|实测.*不|文本.*有误|描述.*有误|记录有误|wiki|百科/.test(text)) cats.add("spec-mismatch");
    else cats.add("spec-mismatch"); // catch-all: a bug with no other signal is almost always a spec deviation observation
  }

  // 8) severity
  let sev = "S2"; // default
  for (const rule of SEVERITY_RULES) {
    if (rule.test(text, cats)) { sev = rule.sev; break; }
  }
  // safety override: anything tagged crash → S0
  if (cats.has("crash")) sev = "S0";

  return { categories: [...cats].sort(), severity: sev };
}

// ---------- run --------------------------------------------------------------

const out = [];
const stats = {
  total: bugs.length,
  byCategory: new Map(),
  bySeverity: new Map(),
  uncategorizedBefore: 0,
};

for (const b of bugs) {
  if (!b.categories || b.categories.length === 0) stats.uncategorizedBefore++;
  const { categories, severity } = classify(b);
  for (const c of categories) stats.byCategory.set(c, (stats.byCategory.get(c) || 0) + 1);
  stats.bySeverity.set(severity, (stats.bySeverity.get(severity) || 0) + 1);
  out.push({ ...b, categories, severity });
}

writeFileSync(bugsPath, JSON.stringify(out, null, 2) + "\n", "utf8");

console.log(`recategorized ${stats.total} bugs (${stats.uncategorizedBefore} were uncategorized)\n`);
console.log("by category:");
[...stats.byCategory.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k.padEnd(18)} ${v}`));
console.log("\nby severity:");
[...stats.bySeverity.entries()].sort().forEach(([k, v]) => console.log(`  ${k}  ${v}`));
