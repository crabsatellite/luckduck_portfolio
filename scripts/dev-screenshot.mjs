// dev-only screenshot helper. NOT part of the build; used during the
// redesign rounds to verify changes look right. Run with:
//   node scripts/dev-screenshot.mjs <scope>
// where <scope> is 'all' (default) | 'home' | 'home-zh' | 'home-en' |
// a section selector with --section=".letter" --out=letter-zh --lang=zh
import { chromium } from 'playwright';

const URL_BASE = 'http://localhost:4322/luckduck_portfolio';
const argv = process.argv.slice(2);
const named = Object.fromEntries(
  argv.filter((a) => a.startsWith('--')).map((a) => {
    const [k, ...rest] = a.slice(2).split('=');
    return [k, rest.join('=') || true];
  })
);
const wantedScope = argv.find((a) => !a.startsWith('--')) || 'all';

const all = [
  { url: `${URL_BASE}/`, name: 'home-zh', wait: 1500, locale: 'zh-CN' },
  { url: `${URL_BASE}/en/`, name: 'home-en', wait: 1500, locale: 'en-US' },
  { url: `${URL_BASE}/cases`, name: 'cases-zh', wait: 1000, locale: 'zh-CN' },
  { url: `${URL_BASE}/methodology`, name: 'methodology-zh', wait: 800, locale: 'zh-CN' },
  { url: `${URL_BASE}/notes`, name: 'notes-zh', wait: 800, locale: 'zh-CN' },
  { url: `${URL_BASE}/about`, name: 'about-zh', wait: 800, locale: 'zh-CN' },
  { url: `${URL_BASE}/cases/hotbath`, name: 'case-hotbath-zh', wait: 1000, locale: 'zh-CN' },
];

const targets =
  wantedScope === 'home' ? all.slice(0, 2)
  : wantedScope === 'home-zh' ? [all[0]]
  : wantedScope === 'home-en' ? [all[1]]
  : wantedScope === 'cases' ? [all[2]]
  : wantedScope === 'methodology' ? [all[3]]
  : wantedScope === 'notes' ? [all[4]]
  : wantedScope === 'about' ? [all[5]]
  : wantedScope === 'case-detail' ? [all[6]]
  : all;

const browser = await chromium.launch();

// section mode: take a hi-res clip of a single selector on one page
if (named.section) {
  const url = named.lang === 'en' ? `${URL_BASE}/en/` : (named.url || `${URL_BASE}/`);
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: named.scheme === 'light' ? 'light' : 'dark',
    locale: named.lang === 'en' ? 'en-US' : 'zh-CN',
  });
  await ctx.addInitScript((wanted) => {
    try {
      localStorage.setItem('luckduck.lang', wanted);
      sessionStorage.setItem('luckduck.lang.checked', '1');
    } catch (_) {}
  }, named.lang === 'en' ? 'en' : 'zh');
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const el = page.locator(named.section).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  const out = `C:/temp/lp-${named.out || 'section'}.png`;
  await el.screenshot({ path: out });
  console.log(out);
  await page.close();
  await ctx.close();
  await browser.close();
  process.exit(0);
}

for (const t of targets) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    locale: t.locale,
    reducedMotion: 'no-preference',
  });
  await ctx.addInitScript((wanted) => {
    try {
      localStorage.setItem('luckduck.lang', wanted);
      sessionStorage.setItem('luckduck.lang.checked', '1');
    } catch (_) {}
  }, t.locale === 'en-US' ? 'en' : 'zh');

  const page = await ctx.newPage();
  await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(t.wait);
  const file = `C:/temp/lp-${t.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
  await page.close();
  await ctx.close();
}

if (wantedScope === 'all') {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'zh-CN',
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('luckduck.lang', 'zh');
      sessionStorage.setItem('luckduck.lang.checked', '1');
    } catch (_) {}
  });
  const page = await ctx.newPage();
  await page.goto(`${URL_BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/temp/lp-home-zh-light.png', fullPage: true });
  await page.close();
  await ctx.close();
}

await browser.close();
console.log('done');
