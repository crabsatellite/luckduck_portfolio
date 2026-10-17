# LUCK666DUCK — Portfolio Design Concept v2

> **Companion documents:** `audit.md` (why v1 felt 违和), `research.md` (14 reference sites surveyed). v1's `concept.md` remains for diff comparison only.
> Subject: Tingfeng Yang (LUCK666DUCK) — Minecraft mod QA tester.
> Real numbers (unchanged from v1): 13 mods tested, 433 bugs filed, 24 test rounds, 5 regression rounds, 2 verified-tester credits (Hot Bath 1M+ downloads, Instant World Mirror), bilingual zh/en, GitHub Pages static.

---

## 0. Diagnosis — what changed in our brief

v1 was internally consistent and externally misaligned. The forensic-log genre signaled to the wrong reader. v2's brief is to keep the *substance* of v1 (the regression-thread idea, the dense-data-as-evidence backbone) while replacing the *tonal frame* with one native to the Minecraft modding community.

The audience is not Big-4 hiring managers. It is mod authors — hobbyist, warm, often-Chinese-speaking, Discord-fluent, pixel-art-affectionate, used to Modrinth's saturated green and CurseForge's mod-icon-led grids. Six of v1's findings were HIGH-severity (genre, type voice, sterility, density-before-character, no raster, alien case-file vocab). v2 must reverse all of them.

---

## 1. Three v2 directions explored

Each direction below is grounded in at least 2 reference sites from `research.md`. Token sets are illustrative, not yet implementation-ready (BuildAgent will refine).

### Direction X — `LD-bath-house` (warm-bath / cozy-tester) ⭐ **recommended**

**Antecedents:** R-6 gaiety.me (Catppuccin-warm-dark, mascot, retro badges), R-1 Modrinth (saturated single-accent on dark), R-10 Nazareno Rivero (first-person opener), R-13 Max Bittker (Unicode/ASCII dividers, "send me a letter" warmth), and the user's own subject matter — Hot Bath / Shower Core / hygiene mods are *literally about warm water*. The portfolio leans into that thematic match: a tester whose flagship mods are bath/shower mods has a built-in design metaphor that costs nothing to claim.

**Stance vs v1 audit:**
- Reverses **F1 (genre)**: warm-bath / cozy-tester is community-native, not institutional.
- Reverses **F2 (type voice)**: drops mono-as-display; uses a friendly humanist sans for body and mono only for actual data (versions, bug IDs, counts).
- Reverses **F3 (sterility)**: introduces a duck mascot, mod-logo raster, ASCII steam-curl dividers (`～～～`), warm gradient banner, micro-animation on hover.
- Reverses **F4 (density before character)**: hero opens with mascot + first-person greeting + 1-line role + active mods, *then* unfolds to stats + cases.
- Reverses **F6 (no personal artifacts)**: GitHub avatar, mod logos at 64×96px, ASCII art, in-game screenshots on case pages.
- Reverses **F7 (alien vocab)**: replaces `CASE-FILE / CS-04` with `测试日志 #04 — Alex's Mobs` / `tester log #04`, native modder vocabulary.

**Palette — `bath-house` (extends Catppuccin Latte/Mocha pairing):**

```
DARK (default — soak-mode):
--bg            #1c1d2a   warm-deep blue-violet (Catppuccin Macchiato base, slightly warmed)
--bg-soft       #25273a   panel
--bg-raised     #2c2e44   raised card
--ink           #f4ebd9   warm-cream paper text (slightly off Catppuccin text — warmer)
--ink-soft      #c8c0b0
--ink-mute      #8e8a7d
--accent        #f9c47a   duck-yellow / honey-amber (between Catppuccin peach and yellow)
--accent-deep   #e89c4d   deeper amber for hover/active
--steam         #b8d8e6   pale steam-blue, secondary accent
--ok            #a6e3a1   verified-fixed Catppuccin green
--warn          #f9c47a   open/regressed (uses accent)
--alert         #f38ba8   crash/critical Catppuccin pink-red
--rule          #3a3d56   visible hairline on dark

LIGHT (alt — daylight-mode):
--bg            #fdf6e3   warm cream paper (Solarized-light influence)
--bg-soft       #f4ecd8
--bg-raised     #ece4d0
--ink           #2e2a1d   warm dark
--ink-soft      #5e5a4d
--ink-mute      #8e8a7d
--accent        #d97e1c   honey-amber on light
--accent-deep   #a85a14
--steam         #6a92a8
--ok            #3aa05c
--warn          #d97e1c
--alert         #b53055
--rule          #d8d0bc
```

The dark mode is roughly Catppuccin Macchiato-warmed; the light mode is Solarized-light-warmed. The single dominant accent is *duck yellow / honey amber* — the connection to the duck mascot AND the bath-water-warmth is unforced.

**Typography (open-source only, all self-hosted):**
- Body Latin: **Lora Variable** (OFL) OR **Sora Variable** (OFL) — humanist, slightly rounded, friendly. Decision deferred to BuildAgent based on weight-axis support and CJK-Latin baseline match. Default leaning: **Sora Variable** for cleaner CJK pairing.
- Body CJK: **LXGW WenKai Screen R** (霞鹜文楷屏幕 R, OFL) — rounded, slightly handwritten, very friendly. Crucially *not* Noto Sans SC (system-default-feeling). LXGW WenKai is the de-facto "warm zh font" of the indie/open-source Chinese web in 2025-2026.
- Mono / numerals / data: **JetBrains Mono Variable** (OFL) — kept from v1 but demoted to *data only* (version strings, bug counts, IDs, dates). Never used for display headings.
- Display / hero name: also **Sora Variable** at heavy weight (700-800), or **Lora Variable** if we go warmer-serif. NOT mono.
- Pixel-art labels (badges, mascot dialogue): **VT323** OR **Cubic 11** for selective decoration — only on retro-style 88×31 badges in the footer/sidebar.

**Key visual motifs:**

1. **The duck mascot.** A small (96×96 hero / 32×32 nav / 24×24 favicon) pixel-art rubber-duck character. Hand-pixeled, ~5-color palette using duck-yellow + steam-blue + accent-deep. Two states: idle and "found a bug" (eyes-wide animation 200ms loop). Appears in hero, in 404 pages, as a watermark in case-thread sections. Generated by BuildAgent (script-generates 16×16 base sprite; no Mojang trademark contact).

2. **Steam-curl dividers.** Replace v1's hairline `<hr>` with hand-pixeled or ASCII steam curls: `～ 💧 ～ 💧 ～` or a 32px-tall SVG of a steam wisp. Used at section breaks in case studies. Adopts R-13's decorative-divider pattern in a Minecraft-bath vocabulary.

3. **Mod-card with mod-logo.** Real mod logo at 96×96 with `image-rendering: pixelated` flag (per-mod data switch). Card has rounded 8px corners (vs v1's hard 0px), warm cream `--ink` on warm-deep `--bg-soft` panel, duck-yellow accent strip on left edge but at 6px (chunkier than v1's hairline 4px). Hover: subtle 1px lift + accent-deep stripe glow. Bug-count badge in mono yellow numerals on dark panel.

4. **Test log timeline (renamed from "regression thread").** v1's signature element survives, reframed: `测试日志` / `tester log`. Same vertical-thread shape with dots at each round, but dot is a small water-drop pixel-art icon (3 frames per round: drop forming → falling → splash) instead of a filled circle. Round labels read like "Hot Bath 4.1 → 4.5: 14 条 confirmed fixed, 7 条 still" rather than "regression round 1 — 18 entries".

5. **Members-panel echo.** Each case-study page has a "team" mini-block at top mirroring CurseForge's Members panel (R-2). Avatars + role pills:
   ```
   👤 CrabMods (Owner) · 👤 ModderAlex (程序) · 👤 DoraWolf (美术) · 🦆 LUCK666DUCK (Tester ✓)
   ```
   The duck emoji or the duck mascot 32×32 stands in for LUCK666DUCK's avatar. Team panel adopts the visual pattern visitors are *already trained on* from CurseForge mod pages.

6. **Retro-90s footer badges.** 88×31 gif/svg badges in pixel-art style:
   - `[MC 1.20.1 ✓]`
   - `[MC 1.21.1 ✓]`
   - `[Hot Bath 1M+ DL]`
   - `[verified tester]`
   - `[powered by 🦆]`
   - `[bilingual zh/en]`
   These are decoration *and* data. Adopted from R-6 gaiety.me's retro-90s footer pattern.

7. **In-game screenshot strips.** Each major case page (Hot Bath, Shower Core, Alex's Caves) has a 1-2 image strip showing the actual in-game scenarios where bugs were filed. Wide aspect (1280×400 typical). Captioned with the bug ID it relates to. Adopted from R-5 tterrag and R-7 itch.io creator pages. (Sourcing note: BuildAgent generates *placeholder* in-game-style scenes from MC's open vanilla blocks if no real screenshots are provided; user can swap real screenshots later. No Mojang trademarks in placeholders.)

**Layout language:** medium density (40-60% data-bearing pixels — between v1's 80% and DoraWolf's 50%). 12-col grid but with breathing rooms; rounded panels (8px radius); hairlines softened to `--rule` mid-gray; gradient-on-hover instead of flat-color-on-hover. Soak-mode (dark) as default with respect for system preference; daylight-mode (light) as alt — both use the same accent (duck-yellow / honey-amber) so brand is consistent. Mobile collapses to single col with mascot promoted to top of stack.

**Vibe-contrast vs v1:** night-and-day. v1 is graphite forensic SOC2 audit; v2 is warm-bathhouse cozy-tester log. They share zero design tokens.

**Vibe-contrast vs DoraWolf:** still distinct. DoraWolf is warm-cream paper + serif editorial + airy galleries + raster architecture photography + scroll-reveal animation + custom-cursor. v2-X is warm-deep night + sans humanist + medium density + pixel-art mascot + mod-icon raster + micro-hover-only motion + no-cursor-swap. Both are warm; that's the only overlap. DoraWolf is *gallery-warm*; v2-X is *living-room-warm* — different rooms.

**Trade-offs (honest):**
- Warm tone risks reading "less professional" to a hypothetical English-speaking corporate viewer. We accept this — the audience is not corporate, and "verified tester" badges + 1M+ DL Hot Bath credit + 433-bug count carry the rigor signal.
- The duck mascot must be *good*. A bad mascot is worse than no mascot. Mitigation: BuildAgent generates 3 variants and we pick the best; if all fail, fall back to a clean text-logo "LD" mark in the same accent color.
- Catppuccin-adjacent palette is a known *family* — this means we look fluent in indie-tech but also slightly less unique than v1's bespoke graphite. Mitigation: the warm-cream `--ink` shifted off Catppuccin spec, plus the duck-yellow accent (peach×yellow blend not in stock Catppuccin), gives us our own variant.
- LXGW WenKai is the *most popular* CJK web font in indie Chinese spaces, which means visitors might recognize it. That's fine — recognition signals "you're using community fonts", which reinforces the community-native frame.

---

### Direction Y — `Inventory-slot grid` (Minecraft-launcher-native) — anti-rec

**Antecedents:** v1 Direction B (`pixel-CRT-survival`), R-7 itch.io creator pages, R-9 pixel-art portfolios.

**Stance:** commit hard to a Minecraft launcher visual chrome. 64×64 inventory-slot grid for mod cards (with chunky 4px black border + 2px highlight bevel — generic block-game button style without copying any specific Mojang asset). Pixel-art everywhere: VT323 + Cubic 11 fonts, scanlines, pure-pixel mascot. Color palette draws from "redstone red / lapis blue / emerald green / oak brown / parchment cream / dirt brown" Minecraft-native swatches.

**Why it's not the recommendation:** v1's own Direction B already articulated this and it was rejected for a reason — pixel-CRT chrome competes with the data, and a cold-outreach tester portfolio needs the *substance* (433 bugs, regression rounds, verified credits) to register before the chrome. A mod-author scanning the page in 8 seconds processes pixel chrome as "this is a fun pixel-art site" — *which* is fine for a hobbyist creator's site but reads as low-credibility for a *tester for hire*. Pixel-CRT is also fundamentally inaccessible: Cubic 11 at 11px loses readability on low-DPI 35+ year old eyes, which is a non-trivial slice of the modder audience.

The audit reversed v1's failure away from coldness, but Y over-corrects into commit-too-hard nostalgia. We want warmth + community + pixel *flavor*, not pixel-fundamentalism.

**Trade-off (if BuildAgent ever wants to revisit):** Y is the design that wins on Awwwards and loses on conversion. We are not building a portfolio for awards.

---

### Direction Z — `Friend-zone modlist` (modpack-manifest-native) — anti-rec

**Antecedents:** R-2 CurseForge mod pages, R-8 game jam entries, R-14 Lynn Fisher (versioned playful sections).

**Stance:** lean fully into the modpack/manifest vocabulary. The whole portfolio is structured as a "loadout" or "modpack manifest" — every section labeled `mods.toml` / `config/` / `screenshots/` etc. Hero is "LUCK666DUCK's modpack — 13 mods loaded, 433 issues triaged". Each tested mod becomes a `[entry]` in a TOML-like rendered block. Bilingual handles both as the modpack `description.zh.txt` and `description.en.txt`. Heavy use of file-path notation as decoration.

**Why it's not the recommendation:** the manifest metaphor is *clever* — it would land hard with developer-side modders — but it has the same flaw as v1's case-file metaphor: it's a single sustained metaphor that demands the audience accept it. CurseForge modpacks are configured by a small subset of MC players (those who run modded servers); a generic mod author who just authors a single mod might not viscerally feel the manifest format. Direction X's bath-house metaphor is *grounded in the user's actual flagship mods* (Hot Bath, Shower Core), which is a stronger and more personal anchor than a generic-loadout metaphor.

Also: TOML/YAML rendering re-introduces mono-as-display (audit F2). Same trap, different vocabulary.

**Trade-off:** if the user is more interested in being read as developer-adjacent than as community-warm, Z could be revisited. The brief said audience is mod authors broadly (artists, hobbyists, modpack authors, content creators) — not just dev-modders — so X has wider reach.

---

## 2. Recommendation — **Direction X (`bath-house`)**

Pick X for execution.

The decision rests on five evidence points from `audit.md` and `research.md`:

1. **Audience fit:** R-6 gaiety.me is a working example of an MC-modder personal site that uses warm-Catppuccin + mascot + retro-badges and works. We have a near-1:1 template.
2. **Subject-matter alignment:** the user's flagship CurseForge credits are *Hot Bath* (1M+ DL bath-mod) and *Shower Core* (hygiene-shower mod). The portfolio's metaphor (warm-water, soak-mode, steam-curl dividers, duck mascot) literally maps onto the work itself. No metaphor is closer to free than this one.
3. **First impression:** the duck mascot + first-person greeting fixes audit's HIGH-severity F4 (density-before-character) in the hero. R-10 Nazareno's "Hi, I'm ___" pattern is proven.
4. **Continuity:** the regression-thread / test-log idea — the single strongest piece of v1 — survives intact, just renamed and given a better visual vocabulary (water-drop dots vs filled circles).
5. **Distinctness from DoraWolf:** the warm-deep night palette + sans humanist + pixel-art mascot puts v2 in a different design lineage than DoraWolf's warm-cream paper + serif editorial + architecture photography. Both are warm; that's not enough overlap to confuse them.

Y (pixel-launcher) over-commits and risks the credibility ceiling. Z (manifest-loadout) is clever but inherits v1's monospace-display trap. X is the path.

---

## 3. Component sketches (Direction X — bath-house)

### Hero block (homepage `/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～    │
│                                                                            │
│   ╭─🦆────╮                                                                │
│   │ duck  │      Hi, I'm Tingfeng — LUCK666DUCK.                           │
│   │ 96×96 │      嗨，我是楊庭鳳。                                            │
│   ╰───────╯                                                                │
│                  I test Minecraft mods, mostly hygiene & bath ones,        │
│                  on 1.20.1 and 1.21.1. 简体 / 繁中 / 日文 / English.          │
│                                                                            │
│                  [tested 13 mods · filed 433 bugs · 24 rounds] →            │
│                                                                            │
│  ╭──────────╮ ╭──────────╮ ╭──────────╮ ╭──────────╮                       │
│  │ [HotBath]│ │[ShowerC.]│ │[A.Caves] │ │[A.Mobs]  │  active right now      │
│  │  73 bugs │ │  43 bugs │ │ 141 bugs │ │ 125 bugs │  ↓ see all 13          │
│  │  ✓ tester│ │   1.20.1 │ │  shaders │ │  carryon │                        │
│  ╰──────────╯ ╰──────────╯ ╰──────────╯ ╰──────────╯                       │
│                                                                            │
│  ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～    │
└────────────────────────────────────────────────────────────────────────────┘
```

The hero has a *face* (duck mascot stands in for visual identity). The greeting is first-person bilingual. The 4-mod "active" strip lets the visitor see what's happening *now* without scrolling. The steam-curl dividers (`～ 💧`) are the section rhythm marker. The hero never opens with bare numerals.

Hero name: Sora Variable (or Lora) at clamp(2.4rem, 6vw, 4rem), weight 700. The CJK greeting on the second line in LXGW WenKai 500. Numerals (13 / 433 / 24) inline in JBM mono inside the body sentence — mono is *demoted* to data-only.

### Mod card (warm version)

```
╭─ 6px duck-yellow stripe (left edge) ─────────────────────────────────────╮
│                                                                          │
│    ┌────────┐    Hot Bath                                                │
│    │  🛁    │    热水澡                                              ✓    │
│    │ 96x96  │    1.20.1 / 1.21.1 · Forge                          tester  │
│    │  logo  │                                                            │
│    └────────┘    ╔══════════╗                                            │
│                  ║  73      ║  bugs filed across                         │
│                  ║          ║  4 rounds                                  │
│                  ╚══════════╝                                            │
│                                                                          │
│   洗澡得有热水。这套 mod 给玩家提供了 13 种可定制的浴桶+液体, 我从 4.1     │
│   到 4.5 跟测了 4 轮, 主要找视觉/渲染/i18n 问题。                            │
│                                                                          │
│   ─── tags ─────                                                          │
│   [multi-version] [regression-rounds] [i18n: zh-Hant HK / TW / ja]          │
│   [mod-compat: Cold Sweat × ToughAsNails × LSO]                            │
│                                                                          │
│   ─── links ─────                                                         │
│   curseforge ↗   ·   mcmod.cn ↗   ·   读取测试日志 →                         │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
```

The mod logo is a *real raster* (not slug fallback) — pixelated when the mod's logo is pixel-art, otherwise smooth. The bug-count box is rendered as a chunky pixel-art panel (`╔═╗` border) with mono yellow numeral. The description text is in LXGW WenKai zh, casual register ("洗澡得有热水"). Tags are wrapped chips with rounded 4px corners and warm tones (not v1's hairline boxes). The card has 8px corner radius, soft shadow at hover (replaces v1's no-shadow rule — shadow gives warmth and the card breathing room).

The verified-tester `✓ tester` mark is a small badge in `--accent` on the upper right; it's confined to the 2 actually-verified mods (Hot Bath, Instant World Mirror).

### Test log (case-study) page layout

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Hot Bath · 热水澡                                                         ║
║  测试日志 #01 — tester log #01                              MC 1.20.1/1.21.1║
║                                                                           ║
║  ┌─🦆 LUCK666DUCK (Tester ✓) · 👤 CrabMods · 👤 ModderAlex · 👤 DoraWolf ─┐║
║  │     ↑ team panel (members-panel echo)                                 │║
║  └──────────────────────────────────────────────────────────────────────┘║
║                                                                           ║
║  ╭─ in-game screenshot strip ─────────────────────────────────────────╮   ║
║  │ [hot-bath in-game scene — 1280×400 placeholder]                    │   ║
║  ╰────────────────────────────────────────────────────────────────────╯   ║
║                                                                           ║
║  73 条 bugs filed · 4 测试轮次 · 5 个语言场景 · 3 个 mod-compat scenarios   ║
║                                                                           ║
║  ─── ～ 💧 ～ 💧 ～ ───                                                   ║
║                                                                           ║
║  📜 Tester log                                                            ║
║                                                                           ║
║   💧 4.1   初轮 (2026-04-01)                                              ║
║   │       — 29 条 found. 渲染层 18 条, i18n 7 条, mod-compat 4 条.        ║
║   │       — top issue: 浴液在岩浆块/灵魂沙上没有泡泡显示                    ║
║   │                                                                       ║
║   💧 4.5   回归 round 2 (2026-04-05)                                       ║
║   │       — 18 条 still open, 12 条 confirmed fixed, 6 条 new found.        ║
║   │       — top regression: Cold Sweat compat 体温计算 又改了一次             ║
║   │                                                                       ║
║   💧 4.18  回归 round 3 (planned)                                          ║
║           — 7 条 outstanding, 15 条 confirmed fixed total.                  ║
║                                                                           ║
║  ─── ～ 💧 ～ 💧 ～ ───                                                   ║
║                                                                           ║
║  📋 Featured bug                                                          ║
║                                                                           ║
║  ┌─ #001 · 1.20.1 · 视觉/渲染 ────────────────────────────────────────┐  ║
║  │ 站在地上, 看向池底有灵魂沙和岩浆块的浴液, 6 种浴桶浴液在岩浆块上只     │  ║
║  │ 有水面之上有泡泡显示出来, 水面之下则没有泡泡显示...                   │  ║
║  │                                                                      │  ║
║  │ status: open in 4.5 (still reproduces)                                │  ║
║  │ severity: P2 visual                                                   │  ║
║  └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  📋 Full bug ledger (collapsed by default)                                ║
║      ▶ click to expand 73 entries                                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

Key changes vs v1:
- Eyebrow is `测试日志 #01 — tester log #01`, not `CASE / CS-01`.
- Team panel mirrors CurseForge's Members panel (R-2 reference). Names + roles familiar to anyone who has ever opened a CurseForge mod page.
- In-game screenshot strip up top — visual proof of the mod the bugs are about.
- Stats line is conversational ("73 条 bugs filed · 4 轮次"), not 4 mono columns.
- 💧 water-drop pixel-art dots replace v1's solid circles in the timeline.
- Dates use ISO format but in body voice ("初轮 (2026-04-01)" not just "2026-04-01 14 条").
- 1-2 bugs are *featured* as readable case stories with severity + status; the full 73-entry ledger is collapsed by default behind a click. Solves audit F11 (ledger-as-wall-of-text on hotbath page).

### Footer

```
～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～

  🦆 LUCK666DUCK / 楊 庭 鳳                                       
  Minecraft mod tester · zh / 繁 / 日 / en                       
  active 1.20.1 / 1.21.1                                          

  ┌─[88×31 retro-badge strip]─────────────────────────────┐       
  │ [MC 1.20.1 ✓] [MC 1.21.1 ✓] [Hot Bath 1M+ DL]         │       
  │ [verified tester] [bilingual zh/en] [powered by 🦆]    │       
  └───────────────────────────────────────────────────────┘       

  github / LUCK666DUCK ↗
  curseforge / luck666duck ↗

  © 2026 Tingfeng Yang. Bug reports remain authored by their      
  filer. Mod names belong to their respective authors.            
  v0.2.0 ↗  ·  redesigned 2026-05  ·  /v1/ archived  

～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～ 💧 ～
```

The retro-badge strip (R-6 transfer) carries the v1 stat strip's data load with much more visual character. Each badge is an actual 88×31 pixel-art element generated by BuildAgent (CSS-drawn or static SVG, no JS). The `/v1/ archived` line preserves v1 at a sub-route — visitors curious can see the forensic-log version, and we get the R-14 Lynn Fisher "version your portfolio" flex for free.

### Nav

Stays close to v1 but warmer:
- Logo: 🦆 + "LUCK666DUCK" wordmark in Sora Variable Bold (NOT mono).
- Routes: `home / 主页` · `tested mods / 已测 mod` · `about / 关于` (drop "case files" — replaced with "tested mods").
- Lang switch: `EN / 中` segmented control with duck-yellow active fill.
- No backdrop blur (still distinct from DoraWolf), but warm `--bg` solid with 1px `--rule` bottom border.
- Mascot at 24×24 next to the wordmark, idle-blink animation 4s loop (only animation on the site).

---

## 4. Vibe contrasts

### vs v1 forensic-log (specific deltas)

| Axis | v1 | v2-X | Why |
|---|---|---|---|
| Genre frame | NTSB / SOC2 forensic | warm-bath / cozy-tester log | Audit F1 — community-native |
| Type voice (display) | JBM mono everywhere | Sora/Lora humanist sans for display, mono ONLY for data | Audit F2 — tester not engineer |
| Hero opener | name + stat strip | duck mascot + first-person greeting + active-mods strip | Audit F4 — character before density |
| Color | graphite #0e0f12 + amber single accent | warm-deep #1c1d2a Catppuccin-shifted + duck-yellow + steam-blue | Audit F5 — exit dev-tools zeitgeist |
| Surface decoration | hairlines only | rounded 8px corners, soft shadows on hover, steam-curl dividers, retro badges | Audit F3 — sterility |
| Raster content | none (slug-letter fallback) | duck mascot, real mod logos, in-game screenshots, retro badges | Audit F6 — humanity |
| Vocabulary | CASE-FILE / CS-04 / 案件档案 | 测试日志 #01 / tester log #01 | Audit F7 — community vocab |
| Motion budget | zero | mascot idle-blink + hover-stripe-glow + minimal | F3 — proportional warmth |
| CJK voice | Noto Sans SC (system default) | LXGW WenKai Screen R (warm rounded) | Audit F2 — character |
| Mode default | dark (forensic) | dark (soak) — but warmer; respects light pref | F9 — tonal warmth at default |

### vs DoraWolf architecture portfolio

| Axis | DoraWolf | v2-X bath-house |
|---|---|---|
| Color temperature | warm cream paper + ink + earth accents | warm-deep night + cream ink + duck-yellow accent |
| Type voice (display) | display serif (Source Serif 4 / Fraunces) + LXGW WenKai kaiti | humanist sans (Sora/Lora) + LXGW WenKai Screen (rounded sans-serif kai, NOT brush kaiti) |
| Density | airy plate-style with marquee + scroll-reveal | medium density, modular cards, rounded panels, no marquee |
| Decoration | paper grain overlay, custom cursor, oversized backdrop year-numerals | duck mascot, steam-curl ASCII dividers, retro 88×31 badges, mod logos |
| Italic / emphasis | italic serif + Kaiti for CJK emphasis | weight-only emphasis + occasional VT323 pixel-style for badges |
| Image content | architectural photo grids, render slots, site-plans | mod logos at 96×96, in-game screenshots in case pages, duck mascot |
| Motion | scroll-reveal stagger + marquee + cursor-follow preview | mascot idle-blink + hover-stripe-glow, otherwise static |

Both are warm. The overlap stops there. DoraWolf is a *gallery monograph* warmth (museum, paper, slow). v2-X is a *living-room* warmth (hot tub, cozy, lived-in). Different rooms, distinct identities.

---

## 5. Implementation notes for BuildAgent

### Stack
- **Astro 5** unchanged (matches DoraWolf infra; static GH Pages output).
- No client-side JS beyond the mascot's idle-blink (which can be pure CSS animation), the lang switch, and an optional accordion for the collapsed bug ledger.

### CSS approach
**Vanilla CSS with CSS modules per component + a single `global.css` for tokens, base layer, and warm primitives** (`.mod-card`, `.test-log`, `.water-drop-dot`, `.retro-badge`, `.steam-divider`).

### Files to delete or rewrite (vs v1 codebase)
- `src/styles/global.css` — full token rewrite (palette + fonts + new primitives).
- `src/components/Hero.astro` — full rewrite (mascot + greeting + active-mods strip).
- `src/components/StatStrip.astro` — replaced by retro-badge strip; keep file but rewrite as `RetroBadgeStrip.astro` (rename or new file).
- `src/components/ModCard.astro` — full rewrite (rounded corners, real logo slot, 6px stripe vs 4px, warm panel).
- `src/components/RegressionThread.astro` — rename to `TestLog.astro`, swap dots for water-drop pixel art, conversational round labels.
- `src/components/BugLedger.astro` — rewrite to ship 1-2 *featured* bugs as readable cases plus collapsible full table.
- `src/components/CaseFileHeader.astro` — rename to `TestLogHeader.astro`, add Members-panel echo subcomponent.
- `src/components/Nav.astro` — rewrite logo + routes + lang switch.
- `src/components/Footer.astro` — full rewrite (retro badges + steam dividers).
- New: `src/components/SteamDivider.astro` (the `～ 💧` rule primitive).
- New: `src/components/MascotDuck.astro` (the pixel-art duck SVG with optional `data-state="idle"|"found-bug"`).
- New: `src/components/MembersPanel.astro` (CurseForge-pattern team strip).
- New: `src/components/RetroBadge.astro` (88×31 badge primitive with text + color slots).

Pages (`src/pages/index.astro`, `cases/[slug].astro`, `about.astro`, etc.) stay structurally similar — they're consumed by the renamed components and require minor copy/structure tweaks.

### Web fonts to load
- `@fontsource-variable/sora` (humanist sans display + body)
- `@fontsource-variable/jetbrains-mono` (kept, but used only for `.mono` data class)
- `@fontsource/lxgw-wenkai-screen-r/400.css` and `500.css` and `700.css` — the warm zh body font (replaces Noto Sans SC). If `@fontsource` package not available, BuildAgent can self-host the OFL files from chillpaste or the official LXGW repo and slice unicode-ranges.
- `@fontsource/vt323` — pixel display, used only on retro badges.
- (Optional) `@fontsource-variable/lora` if BuildAgent prefers serif body for an even warmer feel — defer choice.

Total CSS font budget: ≤ 250 KB woff2 after subsetting. Slightly bigger than v1's 200KB because LXGW WenKai is heavier than Noto Sans SC, but acceptable.

### Pixel / raster assets to be created
- **Duck mascot.** ~64×64 base sprite, 4 frames idle-blink + 2 frames "found bug". Hand-pixeled. ~5-color palette (duck-yellow body, dark-amber bill/feet, steam-blue eye, cream cheek, dark accent). BuildAgent generates 3 variants for the user to choose. Also export 32×32 (nav) and 24×24 (favicon body element). PNG with `image-rendering: pixelated`.
- **Favicon.** 32×32 PNG + 180×180 PNG-Apple-touch + ICO. Design: duck head only, on `--accent` square background. BuildAgent generates.
- **OG / social card.** 1200×630 PNG. Warm-deep background, mascot on left, "LUCK666DUCK · Minecraft mod tester" text on right in Sora Bold + LXGW WenKai 500. Steam-curl divider strip top + bottom.
- **Mod logos.** 96×96 raster per mod, sourced from CurseForge / mcmod.cn (where available) or BuildAgent generates a generic 96×96 colored-square fallback with mod-slug-initials in pixel-style for mods without a logo. NEVER show the slug-letter fallback as the rendered output — at minimum, fallback should be a colored square with a mod-themed emoji (🛁 for bath mods, 🌳 for tree mods, 🦴 for prehistoric mods, ⚙️ for tech mods).
- **Retro 88×31 badges.** 6 SVGs (or PNGs), pixel-style. BuildAgent generates from a template:
  - `mc-1-20-1.svg`, `mc-1-21-1.svg`, `hot-bath-1m-dl.svg`, `verified-tester.svg`, `bilingual.svg`, `powered-by-duck.svg`.
- **In-game screenshot placeholders.** 1280×400 each, one per major case page (Hot Bath, Shower Core, Alex's Caves, Alex's Mobs at minimum). BuildAgent generates from MC-vanilla-block illustrations (no Mojang trademarks); user swaps real screenshots later. Each placeholder is a stylized scene (e.g. a steamy bathroom, a deep cave, a tropical fish biome).

### Dark / light mode
**Default dark soak-mode**, `prefers-color-scheme: light` triggers daylight-mode (warm-cream paper). Both modes share the same accent (duck-yellow / honey-amber). No manual toggle in v2 (consistent with v1 stance — adding the toggle is decoration drift). Token names abstract palette, light is value-only override on `:root[data-theme="light"]` or via media query.

### Bilingual zh / en handling
- Routes mirrored: `/` (zh default) and `/en/` (mirror).
- `lang="zh-Hans"` default. Switch via Nav.
- LXGW WenKai for CJK paragraphs at line-height 1.85; Sora for Latin at 1.65. Same `:lang(zh)` rule pattern as v1.
- Bilingual asymmetry (audit F10): the hero greets in *both* languages on a single line ("Hi, I'm Tingfeng — 嗨，我是楊庭鳳") rather than mirroring routes 1:1. This is a small but distinctive nod to the duality.
- CJK emphasis: weight only (still no italic synthesis on CJK). LXGW WenKai's natural rounded warmth replaces the brush-kaiti or sans-system-default extremes.

### Accessibility hard requirements (unchanged from v1)
- Default reduced-motion (mascot blink can be disabled via `prefers-reduced-motion: reduce`).
- Color contrast ≥ 7:1 for body text. Verify warm-cream `#f4ebd9` on `#1c1d2a` actually clears AAA — calculator: ~12.5:1, clears.
- Severity colors (alert / warn / ok) paired with text labels and icon shape, never color-alone.
- Skip link, focus-visible 2px duck-yellow ring.
- All images alt-tagged via component data, mod logos with mod-name + version as alt.

### Anti-patterns to avoid (lessons from this audit)
- **No mono-as-display.** Mono is for data only — versions, IDs, counts, dates. Headings and prose are humanist sans (or warm serif).
- **No graphite-with-amber palette.** That's v1's identity; v2 must read different at first glance.
- **No "case-file" / "evidence" / "forensic" / "incident" vocabulary.** Audit-killed.
- **No third-person hero name display.** First-person greeting only.
- **No slug-letter fallback as rendered output.** If a mod logo is missing, fallback uses a themed emoji + colored square, not a 5-character slug abbreviation.
- **No dense stat strip as hero opener.** Stats appear after character is established.
- **No "case-file numbering" eyebrow on every page.** Eyebrows can be conversational ("已测 mod / tested mods").
- **Don't over-Catppuccin.** One coordinated warm-dark + duck-yellow accent. No rainbow.
- **Don't fall into Modrinth-clone trap.** Use the genre vibe (saturated single accent on warm dark) without stealing Modrinth's specific green.

### Anti-patterns avoided that v1 already had right (keep these)
- Hairline focus on screen-native, not print-native (no paper grain).
- All-self-hosted fonts, no CDN.
- Static-render priority, no scroll-reveal animation as load-pattern.
- `tabular-nums` mono on actual data tables.

---

## 6. Open questions for orchestrator review

1. **Duck mascot design quality.** BuildAgent will generate 3 variants. If all 3 fail aesthetically, fallback plan = clean text-logo "LD" wordmark in `--accent`. Need user (or orchestrator) to ratify the variant.
2. **LXGW WenKai vs Noto Serif SC.** I'm strongly leaning LXGW WenKai Screen R for warmth. BuildAgent can fall back to Noto Serif SC if LXGW packaging is problematic. Either reads as "warmer than Noto Sans SC" — both fix audit F2.
3. **In-game screenshot policy.** Generated placeholders use vanilla-MC blocks only (no Mojang trademark assets like specific Steve / Creeper / Alex sprites). User will eventually want to swap real screenshots, but v2 ships with placeholders so the design renders cleanly out-of-the-box.
4. **`/v1/` archive sub-route.** Optional — preserves v1 forensic version under `/v1/` while v2 lives at `/`. Useful as Lynn-Fisher-style "version your portfolio" flex AND as a hedge if user changes their mind. Defer decision to BuildAgent; my recommendation is *do it* (it's a 5-minute route copy + 0 code changes elsewhere). Costs ~10 KB of static HTML.
5. **Active-mods strip on hero.** I picked Hot Bath / Shower Core / Alex's Caves / Alex's Mobs as the "currently active" set based on bug count + recency in `data/STATS.md`. BuildAgent should sanity-check against `data/profile.json` activity dates and adjust if needed.

---

## 7. Estimated implementation delta

**Token swap + 7 component rewrites + 4 component renames + 1 new component class.**

Roughly:
- Full rewrite: `global.css`, `Hero.astro`, `ModCard.astro`, `Footer.astro`, `Nav.astro`.
- Rename + rewrite: `RegressionThread.astro` → `TestLog.astro`, `CaseFileHeader.astro` → `TestLogHeader.astro`, `StatStrip.astro` → `RetroBadgeStrip.astro`, `BugLedger.astro` (collapsed-by-default + featured-bug pattern).
- New: `SteamDivider.astro`, `MascotDuck.astro`, `MembersPanel.astro`, `RetroBadge.astro`.
- Asset generation: duck mascot (3 variants), 6 retro badges, 4 in-game screenshot placeholders, OG card, favicon set.
- Pages: structure mostly preserved, copy + small layout adjustments per page.

Not a full rebuild — the data layer (`data/*.json`, `data/STATS.md`) is unchanged, the route topology is unchanged, the Astro 5 + GH Pages stack is unchanged. The change is *visual + tonal*, executed through CSS tokens + component primitives. Estimated build time: ~1 round of focused BuildAgent work, ~2 rounds if mascot iteration is needed.
