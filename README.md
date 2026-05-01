# LUCK666DUCK Portfolio

Static Astro site documenting Tingfeng Yang's Minecraft mod QA testing work.

## Stack

- Astro 5 (static output)
- Vanilla CSS with custom properties + per-component scoped styles
- Self-hosted fonts via `@fontsource` (JetBrains Mono Variable, Inter Variable, Noto Sans SC)
- GitHub Pages deploy via `.github/workflows/deploy.yml`

## Local development

```bash
npm install
npm run dev
```

Build a production bundle:

```bash
npm run build
```

Output goes to `dist/`. Preview with `npm run preview`.

## Data layer

- `data/mods.json` — 13 mods tested
- `data/bugs.json` — 433 individual bug entries
- `data/profile.json` — person, GitHub, CurseForge, mcmod.cn metadata
- `data/STATS.md` — top-line summary

## Asset generation

```bash
npm run assets
```

Generates favicon (32 / 180px) and OG card (1200x630) into `public/`. Runs
automatically before `npm run build`.

## Routes

- `/` — home (hero + stats + cases grid)
- `/cases/` — full mod listing, client-side filterable
- `/cases/<slug>/` — per-mod case file
- `/about/` — short bilingual bio
- `/en/*` — English mirror of all routes

## Deploy

Push to `main` on the `LUCK666DUCK/luckduck_portfolio` repo; GH Actions runs
`npm install` + `npm run build` and uploads `dist/` to GitHub Pages.
