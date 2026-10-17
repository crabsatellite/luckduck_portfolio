# LUCK666DUCK 测试覆盖统计

- **测试 mod 总数**：13 个（其中 11 个发现了问题，2 个无问题通过）
- **测试 bug 总数**：433 条
- **覆盖游戏版本**：1.20.1, 1.21.1
- **多版本对照测试**：6 个 mod 同时覆盖 1.20.1 与 1.21.1（Alex's Caves、Alex's Mobs、Instant World Mirror、Pelagic Prehistory、Shower Core、Hot Bath）
- **回归测试覆盖**：2 个 mod 进行了 5 个回归轮次（Hot Bath 4.1 / 4.5；Shower Core 4.5 / 4.6 / 4.18）
- **多语言验证**：3 种语言场景 — 日文、繁中（香港）、繁中（台湾）
- **跨 mod 兼容场景**：6 种独立兼容性测试 — 跨 Alex Mods / Alex Caves、CarryOn、Cold Sweat、Legendary Survival Overhaul、静谧四季 / Serene Seasons、ToughAsNails
- **最深单 mod 深度**：Alex 的洞穴 / Alex's Caves（1.20.1 / 1.21.1）共 141 条 bug

## 分类 Top 5（按出现次数）

- **视觉 / 渲染 / 贴图** (visual): 98 条
- **回归追踪** (regression-tracked): 56 条
- **规格与实测不符** (spec-mismatch): 32 条
- **生物行为** (entity-behavior): 27 条
- **合成 / 酿造 / 配方** (recipe): 22 条

## 状态分布

- open（初轮发现，未在记录中标注修复结果）: 369 条
- 未修复（unfixed，回归追踪）: 56 条
- 已修复（fixed）: 4 条
- 已澄清非 bug（noted-not-bug，开发回应）: 4 条

## 各 mod 测试规模

| Mod | 版本 | 总 bug 数 | 测试轮次 | 深度信号 |
|---|---|---|---|---|
| Alex 的洞穴 / Alex's Caves | 1.20.1 / 1.21.1 | 141 | 2 | multi-version, shader-tested |
| Alex 的生物 / Alex's Mobs | 1.20.1 / 1.21.1 | 125 | 2 | multi-version, mod-compat:carryon, shader-tested |
| 热水澡 / Hot Bath | 1.20.1 / 1.21.1 | 73 | 4 | multi-version, regression-rounds, i18n-zh-hk, i18n-zh-tw, i18n-ja, mod-compat:cold-sweat, mod-compat:toughasnails, mod-compat:legendary-survival-overhaul, cross-mod-with-alex-mods |
| 洗浴核心 / Shower Core | 1.20.1 / 1.21.1 | 43 | 5 | multi-version, regression-rounds, mod-compat:carryon, cross-mod-with-alex-mods, mod-compat:serene-seasons |
| 瞬时世界之镜 / Instant World Mirror | 1.20.1 / 1.21.1 | 19 | 2 | multi-version, cross-mod-with-alex-mods |
| 远洋史前 / Pelagic Prehistory | 1.20.1 / 1.21.1 | 13 | 2 | multi-version |
| 樱花 / Sakura | 1.21.1 | 12 | 1 | — |
| Ok 的探矿器 / Ok OreFinder | 1.21.1 | 3 | 1 | — |
| 村民旅游系统 / VillagerTourism | 1.21.1 | 2 | 1 | — |
| 无线电通讯方块 / Radios | 1.21.1 | 1 | 1 | — |
| 身体倾斜动画 / LeaningTower | 1.21.1 | 1 | 1 | — |
| ping_system | 1.21.1 | 0 | 1 | no-issues-found |
| ConstructionWand | 1.21.1 | 0 | 1 | no-issues-found |

## 数据说明

- bug 分类基于关键词启发式抽取，单条 bug 可同时归入多类。
- 状态字段：`fixed` / `unfixed` 仅在记录中明确标注（如「已修复」「此条未修复」「依旧未修复」）时填入；初轮记录默认 `null`，回归轮次默认 `unfixed`。
- `regression-rounds` 信号表示该 mod 经历了多轮提交-修复-回归测试循环，单次 mod 测试可达 3 轮以上。
- `multi-version` 信号表示同一 mod 同时在 1.20.1 与 1.21.1 上做了对照测试。
- 5 个小 mod 共享一份测试记录文件，其中 ping_system 与 ConstructionWand 在该轮测试中无问题（标记为 `no-issues-found`）。
