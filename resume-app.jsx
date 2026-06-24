// Hi-fi resume V2 — sidebar layout, work thumbnails, project tiles, skill filter, project links
const TWEAK_DEFAULTS_V2 = /*EDITMODE-BEGIN*/{
  "displayFont": "DM Serif",
  "bodyFont": "Jakarta",
  "panelWidth": 1080,
  "showRoomBackdrop": true
}/*EDITMODE-END*/;

const FONT_STACKS_V2 = {
  Recoleta: '"Recoleta", "Fraunces", Cooper, Georgia, serif',
  "DM Serif": '"DM Serif Display", "PP Editorial", Georgia, serif',
  Caprasimo: '"Caprasimo", "Cooper", Georgia, serif',
  Sniglet: '"Sniglet", "Quicksand", system-ui, sans-serif',
  Fraunces: '"Fraunces", Cooper, Georgia, serif',
};
const BODY_STACKS_V2 = {
  Quicksand: '"Quicksand", "Nunito", system-ui, sans-serif',
  Nunito: '"Nunito", "Quicksand", system-ui, sans-serif',
  Jakarta: '"Plus Jakarta Sans", system-ui, sans-serif',
};

// ─── Project data — keyed by company so each role can link out ─────────────
const PROJECTS = {
  parachute: { title: 'VR Parachute Sim', sub: 'Indonesian Air Force Academy · 2023', tag: '3D · VR · Sim', accent: 'oklch(0.78 0.10 145)', href: '#parachute' },
  vlux: { title: 'Vlux', sub: 'UE5 precision lighting desktop app', tag: 'SaaS · Tooling', accent: 'oklch(0.82 0.10 240)', href: '#vlux' },
  edutech: { title: 'Edutech Suite', sub: 'Multiple SaaS platforms', tag: 'SaaS · Edu', accent: 'oklch(0.85 0.07 25)', href: '#edutech' },
  pataland: { title: 'Pataland', sub: 'Brand & product UI', tag: 'Brand · Web', accent: 'oklch(0.88 0.13 95)', href: '#pataland' },
  metaverse: { title: 'Mobile Metaverse', sub: 'Internal social product', tag: '3D · Mobile', accent: 'oklch(0.70 0.10 70)', href: '#metaverse' },
};

// Tiny SVG thumbnail placeholders — replace with screenshots later
function ProjectThumb({ p, size = 56 }) {
  return (
    <span title={p.title} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: 12, background: p.accent, border: `2px solid ${RT.ink}`, boxShadow: '0 2.5px 0 ' + RT.ink, fontFamily: '"DM Serif Display", serif', fontSize: size * 0.42, fontWeight: 700, color: RT.ink, flexShrink: 0 }}>
      {p.title.split(' ').map(w => w[0]).slice(0, 2).join('')}
    </span>
  );
}

function ResumeRoom({ theme = 'light' }) {
  const isDark = theme === 'dark';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', filter: isDark ? 'brightness(0.45) saturate(0.7) hue-rotate(-8deg)' : 'none', transition: 'filter 0.4s' }}>
      <img src="assets/room-background.png" alt="" aria-hidden="true" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
      }} />
      {/* warm vignette to ground edges + soft hero glow */}
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, oklch(0.95 0.10 90 / 0.35), transparent 65%)', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(80,50,30,0.22) 100%)' }} />
      {/* dust motes — keep the lived-in vibe */}
      {[...Array(14)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${(i * 73 + 7) % 100}%`, top: `${(i * 47 + 13) % 100}%`,
          width: 5, height: 5, borderRadius: '50%',
          background: 'oklch(0.96 0.06 90 / 0.6)', boxShadow: '0 0 8px oklch(0.96 0.06 90)',
          animation: `mote ${8 + (i % 5)}s ease-in-out ${i * 0.4}s infinite`,
        }} />
      ))}
    </div>
  );
}

function TopBar({ fontUI, theme, toggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <header style={{ position: 'fixed', top: 16, left: 16, right: 16, zIndex: 30, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)', background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 18, boxShadow: '0 10px 30px -12px rgba(40,25,10,0.30)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Magnetic strength={0.18}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999, background: RT.innerFill, border: `2px solid ${RT.ink}`, color: RT.ink, fontFamily: fontUI, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 0 ' + RT.ink }}>
            <span style={{ fontSize: 14 }}>←</span> Back to room
          </button>
        </Magnetic>
        <Magnetic strength={0.22}>
          <button onClick={toggleTheme} aria-label="Toggle dark mode" title={isDark ? 'Switch to light' : 'Switch to dark'} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: isDark ? RT.ink : RT.yellow,
            border: `2px solid ${RT.ink}`,
            color: isDark ? RT.yellow : RT.ink,
            cursor: 'pointer', boxShadow: '0 3px 0 ' + RT.ink,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.3s, color 0.3s, transform 0.3s',
            fontSize: 16,
          }}>
            {isDark ? (
              // moon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              // sun
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            )}
          </button>
        </Magnetic>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <LiveClock />
        <span style={{ width: 1.5, height: 18, background: RT.glassBorderHi }} />
        {['About', 'Work', 'Resume', 'Contact'].map((it) => (
          <span key={it} style={{ fontFamily: fontUI, fontSize: 13, fontWeight: it === 'Resume' ? 700 : 500, color: it === 'Resume' ? RT.accentDeep : RT.ink2, cursor: 'pointer' }}>{it}</span>
        ))}
        <Magnetic>
          <button style={{ padding: '9px 18px', borderRadius: 999, background: RT.accent, border: `2px solid ${RT.ink}`, color: 'white', fontFamily: fontUI, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 0 ' + RT.ink }}>Download CV ↓</button>
        </Magnetic>
      </div>
    </header>
  );
}

function WindowCard({ title, children, padding = 28, hoverable = false, accent = RT.accent, style = {} }) {
  return (
    <div className={hoverable ? 'glass glass-hover' : 'glass'} style={{
      position: 'relative',
      background: 'rgba(255, 250, 238, 0.55)',
      backdropFilter: 'blur(22px) saturate(150%)',
      WebkitBackdropFilter: 'blur(22px) saturate(150%)',
      border: `2px solid ${RT.glassBorder}`,
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 24px 48px -20px rgba(60,40,20,0.30), inset 0 1px 0 rgba(255,255,255,0.7)',
      ...style,
    }}>
      {title && (
        <div style={{ padding: '11px 16px', borderBottom: `2px solid ${RT.glassBorder}`, background: 'rgba(255,250,238,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: accent, border: `1.5px solid ${RT.ink}` }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: RT.yellow, border: `1.5px solid ${RT.ink}` }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: RT.green, border: `1.5px solid ${RT.ink}` }} />
          <span style={{ marginLeft: 8, fontFamily: RT.fontUI, fontSize: 11.5, fontWeight: 700, color: RT.ink2, letterSpacing: 0.5, textTransform: 'uppercase' }}>{title}</span>
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ fontDisplay, fontUI }) {
  return (
    <aside style={{ position: 'sticky', top: 92, alignSelf: 'start' }}>
      <WindowCard title="profile.card" padding={0} accent={RT.accent}>
        {/* photo slot — user fills later */}
        <div style={{ aspectRatio: '1 / 1', background: `linear-gradient(135deg, oklch(0.86 0.05 70), oklch(0.78 0.06 75))`, borderBottom: `2px solid ${RT.glassBorder}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={RT.ink2} strokeWidth="1.5">
            <circle cx="12" cy="9" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
          </svg>
          <span style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 600, color: RT.ink3, letterSpacing: 1, textTransform: 'uppercase' }}>Drop photo here</span>
        </div>
        <div style={{ padding: '20px 22px 22px' }}>
          <h2 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: RT.ink, lineHeight: 1.05, letterSpacing: -0.5 }}>Andri Saputro</h2>
          <div style={{ marginTop: 6, fontFamily: fontUI, fontSize: 13.5, fontWeight: 600, color: RT.ink2 }}>Product Designer · CDO</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '5px 10px', borderRadius: 999, background: RT.green, border: `2px solid ${RT.ink}`, fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.ink, boxShadow: '0 2px 0 ' + RT.ink }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: RT.ink }} />
            Open to work
          </div>

          <hr style={{ border: 'none', borderTop: `2px dashed ${RT.glassBorder}`, margin: '18px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Location', 'Jakarta, ID'],
              ['Experience', '5+ years'],
              ['Languages', 'ID · EN'],
              ['Education', 'Telkom Univ. · 3.67 GPA'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.ink3, textTransform: 'uppercase', letterSpacing: 0.8 }}>{k}</span>
                <span style={{ fontFamily: fontUI, fontSize: 12.5, fontWeight: 600, color: RT.ink, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: `2px dashed ${RT.glassBorder}`, margin: '18px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Email', 'andri.saputro98@gmail.com'],
              ['LinkedIn', '/in/masscit'],
              ['Phone', '+62 822-1924-0385'],
            ].map(([k, v]) => (
              <a key={k} href="#" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 10, background: 'rgba(255,250,235,0.5)', border: `1.5px solid ${RT.glassBorder}`, textDecoration: 'none' }}>
                <span style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.ink3, textTransform: 'uppercase', letterSpacing: 0.8 }}>{k}</span>
                <span style={{ fontFamily: fontUI, fontSize: 12, fontWeight: 600, color: RT.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{v}</span>
              </a>
            ))}
          </div>

          <button style={{ marginTop: 16, width: '100%', padding: '11px 14px', borderRadius: 12, background: RT.accent, border: `2px solid ${RT.ink}`, color: 'white', fontFamily: fontUI, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 0 ' + RT.ink }}>
            Download CV ↓
          </button>
        </div>
      </WindowCard>
    </aside>
  );
}

// ─── HERO — opening like a file ──────────────────────────────────────────────
function Hero({ fontDisplay, fontUI }) {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal">
      <WindowCard title="resume.txt — currently open" padding={36} accent={RT.accent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.accentDeep, letterSpacing: 1, textTransform: 'uppercase' }}>
          <span style={{ width: 28, height: 1.5, background: RT.accent }} />
          opened from desktop · 2 sec ago
        </div>
        <h1 style={{ margin: '14px 0 0', fontFamily: fontDisplay, fontSize: 'clamp(40px, 5.6vw, 64px)', lineHeight: 1.18, fontWeight: 700, color: RT.ink, letterSpacing: -1.2 }}>
          Designs products that feel <span style={{ color: RT.accent, fontStyle: 'italic' }}>good</span> to use.
        </h1>
        <p style={{ marginTop: 28, maxWidth: 580, fontFamily: fontUI, fontSize: 15.5, fontWeight: 500, lineHeight: 1.65, color: RT.ink2 }}>
          Five years across SaaS, edutech, VR, and gamification — from leading a national-scale parachute simulator to shipping social metaverses with 10+ designer teams across SEA & Hong Kong.
        </p>
      </WindowCard>
    </section>
  );
}

// ─── PROJECT TILES — replaces metrics row ─────────────────────────────────
function CaseStudies({ fontDisplay, fontUI }) {
  const ref = useReveal();
  const studies = [
    { p: PROJECTS.parachute, headline: 'VR sim that saved 500M IDR/flight',  body: '100km² environments synced with hardware feedback. Lead design for the Indonesian Air Force Academy.', metric: '500M IDR', metricLabel: 'saved per flight' },
    { p: PROJECTS.vlux,      headline: 'Tooling for UE5 lighting artists',    body: 'Progressive disclosure for high-density technical settings. Monetization roadmap & marketplace strategy.', metric: 'UE5', metricLabel: 'pro tooling' },
    { p: PROJECTS.metaverse, headline: 'Social metaverse for mobile',         body: '10+ designers under my lead. Design system lifted asset production by 500%.', metric: '500%', metricLabel: 'asset throughput' },
  ];
  return (
    <section ref={ref} className="reveal" style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 12, padding: '0 4px' }}>
        <Kicker>selected work · 03 case studies</Kicker>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {studies.map(({ p, headline, body, metric, metricLabel }) => (
          <a key={p.title} href={p.href} className="glass glass-hover" style={{
            display: 'block', textDecoration: 'none', position: 'relative',
            background: 'rgba(255,250,238,0.55)',
            backdropFilter: 'blur(22px) saturate(150%)', WebkitBackdropFilter: 'blur(22px) saturate(150%)',
            border: `2px solid ${RT.glassBorder}`, borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 18px 36px -18px rgba(60,40,20,0.30), inset 0 1px 0 rgba(255,255,255,0.7)',
          }}>
            {/* thumbnail block */}
            <div style={{ aspectRatio: '16 / 9', background: `linear-gradient(135deg, ${p.accent}, oklch(from ${p.accent} calc(l - 0.12) c h))`, borderBottom: `2px solid ${RT.glassBorder}`, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 14 }}>
              <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 9px', borderRadius: 999, background: 'rgba(255,250,235,0.85)', border: `1.5px solid ${RT.ink}`, fontFamily: fontUI, fontSize: 10, fontWeight: 700, color: RT.ink, letterSpacing: 0.5, textTransform: 'uppercase' }}>{p.tag}</span>
              <div style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: RT.ink, lineHeight: 1, letterSpacing: -1 }}>{metric}<div style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.ink2, marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>{metricLabel}</div></div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: RT.ink, lineHeight: 1.2 }}>{headline}</div>
              <p style={{ margin: '8px 0 0', fontFamily: fontUI, fontSize: 13, fontWeight: 500, color: RT.ink2, lineHeight: 1.55 }}>{body}</p>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: fontUI, fontSize: 11.5, fontWeight: 700, color: RT.accentDeep, textTransform: 'uppercase', letterSpacing: 1 }}>{p.title}</span>
                <span style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: RT.ink }}>↗</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── EXPERIENCE — featured + compact two-column for older roles ──────────────
const SKILL_TAGS = ['All', 'Product', '3D', 'Leadership', 'SaaS'];

function ExperienceFull({ co, role, place, period, color, badgeColor, badgeLabel, summary, projects, quote, quoteAttr, fontDisplay, fontUI }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ marginTop: 12 }}>
      <WindowCard padding={0} accent={color}>
        <div style={{ padding: 28 }}>
          {badgeLabel && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: badgeColor, border: `2px solid ${RT.ink}`, fontFamily: fontUI, fontSize: 11, fontWeight: 800, color: RT.ink, boxShadow: '0 2.5px 0 ' + RT.ink, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap', marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: RT.ink }} />
              {badgeLabel}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: color, border: `2px solid ${RT.ink}`, boxShadow: '0 3px 0 ' + RT.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontDisplay, fontSize: 24, fontWeight: 700, color: RT.ink }}>{co[0]}</div>
            <div>
              <h3 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, color: RT.ink, letterSpacing: -0.5, lineHeight: 1.1 }}>{co}</h3>
              <div style={{ fontFamily: fontUI, fontSize: 14, fontWeight: 600, color: RT.ink2, marginTop: 4 }}>{role}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: fontUI, fontSize: 13, fontWeight: 700, color: RT.ink2, whiteSpace: 'nowrap' }}>{place} · {period}</div>
          </div>
          <p style={{ marginTop: 18, fontFamily: fontUI, fontSize: 14.5, fontWeight: 500, lineHeight: 1.65, color: RT.ink2, maxWidth: 720 }}>{summary}</p>
          {projects && projects.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <Kicker>projects</Kicker>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                {projects.map(p => (
                  <a key={p.title} href={p.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 8px 8px', borderRadius: 14, background: 'rgba(255,250,235,0.6)', border: `1.5px solid ${RT.glassBorder}`, textDecoration: 'none' }}>
                    <ProjectThumb p={p} size={36} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, color: RT.ink, lineHeight: 1.1 }}>{p.title}</div>
                      <div style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 600, color: RT.ink3, marginTop: 2 }}>{p.tag}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, color: RT.ink2 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {quote && (
            <div style={{ marginTop: 22, padding: '16px 18px', borderRadius: 14, background: 'rgba(255,250,235,0.5)', border: `1.5px solid ${RT.glassBorder}`, borderLeft: `4px solid ${color}` }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 15, fontStyle: 'italic', color: RT.ink, lineHeight: 1.5 }}>"{quote}"</div>
              <div style={{ fontFamily: fontUI, fontSize: 11.5, fontWeight: 700, color: RT.ink3, marginTop: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>— {quoteAttr}</div>
            </div>
          )}
        </div>
      </WindowCard>
    </div>
  );
}

function Experience({ fontDisplay, fontUI }) {
  const [skill, setSkill] = useState('All');
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal" style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, padding: '0 4px', flexWrap: 'wrap', gap: 20, rowGap: 18 }}>
        <div>
          <Kicker>experience · 03 places</Kicker>
          <h2 style={{ margin: '6px 0 0', fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: RT.ink, letterSpacing: -1, lineHeight: 1.2 }}>Where I've <span style={{ color: RT.accent, fontStyle: 'italic' }}>built</span></h2>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(255,250,235,0.5)', border: `1.5px solid ${RT.glassBorder}` }}>
          {SKILL_TAGS.map(s => (
            <button key={s} onClick={() => setSkill(s)} style={{
              padding: '6px 12px', borderRadius: 999, border: 'none',
              background: skill === s ? RT.ink : 'transparent',
              color: skill === s ? 'white' : RT.ink2,
              fontFamily: fontUI, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      <ExperienceFull fontDisplay={fontDisplay} fontUI={fontUI}
        co="Cube Studio" role="Founder · Product Designer · CDO"
        place="Jakarta" period="2021 — Now"
        color={RT.green} badgeColor={RT.green} badgeLabel="Currently leading"
        summary="Founded a multidisciplinary studio shipping VR sims, SaaS tooling, and brand work across SEA & Hong Kong. Lead design and team operations for 10+ designers and engineers."
        projects={[PROJECTS.parachute, PROJECTS.vlux, PROJECTS.edutech]}
        quote="Andri's design system lifted our asset production by 500% in the first quarter."
        quoteAttr="Cube Studio engineering lead [placeholder]" />

      <ExperienceFull fontDisplay={fontDisplay} fontUI={fontUI}
        co="FUTR Asia · Surge" role="Product Designer · Lead Design · Visual Designer"
        place="Jakarta" period="2022 — 2024"
        color={RT.yellow}
        summary="Led PataLand — a web-based social entertainment metaverse. Architected user-behavior tracking with custom triggers, managed the product lifecycle, and led technical discussions with developers. Shipped cross-platform across VR, desktop, and mobile."
        projects={[PROJECTS.pataland]}
        quote="836 registered accounts across 4 collaborated artists and 10+ social activities."
        quoteAttr="PataLand metrics" />

      <ExperienceFull fontDisplay={fontDisplay} fontUI={fontUI}
        co="Techpolitan" role="Business Development · Project Manager · 3D Design"
        place="Jakarta" period="2022 — 2023"
        color={RT.pink}
        summary="Built a mobile Metaverse integrating brands under PT. Walden Global Service into one social-ecosystem. Wore three hats — business development, project management, and 3D design — coordinating across brand stakeholders, engineering, and creative teams."
        projects={[PROJECTS.metaverse]}
        quote="Every design decision has a business consequence — and vice versa."
        quoteAttr="Personal reflection" />
    </section>
  );
}

// ─── HOW I WORK — replaces toolkit chip noise ────────────────────────────────
function HowIWork({ fontDisplay, fontUI }) {
  const ref = useReveal();
  const principles = [
    { n: '01', title: 'Systems first.', body: 'I build design systems before screens — once tokens and components are right, asset throughput compounds.' },
    { n: '02', title: 'Progressive disclosure.', body: 'Dense, technical UI is a craft. I hide complexity behind layered defaults so power users can dig and beginners stay calm.' },
    { n: '03', title: '3D is just another canvas.', body: 'I move freely between Figma, Blender, UE5 and Unity. Real materials and real space are part of the vocabulary now.' },
  ];
  return (
    <section ref={ref} className="reveal" style={{ marginTop: 32 }}>
      <WindowCard title="how_i_work.md" padding={28}>
        <h2 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, color: RT.ink, letterSpacing: -0.8 }}>How I work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 18 }}>
          {principles.map(({ n, title, body }) => (
            <div key={n}>
              <div style={{ fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, color: RT.accentDeep, letterSpacing: 1 }}>{n}</div>
              <h4 style={{ margin: '4px 0 8px', fontFamily: fontDisplay, fontSize: 19, fontWeight: 700, color: RT.ink, letterSpacing: -0.3 }}>{title}</h4>
              <p style={{ margin: 0, fontFamily: fontUI, fontSize: 13.5, fontWeight: 500, color: RT.ink2, lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
        {/* tool stack as small footnote */}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: `2px dashed ${RT.glassBorder}`, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.ink3, textTransform: 'uppercase', letterSpacing: 1 }}>Stack</span>
          <span style={{ fontFamily: fontUI, fontSize: 12.5, fontWeight: 600, color: RT.ink2 }}>Figma · Blender · Unreal 5 · Unity · Photoshop · Illustrator · Notion</span>
        </div>
      </WindowCard>
    </section>
  );
}

// ─── PROOF — awards / recognition ────────────────────────────────────────────
function Proof({ fontDisplay, fontUI }) {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal" style={{ marginTop: 16 }}>
      <WindowCard padding={26} accent={RT.yellow}>
        <Kicker>recognition</Kicker>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: 12 }}>
          <div>
            <div style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: RT.accent, lineHeight: 1, letterSpacing: -1 }}>3rd</div>
            <div style={{ fontFamily: fontUI, fontSize: 12.5, fontWeight: 600, color: RT.ink, marginTop: 4 }}>Place · Gemastik XII</div>
            <div style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 500, color: RT.ink3, marginTop: 2 }}>Game Application Development</div>
          </div>
          <div>
            <div style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: RT.accent, lineHeight: 1, letterSpacing: -1 }}>—</div>
            <div style={{ fontFamily: fontUI, fontSize: 12.5, fontWeight: 600, color: RT.ink, marginTop: 4 }}>Press / Feature [TBD]</div>
            <div style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 500, color: RT.ink3, marginTop: 2 }}>Add a Behance feature, podcast, or talk here.</div>
          </div>
          <div>
            <div style={{ fontFamily: fontDisplay, fontSize: 16, fontStyle: 'italic', color: RT.ink, lineHeight: 1.4 }}>"Add a short client testimonial here — one sentence, one name, one role."</div>
            <div style={{ fontFamily: fontUI, fontSize: 10.5, fontWeight: 700, color: RT.ink3, marginTop: 8, letterSpacing: 0.8, textTransform: 'uppercase' }}>— Client name [placeholder]</div>
          </div>
        </div>
      </WindowCard>
    </section>
  );
}

function Contact({ fontDisplay, fontUI }) {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal" style={{ marginTop: 32 }}>
      <WindowCard padding={32}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 28, alignItems: 'center' }}>
          <div>
            <Kicker>let's work together</Kicker>
            <h2 style={{ margin: '10px 0 0', fontFamily: fontDisplay, fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, color: RT.ink, lineHeight: 1.1, letterSpacing: -1 }}>
              See you in your <span style={{ color: RT.accent, fontStyle: 'italic' }}>next project</span>.
            </h2>
            <p style={{ marginTop: 16, fontFamily: fontUI, fontSize: 14.5, fontWeight: 500, color: RT.ink2, maxWidth: 460 }}>Open to product design roles, lead/CDO contracts, and interactive 3D collaborations across SEA.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Email', 'andri.saputro98@gmail.com', RT.yellow],
              ['LinkedIn', 'linkedin.com/in/masscit', RT.green],
              ['Phone', '+62 822-1924-0385', RT.pink],
            ].map(([k, v, c]) => (
              <Magnetic key={k} strength={0.13}>
                <a href="#" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 15px', borderRadius: 12, background: c, border: `2px solid ${RT.ink}`, textDecoration: 'none', boxShadow: '0 2.5px 0 ' + RT.ink }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: fontUI, fontSize: 10.5, fontWeight: 700, color: RT.ink2, textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div>
                    <div style={{ fontFamily: fontUI, fontSize: 13.5, fontWeight: 600, color: RT.ink, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
                  </div>
                  <span style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: RT.ink }}>↗</span>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </WindowCard>
    </section>
  );
}

// ─── DOOR — memorable "back to room" CTA ─────────────────────────────────────
function BackToRoomDoor({ fontDisplay, fontUI }) {
  return (
    <section style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
      <Magnetic strength={0.2}>
        <a href="#room" style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px',
          borderRadius: 999,
          background: `linear-gradient(135deg, oklch(0.92 0.10 90), ${RT.yellow})`,
          border: `2.5px solid ${RT.ink}`, boxShadow: '0 5px 0 ' + RT.ink,
          textDecoration: 'none',
        }}>
          <div style={{ position: 'relative', width: 36, height: 44, background: RT.accent, border: `2px solid ${RT.ink}`, borderRadius: '6px 6px 2px 2px' }}>
            <div style={{ position: 'absolute', right: 5, top: '50%', width: 5, height: 5, borderRadius: '50%', background: RT.ink }} />
          </div>
          <div>
            <div style={{ fontFamily: fontUI, fontSize: 11, fontWeight: 700, color: RT.ink2, textTransform: 'uppercase', letterSpacing: 1 }}>Door · click to leave</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: RT.ink, marginTop: 2 }}>Back to the room →</div>
          </div>
        </a>
      </Magnetic>
    </section>
  );
}

function ResumeApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_V2);
  const [theme, toggleTheme] = useTheme();
  const fontDisplay = FONT_STACKS_V2[t.displayFont] || FONT_STACKS_V2["DM Serif"];
  const fontUI = BODY_STACKS_V2[t.bodyFont] || BODY_STACKS_V2.Jakarta;
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {t.showRoomBackdrop && theme === 'light' && <ResumeRoom theme={theme} />}
      {theme === 'dark' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${RT.accent} 0%, transparent 65%)`, opacity: 0.18, filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${RT.yellow} 0%, transparent 65%)`, opacity: 0.10, filter: 'blur(40px)' }} />
        </div>
      )}
      <CursorSpotlight />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <TopBar fontUI={fontUI} theme={theme} toggleTheme={toggleTheme} />
        <main style={{ maxWidth: t.panelWidth, margin: '0 auto', padding: '110px 24px 60px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18, alignItems: 'start' }}>
          <Sidebar fontDisplay={fontDisplay} fontUI={fontUI} />
          <div>
            <Hero fontDisplay={fontDisplay} fontUI={fontUI} />
            <CaseStudies fontDisplay={fontDisplay} fontUI={fontUI} />
            <Experience fontDisplay={fontDisplay} fontUI={fontUI} />
            <HowIWork fontDisplay={fontDisplay} fontUI={fontUI} />
            <Proof fontDisplay={fontDisplay} fontUI={fontUI} />
            <Contact fontDisplay={fontDisplay} fontUI={fontUI} />
            <BackToRoomDoor fontDisplay={fontDisplay} fontUI={fontUI} />
            <footer style={{ marginTop: 30, padding: '18px 6px', display: 'flex', justifyContent: 'space-between', fontFamily: fontUI, fontWeight: 600, fontSize: 11.5, color: RT.ink2 }}>
              <span>© 2026 Andri Saputro</span>
              <span>resume · cozy edition</span>
            </footer>
          </div>
        </main>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Typography" />
        <TweakSelect label="Display font" value={t.displayFont}
          options={['Recoleta','DM Serif','Caprasimo','Sniglet','Fraunces']}
          onChange={(v) => setTweak('displayFont', v)} />
        <TweakSelect label="Body font" value={t.bodyFont}
          options={['Quicksand','Nunito','Jakarta']}
          onChange={(v) => setTweak('bodyFont', v)} />
        <TweakSection label="Layout" />
        <TweakSlider label="Page width" value={t.panelWidth} min={900} max={1280} step={20} unit="px"
          onChange={(v) => setTweak('panelWidth', v)} />
        <TweakToggle label="Show room backdrop" value={t.showRoomBackdrop}
          onChange={(v) => setTweak('showRoomBackdrop', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ResumeApp />);
