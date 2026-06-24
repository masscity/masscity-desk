# Product

## Register

brand

## Users

Three audiences, one portfolio:

- **Recruiters and hiring managers** — scan fast, need instant signal on craft level and range. They see dozens of portfolios; the 3D room stops the scroll.
- **Creative directors and senior designers** — evaluate depth, systems thinking, and whether the process matches the output. They'll go deep into case studies.
- **Clients and startup founders** — looking for someone who can ship real product. They want to feel the designer's taste and trust their judgment.

Context: visited from a laptop or desktop, usually mid-session during a review pass or hiring loop. On a monitor, at a desk — which makes the room metaphor land.

## Product Purpose

MassCity's Desk is Muhamad Andri Saputro's interactive 3D portfolio. Visitors navigate a fully rendered desk environment, click objects, and discover case studies, social links, and a resume embedded inside the experience. The 3D room is not a novelty layered over a standard portfolio — it IS the portfolio, and the quality of the experience is itself evidence of craft.

Success: a visitor closes the tab having thought "this person is genuinely exceptional at what they do" — and sends an email or saves the link.

## Brand Personality

Spatial · Immersive · Meticulous

The portfolio should feel like being handed a perfectly crafted object: every surface considered, every interaction deliberate, nothing wasted. Not flashy for its own sake — precise, curious, and confident.

References that capture the register:
- **Bruno Simon** (bruno-simon.com) — 3D world as identity; the experience is the resume
- **Merci Michel / Coastal World** — environmental storytelling, the environment has texture and specificity
- **David Hckh** — experimental portfolio energy, typographic confidence within a spatial frame

## Anti-references

- **Pop-art UI** — saturated flat palettes, comic-book color blocking, Ben-day dot aesthetics. Not this.
- **Generic Framer templates** — floating cards, pastel gradient, "here's my work" scaffold. Zero personality.
- **Over-animated chaos** — everything flies in, nothing lands. Motion without intention reads as noise.
- **Sterile minimalism** — so clean it has no character. The restraint here must carry warmth, not emptiness.

## Design Principles

1. **The experience is the argument.** The 3D room is not decoration around a portfolio — it is the primary proof of taste. Every detail of the environment should signal what kind of designer Andri is.
2. **Craft speaks before copy.** A visitor should feel the quality of the work before reading a single word. Visual and interactive quality is the first message; text explains what it already showed.
3. **Spatial depth, not flat hierarchy.** The world has depth; UI elements that appear over it should feel like they belong to the same space — not like a flat dashboard dropped on top of a game.
4. **Editorial restraint within the spectacle.** The 3D canvas is expressive. Everything overlaid on it (HUD, modals, case studies) earns its visual weight by stepping back, not competing.
5. **Every click rewards curiosity.** The interactive model sets an expectation: exploration yields discovery. Dead-ends or empty interactions break the contract.

## Accessibility & Inclusion

Best effort. No hard WCAG compliance target.

- Reasonable contrast on all non-3D UI (HUD, modals, overlays, case study pages)
- Keyboard navigation where practical
- `prefers-reduced-motion` respected for GSAP transitions and UI animations
- The 3D canvas itself is exempt; screen-reader and keyboard navigation of the 3D scene is out of scope
