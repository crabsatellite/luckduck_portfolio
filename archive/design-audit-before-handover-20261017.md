# v1 Forensic-Log Dissonance Audit

**Subject:** rendered v1 site at `http://localhost:4321/luckduck_portfolio/`
**v1 design:** `_design/concept.md` Direction C (`forensic-log`) — graphite #0e0f12 + amber #ffb454, JBM Variable mono everywhere, Inter prose, Noto Sans SC for zh, dense fielded grid, hairline-only chrome, no motion, no images, no decoration.
**User signal:** 不够好看 (not pretty enough), 违和 (dissonant / off).

The site renders cleanly and the data is correct. The dissonance is not a build defect — it is a tonal/strategic mismatch between the design vocabulary and the audience.

---

## Method

I read the v1 spec, fetched five rendered pages from the running dev server (`/`, `/cases/`, `/cases/hotbath/`, `/about/`, `/en/`), inspected `src/styles/global.css` for confirmation of the actual rendered tokens, and walked the homepage and Hot Bath case file as a hypothetical mod author would (8-second scan + 30-second deep dive).

Each finding below cites a specific page region and is graded:
- **HIGH** = first-impression killer; user reaction "this isn't for me" within 5s
- **MED** = noticeable on second pass; weakens trust, doesn't repel
- **LOW** = subtle, surfaces only on a third visit

---

## Findings

### F1 — Tonal mismatch with audience [HIGH]

**Where:** every page; especially the homepage hero (`/`) and the Hot Bath ledger table (`/cases/hotbath/`).

**What's rendered:** `CASE-FILE / ACTIVE` eyebrow → all-mono "Tingfeng Yang / 楊 庭 鳳 / LUCK666DUCK" name stack → "多轮回归 · 多语言验证 · 跨 mod 兼容性取证" subtitle → mono stat strip "13 / mods tested" "433 / bugs filed" etc. Then a grid of "CASE / CS-01" "CASE / CS-02" cards with `verified tester ✓` badges in amber-on-graphite mono.

**Why it's wrong:** the Minecraft modding community — the audience this site speaks to — is hobbyist + warm + playful + pixel-art-affectionate + Discord-native. Their visual references are CurseForge mod pages with chunky logos, Modrinth's friendly green, mcmod.cn's information-density-but-with-color, modpack manifests, screenshot grids, block textures, emoji-laden Discord servers.

The v1 site's reference frame is none of that. `CASE-FILE / ACTIVE` evokes:
- aviation incident reports (NTSB)
- penetration-test final write-ups
- SOC2 audit findings
- forensic accounting deliverables

These are all *institutional* genres. None of them have ever existed in a Minecraft modder's visual diet. A mod author landing on this page does not register "rigorous tester"; they register one of:

- *"this person is from a different world; I'm not their target"* — bounce
- *"this person is trying very hard to look like a corporate consultant"* — distrust (the modding scene has a strong allergy to Big-Tech polish)
- *"this is a fake site / template / parody"* — dismiss

The forensic genre is signaling competence to the wrong reader. A Big 4 hiring manager would love this site. A mod author is not a Big 4 hiring manager.

**Severity:** HIGH. This is the root issue. Most sub-findings below are downstream of this one mismatch.

---

### F2 — All-mono type voice signals "engineer", not "tester / community member" [HIGH]

**Where:** every text element on every page, including the hero name itself.

**What's rendered:** `Tingfeng Yang` is set in JetBrains Mono Bold at clamp(2.6rem, 7vw, 5rem). That is the same typeface displayed in VS Code at 12px when reading source code. The handle `LUCK666DUCK`, the stat numerals `13` `433` `24`, the eyebrow tags, the nav links, the buttons (`view case files ↓`), the bug IDs (`#001`), the footer — all mono.

**Why it's wrong:** mono-as-display has a specific cultural meaning in 2026: it signals "I am an engineer / hacker / dev-tools company / terminal-native". Sites in this lineage (Linear, Vercel, Supabase admin, Railway, Bun, posthog, Mux) all use mono-as-display intentionally to claim that identity.

LUCK666DUCK is a *tester*, not an engineer. The QA/testing role in modding communities sits closer to:
- artists (skin makers, texture artists, content creators)
- documentation contributors
- community moderators / mascots
- modpack curators

than to it does to backend developers. By cosplaying as a developer-tools site, v1 actively misrepresents the wearer's role in their own community. A modder reading "JetBrains Mono everywhere" decodes "this is someone who fancies themselves a developer", which can read as status-climbing in a community that prizes hands-on craft over titles.

The CJK side compounds this: Noto Sans SC is the system-default sans-serif on Chinese OSes — the equivalent of writing English in Helvetica. It has no character. A QA tester writing 433 detailed bug reports in Chinese has a *voice*; sans-serif system-default flattens it.

**Severity:** HIGH. Even if F1 (tonal genre) were fixed, mono-as-display would keep dragging the impression toward "fintech / developer-tool".

---

### F3 — Sterility / lifelessness: zero raster, zero color, zero motion [HIGH]

**Where:** entire site. The `.btn` is a 1px outline. The `.chip` is a 1px outline. The `.pill` is a 1px outline. The `.hairline` is a 1px rule. The `ModCard` has a left amber stripe and a 1px hairline border. There are no images anywhere except the favicon.

**What's rendered:** I count exactly four colored elements on the homepage:
1. amber `13` stat numeral (the only colored number; rest are `--ink`)
2. amber `verified tester ✓` badges on Hot Bath and Instant World Mirror cards
3. amber `view case files ↓` button
4. amber underline beneath the `EN` lang switch

Everything else is `--ink #e6e7ea` text on `--bg #0e0f12` background, separated by `--rule #232730` hairlines. The Hot Bath case page renders 73 bug rows as a flat hairline-divided table — a wall of mono Chinese text with intermittent amber dots and ink-mute version columns.

**Why it's wrong:** this is the visual diet of a JIRA sprint board. For a portfolio in 2026 — and especially for a portfolio in a community that sees CurseForge mod cards (color, logos, screenshots) and Modrinth profiles (green accent, emoji avatars) and YouTube modding videos (every thumbnail is saturated) — graphite-and-amber-only reads as:

- *intentionally austere* (which only works if the audience is primed to read austerity as luxury, like in fashion/art-direction sites — modders are not)
- *unfinished / placeholder* (the CSS budget shows but the design hasn't started)
- *mid-2010s flat-design hangover*

The ModCard's only color is the left edge stripe (4px amber). If a viewer has 8 seconds, the visual hierarchy hands them: large mod name in mono → bug count in mono → tags in mono. The mod itself — its identity, its *thing* — is invisible. A mod is never just a name; it is a sprite, a screenshot, a feel.

The "no motion" stance is also miscalibrated. Motion budget = 0 is correct for a pure data dashboard. For a *portfolio*, even DoraWolf's architecture site uses scroll-reveal stagger, marquee, and a custom cursor — and DoraWolf's audience is *more* conservative (architecture clients) than LUCK666DUCK's audience. Zero motion in 2026, on a portfolio, in a gaming-adjacent community, registers as "missing" not "disciplined".

**Severity:** HIGH. The space looks empty even when the data is present.

---

### F4 — Density inversion: data is the entire first impression, character is nowhere [HIGH]

**Where:** the homepage hero stat strip "13 / 433 / 24 / 5 / 1.20.1 / 1.21.1" → cases grid "CS-01 / CS-02 / CS-03 ..." → footer.

**What's rendered:** the homepage scroll opens with five mono numerals stacked above mono labels (`mods tested` / `bugs filed` / `test rounds` / `regression rounds` / `mc coverage`), then immediately into a 13-tile grid of nearly-identical case-file cards. The visual rhythm is: numbers → grid → numbers. There is no moment in the first viewport where the page tells the visitor *who Tingfeng is as a person*.

**Why it's wrong:** the hero is doing the wrong job. v1's hero is selling on quantitative depth. But quantitative depth is the *closing argument*, not the opening hook. A mod author scanning a stranger's portfolio for 8 seconds is not yet asking "is this person rigorous"; they are asking "do I want to keep reading". Density before character is the LinkedIn-recruiter-page failure mode: stuffing keywords above the fold drives bounces because nothing in the first impression makes the reader want to invest.

DoraWolf's portfolio (the architecture site) gets this right by leading with a single oversized photo + name + role, *then* unfolding density. v1 leads with density and gives no anchor for personality. The result: a mod author bounces before they reach Hot Bath's regression-thread story, where the actual depth payoff lives.

The Hot Bath page itself has the opposite problem — once a reader gets there, the regression thread is genuinely strong (the dot-timeline + delta summaries do work). But the homepage hasn't earned that visit.

**Severity:** HIGH. This is a top-of-funnel problem; the better the case-study page is, the worse it is to fail the hero.

---

### F5 — Color palette feels enterprise [MED]

**Where:** `:root` tokens in `global.css` lines 9-19; visible everywhere.

**What's rendered:** background `#0e0f12` (graphite-warm-near-black), surface `#15171c`, single accent `#ffb454` (amber/honey), alert `#ff5757` (used only on crash-class chips). The amber-on-graphite combination is the dominant visual signature.

**Why it's wrong:** this exact palette — warm-amber single-accent on near-black graphite — is the palette of:

- Linear (slightly more violet, but same energy)
- Vercel (zinc + accent, same density)
- Railway (graphite + violet)
- Bun.sh (white + ember-orange on black)
- Anthropic's own developer console
- Most "modern dev tools" landing pages of the past 24 months

There is nothing wrong with this palette in absolute terms — it's tasteful, accessibility-clean (14:1 contrast), works in dark + light. But it is *currently saturated* in the corporate-dev-tools zeitgeist. A mod author who has never seen Linear in their life still feels the genre because that palette has bled into developer-tool ads, GitHub repo READMEs, YC startup landings, etc.

The Minecraft community palette runs hot or saturated: emerald-block green (`#5dd16f`), redstone red, lapis blue, gold-yellow, parchment cream, dirt-brown. CurseForge uses orange-red. Modrinth uses pure green. mcmod.cn uses bright sky-blue. None of them use graphite + warm-amber-single-accent.

**Severity:** MED. The palette is competent in isolation but reads "dev tool" to anyone who has been online in 2024-2026.

---

### F6 — No personal artifacts: no avatar, no mod logos, no screenshots, no community signals [HIGH]

**Where:** entire site. Especially `/about/` (no photo, no avatar, no images at all), and the case grid (cards have `[ logo 64x64 ]` placeholders in the v1 spec but in the rendered output the logo slot is just a mod-slug abbreviation — `hotbat`, `instan`, `alex-c` — in mono on a darker square).

**What's rendered:** `/about/` is three paragraphs of mono Chinese text under an `关于 / TESTER` eyebrow. Three paragraphs. That is the entire about page. The case cards have a 5-character slug label (`hotbat`) in a square box where the mod's logo should be.

**Why it's wrong:** real people in this community show their mods, screenshots, avatars, art they like. CurseForge profiles surface the user's mod thumbnails. Modrinth shows the user's avatar prominently. Discord profiles have custom banners and decorative roles. mcmod.cn author pages list every mod the author has touched with thumbnails.

A portfolio with **zero raster content** in this community reads as *anonymous resume / fake account / scraper-generated*. The user does have an actual GitHub avatar (`avatars.githubusercontent.com/u/255657248`) — confirmed identical to their CurseForge avatar — that they could put on their About page. v1 spec deliberately rejects "no photo; the data is the face" but that decision was made under the forensic-log frame; outside that frame, the absence of a face is just absence.

Mod logos are similar: every mod tested has a real CurseForge or mcmod.cn page with an icon. The 64×64 logo slot is in v1's component spec (`ModCard.astro`), but the rendered output uses a slug-letter fallback because the actual logos haven't been sourced/embedded. So the audience sees the *fallback*, not the design intent. That fallback is *worse* than no slot at all — it pretends the design has imagery while delivering placeholder.

**Severity:** HIGH. Combined with F2/F3, this is what makes the site feel inhuman.

---

### F7 — Eyebrow / case-numbering vocabulary is alien to the community [MED]

**Where:** every page header. `CASE-FILE / ACTIVE`, `CASE / CS-01` ... `CASE / CS-13`, `案件档案`, `CASE-FILE / LUCK666DUCK`.

**What's rendered:** the homepage eyebrow, every mod card eyebrow, every case-study page eyebrow, the footer eyebrow all use the case-file metaphor. The Chinese localization uses 案件档案 — literally "case-file dossier" — which is a phrase a Chinese speaker associates primarily with police investigations or court records.

**Why it's wrong:** "case file" / "案件档案" is borrowed from law enforcement and forensic accounting. It is a deliberate, sustained metaphor — and that's the issue. A metaphor this loud needs to be *welcoming* to its audience. Modders don't think of bug reports as "cases"; they think of them as "issues" (the GitHub Issues lineage), "reports", "提交" (submissions), or just by mod name. The case-file framing imposes a foreign vocabulary on a community that has its own.

Worse, `CS-01` ... `CS-13` are sequential case-study IDs that have no inherent meaning; they're just an ordering imposed by the design. A mod author looking at "CS-04 / Alex's Mobs" gains nothing from "CS-04". The ID slot is taking valuable header real estate to display an artificial sequence number.

**Severity:** MED. Strong vocabulary commitment that cuts the wrong way.

---

### F8 — Wrong reference frame to DoraWolf's architecture portfolio [MED]

**Where:** the `_design/concept.md` itself states the goal of being "distinct from DoraWolf" via inversion (warm/serif/airy → graphite/mono/dense). I'm taking issue with the framing, not the execution.

**What's wrong:** v1 was designed *as a contrast to DoraWolf*. That's the wrong reference. DoraWolf is an architecture portfolio for a designer; LUCK666DUCK is a QA-tester portfolio for a Minecraft mod community member. The two portfolios should not be in dialogue at all — they should each independently fit *their own audience's* reference frame.

By taking DoraWolf as the negative pole and inverting every axis (warm → cold, serif → mono, airy → dense, decorative → austere, light → dark), v1 inherits a coordinate system from a domain (architecture / editorial) that has nothing to do with Minecraft modding. The result is a portfolio that is "not-DoraWolf" rather than "is-LUCK666DUCK". Inversion is not identity.

**Severity:** MED — strategic, not visual. But it explains how the design got here.

---

### F9 — Light-mode alt is afterthought; default dark is the wrong default [LOW]

**Where:** `:root` default + `@media (prefers-color-scheme: light)` override in `global.css`.

**What's wrong:** the v1 spec rationalizes "default dark" as "QA work happens in dark IDE/launcher chrome". That is true for an *editor's* environment. But the *visitor* viewing the portfolio is not editing anything; they are reading. A mod author opens the site at noon on a phone or iPad with the OS in light mode — and gets graphite as the default unless their system theme overrides it. Most non-developer users on Windows/Mac/iOS run light mode by system default; they will see the graphite version unless the page respects their preference, which v1 does (`prefers-color-scheme`), but the *design intent* is still dark-first.

The light-mode alt is a value swap on the existing palette (`bg #f3f1ec`, `ink #131418`, accent unchanged at amber). It works mechanically but inherits all the dev-tools genre coding from F5, just on light surface. There's no warmth-of-its-own in light mode; it's just "the dark mode with the lights on".

**Severity:** LOW — a fully community-fit v2 may not need a manual toggle either, but the dark-first stance amplifies F1/F5.

---

### F10 — Bilingual zh/en handling is symmetric, not complementary [LOW]

**Where:** `/` (zh) vs `/en/` (en) — same layout, same components, just translated strings.

**What's wrong:** v1 treats bilingualism as a string-table swap. Both versions present the same forensic-log voice. But the Chinese audience and the English audience have different expectations:
- a Chinese-speaking mod author lands on `/` and sees `案件档案` → reads police-procedural genre → bounces
- an English-speaking mod author lands on `/en/` and sees `CASE-FILE / ACTIVE` → reads NTSB report → bounces

Both bounce, but for slightly different reasons that the design should respect. A bilingual site can lean into the duality (bilingual-as-feature) instead of treating it as 1:1 mirror translation.

**Severity:** LOW. Useful as v2 design opportunity, not a critical bug.

---

## Summary — failure-mode synthesis

The v1 forensic-log design is **internally consistent and externally misaligned**. It executes its own spec faithfully (concept.md → rendered site is a near-perfect transcription). The problem is the spec selected a genre the audience does not occupy.

The four root causes, in priority order:

1. **F1: Wrong genre** — forensic / institutional / dev-tools is foreign to Minecraft modding.
2. **F4: Density-before-character** — hero opens with stats before personality, fails 8-second scan.
3. **F2: Mono-as-display** — signals engineer, not tester/community-member.
4. **F6: No raster/personal artifacts** — site feels inhuman and template-generated in a community where every member shows their face.

Secondary contributors: F3 (sterile palette), F5 (enterprise-zeitgeist accent), F7 (alien case-file vocab), F8 (wrong reference frame).

A v2 redesign that fixes only **F1 (genre)** and **F2 (type voice)** would already resolve "违和". Fixing **F4 + F6** would push the site from "fits the audience" to "actively warm for the audience". The forensic-log dot-timeline regression motif — which is genuinely good and the strongest single piece of v1 — can be carried into v2 in a different vocabulary; the *idea* (multi-round regression as a visual artifact) survives the genre change.
