# luckduck_portfolio

Static Astro site for LUCK666DUCK — Minecraft mod tester. Lives at <https://crabsatellite.github.io/luckduck_portfolio>.

## stack

- Astro 5, static output
- Inter Variable + Noto Sans SC + JetBrains Mono Variable, self-hosted via `@fontsource-variable/*`
- Vanilla CSS with custom properties, per-component scoped styles
- Client-side language auto-detect (browser pref → `/` or `/en/`)
- Live GitHub activity feed on the home page (client-side fetch from `api.github.com`)
- Scheduled remote metric snapshots for CurseForge downloads, LUCK666DUCK GitHub activity, and the merge-state of PR-mode tester credits
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
| `data/remote-metrics.json` | scheduled snapshot of CurseForge downloads, LUCK666DUCK GitHub PR/issue counts, and per-PR merge state for PR-mode tester credits |
| `data/STATS.md` | top-line counts |

## scripts

```bash
npm run recategorize    # rebuild bugs.json categories + severities from text_zh
npm run deliverables    # regenerate ../luckduck-deliverables/<repo>/ trees
npm run assets          # rebuild favicons + OG card (auto-runs before build)
npm run badges          # rebuild retro badges from current data/remote-metrics.json
npm run update:remote-metrics # refresh remote metrics snapshot
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

## credit verification

The "public credits" panel on home + about lists tester credits in two
verification modes:

- **CurseForge member panel** — `LUCK666DUCK` is listed as "Tester" in the
  Members section on the mod's CurseForge page. Source: scraped from the
  mod's Next.js payload (`profile.curseforge.tester_credits`). Currently:
  Hot Bath, Instant World Mirror.
- **Merged PR body** — a PR opened against the mod's upstream GitHub
  repo whose description explicitly credits the tester by GitHub URL.
  Source: hand-listed in `profile.pr_credits`; each PR's live state
  (open / closed / merged + merged_at) is refreshed daily by the
  `update-remote-metrics.mjs` script and merged into the JSON at read
  time, so an unmerged or reverted PR will surface accurately on the
  site. Currently: Alex's Caves (#1693, #1698), Alex's Mobs (#2315,
  #2317), all merged by AlexModGuy.

`teamForMod()` in `src/lib/data.ts` appends LUCK666DUCK as a Tester to
the mcmod.cn author list for any mod with a PR-mode credit, so the
per-mod case page member panel reflects the credit too.

## sister project

The deliverable tester-log repos that the home page links to are generated into a sibling directory at `../luckduck-deliverables/`. See [`../luckduck-deliverables/CONVENTIONS.md`](../luckduck-deliverables/CONVENTIONS.md) for the per-repo format spec and [`../luckduck-deliverables/HANDOFF.md`](../luckduck-deliverables/HANDOFF.md) for push instructions.

## deploy

Push to `main`. GitHub Actions runs `npm install` + `npm run build` and uploads `dist/` to GitHub Pages. `.github/workflows/update-remote-metrics.yml` also runs daily, commits refreshed `data/remote-metrics.json`, rebuilds, and deploys the refreshed Pages artifact directly.
