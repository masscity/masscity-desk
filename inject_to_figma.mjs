/**
 * Reads the portfolio screenshots and creates Figma frames via the bridge plugin.
 * Bypasses MCP tool to embed images as base64 directly in plugin code.
 */
import fs from 'fs';
import path from 'path';

const BRIDGE = 'http://127.0.0.1:3845';
const SCREENSHOTS_DIR = 'C:/Users/Andri Saputro/Documents/Claude/masscity-desk/screenshots';

const PAGES = [
  { name: 'Portfolio — Work',             file: 'portfolio.jpg',       x: 0 },
  { name: 'Resume',                        file: 'resume.jpg',          x: 1540 },
  { name: 'Case Study — VR Parachute',     file: 'case-parachute.jpg',  x: 3080 },
];

async function injectCode(code, timeout_ms = 60000) {
  const res = await fetch(`${BRIDGE}/api/inject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, timeout_ms }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// Switch to Web page first
console.log('Switching to Web page...');
await injectCode(`
  const page = figma.root.children.find(p => p.name === 'Web');
  if (page) { figma.currentPage = page; return 'switched to ' + page.name; }
  return 'Web page not found, staying on: ' + figma.currentPage.name;
`);

// Create each frame
for (const { name, file, x } of PAGES) {
  const imgPath = path.join(SCREENSHOTS_DIR, file);
  const bytes = fs.readFileSync(imgPath);
  const b64 = bytes.toString('base64');
  console.log(`Creating frame "${name}" (${Math.round(bytes.length / 1024)}KB → ${Math.round(b64.length / 1024)}KB base64)...`);

  const code = `
    const b64 = ${JSON.stringify(b64)};
    // Pure-JS base64 decoder (atob not available in Figma plugin sandbox)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
    const str = b64.replace(/[^A-Za-z0-9+/]/g, '');
    const len = str.length;
    const outLen = Math.floor(len * 3 / 4);
    const bytes = new Uint8Array(outLen);
    let j = 0;
    for (let i = 0; i < len; i += 4) {
      const e0 = lookup[str.charCodeAt(i)], e1 = lookup[str.charCodeAt(i+1)];
      const e2 = lookup[str.charCodeAt(i+2)], e3 = lookup[str.charCodeAt(i+3)];
      bytes[j++] = (e0 << 2) | (e1 >> 4);
      if (i+2 < len && str[i+2] !== '=') bytes[j++] = ((e1 & 15) << 4) | (e2 >> 2);
      if (i+3 < len && str[i+3] !== '=') bytes[j++] = ((e2 & 3) << 6) | e3;
    }

    const img = figma.createImage(bytes.slice(0, j));
    const frame = figma.createFrame();
    frame.name = ${JSON.stringify(name)};
    frame.resize(1440, 900);
    frame.x = ${x};
    frame.y = 0;
    frame.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
    figma.currentPage.appendChild(frame);
    return frame.name + ' created';
  `;

  const result = await injectCode(code, 60000);
  console.log(' ✓', result);
}

// Zoom to fit all frames
console.log('Zooming to fit...');
await injectCode(`
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.notify('✓ Portfolio imported — 3 frames created!');
  return 'done';
`);

console.log('\nAll done! Check Figma — 3 frames should be on the Web page.');
