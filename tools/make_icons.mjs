// Hutengeneza aikoni za PWA (PNG + SVG). Matumizi: node tools/make_icons.mjs
// Inahitaji Playwright (npm i -D playwright). Aikoni zilizotengenezwa tayari zipo kwenye public/icons.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(out, { recursive: true });

// scale: ukubwa wa msalaba (maskable lazima ubaki ndani ya 60% ya katikati)
function svg({ rounded = true, scale = 1 } = {}) {
  const r = rounded ? 112 : 0;
  const s = scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2358"/><stop offset="1" stop-color="#090d1c"/></linearGradient>
  <radialGradient id="halo" cx="50%" cy="46%" r="52%"><stop offset="0" stop-color="#f3d78a" stop-opacity=".55"/><stop offset=".55" stop-color="#c99a3e" stop-opacity=".12"/><stop offset="1" stop-color="#c99a3e" stop-opacity="0"/></radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbeab8"/><stop offset=".5" stop-color="#e6c982"/><stop offset="1" stop-color="#b98630"/></linearGradient>
</defs>
<rect width="512" height="512" rx="${r}" fill="url(#bg)"/>
<rect width="512" height="512" rx="${r}" fill="url(#halo)"/>
<g transform="translate(256 256) scale(${s}) translate(-256 -256)">
  <g stroke="url(#gold)" stroke-width="7" stroke-linecap="round" opacity=".5" fill="none">
    <path d="M256 64v34M256 414v34M64 256h34M414 256h34M122 122l24 24M366 366l24 24M390 122l-24 24M146 366l-24 24"/>
  </g>
  <path d="M226 118h60v108h108v60H286v108h-60V286H118v-60h108z" fill="url(#gold)"/>
  <path d="M226 118h60v108h108v60H286v108h-60V286H118v-60h108z" fill="none" stroke="#fff6dc" stroke-opacity=".55" stroke-width="3"/>
</g>
</svg>`;
}

const jobs = [
  ["favicon.svg", svg({ scale: 1.05 }), null],
  ["icon-192.png", svg({ scale: 1.0 }), 192],
  ["icon-512.png", svg({ scale: 1.0 }), 512],
  ["icon-maskable-512.png", svg({ rounded: false, scale: 0.68 }), 512],
  ["apple-touch-icon.png", svg({ rounded: false, scale: 0.9 }), 180],
  ["favicon-32.png", svg({ scale: 1.15 }), 32],
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, markup, size] of jobs) {
  if (!size) { writeFileSync(join(out, name), markup); continue; }
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`);
  await page.screenshot({ path: join(out, name), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}
await browser.close();
console.log("Aikoni zimeandikwa:", out);
