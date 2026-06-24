import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const SOURCE_DIR = 'C:/Users/Andri Saputro/Downloads/MassCityDesk_v2_extracted/design_handoff_andri_portfolio/source';
const OUT_DIR = 'C:/Users/Andri Saputro/Documents/Claude/masscity-desk/screenshots';
const PORT = 8766;

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.jsx': 'application/javascript',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
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
  { path: '/Portfolio.html', out: 'portfolio_v2.png', wait: 8000 },
  { path: '/Resume.html',    out: 'resume_v2.png',   wait: 8000 },
  { path: '/Case-Parachute.html', out: 'case_v2.png', wait: 8000 },
];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

for (const pg of PAGES) {
  console.log(`\n→ ${pg.path}`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Capture console errors
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PageError: ' + err.message));

  await page.goto(`http://localhost:${PORT}${pg.path}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, pg.wait));

  // Check if root has content
  const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML?.slice(0, 200));
  console.log('  root content:', rootHTML || '(empty)');
  if (errors.length) console.log('  errors:', errors.slice(0, 5));

  // Force reveal
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    // Also trigger a synthetic scroll to fire IntersectionObserver
    window.dispatchEvent(new Event('scroll'));
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: `${OUT_DIR}/${pg.out}`, fullPage: true });
  console.log(`  ✓ ${pg.out}`);
  await page.close();
}

await browser.close();
server.close();
console.log('\nDone.');
