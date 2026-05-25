// Generates 6 retro 88x31 badges as SVG files.
// Classic 88x31 web-button aesthetic: chunky 1-2px borders, segmented panels,
// pixel-style font, saturated paired colors. No external font deps — uses
// generic monospace/system. SVG is self-contained.

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT = join(__dirname, "..", "public", "badges");

const W = 88, H = 31;

// Build a classic 2-panel split badge: left side colored block with one line,
// right side darker with two lines.
function badge2panel(opts) {
  const {
    leftBg, leftFg, leftText, leftFontSize = 9,
    rightBg, rightFg, rightLine1, rightLine2, rightFontSize = 8,
    leftWidth = 32,
  } = opts;
  const rightX = leftWidth;
  const rightW = W - leftWidth;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" image-rendering="pixelated">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#1c1d2a"/>
  <rect x="1" y="1" width="${leftWidth - 1}" height="${H - 2}" fill="${leftBg}"/>
  <rect x="${rightX}" y="1" width="${rightW - 1}" height="${H - 2}" fill="${rightBg}"/>
  <rect x="0" y="0" width="${W}" height="1" fill="#f4ebd9"/>
  <rect x="0" y="${H - 1}" width="${W}" height="1" fill="#1c1d2a"/>
  <rect x="0" y="0" width="1" height="${H}" fill="#f4ebd9"/>
  <rect x="${W - 1}" y="0" width="1" height="${H}" fill="#1c1d2a"/>
  <rect x="${leftWidth - 1}" y="1" width="1" height="${H - 2}" fill="#1c1d2a"/>
  <text x="${leftWidth / 2}" y="${H / 2 + leftFontSize / 3}" font-family="ui-monospace,Consolas,Menlo,monospace" font-size="${leftFontSize}" font-weight="700" fill="${leftFg}" text-anchor="middle" dominant-baseline="middle" letter-spacing="0">${escape(leftText)}</text>
  <text x="${rightX + rightW / 2}" y="${H / 2 - 2}" font-family="ui-monospace,Consolas,Menlo,monospace" font-size="${rightFontSize}" font-weight="700" fill="${rightFg}" text-anchor="middle" dominant-baseline="middle">${escape(rightLine1)}</text>
  <text x="${rightX + rightW / 2}" y="${H / 2 + 8}" font-family="ui-monospace,Consolas,Menlo,monospace" font-size="${rightFontSize}" font-weight="500" fill="${rightFg}" text-anchor="middle" dominant-baseline="middle">${escape(rightLine2)}</text>
</svg>`;
}

function badgeSingle(opts) {
  const { bg, fg, line1, line2, fontSize = 8, accent = "#1c1d2a" } = opts;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" image-rendering="pixelated">
  <rect x="0" y="0" width="${W}" height="${H}" fill="${accent}"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="${bg}"/>
  <rect x="0" y="0" width="${W}" height="1" fill="#f4ebd9"/>
  <rect x="0" y="${H - 1}" width="${W}" height="1" fill="${accent}"/>
  <rect x="0" y="0" width="1" height="${H}" fill="#f4ebd9"/>
  <rect x="${W - 1}" y="0" width="1" height="${H}" fill="${accent}"/>
  <text x="${W / 2}" y="${H / 2 - 2}" font-family="ui-monospace,Consolas,Menlo,monospace" font-size="${fontSize}" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${escape(line1)}</text>
  <text x="${W / 2}" y="${H / 2 + 8}" font-family="ui-monospace,Consolas,Menlo,monospace" font-size="${fontSize}" font-weight="500" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${escape(line2)}</text>
</svg>`;
}

function escape(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

function compactNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function loadHotBathDownloads() {
  try {
    const metricsPath = join(__dirname, "..", "data", "remote-metrics.json");
    const metrics = JSON.parse(readFileSync(metricsPath, "utf8"));
    const downloads = metrics?.curseforge?.projects?.hotbath?.downloads;
    return typeof downloads === "number" ? `${compactNumber(downloads)} DL` : "1M+ DL";
  } catch {
    return "1M+ DL";
  }
}

const hotBathDownloads = loadHotBathDownloads();

const BADGES = {
  "mc-range.svg": badge2panel({
    leftBg: "#1c1d2a", leftFg: "#f9c47a", leftText: "MC",
    rightBg: "#f9c47a", rightFg: "#1c1d2a", rightLine1: "1.14 →", rightLine2: "1.21",
  }),
  "regression-rounds.svg": badge2panel({
    leftBg: "#1c1d2a", leftFg: "#a6e3a1", leftText: "5×",
    rightBg: "#a6e3a1", rightFg: "#1c1d2a", rightLine1: "regression", rightLine2: "rounds",
  }),
  "hot-bath-dl.svg": badge2panel({
    leftBg: "#e89c4d", leftFg: "#1c1d2a", leftText: "🛁", leftFontSize: 14,
    rightBg: "#1c1d2a", rightFg: "#f9c47a", rightLine1: "Hot Bath", rightLine2: hotBathDownloads,
    leftWidth: 26,
  }),
  "verified-tester.svg": badge2panel({
    leftBg: "#f9c47a", leftFg: "#1c1d2a", leftText: "✓", leftFontSize: 16,
    rightBg: "#1c1d2a", rightFg: "#f9c47a", rightLine1: "verified", rightLine2: "tester",
    leftWidth: 22,
  }),
  "bilingual-zh-en.svg": badge2panel({
    leftBg: "#b8d8e6", leftFg: "#1c1d2a", leftText: "中/EN", leftFontSize: 8,
    rightBg: "#1c1d2a", rightFg: "#b8d8e6", rightLine1: "bilingual", rightLine2: "zh / en",
  }),
  "powered-by-duck.svg": badge2panel({
    leftBg: "#1c1d2a", leftFg: "#f9c47a", leftText: "🦆", leftFontSize: 16,
    rightBg: "#f9c47a", rightFg: "#1c1d2a", rightLine1: "powered", rightLine2: "by duck",
    leftWidth: 26,
  }),
};

async function main() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
  for (const [name, svg] of Object.entries(BADGES)) {
    await writeFile(join(OUT, name), svg, "utf8");
    console.log(`[badges] wrote ${name}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
