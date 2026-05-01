// Generates favicon (32x32 PNG, 180x180 apple-touch, ICO) and OG card (1200x630)
// from inline SVG using sharp. Skips if outputs already exist and are newer
// than this script.

import { mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "..", "public");

const COLORS = {
  bg: "#0e0f12",
  surface: "#15171c",
  ink: "#e6e7ea",
  inkMute: "#8d909a",
  amber: "#ffb454",
};

const SVG_FAVICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${COLORS.bg}"/>
  <rect x="2" y="2" width="28" height="28" fill="${COLORS.amber}"/>
  <text x="16" y="22" font-family="ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
        font-size="16" font-weight="700"
        text-anchor="middle" fill="${COLORS.bg}">LD</text>
</svg>
`;

const SVG_OG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${COLORS.surface}" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${COLORS.bg}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <line x1="80" y1="120" x2="1120" y2="120" stroke="#232730" stroke-width="1"/>
  <text x="80" y="105" font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace"
        font-size="20" font-weight="500" fill="${COLORS.amber}" letter-spacing="3">CASE-FILE / ACTIVE</text>

  <text x="80" y="240" font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace"
        font-size="84" font-weight="700" fill="${COLORS.ink}" letter-spacing="-1">LUCK666DUCK</text>
  <text x="80" y="320" font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace"
        font-size="32" font-weight="500" fill="${COLORS.inkMute}" letter-spacing="2">Minecraft mod QA tester</text>
  <text x="80" y="372" font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace"
        font-size="22" font-weight="400" fill="${COLORS.inkMute}" letter-spacing="1">multi-round regression · multi-locale verification · cross-mod compatibility</text>

  <line x1="80" y1="510" x2="1120" y2="510" stroke="#232730" stroke-width="1"/>
  <line x1="80" y1="580" x2="1120" y2="580" stroke="#232730" stroke-width="1"/>

  <text x="80" y="555" font-family="ui-monospace, monospace" font-size="36" font-weight="700" fill="${COLORS.amber}">13</text>
  <text x="130" y="555" font-family="ui-monospace, monospace" font-size="18" font-weight="500" fill="${COLORS.inkMute}" letter-spacing="2">mods tested</text>

  <text x="340" y="555" font-family="ui-monospace, monospace" font-size="36" font-weight="700" fill="${COLORS.ink}">433</text>
  <text x="410" y="555" font-family="ui-monospace, monospace" font-size="18" font-weight="500" fill="${COLORS.inkMute}" letter-spacing="2">bugs filed</text>

  <text x="600" y="555" font-family="ui-monospace, monospace" font-size="36" font-weight="700" fill="${COLORS.ink}">24</text>
  <text x="650" y="555" font-family="ui-monospace, monospace" font-size="18" font-weight="500" fill="${COLORS.inkMute}" letter-spacing="2">test rounds</text>

  <text x="850" y="555" font-family="ui-monospace, monospace" font-size="22" font-weight="500" fill="${COLORS.ink}">1.20.1 / 1.21.1</text>
  <text x="850" y="580" font-family="ui-monospace, monospace" font-size="14" font-weight="500" fill="${COLORS.inkMute}" letter-spacing="2" dy="20">mc coverage</text>
</svg>
`;

async function ensureDir(d) {
  if (!existsSync(d)) await mkdir(d, { recursive: true });
}

async function needsRebuild(outPath) {
  if (!existsSync(outPath)) return true;
  try {
    const out = await stat(outPath);
    const me = await stat(__filename);
    return out.mtimeMs < me.mtimeMs;
  } catch {
    return true;
  }
}

async function buildFavicon() {
  const outPng32 = join(PUBLIC_DIR, "favicon-32.png");
  const outApple = join(PUBLIC_DIR, "apple-touch-icon.png");
  const outIco = join(PUBLIC_DIR, "favicon.ico");

  const svgBuffer = Buffer.from(SVG_FAVICON);

  if (await needsRebuild(outPng32)) {
    await sharp(svgBuffer, { density: 384 })
      .resize(32, 32)
      .png()
      .toFile(outPng32);
    console.log("[assets] wrote", outPng32);
  }

  if (await needsRebuild(outApple)) {
    await sharp(svgBuffer, { density: 384 })
      .resize(180, 180)
      .png()
      .toFile(outApple);
    console.log("[assets] wrote", outApple);
  }

  // Sharp doesn't write .ico natively. Write a 32x32 PNG into .ico container —
  // browsers tolerate raw PNG inside .ico on modern OSes. For absolute
  // reliability on legacy IE we'd need a real .ico encoder, but per this
  // project's audience (Minecraft mod authors on modern browsers) PNG-as-ico
  // is acceptable.
  if (await needsRebuild(outIco)) {
    const pngBuf = await sharp(svgBuffer, { density: 384 })
      .resize(32, 32)
      .png()
      .toBuffer();
    await writeFile(outIco, pngBuf);
    console.log("[assets] wrote", outIco, "(PNG-as-ICO)");
  }
}

async function buildOg() {
  const outOg = join(PUBLIC_DIR, "og.png");
  if (!(await needsRebuild(outOg))) return;
  await sharp(Buffer.from(SVG_OG))
    .resize(1200, 630)
    .png()
    .toFile(outOg);
  console.log("[assets] wrote", outOg);
}

async function main() {
  await ensureDir(PUBLIC_DIR);
  await buildFavicon();
  await buildOg();
}

main().catch((e) => {
  console.error("[assets] failed:", e);
  process.exit(1);
});
