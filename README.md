# luckduck_portfolio

Static Astro site for LUCK666DUCK — Minecraft mod tester. Lives at <https://crabsatellite.github.io/luckduck_portfolio>.

## stack

- Astro 5, static output
- Inter Variable + Noto Sans SC + JetBrains Mono Variable, self-hosted via `@fontsource-variable/*`
- Vanilla CSS with custom properties, per-component scoped styles
- Client-side language auto-detect (browser pref → `/` or `/en/`)
- Live GitHub activity feed on the home page (client-side fetch from `api.github.com`)
- GitHub Pages deploy via `.github/workflows/deploy.yml` on push to `main`

## local development

```bash
npm install
npm run dev      # dev server
npm run build    # production bundle → dist/
npm run preview  # serve dist/ locally
npm run check    # astro + ts type check
```

## data layer

| file | purpose |
|---|---|
| `data/mods.json` | 13 mods tested, with rounds metadata + supported-version provenance |
| `data/bugs.json` | 433 bug entries, each with `categories[]` (13-method tags) + `severity` (S0–S3) + `status` (author response, nullable) |
| `data/methodology.json` | 13 test methods — definition, what-i-do checklist, judgement standard |
| `data/notes.json` | long-form notes index |
| `data/deliverables.json` | placeholder cards for the per-mod tester-log repos shown on home |
| `data/profile.json` | GitHub / CurseForge / mcmod.cn account metadata |
| `data/STATS.md` | top-line counts |

## scripts

```bash
npm run recategorize    # rebuild bugs.json categories + severities from text_zh
npm run deliverables    # regenerate ../luckduck-deliverables/<repo>/ trees
npm run assets          # rebuild favicons + OG card (auto-runs before build)
```

The recategorize and deliverables scripts are idempotent — re-run any time the source data changes.

## routes

| path | content |
|---|---|
| `/` | minimal hero + live GitHub activity feed + deliverables archive |
| `/methodology/` | 13 test methods, severity rubric, tools & process |
| `/cases/` | filterable grid of all 13 tested mods |
| `/cases/<slug>/` | per-mod test log with severity-aware ledger |
| `/notes/` | long-form essays |
| `/notes/<slug>/` | individual essay |
| `/about/` | bio + credits + contact |
| `/en/*` | English mirror of all routes |

## sister project

The deliverable tester-log repos that the home page links to are generated into a sibling directory at `../luckduck-deliverables/`. See [`../luckduck-deliverables/CONVENTIONS.md`](../luckduck-deliverables/CONVENTIONS.md) for the per-repo format spec and [`../luckduck-deliverables/HANDOFF.md`](../luckduck-deliverables/HANDOFF.md) for push instructions.

## deploy

Push to `main`. GitHub Actions runs `npm install` + `npm run build` and uploads `dist/` to GitHub Pages.
