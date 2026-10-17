# Reference-site research for v2

Survey of 14 real sites across four audience-adjacent categories. Each entry: URL, visual summary, what works for *our* mod-author audience, what to avoid.

I prioritized within-ecosystem references (Modrinth/CurseForge/MC modder personal sites) because that is the audience LUCK666DUCK actually addresses. The wider categories (game-jam pages, QA portfolios, indie creator portfolios) are sampled for design vocabulary, not for genre transfer.

---

## 2a. Within-ecosystem (highest priority)

### R-1. Modrinth — `https://modrinth.com/`
**Visual language:** dark base (`#000000` / raised panel `#1d1e1b`) + retro-mode warmer base `#191917`; primary brand "Modrinth green" Malachite `#1BD96A` (dark mode) / `#30B27B` (light mode). Sans-serif system font with ~14-16px base. Modular project card grid — rounded corners (8-12px), thumbnail-led, version badges as pills, download-count + update-date metadata. Status colors: success `#3CDB36`, warning `#E88D0D`, error `#E8200D`, info `#099FEF` — all bright, high-saturation.

**Transfers:**
- Saturated *single-color hero accent* (one strong green) on a near-black backdrop is the canonical "Minecraft modding platform" signal. It survives outside of Modrinth — visitors recognize the genre by the green/black combo alone. Adopting this color logic (one hot accent on dark) signals "I belong to this community" without literally cloning Modrinth.
- Card grid with thumbnail-first ordering: visitors scan thumbnails before names. The card layout is a cultural template; using it gets us read as community-native immediately.
- Status pills with semantic color (success/warning/error) translate directly to "verified-fixed / regressed / open" without forensic-log connotation.

**Avoid:**
- Modrinth's exact green is *their* brand. Using `#1BD96A` would confuse identity.
- The platform-style chrome (left sidebar nav, top search bar) is a *platform* convention; a personal portfolio shouldn't impersonate one.

---

### R-2. CurseForge — `https://www.curseforge.com/` (assessed via search results + Hot Bath mod page metadata in `data/profile.json`)
**Visual language:** orange-red primary brand, white/light surface, dense card grid with mod thumbnail-icons (typically 64-128px square pixel-art logos), tag chips, download-count rendered prominently in mono numerals. Mod page presents: large hero banner image, in-line screenshot carousel, "Members" panel listing each contributor with avatar + role pill (Owner / Author / Tester / Artist), changelog-style version dropdown.

**Transfers:**
- The "Members" panel is the *mechanical* origin of why LUCK666DUCK matters — they show up there as "Tester" with avatar. Mirroring that panel format on the portfolio (avatar + role pill + mod) literally repeats the pattern visitors are already trained on. Familiarity = trust.
- Mod thumbnails as the dominant visual anchor: every mod is *known by its icon* in this ecosystem. The 64×64 pixel logo with optional `image-rendering: pixelated` is the right slot — and crucially, the slot must actually contain the logo, not a slug fallback.
- Pixel-y mod logos sit beside non-pixel UI cleanly; the community is fluent in mixing.

**Avoid:**
- CurseForge orange is *their* brand. Don't borrow.
- Their density-of-ads layout is platform-specific noise; personal sites should be airier than CurseForge.

---

### R-3. mcmod.cn — Chinese mod database (assessed via `data/profile.json` author page extracts)
**Visual language:** light blue/sky primary (`#3a82c4` family), white surface, *very* dense info layout, tabular data dominant, Microsoft YaHei / PingFang as default CJK sans, full-width tables for mod attributes (versions, loaders, environments, tags). Inline emoji icons for status (活跃 active = green dot). Mod thumbnails appear at 100×100ish on author pages with mod name + version-list + tag-chip cluster.

**Transfers:**
- The Chinese audience reads dense tabular data as *normal*; the mcmod.cn density level is genuinely competence-coded for zh visitors. Our v1's density was actually *under-using* what zh readers expect — but pairing it with mono fonts mistranslated the genre. A version with tabular density + warmer color + system CJK (rather than mono) would land better with the Chinese half of the audience.
- The 活跃/停更 status-with-color-dot convention is universally legible to Chinese mod-community readers; we can adopt it for "active 1.20.1 / 1.21.1" copy.

**Avoid:**
- mcmod.cn's exact blue. It's specifically *that* site.
- Microsoft YaHei is fine as fallback but its rendering on Mac/iOS is uglier than Source Han / Noto SC. Self-host a real CJK sans, just not the same one v1 used.

---

### R-4. Vazkii's personal site — `https://vazkii.net/`
**Visual language:** modern-minimalist with Material Design icons (science / engineering / psychology symbols) for navigation; neutral palette (mostly white, restrained text colors); icon-led module layout; mods presented with small icon + brief paragraph; explicit "have a nice day" footer voice; collected sections include games / idols / music as personal interests.

**Transfers:**
- *Voice* is the takeaway, not visuals. Vazkii (a top-5 MC modder by every measure) writes "have a nice day" and lists a "Before You Follow" boundary section. The personal warmth is conveyed through copy. v2 should adopt warm, casual first-person copy in both zh and en — "我是楊庭鳳", "I'm Tingfeng" — replacing v1's third-person "Tingfeng Yang" formality.
- Icon-led modules are useful for breaking up dense content without resorting to mono text walls.

**Avoid:**
- Material Design icons are slightly bland 2018-2020 vibe; we can do better with custom mini-glyphs or pixel-art mini-icons.
- All-white surface would not differentiate from generic developer portfolios.

---

### R-5. tterrag's portfolio — `https://www.tterrag.com/portfolio/`
**Visual language:** markdown-style layout, hierarchical headings (Major Content Mods / Small Mods / Contributions / Past Projects), per-mod block has title + role + link cluster (CurseForge / GitHub / YouTube / Wiki) + descriptive paragraph + embedded screenshot. Cool/neutral palette. Functional and unpretentious.

**Transfers:**
- The structural template — *grouped sections of mods with role-tag, link-cluster, screenshot, paragraph* — is a known-good pattern for MC modder portfolios. v2 case pages can mirror this: each case has role pill (Tester / Verified Tester ✓), link cluster (CurseForge / mcmod.cn / GitHub), inline screenshots, paragraph context.
- Embedded raster screenshots beside each mod entry: this is what v1 deliberately rejected and what tterrag (a more famous modder than the user) absolutely does. Visual proof beats text claim.

**Avoid:**
- tterrag's "markdown style" is functional but visually thin. We should have stronger character — tterrag is famous enough that he can underdesign and people still read. LUCK666DUCK is unknown and needs design to do more work.

---

### R-6. gaiety.me — `https://gaiety.me/blog/modding-minecraft/`
**Visual language:** Catppuccin Mocha palette (dark base `#1e1e2e` + lavender/mauve/peach accents `#cba6f7` `#fab387` `#f5c2e7`); animated falling fursona GIF as hero; warm retro-90s footer badges ("TTRPG GAME MOM" / "big doggo" / "smol kobold"); webring membership; clean readable sans typography (Tailwind defaults); Eleventy-built; explicit boundary-setting copy ("Before You Follow"); personal pronouns prominent; modular card layout.

**Transfers:**
- **This is the closest single match to our v2 target.** Catppuccin (community-driven palette popular in indie/queer/nerd tech) gives us a ready-made warm dark palette that is unmistakably *not enterprise*. It's saturated, friendly, and currently fashionable in the kind of Discord/Linux/indie spaces our audience also occupies.
- Animated mascot/avatar in hero: even a small GIF or animated SVG of a duck (LUCK*duck*) would make the hero feel inhabited. Hero needs a *face* — not Tingfeng's photo (he hasn't asked for one) but the duck mascot.
- Retro-90s badges in the footer: Minecraft itself is nostalgic for many players; web-1.0 footer badges + a Minecraft tester portfolio is a coherent pairing. Badges like "MC 1.20.1 ✓" "MC 1.21.1 ✓" or "13 mods tested" rendered as 88×31 buttons would be both decoration and data.
- Webring participation is itself a community signal even without a real webring — a "friends of LUCK666DUCK" link cluster (CrabMods, DoraWolf, mod authors he's tested for) creates relational warmth.

**Avoid:**
- The fursona register is specific to gaiety's identity, not transferable. A duck mascot is fine; an anthropomorphic-character animation isn't necessary.
- Don't over-Catppuccin: we want *one* Catppuccin variant, not a full rainbow.

---

## 2b. Adjacent gaming community

### R-7. itch.io creator pages (Lexaloffle profile + general jam-page conventions)
**Visual language:** itch.io's chrome is utilitarian (black + white + restrained pinks), but creators heavily customize via per-page CSS — pixel-art banners (1920px wide, varying height, often hand-pixeled in Aseprite), custom backgrounds (static color or animated GIF), pixel-perfect fonts (m6x11, VT323) with `image-rendering: pixelated`, large hero raster art, screenshot-led project tiles.

**Transfers:**
- itch.io creator culture proves that the *audience-relevant* approach in indie gaming is "every creator picks their own visual personality and the platform fades out". A portfolio site should *be* that creator-controlled space rather than echoing platform chrome.
- Pixel-art hero banners as the dominant visual language: a custom 1920×400 hand-pixeled hero with a duck character on a Minecraft-flavored landscape (without any Mojang trademarks) would do more work than any amount of mono typography.
- Screenshots of in-game scenes — even just rendered Minecraft world shots showing the bath / shower / cave dimensions — give the data physical context.

**Avoid:**
- Pure pixel-art fonts at body sizes are illegible for paragraph reading; reserve for display/numerals.
- Custom CSS on itch.io requires support approval — not relevant for our static GH Pages site, but the lesson of "make your page yours" is.

---

### R-8. Indie game jam entry pages (general pattern from itch.io GMTK and similar)
**Visual language:** hand-illustrated cover art at 600×440, dev pseudonym + cute avatar, version history as a chronological list with build numbers + dates + 1-line changes, screenshot grid (3-6 raster images), "Made in 48h" badges, devlog blog-post stream.

**Transfers:**
- The *changelog format* (version + date + 1-line) maps perfectly onto LUCK666DUCK's regression rounds. Hot Bath 4.1 → 4.5 with delta-summary per version is structurally identical to a game jam devlog. Reframing v1's "regression thread" as a "tester devlog" or "测试日志" makes the same data warm and community-native.
- Build-number badges as decorative chrome: "v4.5 reg-tested ✓" rendered as a stamp on the mod card replaces the mono pill aesthetic with something more playful.

**Avoid:**
- Don't manufacture fake "game jam" framing if the work isn't from a jam. The *format* transfers; the genre label doesn't.

---

### R-9. Pixel-art portfolios (general pattern)
**Visual language:** sprite-sheet-style asset gallery, often with hover-to-animate, 32×32 / 64×64 / 128×128 sprite tiles, rendered on a dotted/grid background, monospace+pixel pairing, accent colors saturated and few (2-3 max), explicit credit lines, embed-friendly Twitter/Mastodon previews.

**Transfers:**
- A "tested-mods sprite sheet" view of all 13 mods on the homepage as 64×64 pixel-icon tiles with hover-state showing bug-count. Visual density without text density.
- Saturated 2-3 color palette: pick a duck-yellow + Minecraft-green + neutral cream and stop there. Discipline.

**Avoid:**
- Pixel-art-portfolio is a *strong* commitment that can read as "I am a pixel artist", which Tingfeng is not. Use pixel-art as *decoration* (mascot, mod-icon fallbacks, badges) rather than as *type system*.

---

## 2c. Tester / QA-specific (rare but informative)

### R-10. Nazareno Rivero — `https://www.nazarenorivero.com/`
**Visual language:** Squarespace-built, white background, dark navigation, sans-serif throughout, timeline-visualized career, role progression (QA Analyst → QA Manager → VP), company logos as visual anchors, "Hi! I'm Nazareno" warm opener, "Japanese student / Japan enthusiast / Figure and Consoles Collector" personal-interests aside.

**Transfers:**
- **Self-introduction in first person opens the page.** "Hi! I'm Nazareno" beats v1's third-person "Tingfeng Yang" name display. Apply directly: hero says "Hi, I'm LUCK666DUCK" (or "嗨，我是楊庭鳳") with the duck mascot beside it.
- Personal-interests aside: "I test Minecraft mods. I also like 中餐 / pixel art / shower mods" or whatever Tingfeng's actual interests are — a tiny humanizing aside changes the tone of the whole page.
- Company-logos-as-anchors translates to "mod-author logos as anchors" — a strip of CrabMods + other mod-team logos he's collaborated with, rendered as small icons.

**Avoid:**
- Squarespace-template default look reads as undesigned for a community that values handmade. Build to be visibly hand-coded.

---

### R-11. Rieson Blumer — `https://riesonblumer.com/portfolio/`
**Visual language:** simple WordPress, white-on-white, structured bug-report examples with reproduction steps + Jira screenshots, "PAL technique" explanations, hours-logged metrics, self-aware copy ("I am worried I wasn't concise enough").

**Transfers:**
- *Structured bug examples are the entire portfolio.* The actual bug report — verbatim, with screenshots — is what proves the work. v1 has all 433 bugs but they read as *table data*, not as *case studies*. Lifting 5-8 specific bugs to first-class stories (with screenshot, reproduction-steps, severity, what-was-fixed) creates the "show your work" pattern.
- Self-aware/casual copy beats institutional copy. "I noticed something weird in 1.20.1's Hot Bath" reads like a community member; "case-file evidence intake" reads like a courtroom.

**Avoid:**
- WordPress + Jira screenshots = looks like a corporate-QA portfolio. Our audience is gaming community; screenshots should be *in-game*, not from issue trackers.

---

### R-12. Mindful QA portfolio — `https://www.mindfulqa.com/portfolio/` (general pattern from search results)
**Visual language:** company-portfolio site (not personal), white + pastel-blue accent, screenshot-led case studies of apps/sites tested, structured 4-section per project (challenge / approach / outcome / metrics), client-logo strip.

**Transfers:**
- Per-mod case structure: 4-section pattern (intake → testing approach → bugs surfaced → outcome) for the headline mods (Hot Bath, Shower Core) where the work was deep.
- Metrics callout (`73 bugs / 4 rounds / 1M+ downloads`) at the top of each case page works.

**Avoid:**
- Pastel-blue corporate-QA accent is the same wrong-genre trap v1 fell into. Don't use B2B-QA color palettes.

---

## 2d. Personal-creator portfolio inspiration

### R-13. Max Bittker — `https://maxbittker.com/`
**Visual language:** "personal handmade quality", Unicode sparkle/heart decorative dividers (`•*´¨\`*•.¸¸.•`), warm tone, sparse navigation, personal headshot, "Send me a letter?" copy, generous whitespace, blog-post-stream layout, projects-as-curiosity-objects (Sandspiel, etc.).

**Transfers:**
- Decorative dividers using ASCII / Unicode rather than `<hr>`: directly Minecraft-flavored alternative — pickaxe-emoji rows, water-droplet rows, custom-pixel-glyph rows. A Unicode water-drop run between sections (`💧 💧 💧 💧 💧` or hand-pixeled SVG equivalents) instead of `<hr>` hairlines.
- "Send me a letter?" warmth even though contact is empty: we can have "Say hi" / "Find me on Discord" copy without an actual form.

**Avoid:**
- Max Bittker's site is *very* personal-blog, low-density. We want personal warmth at *medium* density (we have real testing work to show).

---

### R-14. Lynn Fisher — `lynnandtonic.com/v.XIX`
**Visual language:** known for 19+ versions of full annual redesigns, each radically different. Current self-positioning "Designer for the Web" with a Gifs section (playful), Thoughts section, RSS-available, version-numbered.

**Transfers:**
- **Versioning the portfolio itself** as an artifact: v1, v2, v3, with "view archive" preserving old versions. For LUCK666DUCK's portfolio this means we can ship *both* v1 and v2 if the user wants — `/v1/` for the forensic-log version, `/` for the new version. This is a flex move and sustainable ("I redesigned my portfolio when MC 1.22 dropped"). Optional but worth noting.
- Playful section names (Gifs / Thoughts / Stuff) are warmer than functional ones (Cases / Reports / Stats). v2 should consider section labels like "tested mods" / "hangs out with" / "lab notes" rather than "case files / about / contact".

**Avoid:**
- Lynn Fisher is a top-tier designer with cultural permission to be very experimental. We have less rope. Use the *idea* of versioning, not the rope-length.

---

## Catppuccin palette reference (from R-6 transfer)

For v2 use, full hex codes captured for reference:

**Latte (light):** base `#eff1f5` mantle `#e6e9ef` crust `#dce0e8` text `#4c4f69` peach `#fe640b` yellow `#df8e1d` green `#40a02b` teal `#179299` blue `#1e66f5` mauve `#8839ef` pink `#ea76cb` rosewater `#dc8a78`

**Frappé (dark muted):** base `#303446` mantle `#292c3c` crust `#232634` text `#c6d0f5` peach `#ef9f76` yellow `#e5c890` green `#a6d189` teal `#81c8be` blue `#8caaee` mauve `#ca9ee6` pink `#f4b8e4` rosewater `#f2d5cf`

**Macchiato (dark medium):** base `#24273a` mantle `#1e2030` crust `#181926` text `#cad3f5` peach `#f5a97f` yellow `#eed49f` green `#a6da95` teal `#8bd5ca` blue `#8aadf4` mauve `#c6a0f6` pink `#f5bde6` rosewater `#f4dbd6`

**Mocha (dark richest):** base `#1e1e2e` mantle `#181825` crust `#11111b` text `#cdd6f4` peach `#fab387` yellow `#f9e2af` green `#a6e3a1` teal `#94e2d5` blue `#89b4fa` mauve `#cba6f7` pink `#f5c2e7` rosewater `#f5e0dc`

---

## CJK pixel font reference (for future pixel-direction)

Open-source CJK pixel fonts available:
- **Cubic 11 / 俐方體11號** — 11px traditional Chinese, derived from M⁺ gothic. OFL.
- **Ark Pixel Font / 方舟像素字体** — 10/12/16px pan-CJK, blackbody style. OFL. By TakWolf.
- **Fusion Pixel Font** — composite project incorporating Ark Pixel + others. OFL.

---

## Cross-reference summary table

| Ref | What it is | Strongest single takeaway for v2 |
|---|---|---|
| R-1 | Modrinth platform | Saturated single-accent on dark = MC-platform genre signal |
| R-2 | CurseForge platform | Members-panel format with avatar+role pills |
| R-3 | mcmod.cn | Density is welcomed by zh audience if color is warm |
| R-4 | Vazkii personal | First-person warm copy, "have a nice day" voice |
| R-5 | tterrag personal | Per-mod structure: role / links / screenshot / paragraph |
| **R-6** | **gaiety.me** | **Catppuccin warm-dark + animated mascot + retro-90s badges = closest single template for v2** |
| R-7 | itch.io creator | Pixel-art hero banner, custom personal space |
| R-8 | game jam entries | Changelog format = our regression rounds reframed |
| R-9 | pixel-art portfolio | Pixel decoration without pixel-only typography |
| R-10 | Nazareno Rivero QA | "Hi, I'm ___" first-person hero opener |
| R-11 | Rieson Blumer QA | Structured bug examples as case stories with screenshots |
| R-12 | Mindful QA company | 4-section case study (challenge/approach/bugs/outcome) |
| R-13 | Max Bittker | Unicode/ASCII decorative dividers, "Send me a letter" warmth |
| R-14 | Lynn Fisher | Versioning the site itself; playful section names |

The strongest single reference is **R-6 (gaiety.me)** — it's an actual Minecraft modder's personal site using a community-warm Catppuccin palette with an animated mascot, retro-90s decoration, and casual indie-nerd voice. v2's recommended direction will lean heavily on this template, hybridized with R-1 (Modrinth-genre saturation), R-2 (members-panel pattern), R-5 (per-mod structure), and R-10 (first-person warmth).
