---
name: MassCity's Desk
description: An interactive 3D portfolio that navigates like a room and reads like a document
colors:
  studio-lamp: "#eaab36"
  blueprint-navy: "#283773"
  amber-accent: "#c07a20"
  modal-glass-ink: "#3d2a18"
  modal-amber: "#7a4520"
  warm-page: "#f8f0db"
  overlay-dark: "#0f0c08"
  near-black: "#0a0a0a"
  interactive-green: "#7ee8a2"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.3px"
  headline:
    fontFamily: "DM Serif Display, Fraunces, Georgia, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.5px"
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.7
  body-prose:
    fontFamily: "Plus Jakarta Sans, Quicksand, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 500
    lineHeight: 1.7
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0.02em"
rounded:
  pill: "999px"
  xl: "20px"
  lg: "16px"
  md: "12px"
  sm: "10px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "48px"
components:
  hud-btn:
    backgroundColor: "transparent"
    textColor: "rgba(255,255,255,0.6)"
    rounded: "999px"
    padding: "0 14px"
    height: "38px"
  hud-btn-hover:
    backgroundColor: "rgba(255,255,255,0.10)"
    textColor: "#ffffff"
    rounded: "999px"
    padding: "0 14px"
    height: "38px"
  hud-btn-cta:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "999px"
    padding: "0 14px"
    height: "38px"
  modal-container:
    backgroundColor: "rgba(255,248,232,0.75)"
    textColor: "#3d2a18"
    rounded: "20px"
    padding: "20px"
  modal-visit-btn:
    backgroundColor: "rgba(140,90,45,0.10)"
    textColor: "#7a4520"
    rounded: "999px"
    padding: "10px 0"
  su-nav-btn:
    backgroundColor: "transparent"
    textColor: "rgba(255,255,255,0.6)"
    rounded: "20px"
    padding: "6px 14px"
  su-cv-btn:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "20px"
    padding: "7px 16px"
---

# Design System: MassCity's Desk

## 1. Overview

**Creative North Star: "The Spatial Document"**

A portfolio that exists as a physical object in three-dimensional space. Everything about this system carries the weight, texture, and deliberateness of something you'd handle carefully — not tap past. The visitor doesn't scroll a page; they enter a room. When they interact with the objects in that room, they find documents — case studies, a resume — rendered with the same attentiveness the room itself demonstrates. The design is the argument.

The system has two physically distinct registers that work together. The **World Layer** is the 3D environment: a dark-glass, cinematic space lit by warm tungsten amber and deep blueprint navy. Everything floating over it — the HUD bar, dropdowns, tooltips — belongs to this dark glass world. The **Document Layer** is the reading room: the case study iframes and portfolio/resume pages render in warm amber-tinted paper, with an editorial serif + friendly sans pairing, careful prose spacing, and the same amber accent threading through as the world. Same designer, two rooms. Moving between them is the experience.

This system explicitly rejects: pop-art UI (flat saturated palettes, comic-book color blocks); generic Framer template scaffolding (floating cards on pastel gradients, "here's my work" grids); over-animated chaos (motion without a purpose beyond existing); and sterile minimalism (restraint stripped of character). The 3D room already does the unexpected thing. Every design decision after that should honor the commitment the room makes.

**Key Characteristics:**
- Dual-register: dark glass World + warm amber Document
- Blur as structural material, not decoration
- Amber is the thread connecting both worlds
- Pills are the default shape for interactive elements
- Fraunces for titles in both layers; the voice is consistent even when the canvas changes
- Motion is earned; every transition is cinematic rather than performative

---

## 2. Colors: The Studio and the Blueprint

Two poles connected by a warm amber thread.

### Primary

- **Studio Lamp** (`#eaab36`, oklch ≈ 0.74 0.17 81): The amber-gold of a tungsten lamp over a desk. Applied as the light-mode tint on the 3D canvas filter, the scrollbar thumb accent, and prose list markers in case studies. In GSAP transitions it is the warm face of the world as it turns toward day.

- **Blueprint Navy** (`#283773`, oklch ≈ 0.28 0.10 266): The cool, deep indigo of an engineering plan stored in a drawer. Applied as the dark-mode 3D world tint. Deep, structural, unhurried.

### Secondary

- **Amber Accent** (`#c07a20`, oklch ≈ 0.72 0.16 45): The darker, more saturated sibling of Studio Lamp. Used for interactive text in warm surfaces (modal visit button, interactive elements in case studies, selection highlight). More purposeful than decorative — it signals action, not atmosphere.

### Tertiary

- **Interactive Green** (`#7ee8a2`): Reserved exclusively for the hover-label status dot — the small glowing indicator that tells visitors an object in the 3D world is clickable. It has no palette relationship to the rest of the system. That is intentional. It is a signal, not a color.

### Neutral

- **Warm Page** (`#f8f0db`, oklch ≈ 0.96 0.025 75): The gradient high-point of case study and portfolio pages. Warm but not creamy — tinted firmly toward the amber hue, not toward generic warmth.
- **Modal Glass Ink** (`#3d2a18`): The primary text color on warm glass surfaces (modals, case study overlays). A deep amber-brown that belongs in the same world as Studio Lamp.
- **Modal Amber** (`#7a4520`): Interactive text on glass surfaces. Deep enough for 4.5:1 contrast on the parchment modal glass.
- **Overlay Dark** (`#0f0c08`): The base of all dark glass surfaces — the HUD bar, dropdown, screen backdrop. Warm near-black, not neutral gray, not cool black.
- **Near Black** (`#0a0a0a`): The curtain. Used only for full-screen page transitions.

### Named Rules

**The One Thread Rule.** Amber connects both worlds. Studio Lamp (#eaab36) defines the 3D canvas; Amber Accent (#c07a20) marks interactive moments in the document layer; the Resume CTA in the HUD carries a warm amber-gold tint (`rgba(255,220,150,0.9)`). Every surface has its own amber reading — the thread never breaks.

**The Signal Rule.** Interactive Green (#7ee8a2) is the only color in this system that exists solely as a signal rather than a surface. Never use it for decoration, background tints, or text. It means "you can click this object." That is its entire job.

---

## 3. Typography

**Display Font:** Fraunces, Georgia, serif (variable optical-size serif with both upright and italic cuts)
**Body / UI Font:** Outfit, system-ui, sans-serif (geometric sans, weights 100–900)
**Prose Font:** Plus Jakarta Sans, Quicksand, system-ui, sans-serif (humanist sans for reading)
**Mono / Technical Font:** JetBrains Mono (case study code references and technical labels)

**Character:** Fraunces holds the authoritative voice — it appears in modal titles, case study headings, and wherever the identity needs to assert itself. Outfit is the workhorse: HUD buttons, navigation, labels, and all interactive UI. The pair contrasts on the serif/sans axis without competing in weight, which is exactly right for a system where the serif announces and the sans operates.

In the Document Layer, Plus Jakarta Sans takes Outfit's role for prose — slightly warmer and more literary than Outfit at reading sizes, which suits long-form case study text. Fraunces stays for section headings. The voice is consistent; only the surface register changes.

### Hierarchy

- **Display** (Fraunces, 700, 22px, 1.2 leading, −0.3px tracking): Modal titles, case study section headers when rendered inside the 3D world's glass modals. Authority, not decoration.
- **Headline** (DM Serif Display / Fraunces, 400/700, 26px, 1.3 leading, −0.5px tracking): Case study and portfolio page h3-level headings in the Document Layer. Confident but not loud.
- **Body** (Outfit, 500, 13.5px, 1.7 leading): All HUD and overlay UI copy — buttons, nav labels, dropdown items, tooltip text. Precise and legible at small sizes.
- **Body Prose** (Plus Jakarta Sans, 500, 16.5px, 1.7 leading): Case study paragraph text. Max line length 65–75ch. `text-wrap: pretty` for orphan control.
- **Label** (Outfit, 500, 13px, 0.02em tracking): Navigation tabs, status labels, meta text in the screen UI top bar.

### Named Rules

**The Two-Register Rule.** Outfit owns the World Layer; Plus Jakarta Sans owns the Document Layer. Never swap them between registers. Fraunces is the one voice that crosses both — it appears wherever authority needs to be asserted regardless of which layer the visitor is in.

---

## 4. Elevation

The system uses **ambient warm shadows as its structural elevation language** and **backdrop-filter blur as the finishing surface treatment**. Shadows establish depth and lift; blur is the material that makes a surface read as glass — but the shadow comes first.

Dark glass surfaces (World Layer) use cool, deep shadows tied to near-black tones. Light glass surfaces (Document Layer modals and cards) use warm amber-tinted shadows that feel like the object is lifting off a wooden desk into raking studio light.

### Shadow Vocabulary

- **Ambient Dark** (`0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`): The HUD bar at rest. Diffuse, enveloping. The inset top-edge highlight reads as the rim of a physical object.
- **Cascade Dark** (`0 16px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`): The HUD dropdown. Deeper than the bar — it is lower in the physical stack.
- **Ambient Warm** (`0 24px 64px rgba(60,30,8,0.22), inset 0 1px 0 rgba(255,255,255,0.70)`): Modal glass. The shadow is amber-tinted, not neutral. The inset highlight is bright — warm light bouncing off the top edge of a glass surface.
- **Card Lift Warm** (`0 28px 50px -20px rgba(40,25,10,0.50), inset 0 1px 0 rgba(255,255,255,0.70)`): Card hover state in Portfolio and Resume pages. Deep negative spread creates sharp focus under the lifted object.

### Glass Blur Reference (not a shadow; paired with shadows above)

- HUD bar: `blur(20px) saturate(140%)`
- Modal: `blur(32px) saturate(120%)`
- Screen top bar: `blur(16px) saturate(140%)`
- Dropdown: `blur(24px) saturate(140%)`
- Screen backdrop: `blur(12px) saturate(80%)`

### Named Rules

**The Warm Shadow Rule.** Dark shadows on warm surfaces are prohibited. Shadows on the Document Layer must be amber-tinted (rgba with red ≥ green ≥ blue, warm undertone). A neutral gray shadow on a warm parchment surface reads as imported from a different system.

**The Glass Earns Its Blur Rule.** Backdrop-filter blur is applied only to overlay-class elements: the HUD, its dropdown, modals, the screen backdrop, and the top bar. It is never used decoratively on cards or passive containers in the Document Layer. Glass means "I am floating above the scene." Non-floating elements do not get blur.

---

## 5. Components

### HUD Bar (Signature Component)

The portfolio's primary navigation surface — a pill-shaped floating bar, fixed at screen bottom-center. Dark glass, warm near-black base, rim-lit by a 1px white-opacity edge.

- **Shape:** Full pill (`border-radius: 999px`), 52px tall including 6px padding, centered by `transform: translateX(-50%)`
- **Background:** `rgba(15,12,8,0.55)` + `backdrop-filter: blur(20px) saturate(140%)`
- **Border:** `1px solid rgba(255,255,255,0.12)` — barely visible edge light
- **Shadow:** Ambient Dark (`0 8px 32px rgba(0,0,0,0.35)`)
- **Entrance:** `opacity: 0 → 1` over 0.5s ease; triggered after loading completes
- **Behavior:** Fades out (`opacity: 0`) when the Screen UI opens

### Buttons (HUD)

Three semantic variants, all 38px tall, pill shape:

- **Icon Button** (38×38px, `border-radius: 50%`): Sound toggle, light toggle, help. Transparent background, `rgba(255,255,255,0.6)` icon color. Hover: `rgba(255,255,255,0.10)` bg, full white icon.
- **CTA Button** (`padding: 0 14px`, `border-radius: 999px`): "View Portfolio", "View Resume". Full white text, transparent bg — the bar's dark background provides the container. Resume variant: `rgba(255,220,150,0.9)` amber-gold tint, darkens on hover.
- **Links Trigger** (`border-radius: 999px`, chevron SVG): Opens dropdown. Active state: `rgba(255,255,255,0.12)` bg. Chevron rotates 180° on open via `transition: transform 0.25s cubic-bezier(.2,.8,.2,1)`.

### HUD Dropdown

A dark glass panel anchored above the HUD bar, opening upward.

- **Shape:** `border-radius: 16px`, min 200px wide
- **Background:** `rgba(15,12,8,0.70)` + `blur(24px) saturate(140%)`
- **Border:** `1px solid rgba(255,255,255,0.12)`
- **Entrance:** `opacity 0.2s ease` + `translateY(8px → 0)`
- **Items:** `border-radius: 10px`, `padding: 10px 16px`, hover `rgba(255,255,255,0.10)`

### Modal (Warm Glass)

The project detail popup — the warmest surface in the system. Feels like a frosted card lifted off a warm wooden desk.

- **Shape:** `border-radius: 20px`, max-width 520px, centered fixed
- **Background:** `rgba(255,248,232,0.75)` + `blur(32px) saturate(120%)` — parchment warmth
- **Border:** `1.5px solid rgba(140,90,45,0.22)` — amber-brown hairline
- **Shadow:** Ambient Warm
- **Title:** Fraunces 22px 700 `color: #3d2a18`, `letter-spacing: -0.3px`
- **Body text:** Outfit 13.5px 500 `color: rgba(61,42,24,0.72)` — warm, legible, restrained
- **Close button:** 30×30px circle, `rgba(140,90,45,0.10)` bg, 1px border, 50% radius
- **Visit Project button:** Full-width pill, `rgba(140,90,45,0.10)` bg, `#7a4520` text, 1.5px amber border; hover shifts bg to 0.20 opacity

### Screen UI Top Bar (Navigation)

A persistent navigation bar that appears when the screen object in the 3D room is clicked. Spans full width, 56px tall, dark glass.

- **Background:** `rgba(20,15,10,0.45)` + `blur(16px) saturate(140%)`
- **Border-bottom:** `1px solid rgba(255,255,255,0.15)`
- **Nav buttons:** `border-radius: 20px`, 13px Outfit 500, `rgba(255,255,255,0.6)` text; hover `rgba(255,255,255,0.10)` bg + white text; active `rgba(255,255,255,0.18)` bg
- **Resume link variant:** Amber-gold tint `rgba(255,220,160,0.7)` at rest; full amber-gold on hover and active
- **CV download button:** Ghost pill with `1.5px solid rgba(255,255,255,0.35)` border; `filter: brightness(1.15)` on hover
- **Back button:** `rgba(255,255,255,0.15)` bg pill; `rgba(255,255,255,0.25)` on hover

### Hover Label (Signature Component)

A cursor-following tooltip that appears when hovering interactive 3D objects. The only component that uses Interactive Green.

- **Shape:** Full pill, `padding: 7px 14px 7px 10px`
- **Background:** `rgba(10,10,10,0.75)` + `blur(10px)`
- **Entrance:** `scale(0.8) translateY(6px) → scale(1) translateY(0)` + opacity 0→1
- **Green dot:** 7×7px circle, `background: #7ee8a2`, `box-shadow: 0 0 6px #7ee8a2` — the only glowing element in the system

### Cards / Glass Containers (Document Layer)

Used in Portfolio and Resume pages. A subtle glass treatment over the warm page gradient.

- **Shape:** Variable radius (12–20px depending on context)
- **Background:** Warm translucent glass (`rgba(255,250,235,0.42)` at rest)
- **Border:** `rgba(255,252,240,0.85)` — near-white warm edge
- **Hover:** `translateY(-3px)` + Card Lift Warm shadow over `0.25s cubic-bezier(.2,.8,.2,1)`
- **Glass shimmer:** Radial gradient following cursor position via CSS `--mx/--my` custom properties, `rgba(255,250,230,0.25)` — visible only on hover

---

## 6. Do's and Don'ts

### Do:

- **Do** apply `backdrop-filter: blur()` only to overlay-class elements — HUD, modal, dropdown, screen backdrop, top bar. If it doesn't float above the scene, it doesn't blur.
- **Do** tint dark shadows warm on Document Layer surfaces: `rgba(40,25,10,...)` not `rgba(0,0,0,...)`. A neutral gray shadow breaks the amber thread.
- **Do** use Interactive Green (`#7ee8a2`) exclusively as the hover-label dot. Its rarity is its meaning.
- **Do** reserve Fraunces for display and title moments that need authority — modal headings, case study section headers. It is the voice that crosses both worlds; use it purposefully.
- **Do** animate state changes through opacity and transform only. No layout-triggering animations.
- **Do** respect `prefers-reduced-motion`: all GSAP and CSS transitions should fall back to instant crossfades or opacity-only changes.
- **Do** keep pill shapes (`border-radius: 999px`) as the default for all interactive elements — nav buttons, HUD buttons, tags, dropdowns. Rounded rectangles (20px) are for containers only.
- **Do** use `cubic-bezier(.2,.8,.2,1)` as the standard easing for interactive transitions — it is fast to start and eases out with snap.

### Don't:

- **Don't** use pop-art UI: saturated flat color palettes, comic-book color blocking, Ben-day dot textures, or primary-color fills. This system's color is amber and midnight — not primary.
- **Don't** fall into generic Framer template patterns: floating card grids on pastel gradients, "here's my work" scaffold layouts, identical card rows with icon + title + text. The 3D room already solved the entry experience; don't undo it with a conventional grid beneath.
- **Don't** use motion without purpose. Every transition in this system is cinematic: curtain fades, ambient entrance, purposeful card lifts. Motion for motion's sake — things flying in from every direction with no spatial logic — contradicts "The Spatial Document."
- **Don't** add sterile minimalism. Restraint here must carry warmth. A surface that is simply empty is not restrained — it is abandoned.
- **Don't** use a side-stripe border (`border-left` or `border-right` thicker than 1px) as an accent on any card, list item, or callout. The system uses full borders, background tints, or leading icons instead.
- **Don't** use gradient text (`background-clip: text`). Emphasis is carried by weight (Fraunces bold vs. regular), size, or color contrast — never by gradient fills on type.
- **Don't** use glassmorphism outside the designated overlay-class components. Blur on a passive card, sidebar, or decorative element reads as decor, not depth. The blur earns its meaning by being rare.
- **Don't** use neutral-gray shadows on warm amber surfaces. The shadow always carries the hue of its context — warm tinted on warm pages, near-black on the dark world.
