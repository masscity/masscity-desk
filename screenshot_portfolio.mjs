import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const PAGES = [
  { url: 'http://localhost:3001/Portfolio.html', name: 'portfolio' },
  { url: 'http://localhost:3001/Resume.html',    name: 'resume' },
  { url: 'http://localhost:3001/Case-Parachute.html', name: 'case-parachute' },
];

const OUT_DIR = 'C:/Users/Andri Saputro/Documents/Claude/masscity-desk/screenshots';
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

for (const { url, name } of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  // Wait extra for Babel + React to finish
  await new Promise(r => setTimeout(r, 5000));
  const outPath = path.join(OUT_DIR, `${name}.jpg`);
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 90, fullPage: false });
  console.log('Captured:', outPath);
  await page.close();
}

await browser.close();
console.log('Done');
