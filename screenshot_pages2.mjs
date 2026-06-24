// Take full-page screenshots via local HTTP server
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:8765';
const OUT = 'C:/Users/Andri Saputro/Documents/Claude/masscity-desk/screenshots';

const PAGES = [
  { path: '/Portfolio.html',      out: 'portfolio_ref.png' },
  { path: '/Resume.html',         out: 'resume_ref.png'    },
  { path: '/Case-Parachute.html', out: 'case_ref.png'      },
];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const pg of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE + pg.path, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3500)); // wait for fonts + React + reveal animations
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: OUT + '/' + pg.out, fullPage: true });
  console.log('✓', pg.out);
  await page.close();
}

await browser.close();
console.log('Done');
