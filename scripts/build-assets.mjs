// v2 build-assets: invokes mascot + badges + scenes generators, then builds
// favicon (duck head on amber square) and OG card (warm-deep, mascot left,
// title right, steam-curl strips top + bottom).

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "..", "public");

const COLORS = {
  bg: "#1c1d2a",
  bgSoft: "#25273a",
  ink: "#f4ebd9",
  inkSoft: "#c8c0b0",
  inkMute: "#8e8a7d",
  accent: "#f9c47a",
  accentDeep: "#e89c4d",
  steam: "#b8d8e6",
  rule: "#3a3d56",
};

async function ensureDir(d) {
  if (!existsSync(d)) await mkdir(d, { recursive: true });
}

function runScript(name) {
  const cmd = `node ${join(__dirname, name)}`;
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (e) {
    console.error(`[build-assets] subscript failed: ${name}`, e);
    throw e;
  }
}

async function buildFavicon() {
  const mascotPath = join(PUBLIC_DIR, "mascot-180.png");
  const accent = COLORS.accent.replace("#", "");
  const accentR = parseInt(accent.slice(0, 2), 16);
  const accentG = parseInt(accent.slice(2, 4), 16);
  const accentB = parseInt(accent.slice(4, 6), 16);
  const bg = { r: accentR, g: accentG, b: accentB, alpha: 1 };

  const sources = [
    { size: 32, out: "favicon-32.png", padding: 4 },
    { size: 180, out: "apple-touch-icon.png", padding: 24 },
  ];
  for (const { size, out, padding } of sources) {
    const ducksize = size - padding * 2;
    const duckBuffer = await sharp(mascotPath)
      .resize(ducksize, ducksize, { kernel: "nearest", fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: bg },
    })
      .composite([{ input: duckBuffer, top: padding, left: padding }])
      .png({ compressionLevel: 9 })
      .toFile(join(PUBLIC_DIR, out));
    console.log(`[build-assets] wrote ${out}`);
  }

  const png32 = await sharp(join(PUBLIC_DIR, "favicon-32.png")).toBuffer();
  await writeFile(join(PUBLIC_DIR, "favicon.ico"), png32);
  console.log("[build-assets] wrote favicon.ico (PNG-as-ICO)");
}

async function buildOg() {
  const W = 1200, H = 630;
  const mascotPath = join(PUBLIC_DIR, "mascot-180.png");
  const mascotBytes = await readFile(mascotPath);
  const mascotB64 = mascotBytes.toString("base64");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.bg}"/>
      <stop offset="100%" stop-color="#252638"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg-grad)"/>
  <g transform="translate(0, 60)" font-family="ui-monospace, monospace" font-size="32" fill="${COLORS.steam}">
    <text x="0" y="0">${"～ 💧 ".repeat(28)}</text>
  </g>

  <image href="data:image/png;base64,${mascotB64}" x="80" y="200" width="280" height="280" style="image-rendering: pixelated"/>

  <text x="420" y="270" font-family="ui-sans-serif, system-ui, sans-serif" font-size="76" font-weight="800" fill="${COLORS.ink}" letter-spacing="-1">LUCK666DUCK</text>
  <text x="420" y="335" font-family="ui-sans-serif, system-ui, sans-serif" font-size="34" font-weight="500" fill="${COLORS.accent}" letter-spacing="0">Minecraft mod tester</text>
  <text x="420" y="380" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" fill="${COLORS.inkSoft}">multi-round regression · multi-locale verification</text>

  <g transform="translate(420, 420)" font-family="ui-monospace, monospace">
    <rect x="0" y="0" rx="8" ry="8" width="140" height="60" fill="${COLORS.bgSoft}" stroke="${COLORS.accent}" stroke-width="2"/>
    <text x="20" y="40" font-size="30" font-weight="800" fill="${COLORS.accent}">13</text>
    <text x="60" y="42" font-size="14" font-weight="500" fill="${COLORS.inkSoft}">mods</text>

    <rect x="160" y="0" rx="8" ry="8" width="170" height="60" fill="${COLORS.bgSoft}" stroke="${COLORS.rule}" stroke-width="1"/>
    <text x="180" y="40" font-size="30" font-weight="800" fill="${COLORS.ink}">433</text>
    <text x="244" y="42" font-size="14" font-weight="500" fill="${COLORS.inkSoft}">bugs</text>

    <rect x="350" y="0" rx="8" ry="8" width="140" height="60" fill="${COLORS.bgSoft}" stroke="${COLORS.rule}" stroke-width="1"/>
    <text x="370" y="40" font-size="30" font-weight="800" fill="${COLORS.ink}">24</text>
    <text x="412" y="42" font-size="14" font-weight="500" fill="${COLORS.inkSoft}">rounds</text>

    <rect x="510" y="0" rx="8" ry="8" width="220" height="60" fill="${COLORS.bgSoft}" stroke="${COLORS.rule}" stroke-width="1"/>
    <text x="528" y="40" font-size="20" font-weight="700" fill="${COLORS.ink}">1.20.1 / 1.21.1</text>
  </g>

  <g transform="translate(0, 580)" font-family="ui-monospace, monospace" font-size="32" fill="${COLORS.steam}">
    <text x="0" y="0">${"～ 💧 ".repeat(28)}</text>
  </g>
</svg>`;

  await sharp(Buffer.from(svg))
    .resize(W, H)
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC_DIR, "og.png"));
  console.log("[build-assets] wrote og.png");
}

async function main() {
  await ensureDir(PUBLIC_DIR);
  runScript("gen-mascot.mjs");
  runScript("gen-badges.mjs");
  runScript("gen-scenes.mjs");
  await buildFavicon();
  await buildOg();
}

main().catch((e) => {
  console.error("[build-assets] failed:", e);
  process.exit(1);
});
