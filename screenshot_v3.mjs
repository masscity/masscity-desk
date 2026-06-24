import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const SOURCE_DIR = 'C:/Users/Andri Saputro/Desktop/masscitydesk2_extracted/masscitydesk/project';
const OUT_DIR = 'C:/Users/Andri Saputro/Documents/Claude/masscity-desk/screenshots';
const PORT = 8767;

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.jsx': 'application/javascript',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

const server = createServer((req, res) => {
  let file = req.url === '/' ? '/Portfolio.html' : req.url.split('?')[0];
  const path = join(SOURCE_DIR, file);
  if (existsSync(path)) {
    const ext = extname(path);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(readFileSync(path));
  } else {
    res.writeHead(404); res.end('Not found: ' + file);
  }
});

await new Promise(r => server.listen(PORT, r));
console.log(`Server on http://localhost:${PORT}`);

const PAGES = [
  { path: '/Portfolio.html',     out: 'v3_portfolio.png',   wait: 9000 },
  { path: '/Resume.html',        out: 'v3_resume.png',      wait: 9000 },
  { path: '/Case-Parachute.html',out: 'v3_case.png',        wait: 9000 },
  { path: '/Wireframes.html',    out: 'v3_wireframes.png',  wait: 6000 },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins'],
});

for (const pg of PAGES) {
  console.log(`\n→ ${pg.path}`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PageError: ' + err.message));

  await page.goto(`http://localhost:${PORT}${pg.path}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, pg.wait));

  const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML?.slice(0, 300) || document.body?.innerHTML?.slice(0, 300));
  console.log('  content preview:', rootHTML?.slice(0, 120));
  if (errors.length) console.log('  errors:', errors.slice(0, 5));

  // Force all reveal animations
  await page.evaluate(() => {
    document.querySelectorAll('.reveal, [class*="reveal"]').forEach(el => el.classList.add('in'));
    window.dispatchEvent(new Event('scroll'));
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: `${OUT_DIR}/${pg.out}`, fullPage: true });
  console.log(`  ✓ saved ${pg.out}`);
  await page.close();
}

await browser.close();
server.close();
console.log('\nAll done.');
