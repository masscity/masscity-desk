# MassCity's Desk — Handoff

## What this project is

Interactive 3D portfolio site. Visitors navigate a WebGL desk scene (Three.js + Draco GLB), click objects, and open case studies, social links, and a resume. The 3D experience IS the proof of craft — not a wrapper around it.

Stack: vanilla JS ES modules, Three.js r168, GSAP 3.12.5, Howler.js, no build step.
Entry: `index.html` → `main.js` → `Web-draco.glb`
Secondary pages: `Portfolio.html`, `Resume.html`, `Case-Parachute.html` (covers all 5 case studies via hash routing)

Design system is in `DESIGN.md` (tokens + component rules) and `PRODUCT.md` (brand strategy).
Impeccable skill is installed and configured — run `/impeccable` for design commands.

---

## Current state

### index.html — 31/40, zero P1s (last critiqued this session)

All critical fixes shipped:

| Fix | File | Status |
|---|---|---|
| View Project links → correct case study URLs | `main.js` | Done |
| `prefers-reduced-motion` on all GSAP animations | `main.js`, `style.css` | Done |
| Progress bar: `width` → `transform: scaleX()` | `main.js`, `style.css` | Done |
| Tutorial overlay font: Arial → Outfit | `style.css` | Done |
| Empty `<img src="">` → transparent 1×1 data URI | `index.html` | Done |
| ESC key closes modal | `main.js` | Done |
| GLB load failure: user-visible error state | `main.js`, `index.html`, `style.css` | Done |
| Hover labels for all 3D objects | `main.js` | Done |

### View Project URL mapping (main.js modalContent)

```
PataLand  → Case-Parachute.html#pataland
Vlux      → Case-Parachute.html#vlux
GoTechUp  → Case-Parachute.html#edutech
Parachute → Case-Parachute.html
```

PC click → opens Portfolio.html in Screen UI (not a modal)
CV click → opens Resume.html in Screen UI

### Remaining open issues on index.html

**[P2] Loading monitor positioning is fragile**
- `top: 47%` + `width: 21vw` in `.loading-monitor-content` (style.css ~line 75) is pixel-matched to `landing2.webp` at one specific viewport
- Breaks on 4K / ultrawide / narrow 16:10 monitors
- Fix: either crop `landing2.webp` so monitor occupies a consistent fraction, or use `aspect-ratio` / `object-fit` math

---

## What to do next

### 1. Critique the case study pages (highest priority)

These pages now receive real traffic from the 3D modals. They've never been reviewed.

```
/impeccable critique Case-Parachute.html
/impeccable critique Portfolio.html
/impeccable critique Resume.html
```

`Case-Parachute.html` covers all 5 case studies via hash-based routing (React + Babel standalone). It's the primary payoff after the 3D experience.

### 2. Fix loading monitor positioning (last P2 on index.html)

```
/impeccable craft loading monitor positioning
```

The loading screen shows a monitor image (`media/landing2.webp`) with content overlaid at `top: 47%`. This drifts at non-standard viewports.

### 3. Polish pass once case studies are reviewed

```
/impeccable polish Case-Parachute.html
```

---

## Key file locations

| File | Role |
|---|---|
| `index.html` | Main 3D experience shell |
| `main.js` | Three.js scene, interactions, modals, audio |
| `style.css` | All CSS — World Layer + Document Layer |
| `Web-draco.glb` | 3D scene model (Draco compressed) |
| `Case-Parachute.html` | All case studies (hash routing: #vlux #edutech #pataland #metaverse) |
| `Portfolio.html` | Portfolio hub (shown in Screen UI when user clicks PC) |
| `Resume.html` | Resume (shown in Screen UI when user clicks CV) |
| `portfolio-data.jsx` | Case study data: slugs, hrefs, colors, summaries |
| `case-study-app.jsx` | Case study React app (hash router) |
| `DESIGN.md` | Design system tokens + component rules |
| `PRODUCT.md` | Brand strategy, audiences, design principles |
| `.impeccable/critique/` | Critique snapshots — polish reads these as backlog |

## Design system quick ref

Two-register rule:
- **World Layer** (3D canvas overlays): dark glass, `rgba(x,x,x,0.x)` backgrounds, Outfit body, Fraunces display, amber + navy accents
- **Document Layer** (Portfolio/Resume/Case studies in Screen UI): warm amber gradient, DM Serif Display headings, Plus Jakarta Sans prose

Hook ignores already configured in `.impeccable/config.json` — no noise from white canvas colors or Fraunces.
