# Luck Duck website handover

Prepared 2026-10-17 Asia/Tokyo for Claude Code. This document records the owner's
brief, existing project, data, original reports and operational details. It does
not prescribe the replacement website's design.

## Owner brief

The owner wants this friend's Minecraft testing portfolio completely redone.
The owner describes the current site as too visibly AI-generated, with weak
pixel work and unsatisfactory lighting. These are the owner's stated reasons
for the redesign, not a new visual audit performed during this handover.

The owner referred to the site as LockDuck in the request. The existing project
and public account identify the subject as **Luck Duck / LUCK666DUCK**. No new
brand spelling or identity change has been made.

The old design documentation has been archived. Its visual directions and its
past QA results are historical context, not requirements or acceptance evidence
for the next design. No replacement palette, layout, typography, component
hierarchy or pixel-art direction is supplied here.

The owner explicitly asked that this handover remain **uncommitted**. No new
commit, staging, push, repository visibility change or site deployment is part
of this preparation.

## Canonical project and remote state

| Resource | Existing location or observed state |
| --- | --- |
| Local project | `E:\Dev\OpenExecution\research-line\academic-papers\collaborations\luckduck_portfolio` |
| GitHub | [crabsatellite/luckduck_portfolio](https://github.com/crabsatellite/luckduck_portfolio), public, default branch `main` |
| Local remote | `origin`, `https://github.com/crabsatellite/luckduck_portfolio.git` |
| Local HEAD at handover | `dd3b7757363196e9cdf4681b975a6e2b5953fefb` |
| Fetched upstream `main` | `beffd79d704ff5530ef4d8a3b75072cc91e117a7`, dated 2026-10-17 00:56:43 UTC; `chore: update remote metrics` |
| Local/upstream difference | Local is 145 commits behind, zero ahead. Net file differences are only `data/remote-metrics.json` and `public/badges/hot-bath-dl.svg`; application source is identical at these two heads. Fetch was performed; no merge or working-tree update was performed. |
| Website | [https://crabsatellite.github.io/luckduck_portfolio/](https://crabsatellite.github.io/luckduck_portfolio/) |
| Hosting | Existing GitHub Pages, workflow build, HTTPS enforced, no custom domain configured |
| Astro URL configuration | `astro.config.mjs`: site `https://crabsatellite.github.io`, base `/luckduck_portfolio`, `trailingSlash: "ignore"` |
| Latest observed scheduled run | [Update Remote Metrics, 2026-10-17](https://github.com/crabsatellite/luckduck_portfolio/actions/runs/38988641916), completed successfully; no run was triggered by this handover |

The local tree was clean before the document archive. New handover changes now
remain unstaged. Existing remote metrics automation can advance upstream again;
the IDs above are a dated inventory. Local `data/remote-metrics.json` reports
`fetched_at: 2026-05-25T05:20:39.239Z` and must not be described as today's
metrics snapshot. New local documentation must be retained when reconciling
the checkout with upstream.

## Application and asset paths

Paths in this table are relative to the canonical local project above.

| Path | Existing role |
| --- | --- |
| `package.json`, `package-lock.json` | Astro 5 project and locked dependencies; CI uses Node.js 22 |
| `astro.config.mjs`, `tsconfig.json` | Static site URL/base and TypeScript configuration |
| `src/pages/index.astro`, `src/pages/en/index.astro` | Chinese and English homepages |
| `src/pages/cases/index.astro`, `src/pages/en/cases/index.astro` | Case index routes |
| `src/pages/cases/[slug].astro`, `src/pages/en/cases/[slug].astro` | Individual mod test-log pages |
| `src/pages/methodology.astro`, `src/pages/en/methodology.astro` | Methodology routes |
| `src/pages/about.astro`, `src/pages/en/about.astro` | Profile and credits routes |
| `src/pages/notes/index.astro`, `src/pages/en/notes/index.astro` | Notes index routes; existing content is draft/placeholder material |
| `src/layouts/BaseLayout.astro` | Shared HTML shell, metadata, canonical/OG links, language behavior and fonts |
| `src/styles/global.css` | Shared current visual styles |
| `src/i18n/strings.ts` | Chinese and English interface/editorial strings |
| `src/lib/data.ts` | Data types, counts, version qualifiers, credit matching and scene visibility |
| `src/components/` | Existing page sections, case ledger, filters, methodology, credits and navigation |
| `src/components/ActivityFeed.astro` | Client-side public GitHub activity request for LUCK666DUCK |
| `src/components/NotesIndex.astro` | Existing notes placeholder cards, statuses and ETA copy; not a published essay collection |
| `public/mods/` | Existing mod logos and images; source fields also appear in `data/mods.json` |
| `public/mascot*.png`, `public/favicon*`, `public/apple-touch-icon.png`, `public/og.png` | Current duck and identity/share assets |
| `public/badges/` | Current generated badges; some contain snapshot metrics |
| `public/scenes/` | Generated scene illustrations, not verified game captures |
| `_design/mascot/` | Three generated mascot previews, retained at their existing generator output path |
| `.astro/`, `dist/` | Existing ignored generated output; preserved, not rebuilt or accepted as fresh during handover |

Actual public routes are under `/luckduck_portfolio`, with Chinese at the base
and English under `/en`. The existing notes routes have no `[slug].astro`
article route in this checkout.

## Data and report evidence

| Data | Current local role and dated inventory |
| --- | --- |
| `data/mods.json` | 13 mod records and 24 recorded test rounds; tested Minecraft versions 1.20.1 and 1.21.1; includes source filenames and supported-version provenance |
| `data/bugs.json` | 433 reported issue entries, with original Chinese text, round, categories, severity, status and regression linkage |
| `data/methodology.json` | 13 methodology/category entries with Chinese/English descriptions |
| `data/profile.json` | Subject handle, public profile links, CurseForge tester credits, PR-body credits, source reconciliation and fetch notes |
| `data/remote-metrics.json` | Dated CurseForge/GitHub/PR/tester-credit snapshot, refreshed by the existing workflow |

The issue dataset records 369 null statuses, 56 `unfixed`, 4 `fixed` and
4 `noted-not-bug`. These are report annotations, not a fresh finding that all
369 null entries remain open. The archived statistics narrative describes
keyword-based categorization; the total is a count of dataset entries, not
a new independent verification of distinct defects or fixes.

`src/lib/data.ts` distinguishes canonical supported Minecraft versions from
versions tested through community ports, private builds or forks. Its existing
`SCENE_MAP` marks all five illustrations `real: false`; they must not become
purported gameplay evidence solely because the presentation changes.

Original material remains outside the website repository:

| Material | Existing absolute path |
| --- | --- |
| Original 20-report archive | `E:\Dev\OpenExecution\research-line\academic-papers\collaborations\问题记录(1).zip` |
| Extracted report texts | `E:\Dev\OpenExecution\research-line\academic-papers\collaborations\_luckduck_inspect` |
| Supplied tested-mod list | `E:\Dev\OpenExecution\research-line\academic-papers\collaborations\测试过的mod名字(1).txt` |
| Existing scrape payloads and provenance helpers | `E:\Dev\OpenExecution\research-line\academic-papers\collaborations\luckduck_portfolio\_scrape` |
| Related CrabMods project/media handover | `E:\Dev\OpenExecution\personal\crabmods\HANDOVER.md` |
| Related mod source collection | `E:\MinecraftDev\AlexProject` |

Some extracted report filenames display encoding damage. Preserve the original
ZIP and the dataset's source-file references; no report text or filename was
rewritten during this handover. `_scrape` is Git-ignored historical evidence,
not a public asset directory. Its Python helpers retain obsolete hard-coded
`E:/Dev/OpenExecution/research/collaborations/...` paths; those paths are not
the current canonical checkout.

## Public identity and credit sources

- GitHub: [LUCK666DUCK](https://github.com/LUCK666DUCK).
- CurseForge: [luck666duck](https://www.curseforge.com/members/luck666duck).
- `data/profile.json` records CurseForge member-panel tester credits for
  Hot Bath and InstantWorldMirror, separately from merged PR-body credits for
  Alex's Caves and Alex's Mobs. These are recorded source relationships, not
  newly reverified endorsements in this handover.
- Recorded PRs: [Alex's Caves #1693](https://github.com/AlexModGuy/AlexsCaves/pull/1693),
  [#1698](https://github.com/AlexModGuy/AlexsCaves/pull/1698),
  [Alex's Mobs #2315](https://github.com/AlexModGuy/AlexsMobs/pull/2315) and
  [#2317](https://github.com/AlexModGuy/AlexsMobs/pull/2317).
- The profile explicitly distinguishes LUCK666DUCK from the mcmod.cn tester
  HotBathRed. Do not collapse those identities or turn a team listing into a
  personal tester credit.

## Commands and automatic publication

The actual current package scripts are `dev`, `start`, `prebuild`, `build`,
`preview`, `astro`, `check`, `assets`, `badges`, `update:remote-metrics` and
`archive-v1`. `node_modules` is currently absent. No dependency installation,
build, type check or preview server was started for this documentation task.

`npm run build` first invokes `scripts/build-assets.mjs`. That script invokes
the existing mascot, badge and scene generators, then creates favicon and OG
assets. It can overwrite tracked old visuals and regenerate mascot previews;
the current output is not a neutral build of replacement artwork.

`scripts/dev-screenshot.mjs` is a historical helper with a hard-coded local
port 4322, `C:/temp` output and an undeclared Playwright dependency. Its earlier
screenshots/QA do not validate a new design. `npm run archive-v1` expects
`public/v1`, which is absent; it is not the documentation-archive operation
performed here.

`.github/workflows/deploy.yml` builds and deploys Pages on push to `main` or
manual dispatch. `.github/workflows/update-remote-metrics.yml` has a daily
00:17 UTC / 09:17 Asia/Tokyo cron, refreshes metrics and a badge, commits and
pushes those updates, then builds and deploys Pages directly. Schedule execution
can be delayed. Both workflows share the `pages` concurrency group. Existing
automation remains configured; it was not changed or manually triggered.

The former README referenced `data/notes.json`, `data/deliverables.json`,
`npm run recategorize`, `npm run deliverables`, and the sibling
`E:\Dev\OpenExecution\research-line\academic-papers\collaborations\luckduck-deliverables`.
These files/scripts/sibling directory are absent from the current checkout;
they are historical references, not ready-to-use project infrastructure.

## Documentation archive and preservation

The archive is inside this canonical repository at
`E:\Dev\OpenExecution\research-line\academic-papers\collaborations\luckduck_portfolio\archive`.
The six old Markdown documents were moved byte-for-byte, without staging:

- `README-before-handover-20261017.md`.
- `design-concept-before-handover-20261017.md`.
- `design-concept-v2-before-handover-20261017.md`.
- `design-audit-before-handover-20261017.md`.
- `design-research-before-handover-20261017.md`.
- `STATS-before-handover-20261017.md`.

`archive/handover-preservation-20261017.json` records their original paths and
hashes, the unchanged local Git HEAD and the 92 preserved tracked source/data/
asset/configuration files. Source, data, scripts, workflows and image bytes
were not changed. Existing ignored reports, scrape evidence and generated
output were retained. Current root documentation is this file, `README.md`
and `AGENTS.md`. No commit, push or deployment was performed.
