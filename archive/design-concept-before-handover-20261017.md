# LUCK666DUCK — Portfolio Design Concept

Subject: Tingfeng Yang (LUCK666DUCK) — Minecraft mod QA tester
Substance evidence: 9+ mods on 1.20.1 / 1.21.1, 20 detailed Chinese bug reports, multi-round regression (HotBath 4.1/4.5, ShowerCore 4.5/4.6/4.18), multi-locale sweeps (zh-Hant HK / TW, ja), cross-mod compatibility coverage (Cold Sweat × ToughAsNails × LSO), Alex Caves 1.21.1 single-mod report exceeding 145 distinct entries.

The design must broadcast that depth at a glance. A mod author's question is "is this person rigorous enough that filing 20 of their reports won't waste my afternoon?" — the portfolio answers it before they read any prose.

---

## 1. Three Mood Directions

### Direction A — `terminal://bug-tracker`
**Essence:** A modded-Minecraft launcher console fused with a self-hosted issue tracker. Reads like the QA workbench of someone who lives in `latest.log`.

**Color palette (dark, single mode):**
- `--bg            #0d1014`  pitch console background
- `--surface       #161a20`  card / panel
- `--surface-hi    #1f242c`  hover, table stripe
- `--ink           #e8ecef`  primary text
- `--ink-muted     #8a93a0`  secondary text, version tags
- `--accent        #7fffa1`  accent (green-mint, terminal cursor lineage but not 1980s lime)
- `--severity-crit #ff5d62`  critical bug
- `--severity-warn #f5c451`  warning / regression
- `--severity-ok   #7fffa1`  reproduces / verified-fixed (reuses accent)
- `--rule          #2a313a`  hairline divider (visible on dark, low contrast)

**Typography (open-source only):**
- Display / numerals: **JetBrains Mono** (variable, weight axis 400→700) — yes, mono for display. Tester signature.
- Body Latin: **Inter** (variable). Pragmatic, neutral, screen-tested.
- Body CJK: **LXGW WenKai Mono Screen** (霞鹜文楷 等宽屏幕版, OFL) for inline mono CJK in bug-card bodies; **Noto Sans SC** for prose reading runs.
- Pair logic: mono-numerics carry the report-volume stat strip, regression round numbers, mod versions; sans handles paragraph-length descriptions. CJK never slants — uses weight (300/400/500/700), not italic synthesis.

**Key visual motif:** **The bug card.** Every project is rendered as a fielded record:
```
#A04C2  ┃ HotBath/4.5  ┃ regression  ┃ confirmed
        ┃ 浸湿状态在切换维度后未清除 …
```
Severity stripe on the left edge (4px solid color), monospace ID column, status pill. A real QA system aesthetic, not a faked one.

**Layout language:** High-density tabular grid. 12-col on desktop, but unlike DoraWolf's airy plate breaks, every column is filled. Cards stack tight (12px gaps). Sticky filter rail on the left at desktop breakpoint. Information per square inch ≈ 3× DoraWolf.

---

### Direction B — `pixel-CRT-survival`
**Essence:** Period Minecraft-launcher chrome (block-game pixel UI) crossed with vintage CRT phosphor. Heavy aesthetic commitment. Loud.

**Color palette (dark, dual-mode optional):**
- `--bg            #1a1410`  warm cave-rock dark
- `--surface       #2c241d`  oak-plank brown
- `--ink           #f4e7c4`  parchment
- `--ink-muted     #b8a584`  faded parchment
- `--accent        #5dd16f`  emerald-block green
- `--accent-warn   #d4732b`  redstone-orange (used sparingly — not Mojang specifically, generic block-game palette)
- `--rule          #4a3d30`  oak-plank seam
- `--scanline      rgba(255,255,255,0.04)` on every 2nd row

**Typography:**
- Display: **VT323** (Google Fonts, OFL) or **Press Start 2P** (OFL). Pixel display.
- Body Latin: **IBM Plex Mono** (OFL). Pixel-adjacent but readable for paragraphs.
- Body CJK: **Cubic 11** (方舟像素字体, OFL) — actual pixel-perfect CJK at 11px native. Pairs with VT323 because both are bitmap-grid native.
- Pair logic: pixel display + pixel CJK both lock to 11px / 22px / 33px integer grid. No anti-alias on display; body uses subpixel.

**Key visual motif:** **Chunky pixel border + scanline overlay.** Every card framed in a 4px black + 2px highlight + 2px shadow inset (the classic Mojang button bevel without copying any actual asset). Faint horizontal scanlines across the whole viewport (toggleable for accessibility).

**Layout language:** Grid of "inventory slots" — 64×64 icon-square cards aligned to a 16px base grid. Hard pixel snapping (no fractional clamp() values). Aggressively retro. Cool, but the visual chrome competes with the actual content — and the content is what's selling here.

---

### Direction C — `forensic-log` ⭐ (recommended)
**Essence:** A forensic lab notebook crossed with a developer changelog. Reads like a flight-incident log — bug as evidence, regression as case-thread, the tester as investigator.

**Color palette (dark primary, light alt available):**
- `--bg            #0e0f12`  deep graphite (slightly warmer than pure black)
- `--surface       #15171c`  evidence-card field
- `--surface-hi    #1d2027`  active row / hover
- `--ink           #e6e7ea`  primary text
- `--ink-mute      #8d909a`  meta (version, dates)
- `--ink-faint     #565963`  rule-of-thirds gridlines
- `--accent        #ffb454`  amber — single warm hit. Reads as evidence-marker / highlighter, not "brand orange". Used for: report counts, the underline beneath active filter, the timeline dot, the hover ring on cards.
- `--alert         #ff5757`  P0/critical — used only on actual P0 bug entries
- `--ok            #7adda1`  verified-fixed status — used only on resolution states
- `--rule          #232730`  hairlines on dark (low contrast, visible but quiet)

Light-mode alt (`prefers-color-scheme: light`) inverts to: `bg #f3f1ec` (graphite-tinted paper), `ink #131418`, accent stays amber. Single accent survives both modes — that's part of the brand discipline.

**Typography (open-source only, all self-hosted via @fontsource where possible):**
- Mono / numerals / labels: **JetBrains Mono Variable** (OFL). The tester's voice. Used for: report IDs, version strings, line-counts, regression-round numbers, timestamps, all numeric stat displays, eyebrow labels, status pills.
- Sans body Latin: **Inter Variable** (OFL). Used for: paragraph prose, project descriptions, navigation labels.
- CJK body: **Noto Sans SC** weight 400 / 500 (OFL). Used for: zh prose. The bug reports are zh; this carries them.
- CJK display (bug-report quotes): **Source Han Mono SC** (思源等宽 SC, SIL OFL via Adobe). Pairs with JetBrains Mono so when a zh bug-quote sits next to a Latin ID, they share an x-height feel.
- No serif anywhere. No italic. CJK emphasis = weight (500/700), not slant.

**Key visual motif:** **The case-thread timeline.** Multi-round regression isn't a generic timeline — it's a vertical thread with amber dots at each round, version strings in mono on the left rail, status (still-broken / partial / verified-fixed) on the right. ShowerCore 4.5 → 4.6 → 4.18 reads down the page as three rounds of forensic re-test, not three separate bullet points. The dot timeline is the signature element — appears in hero stats, every case study, footer activity log.

**Layout language:** Dense, fielded, monospace-anchored. Every numeric value lives in a `tabular-nums` mono column so digits align across rows. Cards are flat with hairline borders (no shadow chrome — that would feel decorative). Asymmetric: 9-col content + 3-col meta sidebar on desktop. No container max-width fluff at 1440 — scales to 1600+ because dense data benefits from real estate. Mobile collapses to single col with the meta sidebar promoted to a leading metadata strip.

---

## 2. Recommendation — Direction C (`forensic-log`)

Pick **C** for execution.

A tester who finds 145 bugs in one mod and runs three regression rounds on ShowerCore is not retro-cute; they are forensic. The timeline-dot motif gives multi-round regression its own native shape on the page, which Direction A's generic bug-tracker lacks. The single-amber accent against graphite reads as "evidence highlighted in the margin of a casebook" — sober, not gimmicky, and survives light-mode.

It also carries the hard contrast requirement against DoraWolf cleanly: DoraWolf is warm-cream paper / serif / airy whitespace / one-mode-only / decorative. C is graphite / mono / dense / dual-mode / functional. They don't accidentally rhyme — they don't share a single design token.

Anti-rec **A (`bug-tracker`):** strong but lower ceiling. Reads as "person who used GitHub Issues a lot." No native shape for regression-round storytelling; multi-round HotBath/ShowerCore would compress into another generic table row. Loses the editorial quality.

Anti-rec **B (`pixel-CRT`):** highest aesthetic commitment, lowest professional credibility for cold-outreach. A Chinese-speaking mod author scanning a stranger's portfolio in 8 seconds wants the report depth to register, not the chrome. Pixel UI also ages out of accessibility — Cubic 11 at 11px is gorgeous, but for visiting authors who are 35+ on a low-DPI screen it's painful.

---

## 3. Component Sketches (Direction C)

### Hero block

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  CASE-FILE / ACTIVE                                            [ZH | EN] │
│                                                                         │
│  Tingfeng  Yang                                                         │
│  楊 庭 鳳   ·   LUCK666DUCK                                              │
│                                                                         │
│  Minecraft mod QA tester — multi-round regression, multi-locale         │
│  verification, cross-mod compatibility forensics.                       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│   09 mods    │   400+ bugs    │   20 reports   │   1.20.1 / 1.21.1      │
│   tested     │   filed        │   delivered    │   coverage             │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  [ view active case-files ↓ ]      [ contact / 联系 → ]                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

Notes: hero name set in JetBrains Mono Bold at clamp(2.6rem, 7vw, 5rem). The CJK name in Noto Sans SC 500 directly under, same line spacing, so name reads as a 三行 stack — Latin / CJK / handle. Stat strip is a single horizontal rule above + below, four mono columns, each two-line: number on top (large, amber for the first, ink for rest), label below (mono ink-faint uppercase). Tag eyebrow `CASE-FILE / ACTIVE` is the project's signature — every page has one. Hero has no photo; the data is the face.

### Tested-mod card

```
┌─ 4px amber stripe (left edge, full card height) ─────────────────────┐
│                                                                       │
│  [ logo 64x64 ]    Alex Caves                                         │
│                    亚历克斯洞穴                                         │
│                                                                       │
│                    1.21.1 (NeoForge)                          ┌─────┐ │
│                                                               │ 145 │ │
│                                                               │ bug │ │
│                                                               └─────┘ │
│                                                                       │
│  Cave-biome content overhaul. Tested across 5 dimensions, stress-     │
│  tested mob spawn caps and biome-loot interaction.                    │
│                                                                       │
│  ─── tags ──────────────────────────────────────────────────────────  │
│   biome   loot-table   mob-spawning   cross-mod   zh-Hans             │
│                                                                       │
│  ─── links ─────────────────────────────────────────────────────────  │
│   mcmod.cn/12345 →     curseforge/alex-caves →     full report ↗      │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

Key: amber stripe is the only color; everything else is graphite + ink. Bug count is a mono-square in the top-right, JetBrains Mono Bold, amber numeral, `bug` label below in faint mono. Card has 1px hairline border + zero shadow. Hover: stripe widens 4px → 6px, card surface shifts to `--surface-hi`, no scale/lift transform (decorative motion would cheapen it).

Logo placeholder: dimension-snapped 64×64 (or 96×96 desktop), no rounded corners — keeps the pixel-art-friendly square nature without committing to pixel chrome. If the mod has no logo, the slot becomes a 64×64 with the mod's slug in mono on a darker square — still functional.

### Stats strip

```
─────────────────────────────────────────────────────────────────────
   09           400+         20           4.18         1.20.1/1.21.1
   mods         bugs         reports      max ver.     mc coverage
   tested       filed        delivered    regressed    
─────────────────────────────────────────────────────────────────────
```

Five values, monospace tabular-nums, two-line per cell. First-row digits in JBM Bold ~3rem; second-row labels in JBM Regular `text-xs` uppercase letter-spaced 0.14em. Hairline rule above and below, no vertical dividers between cells (rhythm comes from the consistent baseline grid). The "4.18 max ver. regressed" cell is the easter-egg flex: a non-regular-tester wouldn't know to brag about going to v4.18 of one mod across regression rounds.

### Case study layout (per-mod page)

```
┌───────────────────────────────────────────────────────────────────────┐
│ CASE  /  CS-04                                       2026-04 active   │
│ ───────────────────────────────────────────────────────────────────── │
│                                                                       │
│  ShowerCore                                                           │
│  淋浴核心                                                              │
│  Hygiene + cold-mechanics integration mod                             │
│                                                                       │
│  ┌─ author ────────┐ ┌─ versions ──────┐ ┌─ mc ────────┐              │
│  │ @author-handle  │ │ 4.5 / 4.6 /     │ │ 1.20.1      │              │
│  │                 │ │ 4.18            │ │             │              │
│  └─────────────────┘ └─────────────────┘ └─────────────┘              │
│                                                                       │
├─ regression thread ───────────────────────────────────────────────────┤
│                                                                       │
│   ●━━ 4.5    │ initial intake — 32 entries                            │
│   │         │ critical: water-state desync after dim-change           │
│   │         │   compat: Cold Sweat freezes on shower                  │
│   │         │                                                         │
│   ●━━ 4.6    │ regression round 1 — 18 entries (12 fixes confirmed)   │
│   │         │ new: zh-Hant tooltip overflow                           │
│   │         │   regress: Cold Sweat compat re-broken on save reload   │
│   │         │                                                         │
│   ●━━ 4.18   │ regression round 2 — 7 entries (15 fixes confirmed)    │
│             │ verified-fixed: water-state desync                      │
│               outstanding: zh-Hant overflow on long item names        │
│                                                                       │
├─ bug ledger ──────────────────────────────────────────────────────────┤
│                                                                       │
│  P0  CRIT │ #SC-001 │ 4.5  │ water-state desync after dim-change      │
│           │         │      │ → fixed in 4.18                          │
│  ─── ──── │ ─────── │ ──── │ ──────────────────────────────────────── │
│  P1  WARN │ #SC-014 │ 4.6  │ Cold Sweat compat: freeze ignores shower │
│           │         │      │ status on save reload                    │
│  ─── ──── │ ─────── │ ──── │ ──────────────────────────────────────── │
│  P2  i18n │ #SC-022 │ 4.6  │ zh-Hant tooltip overflow >18 chars       │
│           │         │      │ → still outstanding 4.18                 │
│                                                                       │
├─ status legend ───────────────────────────────────────────────────────┤
│                                                                       │
│   ● P0 CRIT   ● P1 WARN   ● P2 INFO                                   │
│   ▢ pending   ▣ in-progress   ▣ verified-fixed   ▢ regressed          │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

The regression thread is the signature — vertical line down the left, amber filled circle at each round, content right of the line. Each round has its own delta-summary (entries / fixes-confirmed / new-introduced) so a mod author scrolling can see "this person doesn't just refile; they verify". The bug ledger below is a hairline-divided table with severity tag, ID, version-found, summary. Status uses colored circles (the only place `--alert` and `--ok` appear besides the legend itself).

### Footer

```
─────────────────────────────────────────────────────────────────────
  CASE-FILE / LUCK666DUCK              tingfeng.yang@…  →             
                                       github.com/luck666duck   →     
  楊 庭 鳳                               curseforge / luck666duck   →   
  active 1.20.1 / 1.21.1                discord: luck666duck     →    
─────────────────────────────────────────────────────────────────────
  © 2026 Tingfeng Yang. All bug reports remain authored by their       
  filer. Mod names and trademarks belong to their respective authors.  
                                                          v0.1.0  ↗   
─────────────────────────────────────────────────────────────────────
```

Three-column on desktop, single-stack on mobile. Mono throughout. No social icons (icons here would feel decorative — the textual handle is the data). Version badge at the bottom right (`v0.1.0`) is the runtime portfolio version, useful to mod authors who think in semver.

---

## 4. Vibe Contrasts vs DoraWolf Architecture Portfolio

| Axis | DoraWolf does | LUCK666DUCK does | Why |
|---|---|---|---|
| **Color temperature** | Warm cream `#f6f5ef` + ink-black, single light mode | Graphite `#0e0f12` dark default + amber `#ffb454` accent, with light alt | Architecture is presented in galleries; QA work happens in dark IDE/launcher chrome. Designer instinct vs developer instinct. |
| **Type voice** | Display serif (Source Serif 4 / Fraunces) + LXGW WenKai kaiti — *editorial monograph* | All-mono primary (JetBrains Mono Variable) + Inter sans for prose + Noto Sans SC — *forensic log* | Serif=cultural-permanence rhetoric; mono=evidence rhetoric. CJK side: kaiti (handwritten brush) vs sans (system console) — opposite ends of CJK design tradition. |
| **Density** | Generous whitespace, plate-style chapter breaks, ~50% empty pixels per viewport | High-density fielded grid, sticky filter rail, ~80% data-bearing pixels per viewport | A 145-bug mod report is dense by nature; the design must let that density read as competence, not clutter. |
| **Decoration** | Paper grain overlay, custom cursor, scroll-reveal stagger, oversized backdrop year-numerals, marquee strip | None. No paper grain. No cursor swap. No reveal animations. Hairline-only chrome. | DoraWolf's decoration says "I curated this surface like a gallery." LUCK666DUCK's restraint says "I ran the test and recorded the result." Decoration would actively undermine the brand. |
| **Italic / emphasis** | Italic serif + kaiti (handwritten) for emphasis | Weight only (400 → 700); no italic anywhere | Italic implies editorial voice; weight implies log-level. The latter is what a tester writes in. |
| **Image content** | Photo grids of architectural projects, render / photo / site-plan / sketch slots | Mostly chartless — bug-cards, version threads, status pills. Mod logos at 64-96px slots; no large hero photos. | The work *is* the text. Photos would be filler. |
| **Motion** | Cubic-bezier reveal-on-scroll (760ms), marquee (60s linear), cursor-follow preview | Static. Hover state = stripe-widen + surface-shift only. `prefers-reduced-motion` is the default. | Tester portfolio reading speed = 8 sec scan + 30 sec deep dive; motion budget = 0. |

---

## 5. Implementation Notes for BuildAgent

### Stack
- **Astro 5** (matches DoraWolf so the build/deploy infra is familiar to the team — but no shared component library; fresh build).
- Static output, GitHub Pages deploy. No SSR.

### CSS approach
**Vanilla CSS with CSS modules per Astro component + a single `global.css` for tokens, base layer, and the case-file primitives (`.bug-card`, `.regression-thread`, `.stat-strip`, `.status-pill`).**

Justification: Tailwind's utility-first churn fights the kind of dense, baseline-grid-anchored layout this design needs. Vanilla CSS with custom properties gives us tabular-nums, baseline-grid alignment, and the severity-stripe ::before pattern cleanly. Same approach DoraWolf uses, but a totally different design system on top of it. CSS modules on per-component styles prevent leakage; the global file owns only the tokens and the 4-5 portable primitives.

### Astro components needed
- `BaseLayout.astro` — sets dark/light mode, loads fonts, includes Nav + Footer.
- `Nav.astro` — mono logo (`LUCK666DUCK / 楊 庭 鳳`) on left, four routes + lang switch on right. **No backdrop blur** (DoraWolf has it; we don't — reinforces the difference). Solid `--bg` with hairline bottom border.
- `Footer.astro` — three-col link block + © line + version badge. Mono throughout.
- `Hero.astro` — used on home page only.
- `StatStrip.astro` — five-cell mono stat row, takes a data array.
- `ModCard.astro` — the tested-mod card with severity stripe.
- `RegressionThread.astro` — the vertical timeline component. Takes an array of `{ version, deltaIn, deltaFixed, deltaNew, notes[] }` rounds.
- `BugLedger.astro` — hairline-divided table. Takes severity / id / version / summary rows.
- `StatusPill.astro` — small primitive for `verified-fixed` / `regressed` / `pending` etc.
- `CaseFileHeader.astro` — the `CASE / CS-04` eyebrow + title + meta-block primitive used at the top of every case study and listing.

### Pages
- `/` — home (hero + stats strip + active-cases grid + footer).
- `/cases/` — full mod listing (filterable: by mc-version, by mod-loader, by tag).
- `/cases/[slug]` — per-mod case-study page using `CaseFileHeader` + `RegressionThread` + `BugLedger`.
- `/about/` — short bio in mono + zh paragraph in Noto Sans SC. No photo.
- `/contact/` — mono email + GitHub + CurseForge + Discord. Same visual rhythm as footer.
- `/en/` mirror — same routes, `lang="en"`, English strings, identical visual design (all type stacks have Latin + CJK fallbacks already).

### Web fonts to load
Self-host all via `@fontsource` (DoraWolf's pattern works here too):
- `@fontsource-variable/jetbrains-mono` (full variable, weight + italic axes; we use weight only — but ship the file once)
- `@fontsource-variable/inter` (variable)
- `@fontsource/noto-sans-sc/400.css` and `500.css` and `700.css`
- `@fontsource/source-han-mono` if available, otherwise fallback to Noto Sans SC (Source Han Mono SC has limited @fontsource coverage; BuildAgent should verify availability and fall back gracefully)

Total CSS font budget: ≤ 200 KB across all woff2 subsets after unicode-range slicing (DoraWolf-equivalent). No CDN — all self-hosted.

### Pixel / raster assets to be created
- **Mod logo placeholders** — 1× 64×64 fallback square with mod-slug-in-mono baked in (BuildAgent generates dynamically via component, no static asset needed).
- **Favicon** — 32×32 PNG + 180×180 PNG-Apple-touch + ICO. Design: amber `#ffb454` filled square on `#0e0f12` graphite, with the text `LD` in JetBrains Mono Bold centered. (BuildAgent: please *generate* this — do not hand-author it.)
- **OG / social card** — 1200×630 PNG. Graphite background, single hero line `LUCK666DUCK / Minecraft mod QA tester`, stat strip across the bottom. Mono throughout.
- **Status icons (P0 / P1 / P2 / verified / regressed)** — pure CSS-drawn (border-radius circles + ::before triangles). No raster needed.

Mod-author-supplied logos go in `data/mods/{slug}/logo.png` at 256×256, which the `ModCard` component renders down to 64 or 96 with `image-rendering: pixelated` if the logo looks pixel-art (per-mod data-flag), otherwise smooth.

### Dark mode? Single mode?
**Default dark, `prefers-color-scheme: light` triggers light alt automatically. No manual toggle in v1** — adding one would be brand discipline drift (the toggle UI itself is decorative chrome). Token names already abstract palette; the light mode is a value-only override on `:root[data-theme="light"]`. If user feedback later asks for a manual toggle, add it then; don't pre-build it.

### Bilingual zh / en handling
- Routes mirrored at `/en/*`.
- `lang="zh-Hans"` default; switch via Nav.
- CJK paragraphs get `line-height: 1.85`, Latin paragraphs `1.65`. Single rule, applied via `:lang(zh)` selectors (DoraWolf's pattern; we keep it).
- No italic synthesis on CJK — emphasis on CJK uses `font-weight: 500` only. (DoraWolf swaps to Kaiti for CJK italic; we do *not* — we have no kaiti in our stack at all. Weight-only emphasis is part of our forensic-log voice.)
- Mod names: zh + en variants stored side-by-side in the data file; both render in `ModCard` headers (Latin first, CJK second line, same as the hero name pattern).

### Accessibility hard requirements
- Default reduced-motion (no animation budget anyway, so this is free).
- Color contrast ≥ 7:1 for body text (`--ink` on `--bg` = ~14:1 on graphite; well above WCAG AAA).
- Severity colors paired with text labels and icon shape, never color-alone.
- Skip link, focus-visible 2px amber ring.
- All images alt-tagged via component data, mod logos with mod-name + version as alt.

### Anti-patterns to avoid (lessons from DoraWolf inversion)
- **No paper grain.** The look is screen-native, not print-native.
- **No custom cursor.** Tester portfolio = professional tool, not artist site.
- **No scroll-reveal animation staggering.** Data should be there on first paint.
- **No oversized decorative backdrop type.** Mono text doesn't decorate at scale; it just looks oversized.
- **No marquee strip.** The case-thread timeline is the rhythm marker; no second one needed.
- **No "lively detail layer" comment in the CSS.** This design's restraint is the personality.
