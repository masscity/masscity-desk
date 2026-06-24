// Portfolio — sticks to the wireframe layout:
//   left rail = numbered project list + role filter
//   right pane = full project detail for the active project (hero, meta, challenge,
//   approach, highlights, outcome, prev/next/live link).
const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React;

const ROLE_TAGS = ['All', 'Lead', 'Product', 'UI/UX', '3D', 'Game'];

// Map a project's role/discipline strings onto the wireframe filter tags.
function projectMatchesRole(p, tag) {
  if (tag === 'All') return true;
  const blob = (p.role + ' ' + (p.discipline || []).join(' ')).toLowerCase();
  if (tag === 'Lead')    return /\blead\b|founder/.test(blob);
  if (tag === 'Product') return /\bproduct\b|saas|tooling/.test(blob);
  if (tag === 'UI/UX')   return /\bui\/ux|\bux\b|design system|web/.test(blob);
  if (tag === '3D')      return /\b3d\b|ue5|vr|metaverse|simulation/.test(blob);
  if (tag === 'Game')    return /\bgame\b|telegram|metaverse|vr/.test(blob);
  return false;
}

// Per-project detail copy. Keys are project slugs; values fill the right pane.
const CASE_COPY = {
  parachute: {
    tools: ['Unity', 'Blender', 'Figma', 'Adobe', 'CorelDraw', 'Notion'],
    challenge: 'Each training flight costs the Indonesian Air Force Academy at least 500 million Rupiah in Avtur fuel and operational costs. The academy needed a simulation system that replicates real parachute operations — with physical feedback — without the aircraft.',
    approach: 'Designed the full application flow, modeled training zones from three real airports (10 km × 10 km each), built the VR simulation in Unity, and integrated it with a physical motion rig featuring elevation, rotation, wind, and water spray. Delivered the instructor control station UI for scenario management, calibration, CCTV monitoring, and jump records.',
    shots: ['Control station · Jumper Monitor', 'Hardware rig · full-body simulation'],
    outcome: [
      { metric: '500M+', label: 'Rupiah saved per training flight' },
      { metric: '3', label: 'real airports modeled' },
      { metric: '5 mo', label: 'from kick-off to delivery' },
    ],
  },
  vlux: {
    tools: ['UE5 SDK', 'Figma', 'TypeScript', 'Cycles'],
    challenge: 'UE5 lighting artists were ping-ponging between tools to dial in scenes — slow iteration, lost notes, no shared vocabulary across team members.',
    approach: 'Founded the product. Audited five lighting workflows with practicing artists, designed a node-based color pipeline, and shipped a desktop tool with snapshot/compare and a precision colour picker. Continuous beta with five teams shaping the roadmap.',
    shots: ['Node-based color pipeline', 'Snapshot diff between two lighting passes'],
    outcome: [
      { metric: '5×', label: 'faster lighting iteration' },
      { metric: '5', label: 'studios in active beta' },
      { metric: '1', label: 'tool replaces a 3-app workflow' },
    ],
  },
  edutech: {
    tools: ['Figma', 'Tokens Studio', 'React', 'Storybook'],
    challenge: 'Three SEA institutions, three apps (LMS, admin, student) — and almost no shared vocabulary. Every screen was bespoke, every release a re-invent.',
    approach: 'Stood up a single design system: tokens, components, motion. Migrated the three apps to it screen-by-screen. Trained the in-house team on contribution rules so the system kept living after handover.',
    shots: ['Token foundations', 'LMS dashboard, post-system'],
    outcome: [
      { metric: '500%', label: 'asset production lift' },
      { metric: '83', label: 'institutional accounts onboarded' },
      { metric: '3', label: 'products on a single system' },
    ],
  },
  pataland: {
    tools: ['Figma', 'Blender', 'Adobe', 'Unity', 'CorelDraw', 'Trello'],
    challenge: 'PataLand needed a social-entertainment metaverse where fans and artists share the same room — across VR, desktop, and mobile.',
    approach: 'As Lead Designer, architected a user-behavior tracking system using custom triggers. Analyzed interaction heatmaps and navigation patterns to refine UX. Managed the full product lifecycle and led technical discussions with developers.',
    shots: ['Virtual concert — stage view', 'Character customization system'],
    outcome: [
      { metric: '836', label: 'registered accounts' },
      { metric: '4', label: 'collaborated artists' },
      { metric: '10+', label: 'fun & social activities' },
    ],
  },
  metaverse: {
    tools: ['Blender', 'Unity', 'Internal PM Tool'],
    challenge: 'PT. Walden Global Service needed to integrate its brands into one social-ecosystem to promote and sell digital goods and services.',
    approach: 'Wore three hats — business development, project management, and 3D design. Audited brand ecosystem, defined the business case, designed virtual spaces in Blender, and managed the development pipeline.',
    shots: ['Brand zone — virtual space', 'Marketplace interface'],
    outcome: [
      { metric: '1', label: 'unified social ecosystem' },
      { metric: '3', label: 'roles held simultaneously' },
      { metric: '2', label: 'platforms (Android & iOS)' },
    ],
  },
};

// ─── Left rail: project list + role filter ──────────────────────────────────
function ProjectList({ items, activeIdx, onSelect, roleFilter, onRoleFilter, fontDisplay, fontUI }) {
  return (
    <aside style={{
      position: 'sticky', top: 96, alignSelf: 'start',
      maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
      padding: 18,
      background: RT.glassFill,
      backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      border: `2px solid ${RT.glassBorder}`, borderRadius: 22,
      boxShadow: '0 18px 36px -16px rgba(40,25,10,0.30), inset 0 1px 0 rgba(255,255,255,0.5)',
    }}>
      <Kicker>projects · {String(items.length).padStart(2, '0')}</Kicker>
      <nav style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <button key={p.slug} onClick={() => onSelect(i)} style={{
              all: 'unset', cursor: 'pointer',
              padding: '10px 12px', borderRadius: 10,
              display: 'grid', gridTemplateColumns: '24px 1fr', gap: 8, alignItems: 'baseline',
              background: isActive ? RT.innerFill : 'transparent',
              border: `1.5px solid ${isActive ? RT.glassBorderHi : 'transparent'}`,
              transition: 'background 0.2s, border-color 0.2s',
            }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: isActive ? RT.accent : RT.ink3 }}>
                {String(i + 1).padStart(2, '0')}.
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ display: 'block', fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: RT.ink, letterSpacing: -0.3, lineHeight: 1.2 }}>
                  {p.title}
                </span>
                <span style={{ display: 'block', marginTop: 3, fontFamily: fontUI, fontSize: 11, fontWeight: 600, color: RT.ink2 }}>
                  {p.client}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <hr style={{ margin: '18px -4px 14px', border: 'none', borderTop: `1.5px dashed ${RT.glassBorderHi}` }} />

      <Kicker>filter by role</Kicker>
      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ROLE_TAGS.map(t => {
          const sel = t === roleFilter;
          return (
            <button key={t} onClick={() => onRoleFilter(t)} style={{
              padding: '6px 11px', borderRadius: 999, cursor: 'pointer',
              border: `1.5px solid ${sel ? RT.ink : RT.glassBorder}`,
              background: sel ? RT.ink : 'transparent',
              color: sel ? RT.cream : RT.ink2,
              fontFamily: fontUI, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3,
              transition: 'all 0.2s',
            }}>{t}</button>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Right pane: project detail for the active project ─────────────────────
function ProjectPane({ p, idx, total, onPrev, onNext, fontDisplay, fontUI }) {
  const ref = useReveal();
  // Rebuild reveal each project change — key prop on parent re-mounts this.
  const c = CASE_COPY[p.slug] || {};
  return (
    <article ref={ref} className="reveal" style={{ minWidth: 0 }}>
      <Kicker>project · {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</Kicker>
      <h1 style={{ margin: '10px 0 0', fontFamily: fontDisplay, fontSize: 'clamp(40px, 5.4vw, 68px)', fontWeight: 700, color: RT.ink, letterSpacing: -2, lineHeight: 1.05, textWrap: 'balance' }}>
        {p.title}
      </h1>
      <p style={{ marginTop: 14, fontFamily: fontDisplay, fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: RT.accent, letterSpacing: -0.4, lineHeight: 1.35, maxWidth: 640 }}>
        {p.summary}
      </p>

      {/* Meta strip — Role · Year · Client · Tools */}
      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `2px solid ${RT.glassBorder}`, borderRadius: 14, overflow: 'hidden', background: RT.glassFill, backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)' }}>
        {[
          ['Role', p.role],
          ['Year', p.period],
          ['Client', p.client],
          ['Tools', (c.tools || []).join(' · ') || '—'],
        ].map(([k, v], i) => (
          <div key={k} style={{ padding: '14px 16px', borderRight: i < 3 ? `1.5px solid ${RT.glassBorder}` : 'none' }}>
            <div style={{ fontFamily: fontUI, fontSize: 10, fontWeight: 700, color: RT.ink3, textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div>
            <div style={{ marginTop: 6, fontFamily: fontDisplay, fontSize: 14, fontWeight: 600, color: RT.ink, lineHeight: 1.3 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Hero image / video loop */}
      <div className="glass" style={{
        marginTop: 22, position: 'relative',
        background: `linear-gradient(135deg, ${p.cover} 0%, ${p.coverDeep} 100%)`,
        border: `2px solid ${RT.glassBorder}`, borderRadius: 18, overflow: 'hidden',
        aspectRatio: '21 / 9', boxShadow: '0 22px 44px -20px rgba(40,25,10,0.45)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.32), transparent 55%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.20), transparent 55%)' }} />
        <div style={{
          position: 'absolute', inset: '15% 20%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,250,235,0.92)', border: `2.5px solid ${RT.ink}`,
          borderRadius: 14, boxShadow: '0 16px 32px -10px rgba(0,0,0,0.35)',
          fontFamily: fontDisplay, fontSize: 'clamp(60px, 9vw, 110px)', fontWeight: 700, color: p.coverDeep, letterSpacing: -3,
        }}>
          {p.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div style={{ position: 'absolute', top: 16, left: 16, padding: '5px 11px', borderRadius: 999, background: 'rgba(20,15,8,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: `1.5px solid rgba(255,255,255,0.25)`, fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, fontWeight: 600, color: 'rgba(255,250,235,0.95)', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          ▸ hero · video loop
        </div>
      </div>

      {/* Challenge */}
      <h2 style={{ margin: '34px 0 8px', fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, color: RT.ink, letterSpacing: -0.6 }}>Challenge</h2>
      <p style={{ margin: 0, fontFamily: fontUI, fontSize: 15.5, fontWeight: 500, lineHeight: 1.65, color: RT.ink2, maxWidth: 720 }}>
        {c.challenge}
      </p>

      {/* Approach */}
      <h2 style={{ margin: '28px 0 8px', fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, color: RT.ink, letterSpacing: -0.6 }}>Approach</h2>
      <p style={{ margin: 0, fontFamily: fontUI, fontSize: 15.5, fontWeight: 500, lineHeight: 1.65, color: RT.ink2, maxWidth: 720 }}>
        {c.approach}
      </p>

      {/* Highlights — 2 screenshots */}
      <h2 style={{ margin: '28px 0 12px', fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, color: RT.ink, letterSpacing: -0.6 }}>Highlights</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {(c.shots || []).map((label, i) => (
          <div key={i} className="glass" style={{
            position: 'relative', aspectRatio: '4 / 3',
            background: `linear-gradient(155deg, ${i === 0 ? p.cover : p.coverDeep} 0%, ${i === 0 ? p.coverDeep : p.cover} 100%)`,
            border: `2px solid ${RT.glassBorder}`, borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 14px 28px -14px rgba(40,25,10,0.30)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.30), transparent 55%), radial-gradient(circle at 70% 75%, rgba(0,0,0,0.18), transparent 55%)' }} />
            <div style={{ position: 'absolute', inset: '12% 14%', background: 'rgba(255,250,235,0.88)', border: `2px solid ${RT.ink}`, borderRadius: 10 }} />
            <div style={{ position: 'absolute', bottom: 12, left: 14, padding: '4px 10px', borderRadius: 999, background: 'rgba(20,15,8,0.72)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, color: 'rgba(255,250,235,0.95)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
              0{i + 1} · {label}
            </div>
          </div>
        ))}
      </div>

      {/* Outcome */}
      <h2 style={{ margin: '28px 0 12px', fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, color: RT.ink, letterSpacing: -0.6 }}>Outcome</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {(c.outcome || []).map(({ metric, label }, i) => (
          <div key={i} className="glass" style={{ padding: 18, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 14, backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)' }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: i === 0 ? RT.accent : i === 1 ? RT.green : RT.yellow, lineHeight: 1, letterSpacing: -1.5 }}>{metric}</div>
            <div style={{ marginTop: 8, fontFamily: fontUI, fontSize: 11.5, fontWeight: 700, color: RT.ink2, letterSpacing: 0.4, textTransform: 'uppercase', lineHeight: 1.35 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Action row — Prev / Next / Live */}
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1.5px dashed ${RT.glassBorderHi}`, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={onPrev} style={{
          padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
          border: `1.5px solid ${RT.ink}`, background: RT.ink, color: RT.cream,
          fontFamily: fontUI, fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
          boxShadow: '0 3px 0 ' + RT.ink2,
        }}>← Prev project</button>
        <button onClick={onNext} style={{
          padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
          border: `1.5px solid ${RT.ink}`, background: 'transparent', color: RT.ink,
          fontFamily: fontUI, fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
        }}>Next project →</button>
        <a href={p.href} style={{
          marginLeft: 'auto', textDecoration: 'none',
          padding: '10px 16px', borderRadius: 999,
          border: `1.5px solid ${RT.glassBorder}`, background: RT.innerFill, color: RT.ink,
          fontFamily: fontUI, fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>View footage / live link <span aria-hidden>↗</span></a>
      </div>
    </article>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function PortfolioApp() {
  const [theme, toggleTheme] = useTheme();
  const fontDisplay = '"DM Serif Display", "Fraunces", Georgia, serif';
  const fontUI = '"Plus Jakarta Sans", "Quicksand", system-ui, sans-serif';

  const allProjects = window.PORTFOLIO_PROJECTS || [];
  const [roleFilter, setRoleFilter] = useStateP('All');
  const items = useMemoP(() => allProjects.filter(p => projectMatchesRole(p, roleFilter)), [roleFilter, allProjects]);
  const [activeIdx, setActiveIdx] = useStateP(0);

  // Keep active in range when filter narrows the list.
  useEffectP(() => { if (activeIdx >= items.length) setActiveIdx(0); }, [items.length, activeIdx]);

  // Deep-link: if URL hash matches a project slug, select it.
  useEffectP(() => {
    const h = (window.location.hash || '').replace('#', '');
    if (!h) return;
    const i = items.findIndex(p => p.slug === h);
    if (i >= 0) setActiveIdx(i);
  }, []); // once

  const active = items[activeIdx] || items[0];
  const total = items.length;
  const goPrev = () => setActiveIdx((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIdx((i) => (i + 1) % total);

  // Scroll to top of pane when project changes (feels like turning a page)
  useEffectP(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeIdx]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {theme === 'light' ? <SiteRoom theme={theme} /> : <DarkAmbient />}
      <CursorSpotlight />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <SiteTopBar fontUI={fontUI} theme={theme} toggleTheme={toggleTheme} current="Portfolio" />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 32px 60px' }}>
          {/* Page hero — small, lets the project detail breathe */}
          <header style={{ marginBottom: 28 }}>
            <Kicker>portfolio · /work</Kicker>
            <h1 style={{ margin: '10px 0 0', fontFamily: fontDisplay, fontSize: 'clamp(36px, 4.4vw, 56px)', fontWeight: 700, color: RT.ink, letterSpacing: -1.5, lineHeight: 1.05 }}>
              Five projects, <span style={{ color: RT.accent, fontStyle: 'italic' }}>one rail at a time</span>.
            </h1>
            <p style={{ margin: '12px 0 0', fontFamily: fontUI, fontSize: 14.5, fontWeight: 500, color: RT.ink2, maxWidth: 640 }}>
              Pick a project on the left — the detail opens here. Filter by role to narrow the list.
            </p>
          </header>

          {/* Two-column wireframe layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }}>
            <ProjectList
              items={items}
              activeIdx={activeIdx}
              onSelect={setActiveIdx}
              roleFilter={roleFilter}
              onRoleFilter={setRoleFilter}
              fontDisplay={fontDisplay}
              fontUI={fontUI}
            />
            {active ? (
              <ProjectPane
                key={active.slug /* re-mount → re-trigger reveal */}
                p={active}
                idx={activeIdx}
                total={total}
                onPrev={goPrev}
                onNext={goNext}
                fontDisplay={fontDisplay}
                fontUI={fontUI}
              />
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: fontUI, fontSize: 14, fontWeight: 600, color: RT.ink2, background: RT.innerFill, border: `2px dashed ${RT.glassBorderHi}`, borderRadius: 18 }}>
                No projects match <strong>{roleFilter}</strong>. <button onClick={() => setRoleFilter('All')} style={{ background: 'none', border: 'none', color: RT.accent, fontFamily: fontUI, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>Show all</button>.
              </div>
            )}
          </div>

          <footer style={{ marginTop: 60, padding: '20px 6px', display: 'flex', justifyContent: 'space-between', fontFamily: fontUI, fontWeight: 600, fontSize: 12, color: RT.ink2 }}>
            <span>© 2026 Andri Saputro</span>
            <span><a href="Resume.html" style={{ color: RT.ink2, textDecoration: 'none', borderBottom: `1.5px solid ${RT.glassBorderHi}` }}>Read the resume →</a></span>
          </footer>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PortfolioApp />);
