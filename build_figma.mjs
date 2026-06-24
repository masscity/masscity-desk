/**
 * Builds the MassCityDesk portfolio natively in Figma:
 * - Portfolio — Work page
 * - Resume page
 * - Case Study — VR Parachute page
 *
 * All real text, auto-layout, glassmorphism effects, color tokens.
 */

const BRIDGE = 'http://127.0.0.1:3845';

async function inject(code, timeout_ms = 90000) {
  const res = await fetch(BRIDGE + '/api/inject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, timeout_ms }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// ─── Step 0: Switch to Web page + delete screenshot frames ─────────────────
console.log('0. Switching to Web page and clearing old frames...');
await inject(`
  const page = figma.root.children.find(p => p.name === 'Web');
  if (page) figma.currentPage = page;
  // Remove old screenshot frames
  const old = figma.currentPage.children.filter(n =>
    ['Portfolio — Work','Resume','Case Study — VR Parachute'].includes(n.name)
  );
  old.forEach(n => n.remove());
  return 'cleared ' + old.length + ' old frames';
`);

// ─── Step 1: Load all fonts we'll need ────────────────────────────────────
console.log('1. Loading fonts...');
await inject(`
  await Promise.all([
    figma.loadFontAsync({ family: 'DM Serif Display', style: 'Regular' }),
    figma.loadFontAsync({ family: 'DM Serif Display', style: 'Italic' }),
    figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: 'Bold' }),
  ]);
  return 'fonts loaded';
`, 30000);

// ─── Step 2: Build Portfolio page ─────────────────────────────────────────
console.log('2. Building Portfolio — Work page...');
await inject(`
// ── Color tokens ──
const C = {
  bg0:         { r: 0.957, g: 0.941, b: 0.886 },
  bg1:         { r: 0.929, g: 0.894, b: 0.824 },
  ink:         { r: 0.200, g: 0.129, b: 0.094 },
  ink2:        { r: 0.345, g: 0.235, b: 0.192 },
  ink3:        { r: 0.475, g: 0.365, b: 0.318 },
  accent:      { r: 0.831, g: 0.443, b: 0.278 },
  accentDeep:  { r: 0.545, g: 0.259, b: 0.153 },
  yellow:      { r: 0.808, g: 0.722, b: 0.478 },
  green:       { r: 0.478, g: 0.722, b: 0.541 },
  pink:        { r: 0.773, g: 0.588, b: 0.498 },
  cream:       { r: 1.000, g: 0.980, b: 0.933 },
  glassFill:   { r: 1.000, g: 0.980, b: 0.933 },
  glassBorder: { r: 0.431, g: 0.294, b: 0.176 },
  innerFill:   { r: 1.000, g: 0.973, b: 0.910 },
};

// ── Helper: solid fill ──
const solid = (c, a = 1) => [{ type: 'SOLID', color: c, opacity: a }];

// ── Helper: create styled text ──
function mkText(chars, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: opts.family || 'Plus Jakarta Sans', style: opts.style || 'Regular' };
  t.characters = chars;
  t.fontSize = opts.size || 14;
  t.fills = solid(opts.color || C.ink);
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: 'PIXELS' };
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PIXELS' };
  if (opts.italic) t.fontName = { family: opts.family || 'DM Serif Display', style: 'Italic' };
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.width) { t.textAutoResize = 'HEIGHT'; t.resize(opts.width, 100); }
  return t;
}

// ── Helper: glass card frame ──
function glassCard(w, h, opts = {}) {
  const f = figma.createFrame();
  f.resize(w, h);
  f.fills = solid(C.glassFill, 0.55);
  f.strokes = solid(C.glassBorder, 0.28);
  f.strokeWeight = 2;
  f.cornerRadius = opts.radius || 22;
  f.clipsContent = true;
  f.effects = [{ type: 'BACKGROUND_BLUR', radius: 22, visible: true }];
  return f;
}

// ── Helper: auto-layout frame ──
function autoFrame(name, dir, gap, pt, pr, pb, pl) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.itemSpacing = gap;
  f.paddingTop = pt; f.paddingRight = pr;
  f.paddingBottom = pb; f.paddingLeft = pl;
  f.fills = [];
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  return f;
}

// ═══════════════════════════════════════════════════════
// PAGE FRAME
// ═══════════════════════════════════════════════════════
const PAGE = figma.createFrame();
PAGE.name = 'Portfolio — Work';
PAGE.resize(1440, 4200);
PAGE.fills = [{ type: 'GRADIENT_LINEAR',
  gradientTransform: [[0,1,0],[-1,0,1]],
  gradientStops: [
    { color: { ...C.bg0, a: 1 }, position: 0 },
    { color: { ...C.bg1, a: 1 }, position: 1 },
  ]
}];
PAGE.clipsContent = false;
figma.currentPage.appendChild(PAGE);

// ─── Grain overlay ───────────────────────────────────────
const grain = figma.createRectangle();
grain.name = 'Grain overlay';
grain.resize(1440, 4200);
grain.fills = solid(C.bg0, 0.04);
grain.opacity = 0.06;
PAGE.appendChild(grain);

// ═══════════════════════════════════════════════════════
// NAV BAR
// ═══════════════════════════════════════════════════════
const NAV = glassCard(1408, 56, { radius: 18 });
NAV.name = 'Nav Bar';
NAV.x = 16; NAV.y = 16;
NAV.fills = solid(C.glassFill, 0.85);
NAV.effects = [
  { type: 'BACKGROUND_BLUR', radius: 20, visible: true },
  { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.30 }, offset: { x: 0, y: 10 }, radius: 30, spread: -12, visible: true, blendMode: 'NORMAL' },
];

// Back to room button
const backBtn = figma.createFrame();
backBtn.name = 'Back to room';
backBtn.layoutMode = 'HORIZONTAL'; backBtn.itemSpacing = 8;
backBtn.paddingTop = 9; backBtn.paddingBottom = 9;
backBtn.paddingLeft = 16; backBtn.paddingRight = 16;
backBtn.primaryAxisSizingMode = 'AUTO'; backBtn.counterAxisSizingMode = 'AUTO';
backBtn.fills = solid(C.innerFill, 0.6);
backBtn.strokes = solid(C.ink); backBtn.strokeWeight = 2;
backBtn.cornerRadius = 999;
backBtn.effects = [{ type: 'DROP_SHADOW', color: { ...C.ink, a: 1 }, offset: { x: 0, y: 3 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
backBtn.x = 12; backBtn.y = 8;
const backArrow = mkText('←', { family: 'Plus Jakarta Sans', style: 'Bold', size: 14, color: C.ink });
const backLabel = mkText('Back to room', { family: 'Plus Jakarta Sans', style: 'Bold', size: 13, color: C.ink });
backBtn.appendChild(backArrow); backBtn.appendChild(backLabel);
NAV.appendChild(backBtn);

// Theme toggle
const themeBtn = figma.createEllipse();
themeBtn.name = 'Theme toggle';
themeBtn.resize(40, 40);
themeBtn.fills = solid(C.yellow);
themeBtn.strokes = solid(C.ink); themeBtn.strokeWeight = 2;
themeBtn.effects = [{ type: 'DROP_SHADOW', color: { ...C.ink, a: 1 }, offset: { x: 0, y: 3 }, radius: 0, visible: true, blendMode: 'NORMAL' }];
themeBtn.x = backBtn.x + backBtn.width + 8; themeBtn.y = 8;
NAV.appendChild(themeBtn);

// Nav links (right side)
const navLinks = ['About', 'Work', 'Resume', 'Contact'];
let nlX = 1408 - 16;
const dlBtn = figma.createFrame();
dlBtn.name = 'Download CV';
dlBtn.layoutMode = 'HORIZONTAL';
dlBtn.paddingTop = 9; dlBtn.paddingBottom = 9;
dlBtn.paddingLeft = 18; dlBtn.paddingRight = 18;
dlBtn.primaryAxisSizingMode = 'AUTO'; dlBtn.counterAxisSizingMode = 'AUTO';
dlBtn.fills = solid(C.accent);
dlBtn.strokes = solid(C.ink); dlBtn.strokeWeight = 2;
dlBtn.cornerRadius = 999;
dlBtn.effects = [{ type: 'DROP_SHADOW', color: { ...C.ink, a: 1 }, offset: { x: 0, y: 3 }, radius: 0, visible: true, blendMode: 'NORMAL' }];
const dlLabel = mkText('Download CV ↓', { family: 'Plus Jakarta Sans', style: 'Bold', size: 13, color: C.cream });
dlBtn.appendChild(dlLabel);
dlBtn.x = nlX - dlBtn.width; dlBtn.y = 8;
NAV.appendChild(dlBtn);
nlX = dlBtn.x - 16;

// Divider
const navDivider = figma.createRectangle();
navDivider.resize(1.5, 18);
navDivider.fills = solid(C.glassBorder, 0.42);
navDivider.x = nlX - 1.5; navDivider.y = 19;
NAV.appendChild(navDivider);
nlX -= 16;

// Clock
const clock = mkText('Jakarta · 20:10', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 13, color: C.ink });
clock.name = 'Clock';
clock.x = nlX - clock.width - 16; clock.y = 20;
NAV.appendChild(clock);
// Green dot
const dot = figma.createEllipse();
dot.resize(8, 8);
dot.fills = solid(C.green);
dot.effects = [{ type: 'DROP_SHADOW', color: { ...C.green, a: 0.8 }, offset: { x: 0, y: 0 }, radius: 10, visible: true, blendMode: 'NORMAL' }];
dot.x = clock.x - 16; dot.y = 24;
NAV.appendChild(dot);
nlX = dot.x - 16;

// Nav links
for (const label of [...navLinks].reverse()) {
  const isActive = label === 'Work';
  const lnk = mkText(label, { family: 'Plus Jakarta Sans', style: isActive ? 'Bold' : 'Medium', size: 13, color: isActive ? C.accentDeep : C.ink2 });
  lnk.x = nlX - lnk.width; lnk.y = 20;
  NAV.appendChild(lnk);
  nlX = lnk.x - 16;
}

PAGE.appendChild(NAV);

// ═══════════════════════════════════════════════════════
// PAGE HEADER
// ═══════════════════════════════════════════════════════
const kicker1 = mkText('PORTFOLIO · /WORK', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
kicker1.x = 80; kicker1.y = 110;
PAGE.appendChild(kicker1);

const h1 = mkText('Five projects,', { family: 'DM Serif Display', style: 'Regular', size: 56, color: C.ink, width: 900 });
h1.x = 80; h1.y = 130;
PAGE.appendChild(h1);
const h1b = mkText('one rail at a time.', { family: 'DM Serif Display', style: 'Italic', size: 56, color: C.accent, width: 900 });
h1b.letterSpacing = { value: -1.5, unit: 'PIXELS' };
h1b.x = 80; h1b.y = 130 + h1.height + 2;
PAGE.appendChild(h1b);

const subtitle = mkText('Pick a project on the left — the case study opens here. Filter by role to narrow the list.', { family: 'Plus Jakarta Sans', style: 'Medium', size: 14.5, color: C.ink2, width: 640, lineHeight: 22 });
subtitle.x = 80; subtitle.y = h1b.y + h1b.height + 14;
PAGE.appendChild(subtitle);

const contentY = subtitle.y + subtitle.height + 32;

// ═══════════════════════════════════════════════════════
// LEFT RAIL — Project list + filter
// ═══════════════════════════════════════════════════════
const RAIL = glassCard(280, 600, { radius: 22 });
RAIL.name = 'Project Rail';
RAIL.x = 80; RAIL.y = contentY;
RAIL.effects = [
  { type: 'BACKGROUND_BLUR', radius: 20, visible: true },
  { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.30 }, offset: { x: 0, y: 18 }, radius: 36, spread: -16, visible: true, blendMode: 'NORMAL' },
];

const railKicker = mkText('PROJECTS · 05', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
railKicker.x = 18; railKicker.y = 18;
RAIL.appendChild(railKicker);

const projects = [
  { n: '01.', title: 'VR Parachute Simulator', client: 'Indonesian Air Force Academy', active: true },
  { n: '02.', title: 'Vlux', client: 'Cube Studio (in-house product)', active: false },
  { n: '03.', title: 'Edutech Suite', client: 'Multiple SEA institutions', active: false },
  { n: '04.', title: 'Pataland', client: 'Paradimensi', active: false },
  { n: '05.', title: 'Mobile Metaverse', client: 'Techpolitan (internal)', active: false },
];

let projY = 48;
for (const p of projects) {
  const projRow = figma.createFrame();
  projRow.name = p.title;
  projRow.resize(244, p.active ? 56 : 52);
  projRow.x = 18; projRow.y = projY;
  projRow.cornerRadius = 10;
  if (p.active) {
    projRow.fills = solid(C.innerFill, 0.6);
    projRow.strokes = solid(C.glassBorder, 0.42); projRow.strokeWeight = 1.5;
  } else {
    projRow.fills = [];
  }

  const num = mkText(p.n, { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: p.active ? C.accent : C.ink3, letterSpacing: 0 });
  num.x = 12; num.y = p.active ? 10 : 8;
  projRow.appendChild(num);

  const titleT = mkText(p.title, { family: 'DM Serif Display', style: 'Regular', size: 15, color: C.ink });
  titleT.x = 36; titleT.y = p.active ? 8 : 6;
  projRow.appendChild(titleT);

  const clientT = mkText(p.client, { family: 'Plus Jakarta Sans', style: 'Regular', size: 11, color: C.ink2 });
  clientT.x = 36; clientT.y = titleT.y + titleT.height + 2;
  projRow.appendChild(clientT);

  RAIL.appendChild(projRow);
  projY += (p.active ? 56 : 52) + 4;
}

// Dashed divider
const dashedDiv = figma.createRectangle();
dashedDiv.resize(244, 1.5);
dashedDiv.x = 18; dashedDiv.y = projY + 6;
dashedDiv.fills = solid(C.glassBorder, 0.42);
dashedDiv.dashPattern = [6, 4];
RAIL.appendChild(dashedDiv);

// Filter section
const filterKicker = mkText('FILTER BY ROLE', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
filterKicker.x = 18; filterKicker.y = projY + 20;
RAIL.appendChild(filterKicker);

const filters = ['All', 'Lead', 'Product', 'UI/UX', '3D', 'Game'];
let chipX = 18; let chipY = projY + 40;
for (const f of filters) {
  const chip = figma.createFrame();
  chip.name = f;
  chip.layoutMode = 'HORIZONTAL';
  chip.paddingTop = 6; chip.paddingBottom = 6;
  chip.paddingLeft = 11; chip.paddingRight = 11;
  chip.primaryAxisSizingMode = 'AUTO'; chip.counterAxisSizingMode = 'AUTO';
  chip.cornerRadius = 999;
  const isAll = f === 'All';
  chip.fills = isAll ? solid(C.ink) : [];
  chip.strokes = solid(isAll ? C.ink : C.glassBorder, isAll ? 1 : 0.42);
  chip.strokeWeight = 1.5;
  const chipLabel = mkText(f, { family: 'Plus Jakarta Sans', style: 'Bold', size: 11.5, color: isAll ? C.cream : C.ink2, letterSpacing: 0.3 });
  chip.appendChild(chipLabel);

  if (chipX + 50 > 262) { chipX = 18; chipY += 34; }
  chip.x = chipX; chip.y = chipY;
  RAIL.appendChild(chip);
  chipX += chip.width + 6;
}

RAIL.resize(280, chipY + 50);
PAGE.appendChild(RAIL);

// ═══════════════════════════════════════════════════════
// RIGHT PANE — Active case study (VR Parachute)
// ═══════════════════════════════════════════════════════
const PANE = figma.createFrame();
PANE.name = 'Case Study Pane';
PANE.resize(992, 3800);
PANE.x = 80 + 280 + 28; PANE.y = contentY;
PANE.fills = [];

let py = 0;

// Kicker
const csKicker = mkText('CASE STUDY · 01 / 05', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
csKicker.x = 0; csKicker.y = py;
PANE.appendChild(csKicker);
py += 28;

// Title
const csTitle = mkText('VR Parachute Simulator', { family: 'DM Serif Display', style: 'Regular', size: 68, color: C.ink, width: 992 });
csTitle.letterSpacing = { value: -2, unit: 'PIXELS' };
csTitle.lineHeight = { value: 70, unit: 'PIXELS' };
csTitle.x = 0; csTitle.y = py;
PANE.appendChild(csTitle);
py += csTitle.height + 10;

// Tagline
const csTagline = mkText('A VR training rig that lets cadets rehearse a full parachute jump — from cabin to canopy to landing — without the cost or risk of a real airframe.', {
  family: 'DM Serif Display', style: 'Italic', size: 20, color: C.accent, width: 640, lineHeight: 30
});
csTagline.x = 0; csTagline.y = py;
PANE.appendChild(csTagline);
py += csTagline.height + 24;

// Meta strip
const META = glassCard(992, 72, { radius: 14 });
META.name = 'Meta Strip';
META.fills = solid(C.glassFill, 0.55);
META.x = 0; META.y = py;
const metaItems = [
  ['ROLE', 'Lead Designer · 3D / UX'],
  ['YEAR', '2023'],
  ['CLIENT', 'Indonesian Air Force Academy'],
  ['TOOLS', 'Unreal 5 · Figma · Quest 2 · Blender'],
];
let mx = 0;
for (let i = 0; i < metaItems.length; i++) {
  const [k, v] = metaItems[i];
  const cell = figma.createFrame();
  cell.resize(248, 72); cell.x = mx; cell.y = 0; cell.fills = [];
  const kk = mkText(k, { family: 'Plus Jakarta Sans', style: 'Bold', size: 10, color: C.ink3, letterSpacing: 1 });
  kk.x = 16; kk.y = 14;
  const vv = mkText(v, { family: 'DM Serif Display', style: 'Regular', size: 14, color: C.ink, width: 224 });
  vv.x = 16; vv.y = 32;
  cell.appendChild(kk); cell.appendChild(vv);
  if (i < 3) {
    const sep = figma.createRectangle();
    sep.resize(1.5, 48); sep.x = 247; sep.y = 12;
    sep.fills = solid(C.glassBorder, 0.28);
    cell.appendChild(sep);
  }
  META.appendChild(cell);
  mx += 248;
}
PANE.appendChild(META);
py += 72 + 24;

// Hero image area
const HERO = glassCard(992, 420, { radius: 18 });
HERO.name = 'Hero Image';
HERO.fills = [{ type: 'GRADIENT_LINEAR',
  gradientTransform: [[0.707, 0.707, -0.354], [-0.707, 0.707, 0.854]],
  gradientStops: [
    { color: { r: 0.478, g: 0.722, b: 0.541, a: 1 }, position: 0 },
    { color: { r: 0.200, g: 0.396, b: 0.294, a: 1 }, position: 1 },
  ]
}];
HERO.x = 0; HERO.y = py;
HERO.effects = [
  { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.45 }, offset: { x: 0, y: 22 }, radius: 44, spread: -20, visible: true, blendMode: 'NORMAL' },
];

// HUD badge
const hud = figma.createFrame();
hud.name = 'HUD Badge';
hud.layoutMode = 'HORIZONTAL'; hud.itemSpacing = 0;
hud.paddingTop = 7; hud.paddingBottom = 7;
hud.paddingLeft = 14; hud.paddingRight = 14;
hud.primaryAxisSizingMode = 'AUTO'; hud.counterAxisSizingMode = 'AUTO';
hud.fills = solid({ r: 0.078, g: 0.059, b: 0.031 }, 0.70);
hud.cornerRadius = 999; hud.strokes = solid({ r: 1, g: 1, b: 1 }, 0.25); hud.strokeWeight = 1.5;
const hudText = mkText('▸  ALT 1240m  ·  DESCEND 4.2m/s', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 11, color: { r: 1, g: 0.980, b: 0.933 }, letterSpacing: 1 });
hud.appendChild(hudText);
hud.x = 22; hud.y = 22;
HERO.appendChild(hud);

// Center monogram
const mono = figma.createFrame();
mono.name = 'Monogram';
mono.resize(280, 200);
mono.x = (992 - 280) / 2; mono.y = (420 - 200) / 2;
mono.fills = solid(C.cream, 0.92);
mono.strokes = solid(C.ink); mono.strokeWeight = 2.5;
mono.cornerRadius = 14;
mono.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.35 }, offset: { x: 0, y: 16 }, radius: 32, spread: -10, visible: true, blendMode: 'NORMAL' }];
const monoText = mkText('VP', { family: 'DM Serif Display', style: 'Regular', size: 110, color: { r: 0.200, g: 0.396, b: 0.294 } });
monoText.x = (280 - monoText.width) / 2; monoText.y = (200 - monoText.height) / 2;
mono.appendChild(monoText);
HERO.appendChild(mono);
PANE.appendChild(HERO);
py += 420 + 36;

// ─── Challenge ───────────────────────────────────────
const challH = mkText('Challenge', { family: 'DM Serif Display', style: 'Regular', size: 26, color: C.ink });
challH.letterSpacing = { value: -0.6, unit: 'PIXELS' };
challH.x = 0; challH.y = py; PANE.appendChild(challH); py += challH.height + 10;
const challT = mkText('Live parachute training is expensive, weather-bound, and brutal on first-timers. The academy needed a way for cadets to build muscle memory before ever touching a real chute.', {
  family: 'Plus Jakarta Sans', style: 'Medium', size: 15.5, color: C.ink2, width: 720, lineHeight: 26
});
challT.x = 0; challT.y = py; PANE.appendChild(challT); py += challT.height + 30;

// ─── Approach ────────────────────────────────────────
const approachH = mkText('Approach', { family: 'DM Serif Display', style: 'Regular', size: 26, color: C.ink });
approachH.letterSpacing = { value: -0.6, unit: 'PIXELS' };
approachH.x = 0; approachH.y = py; PANE.appendChild(approachH); py += approachH.height + 10;
const approachT = mkText('Field research at the academy, then a six-phase jump model in Unity, re-built in UE5 for fidelity. Designed an instructor tablet UI so non-VR staff could throw weather and gear failures from a calm panel. Two cadet cohorts tested the rig before delivery.', {
  family: 'Plus Jakarta Sans', style: 'Medium', size: 15.5, color: C.ink2, width: 720, lineHeight: 26
});
approachT.x = 0; approachT.y = py; PANE.appendChild(approachT); py += approachT.height + 30;

// ─── Highlights ──────────────────────────────────────
const highlightsH = mkText('Highlights', { family: 'DM Serif Display', style: 'Regular', size: 26, color: C.ink });
highlightsH.x = 0; highlightsH.y = py; PANE.appendChild(highlightsH); py += highlightsH.height + 14;
const shots = ['Cabin · pre-jump checks', 'Free-fall · 4,200 ft AGL'];
const shotColors = [
  [{ r: 0.478, g: 0.722, b: 0.541, a: 1 }, { r: 0.200, g: 0.396, b: 0.294, a: 1 }],
  [{ r: 0.200, g: 0.396, b: 0.294, a: 1 }, { r: 0.478, g: 0.722, b: 0.541, a: 1 }],
];
let shotX = 0;
for (let i = 0; i < 2; i++) {
  const sh = glassCard(487, 360, { radius: 16 });
  sh.name = shots[i];
  sh.fills = [{ type: 'GRADIENT_LINEAR',
    gradientTransform: [[0.866, 0.5, -0.25], [-0.5, 0.866, 0.567]],
    gradientStops: [
      { color: shotColors[i][0], position: 0 },
      { color: shotColors[i][1], position: 1 },
    ]
  }];
  sh.x = shotX; sh.y = py;
  // Inner white card
  const inner = figma.createRectangle();
  inner.resize(420, 260); inner.x = 33; inner.y = 40;
  inner.fills = solid(C.cream, 0.88);
  inner.strokes = solid(C.ink); inner.strokeWeight = 2;
  inner.cornerRadius = 10;
  sh.appendChild(inner);
  // Label
  const lbl = figma.createFrame();
  lbl.layoutMode = 'HORIZONTAL';
  lbl.paddingTop = 4; lbl.paddingBottom = 4;
  lbl.paddingLeft = 10; lbl.paddingRight = 10;
  lbl.primaryAxisSizingMode = 'AUTO'; lbl.counterAxisSizingMode = 'AUTO';
  lbl.fills = solid({ r: 0.078, g: 0.059, b: 0.031 }, 0.72);
  lbl.cornerRadius = 999;
  lbl.x = 14; lbl.y = 320;
  const lblT = mkText('0' + (i+1) + ' · ' + shots[i], { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 10, color: { r: 1, g: 0.980, b: 0.933 }, letterSpacing: 0.6 });
  lbl.appendChild(lblT);
  sh.appendChild(lbl);
  PANE.appendChild(sh);
  shotX += 505;
}
py += 360 + 30;

// ─── Outcome metrics ─────────────────────────────────
const outcomeH = mkText('Outcome', { family: 'DM Serif Display', style: 'Regular', size: 26, color: C.ink });
outcomeH.x = 0; outcomeH.y = py; PANE.appendChild(outcomeH); py += outcomeH.height + 14;
const metrics = [
  { val: '90%', label: 'cost reduction vs. live training', color: C.accent },
  { val: '6 / 6', label: 'training phases supported', color: C.green },
  { val: '2', label: 'cadet cohorts validated pre-ship', color: C.yellow },
];
let metX = 0;
for (const m of metrics) {
  const mc = glassCard(318, 108, { radius: 14 });
  mc.fills = solid(C.glassFill, 0.55);
  mc.x = metX; mc.y = py;
  const mval = mkText(m.val, { family: 'DM Serif Display', style: 'Regular', size: 38, color: m.color });
  mval.letterSpacing = { value: -1.5, unit: 'PIXELS' };
  mval.x = 18; mval.y = 16;
  const mlbl = mkText(m.label.toUpperCase(), { family: 'Plus Jakarta Sans', style: 'Bold', size: 11.5, color: C.ink2, letterSpacing: 0.4, width: 280 });
  mlbl.x = 18; mlbl.y = 64;
  mc.appendChild(mval); mc.appendChild(mlbl);
  PANE.appendChild(mc);
  metX += 328 + 10;
}
py += 108 + 30;

// ─── Action row ──────────────────────────────────────
const divLine = figma.createRectangle();
divLine.resize(992, 1.5); divLine.x = 0; divLine.y = py;
divLine.fills = solid(C.glassBorder, 0.42);
PANE.appendChild(divLine);
py += 22;

const prevBtn = figma.createFrame();
prevBtn.layoutMode = 'HORIZONTAL'; prevBtn.itemSpacing = 0;
prevBtn.paddingTop = 10; prevBtn.paddingBottom = 10;
prevBtn.paddingLeft = 16; prevBtn.paddingRight = 16;
prevBtn.primaryAxisSizingMode = 'AUTO'; prevBtn.counterAxisSizingMode = 'AUTO';
prevBtn.fills = solid(C.ink); prevBtn.strokes = solid(C.ink); prevBtn.strokeWeight = 1.5;
prevBtn.cornerRadius = 999;
prevBtn.effects = [{ type: 'DROP_SHADOW', color: { ...C.ink2, a: 1 }, offset: { x: 0, y: 3 }, radius: 0, visible: true, blendMode: 'NORMAL' }];
prevBtn.x = 0; prevBtn.y = py;
prevBtn.appendChild(mkText('← Prev project', { family: 'Plus Jakarta Sans', style: 'Bold', size: 13, color: C.cream, letterSpacing: 0.3 }));
PANE.appendChild(prevBtn);

const nextBtn = figma.createFrame();
nextBtn.layoutMode = 'HORIZONTAL'; nextBtn.itemSpacing = 0;
nextBtn.paddingTop = 10; nextBtn.paddingBottom = 10;
nextBtn.paddingLeft = 16; nextBtn.paddingRight = 16;
nextBtn.primaryAxisSizingMode = 'AUTO'; nextBtn.counterAxisSizingMode = 'AUTO';
nextBtn.fills = []; nextBtn.strokes = solid(C.ink); nextBtn.strokeWeight = 1.5;
nextBtn.cornerRadius = 999;
nextBtn.x = prevBtn.width + 10; nextBtn.y = py;
nextBtn.appendChild(mkText('Next project →', { family: 'Plus Jakarta Sans', style: 'Bold', size: 13, color: C.ink, letterSpacing: 0.3 }));
PANE.appendChild(nextBtn);
py += 50;

// Trim pane height
PANE.resize(992, py);
PAGE.resize(1440, Math.max(4000, contentY + py + 120));

// ─── Footer ──────────────────────────────────────────
const footer = figma.createFrame();
footer.resize(1280, 40); footer.x = 80; footer.y = PAGE.height - 60;
footer.fills = [];
const footL = mkText('© 2026 Andri Saputro', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 12, color: C.ink2 });
footL.x = 0; footL.y = 12;
const footR = mkText('Read the resume →', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 12, color: C.ink2 });
footR.x = 1280 - footR.width; footR.y = 12;
footer.appendChild(footL); footer.appendChild(footR);
PAGE.appendChild(footer);

figma.viewport.scrollAndZoomIntoView([PAGE]);
figma.notify('✓ Portfolio — Work page built!');
return 'Portfolio page created — ' + PAGE.width + '×' + PAGE.height;
`, 120000);

console.log('✓ Portfolio page done');

// ─── Step 3: Build Resume page ─────────────────────────────────────────────
console.log('3. Building Resume page...');
await inject(`
const C = {
  bg0: { r: 0.957, g: 0.941, b: 0.886 }, bg1: { r: 0.929, g: 0.894, b: 0.824 },
  ink: { r: 0.200, g: 0.129, b: 0.094 }, ink2: { r: 0.345, g: 0.235, b: 0.192 },
  ink3: { r: 0.475, g: 0.365, b: 0.318 }, accent: { r: 0.831, g: 0.443, b: 0.278 },
  accentDeep: { r: 0.545, g: 0.259, b: 0.153 }, yellow: { r: 0.808, g: 0.722, b: 0.478 },
  green: { r: 0.478, g: 0.722, b: 0.541 }, pink: { r: 0.773, g: 0.588, b: 0.498 },
  cream: { r: 1.000, g: 0.980, b: 0.933 }, glassFill: { r: 1.000, g: 0.980, b: 0.933 },
  glassBorder: { r: 0.431, g: 0.294, b: 0.176 }, innerFill: { r: 1.000, g: 0.973, b: 0.910 },
};
const solid = (c, a = 1) => [{ type: 'SOLID', color: c, opacity: a }];
function mkText(chars, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: opts.family || 'Plus Jakarta Sans', style: opts.style || 'Regular' };
  t.characters = chars;
  t.fontSize = opts.size || 14;
  t.fills = solid(opts.color || C.ink);
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: 'PIXELS' };
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PIXELS' };
  if (opts.width) { t.textAutoResize = 'HEIGHT'; t.resize(opts.width, 100); }
  return t;
}
function glassCard(w, h, r = 22) {
  const f = figma.createFrame();
  f.resize(w, h); f.fills = solid(C.glassFill, 0.55);
  f.strokes = solid(C.glassBorder, 0.28); f.strokeWeight = 2;
  f.cornerRadius = r; f.clipsContent = false;
  f.effects = [{ type: 'BACKGROUND_BLUR', radius: 22, visible: true },
    { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.30 }, offset: { x: 0, y: 18 }, radius: 36, spread: -16, visible: true, blendMode: 'NORMAL' }];
  return f;
}

// PAGE
const PAGE = figma.createFrame();
PAGE.name = 'Resume';
PAGE.resize(1440, 3800);
PAGE.fills = [{ type: 'GRADIENT_LINEAR',
  gradientTransform: [[0,1,0],[-1,0,1]],
  gradientStops: [{ color: { ...C.bg0, a: 1 }, position: 0 }, { color: { ...C.bg1, a: 1 }, position: 1 }]
}];
figma.currentPage.appendChild(PAGE);

// Nav (same pattern)
const NAV = figma.createFrame();
NAV.name = 'Nav Bar'; NAV.resize(1408, 56); NAV.x = 16; NAV.y = 16;
NAV.fills = solid(C.glassFill, 0.85); NAV.strokes = solid(C.glassBorder, 0.28); NAV.strokeWeight = 2;
NAV.cornerRadius = 18;
NAV.effects = [{ type: 'BACKGROUND_BLUR', radius: 20, visible: true },
  { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.30 }, offset: { x: 0, y: 10 }, radius: 30, spread: -12, visible: true, blendMode: 'NORMAL' }];
const navT = mkText('Andri Saputro · Resume', { family: 'Plus Jakarta Sans', style: 'Bold', size: 14, color: C.ink });
navT.x = 20; navT.y = 20; NAV.appendChild(navT);
const activeLink = mkText('Resume', { family: 'Plus Jakarta Sans', style: 'Bold', size: 13, color: C.accentDeep });
activeLink.x = 1408 - activeLink.width - 180; activeLink.y = 20; NAV.appendChild(activeLink);
PAGE.appendChild(NAV);

// CONTENT — Two column: left sidebar (320px) + right main (840px)
const contentX = 80, contentY = 110;

// ── Left sidebar: Profile card + info ──
const SIDEBAR = glassCard(320, 580, 22);
SIDEBAR.name = 'Profile Sidebar'; SIDEBAR.x = contentX; SIDEBAR.y = contentY;
SIDEBAR.clipsContent = true;

// Photo placeholder
const photoPlaceholder = figma.createRectangle();
photoPlaceholder.resize(320, 220);
photoPlaceholder.x = 0; photoPlaceholder.y = 0;
photoPlaceholder.fills = solid({ r: 0.808, g: 0.722, b: 0.478 }, 0.30);
SIDEBAR.appendChild(photoPlaceholder);
const photoLabel = mkText('DROP PHOTO HERE', { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: C.ink3, letterSpacing: 1.5 });
photoLabel.x = (320 - photoLabel.width) / 2; photoLabel.y = 96; SIDEBAR.appendChild(photoLabel);

// Open to work badge
const badge = figma.createFrame();
badge.layoutMode = 'HORIZONTAL'; badge.itemSpacing = 8;
badge.paddingTop = 8; badge.paddingBottom = 8; badge.paddingLeft = 16; badge.paddingRight = 16;
badge.primaryAxisSizingMode = 'AUTO'; badge.counterAxisSizingMode = 'AUTO';
badge.cornerRadius = 999; badge.fills = solid(C.innerFill, 0.8);
badge.strokes = solid(C.glassBorder, 0.42); badge.strokeWeight = 1.5;
badge.x = 24; badge.y = 240;
const badgeDot = figma.createEllipse(); badgeDot.resize(8, 8); badgeDot.fills = solid(C.green);
badgeDot.effects = [{ type: 'DROP_SHADOW', color: { ...C.green, a: 0.8 }, offset: { x: 0, y: 0 }, radius: 8, visible: true, blendMode: 'NORMAL' }];
badge.appendChild(badgeDot);
badge.appendChild(mkText('Open to work', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 12.5, color: C.ink }));
SIDEBAR.appendChild(badge);

// Name & title
const nameT = mkText('Andri Saputro', { family: 'DM Serif Display', style: 'Regular', size: 28, color: C.ink });
nameT.x = 24; nameT.y = badge.y + 48; SIDEBAR.appendChild(nameT);
const roleT = mkText('Product Designer · CDO', { family: 'Plus Jakarta Sans', style: 'Medium', size: 13, color: C.ink2 });
roleT.x = 24; roleT.y = nameT.y + nameT.height + 4; SIDEBAR.appendChild(roleT);

// Divider
const sd = figma.createRectangle(); sd.resize(272, 1); sd.x = 24; sd.y = roleT.y + 28;
sd.fills = solid(C.glassBorder, 0.28); sd.dashPattern = [6, 4]; SIDEBAR.appendChild(sd);

// Info rows
const infoRows = [['LOCATION', 'Jakarta, ID'], ['EXPERIENCE', '5+ years'], ['LANGUAGES', 'ID · EN']];
let infoY = sd.y + 16;
for (const [k, v] of infoRows) {
  const kk = mkText(k, { family: 'Plus Jakarta Sans', style: 'Bold', size: 10, color: C.ink3, letterSpacing: 1 });
  kk.x = 24; kk.y = infoY; SIDEBAR.appendChild(kk);
  const vv = mkText(v, { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 13, color: C.ink });
  vv.x = 160; vv.y = infoY; SIDEBAR.appendChild(vv);
  infoY += 28;
}
SIDEBAR.resize(320, infoY + 20);
PAGE.appendChild(SIDEBAR);

// ── Right main: Work experience ──
const MAIN = figma.createFrame();
MAIN.name = 'Main Content'; MAIN.resize(888, 3600);
MAIN.x = contentX + 320 + 32; MAIN.y = contentY; MAIN.fills = [];

const sectionKicker = mkText('WORK EXPERIENCE', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
sectionKicker.x = 0; sectionKicker.y = 0; MAIN.appendChild(sectionKicker);

const jobs = [
  {
    company: 'Cube Studio', role: 'Chief Design Officer (CDO)', period: '2023 — Present',
    color: C.green, projects: ['VR Parachute Simulator', 'Vlux (Founder)', 'Edutech Suite'],
    bullets: ['Led product design across simulation, SaaS, and desktop tooling verticals', 'Founded Vlux — UE5 lighting desktop tool currently in beta with 5 studios', 'Delivered VR training rig for Indonesian Air Force Academy'],
  },
  {
    company: 'Paradimensi', role: 'Lead Product Designer', period: '2023 — 2024',
    color: C.yellow, projects: ['Pataland'],
    bullets: ['Led brand identity, marketing site, and core product UI simultaneously', 'Shipped from kickoff to launch in 4 months', 'Anchored visuals around tactile workshop metaphors'],
  },
  {
    company: 'Techpolitan', role: '3D Designer / UX Designer', period: '2022 — 2023',
    color: C.pink, projects: ['Mobile Metaverse'],
    bullets: ['Built voxel avatars and real-time room system for mobile social platform', '12k monthly active sessions, 40 min median session length', 'Designed custom in-engine UI toolkit enabling designer self-service'],
  },
];

let jy = 32;
for (const job of jobs) {
  const card = figma.createFrame();
  card.name = job.company; card.resize(888, 10);
  card.fills = solid(C.glassFill, 0.55); card.strokes = solid(C.glassBorder, 0.28); card.strokeWeight = 2;
  card.cornerRadius = 22; card.clipsContent = false;
  card.effects = [{ type: 'BACKGROUND_BLUR', radius: 22, visible: true },
    { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.25 }, offset: { x: 0, y: 14 }, radius: 28, spread: -14, visible: true, blendMode: 'NORMAL' }];
  card.x = 0; card.y = jy;

  // Color accent bar
  const bar = figma.createRectangle(); bar.resize(888, 4); bar.x = 0; bar.y = 0;
  bar.fills = solid(job.color); bar.cornerRadius = 22; bar.topLeftRadius = 22; bar.topRightRadius = 22; bar.bottomLeftRadius = 0; bar.bottomRightRadius = 0;
  card.appendChild(bar);

  let cy = 16;
  // Header row
  const companyT = mkText(job.company, { family: 'DM Serif Display', style: 'Regular', size: 22, color: C.ink });
  companyT.x = 24; companyT.y = cy; card.appendChild(companyT);
  const periodT = mkText(job.period, { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 12, color: C.ink3 });
  periodT.x = 888 - periodT.width - 24; periodT.y = cy + 4; card.appendChild(periodT);
  cy += companyT.height + 4;

  const roleT = mkText(job.role, { family: 'Plus Jakarta Sans', style: 'Medium', size: 13.5, color: C.ink2 });
  roleT.x = 24; roleT.y = cy; card.appendChild(roleT);
  cy += roleT.height + 16;

  // Bullet points
  for (const b of job.bullets) {
    const bullet = figma.createEllipse(); bullet.resize(6, 6); bullet.fills = solid(job.color);
    bullet.x = 24; bullet.y = cy + 6; card.appendChild(bullet);
    const bt = mkText(b, { family: 'Plus Jakarta Sans', style: 'Regular', size: 13.5, color: C.ink2, width: 820, lineHeight: 22 });
    bt.x = 38; bt.y = cy; card.appendChild(bt);
    cy += bt.height + 8;
  }
  cy += 12;

  // Project chips
  for (const proj of job.projects) {
    const chip = figma.createFrame();
    chip.layoutMode = 'HORIZONTAL'; chip.itemSpacing = 0;
    chip.paddingTop = 5; chip.paddingBottom = 5; chip.paddingLeft = 12; chip.paddingRight = 12;
    chip.primaryAxisSizingMode = 'AUTO'; chip.counterAxisSizingMode = 'AUTO';
    chip.cornerRadius = 999; chip.fills = solid(job.color, 0.25);
    chip.strokes = solid(job.color, 0.5); chip.strokeWeight = 1.5;
    chip.x = 24; chip.y = cy;
    chip.appendChild(mkText(proj, { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 11.5, color: C.ink }));
    card.appendChild(chip);
    chip.x = 24; // reset since auto-layout handles width
    cy += 34;
  }
  cy += 8;

  card.resize(888, cy);
  MAIN.appendChild(card);
  jy += cy + 20;
}

// Skills section
const skillsK = mkText('SKILLS & TOOLS', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
skillsK.x = 0; skillsK.y = jy + 8; MAIN.appendChild(skillsK); jy += 40;

const skillGroups = [
  { label: 'Design', skills: ['Figma', 'Blender', 'After Effects', 'Protopie'] },
  { label: 'Code', skills: ['React', 'TypeScript', 'Three.js', 'Unreal 5'] },
  { label: 'Methods', skills: ['User Research', 'Design Systems', 'Wireframing', 'Usability Testing'] },
];
for (const sg of skillGroups) {
  const gl = mkText(sg.label, { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: C.ink3, letterSpacing: 0.5 });
  gl.x = 0; gl.y = jy; MAIN.appendChild(gl);
  let sx = 80;
  for (const skill of sg.skills) {
    const sc = figma.createFrame();
    sc.layoutMode = 'HORIZONTAL'; sc.paddingTop = 6; sc.paddingBottom = 6; sc.paddingLeft = 14; sc.paddingRight = 14;
    sc.primaryAxisSizingMode = 'AUTO'; sc.counterAxisSizingMode = 'AUTO';
    sc.cornerRadius = 999; sc.fills = solid(C.innerFill, 0.6);
    sc.strokes = solid(C.glassBorder, 0.28); sc.strokeWeight = 1.5;
    sc.x = sx; sc.y = jy;
    sc.appendChild(mkText(skill, { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 12, color: C.ink }));
    MAIN.appendChild(sc);
    sx += sc.width + 8;
  }
  jy += 38;
}

MAIN.resize(888, jy + 20);
PAGE.appendChild(MAIN);
PAGE.resize(1440, Math.max(3800, contentY + jy + 120));
figma.viewport.scrollAndZoomIntoView([PAGE]);
figma.notify('✓ Resume page built!');
return 'Resume: ' + PAGE.width + 'x' + PAGE.height;
`, 120000);
console.log('✓ Resume page done');

// ─── Step 4: Build Case Study page ────────────────────────────────────────
console.log('4. Building Case Study — VR Parachute page...');

// Sections data defined in Node.js so JSON.stringify handles newline escaping properly
const CASE_SECTIONS = [
  { id: 'problem', kicker: '01 · the problem', title: 'Live parachute training is expensive, weather-bound, and brutal on first-timers.',
    body: 'Each cadet jump cost the academy several thousand dollars in airframe time, fuel, and instructor hours. Bad weather wiped entire training windows. And cadets often froze on their first real exit — there was no rehearsable middle ground between watching a video and actually leaving an aircraft at altitude.\n\nThe academy asked: can we give cadets the muscle memory of a full jump before they ever touch a real chute?' },
  { id: 'process', kicker: '02 · process', title: 'Five steps from a meeting room to a working rig.',
    body: '01 — Field research: 3 days at the academy. Watched real training, interviewed instructors.\n\n02 — Mapping the jump: 6 phases — boarding, exit, free-fall, deploy, canopy, landing.\n\n03 — Greybox in Unity: One-room prototype to validate scale and ergonomics.\n\n04 — Visual + UX pass in UE5: Instructor tablet UI, in-VR HUD, post-jump debrief screen.\n\n05 — Cadet tests + ship: Two cohorts of 8 cadets, two weeks apart.' },
  { id: 'solution', kicker: '03 · solution', title: 'A rig three audiences can use the same morning.',
    body: 'For cadets — Six rehearsable phases. Restart from any point until muscle memory locks in.\n\nFor instructors — Tablet-based co-pilot. Throw weather, gear failures, and panic events from a calm UI. No VR knowledge required.\n\nFor everyone — A 3D debrief replay showing what the cadet did wrong with annotated decision points.' },
  { id: 'outcome', kicker: '04 · outcome', title: 'It worked the way the academy hoped — and faster than I did.',
    body: '"Cadets walk into their first real jump already knowing what their body should do. The first-jump panic rate dropped to almost zero." — Lead instructor, Air Force Academy' },
  { id: 'reflection', kicker: '05 · reflection', title: "What I would do differently.",
    body: "Greyboxing in Unity and re-doing in UE5 cost almost a month. Next time: prototype the hardest interaction directly in the target engine on day one.\n\nThe instructor tablet UI was the quietest piece and the one I am proudest of. A panel that calm taught me the operator's UI is sometimes more important than the user's.\n\nNext time: push for a haptic glove SKU." },
];

await inject(`
const C = {
  bg0: { r: 0.957, g: 0.941, b: 0.886 }, bg1: { r: 0.929, g: 0.894, b: 0.824 },
  ink: { r: 0.200, g: 0.129, b: 0.094 }, ink2: { r: 0.345, g: 0.235, b: 0.192 },
  ink3: { r: 0.475, g: 0.365, b: 0.318 }, accent: { r: 0.831, g: 0.443, b: 0.278 },
  accentDeep: { r: 0.545, g: 0.259, b: 0.153 }, yellow: { r: 0.808, g: 0.722, b: 0.478 },
  green: { r: 0.478, g: 0.722, b: 0.541 }, pink: { r: 0.773, g: 0.588, b: 0.498 },
  cream: { r: 1.000, g: 0.980, b: 0.933 }, glassFill: { r: 1.000, g: 0.980, b: 0.933 },
  glassBorder: { r: 0.431, g: 0.294, b: 0.176 }, innerFill: { r: 1.000, g: 0.973, b: 0.910 },
};
const solid = (c, a = 1) => [{ type: 'SOLID', color: c, opacity: a }];
function mkText(chars, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: opts.family || 'Plus Jakarta Sans', style: opts.style || 'Regular' };
  t.characters = chars;
  t.fontSize = opts.size || 14;
  t.fills = solid(opts.color || C.ink);
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: 'PIXELS' };
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PIXELS' };
  if (opts.width) { t.textAutoResize = 'HEIGHT'; t.resize(opts.width, 100); }
  return t;
}
function glassCard(w, h, r = 22) {
  const f = figma.createFrame();
  f.resize(w, h); f.fills = solid(C.glassFill, 0.55);
  f.strokes = solid(C.glassBorder, 0.28); f.strokeWeight = 2;
  f.cornerRadius = r; f.clipsContent = false;
  f.effects = [{ type: 'BACKGROUND_BLUR', radius: 22, visible: true },
    { type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.30 }, offset: { x: 0, y: 18 }, radius: 36, spread: -16, visible: true, blendMode: 'NORMAL' }];
  return f;
}

const PAGE = figma.createFrame();
PAGE.name = 'Case Study — VR Parachute';
PAGE.resize(1440, 5200);
PAGE.fills = [{ type: 'GRADIENT_LINEAR',
  gradientTransform: [[0,1,0],[-1,0,1]],
  gradientStops: [{ color: { ...C.bg0, a: 1 }, position: 0 }, { color: { ...C.bg1, a: 1 }, position: 1 }]
}];
figma.currentPage.appendChild(PAGE);

// Nav
const NAV = figma.createFrame();
NAV.name = 'Nav Bar'; NAV.resize(1408, 56); NAV.x = 16; NAV.y = 16;
NAV.fills = solid(C.glassFill, 0.85); NAV.strokes = solid(C.glassBorder, 0.28); NAV.strokeWeight = 2;
NAV.cornerRadius = 18;
NAV.effects = [{ type: 'BACKGROUND_BLUR', radius: 20, visible: true }];
NAV.appendChild(mkText('← Back to room', { family: 'Plus Jakarta Sans', style: 'Bold', size: 13, color: C.ink }));
PAGE.appendChild(NAV);

// Reading layout: left content (820px) + right sidebar (240px)
const contentX = 80, cx2 = 80 + 820 + 40;
let py = 120;

// Kicker
const k = mkText('CASE STUDY · 01 / 05', { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
k.x = contentX; k.y = py; PAGE.appendChild(k); py += 28;

// Big title
const tt = mkText('VR Parachute\\nSimulator', { family: 'DM Serif Display', style: 'Regular', size: 92, color: C.ink, width: 820 });
tt.letterSpacing = { value: -2.5, unit: 'PIXELS' }; tt.lineHeight = { value: 94, unit: 'PIXELS' };
tt.x = contentX; tt.y = py; PAGE.appendChild(tt); py += tt.height + 16;

// Tagline
const tg = mkText('Cabin to canopy, without the airframe.', { family: 'DM Serif Display', style: 'Italic', size: 28, color: C.accent, width: 680 });
tg.letterSpacing = { value: -0.5, unit: 'PIXELS' };
tg.x = contentX; tg.y = py; PAGE.appendChild(tg); py += tg.height + 36;

// Hero cover
const HERO = figma.createFrame();
HERO.name = 'Hero Cover'; HERO.resize(1280, 540);
HERO.x = contentX; HERO.y = py; HERO.cornerRadius = 26; HERO.clipsContent = true;
HERO.fills = [{ type: 'GRADIENT_LINEAR',
  gradientTransform: [[0.707, 0.707, -0.354], [-0.707, 0.707, 0.854]],
  gradientStops: [
    { color: { r: 0.478, g: 0.722, b: 0.541, a: 1 }, position: 0 },
    { color: { r: 0.157, g: 0.345, b: 0.239, a: 1 }, position: 1 },
  ]
}];
HERO.strokes = solid(C.glassBorder, 0.28); HERO.strokeWeight = 2.5;
HERO.effects = [{ type: 'DROP_SHADOW', color: { r: 0.157, g: 0.098, b: 0.059, a: 0.55 }, offset: { x: 0, y: 30 }, radius: 60, spread: -25, visible: true, blendMode: 'NORMAL' }];
// HUD badges
const h1 = figma.createFrame();
h1.layoutMode = 'HORIZONTAL'; h1.paddingTop = 7; h1.paddingBottom = 7; h1.paddingLeft = 14; h1.paddingRight = 14;
h1.primaryAxisSizingMode = 'AUTO'; h1.counterAxisSizingMode = 'AUTO';
h1.fills = solid({ r: 0.078, g: 0.059, b: 0.031 }, 0.70); h1.cornerRadius = 999;
h1.strokes = solid({ r: 1, g: 1, b: 1 }, 0.25); h1.strokeWeight = 1.5;
h1.x = 22; h1.y = 22;
h1.appendChild(mkText('▸  ALT 1240m  ·  DESCEND 4.2m/s', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 11, color: C.cream, letterSpacing: 1 }));
HERO.appendChild(h1);
const h2 = figma.createFrame();
h2.layoutMode = 'HORIZONTAL'; h2.paddingTop = 7; h2.paddingBottom = 7; h2.paddingLeft = 14; h2.paddingRight = 14;
h2.primaryAxisSizingMode = 'AUTO'; h2.counterAxisSizingMode = 'AUTO';
h2.fills = solid({ r: 0.078, g: 0.059, b: 0.031 }, 0.70); h2.cornerRadius = 8;
h2.strokes = solid({ r: 1, g: 1, b: 1 }, 0.25); h2.strokeWeight = 1.5;
h2.x = 1280 - 22 - 200; h2.y = 540 - 22 - 38;
h2.appendChild(mkText('[QUEST 2 · stand-alone]', { family: 'Plus Jakarta Sans', style: 'SemiBold', size: 11, color: C.cream, letterSpacing: 1 }));
HERO.appendChild(h2);
// Canopy silhouette placeholder
const canopy = figma.createEllipse(); canopy.resize(220, 120); canopy.x = 530; canopy.y = 160;
canopy.fills = solid(C.cream, 0.15); canopy.strokes = solid(C.cream, 0.3); canopy.strokeWeight = 2;
HERO.appendChild(canopy);
PAGE.appendChild(HERO);
py += 540 + 40;

// Meta strip (5 cells)
const META = glassCard(1280, 80, 14);
META.x = contentX; META.y = py;
const metaCells = [['CLIENT', 'Indonesian Air Force Academy'], ['ROLE', 'Lead Designer · 3D / UX'], ['TEAM', 'Cube Studio · 6 people'], ['TIMELINE', '2023 · 4 months'], ['PLATFORM', 'Meta Quest 2 · Standalone']];
let mx = 0;
for (let i = 0; i < metaCells.length; i++) {
  const [k2, v] = metaCells[i];
  const cell = figma.createFrame(); cell.resize(256, 80); cell.x = mx; cell.y = 0; cell.fills = [];
  cell.appendChild(Object.assign(mkText(k2, { family: 'Plus Jakarta Sans', style: 'Bold', size: 10, color: C.ink3, letterSpacing: 1 }), { x: 16, y: 14 }));
  cell.appendChild(Object.assign(mkText(v, { family: 'DM Serif Display', style: 'Regular', size: 14, color: C.ink, width: 230 }), { x: 16, y: 32 }));
  if (i < 4) { const sep = figma.createRectangle(); sep.resize(1.5, 52); sep.x = 255; sep.y = 14; sep.fills = solid(C.glassBorder, 0.28); cell.appendChild(sep); }
  META.appendChild(cell); mx += 256;
}
PAGE.appendChild(META); py += 80 + 50;

// Sections — injected as JSON from Node.js to avoid newline/quote escaping issues in template literals
const sections = ${JSON.stringify(CASE_SECTIONS)};

for (const sec of sections) {
  const sk = mkText(sec.kicker.toUpperCase(), { family: 'Plus Jakarta Sans', style: 'Bold', size: 12, color: C.accentDeep, letterSpacing: 1.2 });
  sk.x = contentX; sk.y = py; PAGE.appendChild(sk); py += 24;
  const sh = mkText(sec.title, { family: 'DM Serif Display', style: 'Regular', size: 42, color: C.ink, width: 820 });
  sh.letterSpacing = { value: -1.2, unit: 'PIXELS' }; sh.lineHeight = { value: 46, unit: 'PIXELS' };
  sh.x = contentX; sh.y = py; PAGE.appendChild(sh); py += sh.height + 18;
  const sb = mkText(sec.body, { family: 'Plus Jakarta Sans', style: 'Regular', size: 16.5, color: C.ink2, width: 720, lineHeight: 28 });
  sb.x = contentX; sb.y = py; PAGE.appendChild(sb); py += sb.height + 54;

  // Outcome metrics after outcome section
  if (sec.id === 'outcome') {
    const mets = [{ val: '90%', label: 'COST REDUCTION VS. LIVE TRAINING', col: C.accent }, { val: '6/6', label: 'TRAINING PHASES SUPPORTED', col: C.green }, { val: '2 cohorts', label: 'SHIPPED + TESTED IN 4 MONTHS', col: C.yellow }];
    let mx2 = contentX;
    for (const m of mets) {
      const mc = glassCard(390, 110, 18);
      mc.x = mx2; mc.y = py;
      const mv = mkText(m.val, { family: 'DM Serif Display', style: 'Regular', size: 56, color: m.col }); mv.letterSpacing = { value: -2, unit: 'PIXELS' }; mv.x = 26; mv.y = 14; mc.appendChild(mv);
      const ml = mkText(m.label, { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: C.ink2, letterSpacing: 0.5, width: 350 }); ml.x = 26; ml.y = 78; mc.appendChild(ml);
      PAGE.appendChild(mc); mx2 += 400 + 20;
    }
    py += 130;
  }
}

// Prev / Next
const pnY = py;
const prevCard = glassCard(600, 88, 18); prevCard.x = contentX; prevCard.y = pnY;
prevCard.appendChild(Object.assign(mkText('← PREVIOUS', { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: C.accentDeep, letterSpacing: 1 }), { x: 22, y: 16 }));
prevCard.appendChild(Object.assign(mkText('Mobile Metaverse', { family: 'DM Serif Display', style: 'Regular', size: 22, color: C.ink }), { x: 22, y: 36 }));
PAGE.appendChild(prevCard);

const nextCard = glassCard(600, 88, 18); nextCard.x = contentX + 600 + 20; nextCard.y = pnY;
nextCard.strokes = solid(C.accent, 0.6); nextCard.strokeWeight = 2;
nextCard.appendChild(Object.assign(mkText('NEXT →', { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: C.accentDeep, letterSpacing: 1 }), { x: 22, y: 16 }));
nextCard.appendChild(Object.assign(mkText('Vlux', { family: 'DM Serif Display', style: 'Regular', size: 22, color: C.ink }), { x: 22, y: 36 }));
PAGE.appendChild(nextCard);
py = pnY + 120;

// Sidebar: On this page nav
const sidebarItems = ['Overview', 'Problem', 'Process', 'Solution', 'Outcome', 'Reflection'];
const SIDEBAR2 = glassCard(240, 280, 18);
SIDEBAR2.name = 'On this page'; SIDEBAR2.x = cx2; SIDEBAR2.y = 380;
const sk2 = mkText('ON THIS PAGE', { family: 'Plus Jakarta Sans', style: 'Bold', size: 11, color: C.accentDeep, letterSpacing: 1.2 });
sk2.x = 18; sk2.y = 16; SIDEBAR2.appendChild(sk2);
let sy = 40;
for (let i = 0; i < sidebarItems.length; i++) {
  const isFirst = i === 0;
  const row = figma.createFrame(); row.resize(204, 32); row.x = 18; row.y = sy;
  row.cornerRadius = 8; row.fills = isFirst ? solid(C.innerFill, 0.6) : [];
  const dot2 = figma.createEllipse(); dot2.resize(6, 6); dot2.fills = isFirst ? solid(C.accent) : solid(C.glassBorder, 0.42); dot2.x = 10; dot2.y = 13; row.appendChild(dot2);
  const lnk2 = mkText(sidebarItems[i], { family: 'Plus Jakarta Sans', style: isFirst ? 'Bold' : 'Regular', size: 13, color: isFirst ? C.ink : C.ink2 });
  lnk2.x = 24; lnk2.y = 8; row.appendChild(lnk2);
  SIDEBAR2.appendChild(row); sy += 34;
}
SIDEBAR2.resize(240, sy + 12);
PAGE.appendChild(SIDEBAR2);

PAGE.resize(1440, Math.max(5200, py + 100));
figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
figma.notify('✓ All 3 pages built! Portfolio, Resume, Case Study.');
return 'Case study built. Total frames: ' + figma.currentPage.children.length;
`, 120000);

console.log('✓ Case Study page done');
console.log('\n🎉 All 3 pages built natively in Figma!');
console.log('   · Portfolio — Work (two-column layout)');
console.log('   · Resume (sidebar + work history)');
console.log('   · Case Study — VR Parachute (reading layout)');
