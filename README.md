# Luck Duck tester portfolio

Website for **LUCK666DUCK / Luck Duck**, a Minecraft mod tester.

- Handover for the 2026-10 redesign: [HANDOVER.md](HANDOVER.md).
- Canonical local project:
  `E:\Dev\OpenExecution\research-line\academic-papers\collaborations\luckduck_portfolio`
- Repository: [crabsatellite/luckduck_portfolio](https://github.com/crabsatellite/luckduck_portfolio)
- Website: [crabsatellite.github.io/luckduck_portfolio](https://crabsatellite.github.io/luckduck_portfolio/)

Astro, static output, Chinese at the base path and English under `/en`.
Data lives in `data/`, pages and components in `src/`, generated art in
`public/art/`.

## Design

The site is a night-time cross-section of a blocky world. The home page
opens on a moonlit surface over the tester's underground workshop, lit
the way such games light things: every source has a level from 0 to 15
that drops by one per block, so the lantern's light falls off in visible
steps. Log entries are shown as in-game item tooltips, the headline
numbers as a debug-overlay readout, and the mods as an inventory.

- One design pixel is 2 CSS px. Pixel type is only set at whole multiples
  of its grid: the 12 px face at 24/36/48 px, the 10 px face at 20 px.
  Chinese UI text uses the 12 px face; reading text uses system fonts.
- Pixel images are drawn at integer scales with `image-rendering: pixelated`.
- The pixel scenes are illustrations drawn for the site. They are not
  game screenshots, and the footer and About page say so.

## Content rules

- The 433 entries are quoted verbatim from the original reports. English
  pages translate only the quoted home-page entries
  (`src/i18n/highlights.ts`), labelled as the site's translations.
- A null status means the report records no follow-up; it is never shown
  as "open". `unfixed` is shown as "failed retest" with its retest date.
- Credits are shown only with their source: CurseForge member lists
  (Hot Bath, Instant World Mirror) and merged PR descriptions (Alex's
  Caves, Alex's Mobs). Download counts carry their fetch date.

## Generated assets

`npm run build` runs `prebuild` → `scripts/build-assets.mjs`, which is
deterministic and writes:

| Output | Source |
| --- | --- |
| `public/art/ground.png`, `edge.png` | `scripts/pixel/scene.mjs` (world layout, light propagation, rendering) |
| block textures | `scripts/pixel/textures.mjs` |
| duck, lantern, props, moon | `scripts/pixel/sprites.mjs` |
| `public/art/icons.png` | `scripts/pixel/icons.mjs` (13 category icons) |
| `public/art/mods/*.png` | 96 px thumbnails of `public/mods/*` |
| favicons, `public/og.png` | duck sprite and the scene; OG lettering from `scripts/pixel/glyphs-12.json` |

It also runs `scripts/gen-badges.mjs` for the metric badges in
`public/badges/`, which the metrics workflow commits. `gen-mascot.mjs`,
`gen-scenes.mjs`, `public/mascot*.png` and `public/scenes/` belong to the
previous design and are no longer used by the pages; `SCENE_MAP` in
`src/lib/data.ts` still only shows a scene marked `real: true`.

### Pixel font

The pixel face is [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font)
(OFL-1.1), subset to the characters the site uses. After changing text
that is set in the pixel face, regenerate the subsets from an unzipped
release (`*-otf.woff2` zips for 12px and 10px proportional, plus `OFL.txt`
and `LICENSES/`):

```powershell
python -I scripts/fonts/build-pixel-fonts.py <release-dir>
```

This writes `src/fonts/ld-pixel-{12,10}.woff2`, `public/fonts/` licences
and the OG glyph bitmaps. Missing glyphs fall back to the system font.

## Commands

The GitHub workflow uses Node.js 22.

```powershell
npm ci --no-audit --no-fund
npm run dev
npm run check
npm run build
npm run preview
```

## Publication and history

A push to `main` triggers GitHub Pages deployment. The daily metrics
workflow also commits updated metrics and deploys Pages.

The previous README, design documents, audit and statistics narrative are
preserved in `archive/`.
