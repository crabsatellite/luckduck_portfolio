// Rewrites v1's archived HTML so it serves correctly at /luckduck_portfolio/v1/*
// rather than /luckduck_portfolio/*. Walks public/v1/, replaces the original
// base ("/luckduck_portfolio/") with the archived base ("/luckduck_portfolio/v1/")
// in absolute URLs that don't already point inside /v1/. Also injects a tiny
// "← v2 / v1 archived 2026-05-01" banner and a noindex meta into each HTML.

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const V1_DIR = join(__dirname, "..", "public", "v1");
const OLD_BASE = "/luckduck_portfolio/";
const NEW_BASE = "/luckduck_portfolio/v1/";

const NOINDEX = `<meta name="robots" content="noindex, nofollow">`;
const BANNER_STYLE = `position:fixed;top:0;left:0;right:0;z-index:999;background:#1c1d2a;color:#f9c47a;font-family:ui-monospace,monospace;font-size:13px;padding:6px 12px;border-bottom:1px solid #3a3d56;text-align:center;letter-spacing:0.04em;`;
const BANNER_HTML = (lang) => {
  const back = lang === "en" ? "← back to v2" : "← 返回 v2";
  const text = lang === "en"
    ? "v1 archive — forensic-log design, 2026-05-01."
    : "v1 存档 — 取证日志设计, 2026-05-01。";
  return `<div style="${BANNER_STYLE}"><a href="/luckduck_portfolio/" style="color:#f9c47a;text-decoration:underline;">${back}</a> &nbsp;·&nbsp; ${text}</div>`;
};

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

async function rewrite(file) {
  let html = await readFile(file, "utf8");
  // Path rewrites: only match base when followed by something other than `v1/`,
  // to avoid double-prefix (idempotent re-runs).
  html = html.replaceAll(/\/luckduck_portfolio\/(?!v1\/)/g, NEW_BASE);
  // Inject noindex into <head> if not already present.
  if (!html.includes('name="robots"')) {
    html = html.replace(/<head>/i, `<head>${NOINDEX}`);
  }
  // Inject banner right after <body>, language-aware via <html lang>.
  const lang = /<html[^>]*lang="(en[^"]*)"/i.test(html) ? "en" : "zh";
  if (!html.includes("v1 archive — forensic") && !html.includes("v1 存档")) {
    html = html.replace(/<body([^>]*)>/i, (m, attrs) => `<body${attrs}>${BANNER_HTML(lang)}`);
  }
  await writeFile(file, html, "utf8");
}

async function main() {
  const files = await walk(V1_DIR);
  console.log(`[v1-archive] rewriting ${files.length} html files`);
  for (const f of files) await rewrite(f);
  console.log("[v1-archive] done");
}

main().catch((e) => {
  console.error("[v1-archive] failed:", e);
  process.exit(1);
});
