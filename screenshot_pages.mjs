// Take full-page screenshots of all 3 pages for Figma reference
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const DIR = 'C:/Users/Andri Saputro/Documents/Claude/masscity-desk';
const OUT = DIR + '/screenshots';

const PAGES = [
  { file: 'Portfolio.html',     out: 'portfolio_ref.png',  w: 1440, h: 900 },
  { file: 'Resume.html',        out: 'resume_ref.png',     w: 1440, h: 900 },
  { file: 'Case-Parachute.html',out: 'case_ref.png',       w: 1440, h: 900 },
];

const browser = await puppeteer.launch({ headless: true });

for (const pg of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: pg.w, height: pg.h, deviceScaleFactor: 1 });
  const url = `file:///${DIR}/${pg.file}`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Wait for fonts and React render
  await new Promise(r => setTimeout(r, 3000));
  // Force all reveal animations to show
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });
  await new Promise(r => setTimeout(r, 500));
  // Full page screenshot
  await page.screenshot({ path: `${OUT}/${pg.out}`, fullPage: true });
  console.log(`✓ ${pg.out}`);
  await page.close();
}

await browser.close();
console.log('Done. Screenshots saved to', OUT);
