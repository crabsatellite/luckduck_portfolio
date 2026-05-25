import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "data", "remote-metrics.json");
const PROFILE_PATH = join(ROOT, "data", "profile.json");

const GITHUB_USER = "LUCK666DUCK";

// Optional numeric-ID overrides for CurseForge projects. cfwidget will
// happily resolve `minecraft/mc-mods/<slug>`, but where we already know
// a project's stable numeric ID we prefer to use it (more durable if a
// project is ever renamed). Add a row here when you have the ID; not
// required for new credits to start working.
const CURSEFORGE_ID_OVERRIDES = {
  hotbath: 859412,
  instantworldmirror: 1449670,
};

function normalizeProjectKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function curseforgeSlugFromUrl(url) {
  const match = String(url || "").match(
    /curseforge\.com\/minecraft\/mc-mods\/([^/?#]+)/i
  );
  return match ? match[1].toLowerCase() : null;
}

// Derive the list of CurseForge projects to refresh straight from
// profile.json's `curseforge.tester_credits`. When you add a new
// tester credit there, the next daily run picks it up automatically —
// no second edit in this script.
function deriveCurseForgeProjects(profile) {
  const credits = profile?.curseforge?.tester_credits ?? [];
  const out = [];
  const seen = new Set();
  for (const credit of credits) {
    const slug = curseforgeSlugFromUrl(credit?.mod_url);
    if (!slug) continue;
    const key = normalizeProjectKey(slug);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      key,
      id: CURSEFORGE_ID_OVERRIDES[key] ?? null,
      slug,
      title: credit?.mod || slug,
      url: credit?.mod_url,
    });
  }
  return out;
}

// Derive the list of PR-mode credits to verify straight from
// profile.json's `pr_credits[].prs[]`. Daily refresh checks that
// each PR is still merged so the "verified" badge cannot lie.
function derivePRCredits(profile) {
  const credits = profile?.pr_credits ?? [];
  const out = [];
  const seen = new Set();
  for (const credit of credits) {
    if (!credit?.repo) continue;
    for (const pr of credit.prs ?? []) {
      if (typeof pr?.number !== "number") continue;
      const key = `${credit.repo}#${pr.number}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ repo: credit.repo, number: pr.number });
    }
  }
  return out;
}

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "luckduck-portfolio-metrics",
};
if (process.env.GITHUB_TOKEN) {
  GITHUB_HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    return null;
  }
}

function errorPayload(error) {
  return {
    message: error?.message || String(error),
    at: new Date().toISOString(),
  };
}

async function fetchJson(url, headers) {
  const response = await fetch(url, { headers });
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 160)}`);
  }
  if (!contentType.includes("json")) {
    throw new Error(`Unexpected content-type ${contentType || "(none)"}`);
  }
  return JSON.parse(text);
}

async function fetchCurseForgeProject(project, previous) {
  try {
    const endpoint = project.id
      ? `https://api.cfwidget.com/${project.id}`
      : `https://api.cfwidget.com/minecraft/mc-mods/${project.slug}`;
    const data = await fetchJson(endpoint, {
      Accept: "application/json",
      "User-Agent": "luckduck-portfolio-metrics",
    });
    const downloads = data?.downloads?.total;
    if (typeof downloads !== "number") {
      throw new Error("Missing downloads.total in CFWidget response");
    }
    return {
      key: project.key,
      id: project.id ?? data.id ?? null,
      slug: project.slug,
      title: data.title || project.title,
      url: project.url,
      downloads,
      thumbnail: data.thumbnail || null,
      created_at: data.created_at || null,
      updated_at: data.last_fetch || null,
      status: "ok",
    };
  } catch (error) {
    const fallback = previous?.curseforge?.projects?.[project.key];
    if (fallback && typeof fallback.downloads === "number") {
      return {
        ...fallback,
        status: "stale",
        error: errorPayload(error),
      };
    }
    return {
      key: project.key,
      id: project.id,
      slug: project.slug,
      title: project.title,
      url: project.url,
      downloads: null,
      status: "error",
      error: errorPayload(error),
    };
  }
}

async function searchCount(query) {
  const params = new URLSearchParams({
    q: query,
    per_page: "1",
  });
  const data = await fetchJson(`https://api.github.com/search/issues?${params}`, GITHUB_HEADERS);
  return Number(data.total_count || 0);
}

async function searchItems(query, limit = 10) {
  const params = new URLSearchParams({
    q: query,
    sort: "updated",
    order: "desc",
    per_page: String(limit),
  });
  const data = await fetchJson(`https://api.github.com/search/issues?${params}`, GITHUB_HEADERS);
  return (data.items || []).map((item) => ({
    repo: item.repository_url?.replace("https://api.github.com/repos/", "") || null,
    number: item.number,
    title: item.title,
    state: item.state,
    url: item.html_url,
    created_at: item.created_at,
    updated_at: item.updated_at,
    closed_at: item.closed_at,
    merged_at: item.pull_request?.merged_at || null,
  }));
}

async function fetchPRCredit(entry, previous) {
  const key = `${entry.repo}#${entry.number}`;
  const prev = previous?.pr_credits?.[key];
  try {
    const data = await fetchJson(
      `https://api.github.com/repos/${entry.repo}/pulls/${entry.number}`,
      GITHUB_HEADERS
    );
    return [
      key,
      {
        repo: entry.repo,
        number: entry.number,
        state: data.state,
        merged: Boolean(data.merged),
        merged_at: data.merged_at || null,
        updated_at: data.updated_at || null,
        status: "ok",
      },
    ];
  } catch (error) {
    if (prev) {
      return [key, { ...prev, status: "stale", error: errorPayload(error) }];
    }
    return [
      key,
      {
        repo: entry.repo,
        number: entry.number,
        state: "unknown",
        merged: false,
        merged_at: null,
        updated_at: null,
        status: "error",
        error: errorPayload(error),
      },
    ];
  }
}

async function fetchPublicEvents() {
  const params = new URLSearchParams({ per_page: "10" });
  const data = await fetchJson(
    `https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/events/public?${params}`,
    GITHUB_HEADERS
  );
  return {
    count: Array.isArray(data) ? data.length : 0,
    items: (Array.isArray(data) ? data : []).map((event) => ({
      type: event.type,
      repo: event.repo?.name || null,
      created_at: event.created_at,
      action: event.payload?.action || null,
      url: event.payload?.pull_request?.html_url || event.payload?.issue?.html_url || null,
    })),
  };
}

async function fetchGitHub(previous) {
  try {
    const [prTotal, prOpen, prMerged, prClosed, issueTotal, issueOpen, issueClosed, prItems, issueItems, events] =
      await Promise.all([
        searchCount(`author:${GITHUB_USER} type:pr`),
        searchCount(`author:${GITHUB_USER} type:pr state:open`),
        searchCount(`author:${GITHUB_USER} type:pr is:merged`),
        searchCount(`author:${GITHUB_USER} type:pr state:closed`),
        searchCount(`author:${GITHUB_USER} type:issue`),
        searchCount(`author:${GITHUB_USER} type:issue state:open`),
        searchCount(`author:${GITHUB_USER} type:issue state:closed`),
        searchItems(`author:${GITHUB_USER} type:pr`, 10),
        searchItems(`author:${GITHUB_USER} type:issue`, 10),
        fetchPublicEvents(),
      ]);
    return {
      status: "ok",
      data: {
        user: GITHUB_USER,
        prs: {
          total: prTotal,
          open: prOpen,
          merged: prMerged,
          closed_unmerged: Math.max(0, prClosed - prMerged),
          items: prItems,
        },
        issues: {
          total: issueTotal,
          open: issueOpen,
          closed: issueClosed,
          items: issueItems,
        },
        public_events: events,
      },
    };
  } catch (error) {
    const fallback = previous?.github;
    return {
      status: fallback ? "stale" : "error",
      error: errorPayload(error),
      data: fallback || {
        user: GITHUB_USER,
        prs: { total: 0, open: 0, merged: 0, closed_unmerged: 0, items: [] },
        issues: { total: 0, open: 0, closed: 0, items: [] },
        public_events: { count: 0, items: [] },
      },
    };
  }
}

async function main() {
  const previous = await readExisting();
  const profile = JSON.parse(await readFile(PROFILE_PATH, "utf8"));
  const curseforgeProjects = deriveCurseForgeProjects(profile);
  const prCreditEntries = derivePRCredits(profile);
  const fetchedAt = new Date().toISOString();

  console.log(
    `[remote-metrics] tracking ${curseforgeProjects.length} CurseForge project(s) + ${prCreditEntries.length} PR credit(s) from data/profile.json`
  );

  const projects = {};
  for (const project of curseforgeProjects) {
    projects[project.key] = await fetchCurseForgeProject(project, previous);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const github = await fetchGitHub(previous);
  const curseforgeStatus = Object.values(projects).some((p) => p.status === "error")
    ? "partial"
    : Object.values(projects).some((p) => p.status === "stale")
      ? "stale"
      : "ok";

  const prCredits = {};
  for (const entry of prCreditEntries) {
    const [key, value] = await fetchPRCredit(entry, previous);
    prCredits[key] = value;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  const prCreditsStatus = Object.values(prCredits).some((p) => p.status === "error")
    ? "partial"
    : Object.values(prCredits).some((p) => p.status === "stale")
      ? "stale"
      : "ok";

  const payload = {
    schema: 2,
    fetched_at: fetchedAt,
    sources: {
      curseforge: {
        status: curseforgeStatus,
        method: "cfwidget",
      },
      github: {
        status: github.status,
        method: "search/issues",
        user: GITHUB_USER,
        ...(github.error ? { error: github.error } : {}),
      },
      pr_credits: {
        status: prCreditsStatus,
        method: "repos/.../pulls/:number",
      },
    },
    curseforge: { projects },
    github: github.data,
    pr_credits: prCredits,
  };

  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`[remote-metrics] wrote data/remote-metrics.json at ${fetchedAt}`);
  for (const project of Object.values(projects)) {
    console.log(`[remote-metrics] ${project.slug}: ${project.downloads ?? "n/a"} downloads (${project.status})`);
  }
  console.log(`[remote-metrics] ${GITHUB_USER}: ${github.data.prs.total} PR(s), ${github.data.issues.total} issue(s)`);
  for (const pr of Object.values(prCredits)) {
    console.log(
      `[remote-metrics] ${pr.repo}#${pr.number}: ${pr.state}${pr.merged ? " (merged)" : ""} (${pr.status})`
    );
  }
}

main().catch((error) => {
  console.error("[remote-metrics] failed", error);
  process.exit(1);
});
