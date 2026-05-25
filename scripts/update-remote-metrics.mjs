import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "data", "remote-metrics.json");

const GITHUB_USER = "LUCK666DUCK";
const CURSEFORGE_PROJECTS = [
  {
    key: "hotbath",
    id: 859412,
    slug: "hotbath",
    title: "Hot Bath",
    url: "https://www.curseforge.com/minecraft/mc-mods/hotbath",
  },
  {
    key: "instantworldmirror",
    id: 1449670,
    slug: "instantworldmirror",
    title: "InstantWorldMirror",
    url: "https://www.curseforge.com/minecraft/mc-mods/instantworldmirror",
  },
];

// PR-mode credit verification. Each entry is a PR whose body credits
// LUCK666DUCK as Tester; daily refresh checks that the PR is still
// merged so the "verified" badge cannot lie.
const PR_CREDITS = [
  { repo: "AlexModGuy/AlexsCaves", number: 1693 },
  { repo: "AlexModGuy/AlexsCaves", number: 1698 },
  { repo: "AlexModGuy/AlexsMobs", number: 2315 },
  { repo: "AlexModGuy/AlexsMobs", number: 2317 },
];

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
    const data = await fetchJson(`https://api.cfwidget.com/${project.id}`, {
      Accept: "application/json",
      "User-Agent": "luckduck-portfolio-metrics",
    });
    const downloads = data?.downloads?.total;
    if (typeof downloads !== "number") {
      throw new Error("Missing downloads.total in CFWidget response");
    }
    return {
      key: project.key,
      id: project.id,
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
  const fetchedAt = new Date().toISOString();

  const projects = {};
  for (const project of CURSEFORGE_PROJECTS) {
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
  for (const entry of PR_CREDITS) {
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
