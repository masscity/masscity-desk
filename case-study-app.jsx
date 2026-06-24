// Project page — data-driven, reads from window.PROJECT_CONTENT (set by project-content.jsx)
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC, useCallback: useCallbackC } = React;

gsap.registerPlugin(ScrollTrigger);

const PC = window.PROJECT_CONTENT;
const HERO = PC.hero;
const TOTAL_PROJECTS = window.PORTFOLIO_PROJECTS ? window.PORTFOLIO_PROJECTS.length : 5;

const SECTIONS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'problem',    label: 'Problem' },
  { id: 'process',    label: 'Process' },
  { id: 'solution',   label: 'Solution' },
  { id: 'gallery',    label: 'Gallery' },
  { id: 'outcome',    label: 'Outcome' },
  { id: 'reflection', label: 'Reflection' },
];

const FONTS = {
  display: '"DM Serif Display", "Fraunces", Georgia, serif',
  ui: '"Plus Jakarta Sans", "Quicksand", system-ui, sans-serif',
  mono: '"JetBrains Mono", monospace',
};

function resolveAccent(key) {
  return RT[key] || RT.accent;
}

// ─── GSAP scroll animation hook ─────────────────────────────────────────────
function useGsapReveal(options = {}) {
  const ref = useRefC(null);
  useEffectC(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: options.y ?? 50,
        x: options.x ?? 0,
        opacity: 0,
        duration: options.duration ?? 1,
        delay: options.delay ?? 0,
        ease: options.ease ?? 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, []);
  return ref;
}

function useGsapStagger(selector, options = {}) {
  const ref = useRefC(null);
  useEffectC(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: options.y ?? 40,
        opacity: 0,
        duration: options.duration ?? 0.8,
        stagger: options.stagger ?? 0.12,
        ease: options.ease ?? 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}

// ─── Parallax Hero ──────────────────────────────────────────────────────────
function ProjectHero({ p }) {
  const heroRef = useRefC(null);
  const bgRef = useRefC(null);
  const titleRef = useRefC(null);
  const taglineRef = useRefC(null);

  const projectIdx = (() => {
    const list = window.PORTFOLIO_PROJECTS || [];
    const i = list.findIndex(pp => pp.slug === p.slug);
    return i >= 0 ? i + 1 : 1;
  })();

  useEffectC(() => {
    const el = heroRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: 120,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
      gsap.to(titleRef.current, {
        y: -40,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.3 },
      });
      gsap.from(titleRef.current, { y: 80, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });
      gsap.from(taglineRef.current, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.5 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-parallax" style={{ marginBottom: 0, paddingBottom: 80 }}>
      <div ref={bgRef} className="hero-parallax__bg" style={{
        background: `linear-gradient(170deg, oklch(0.82 0.04 200) 0%, ${p.cover} 35%, ${p.coverDeep} 100%)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 25%, rgba(255,250,200,0.50), transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(0,40,30,0.20), transparent 55%)' }} />
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${(i * 73 + 7) % 100}%`, top: `${(i * 37 + 15) % 80}%`,
            width: 4, height: 4, borderRadius: '50%',
            background: 'oklch(0.96 0.06 90 / 0.5)', boxShadow: '0 0 10px oklch(0.96 0.06 90)',
            animation: `mote ${9 + (i % 4)}s ease-in-out ${i * 0.6}s infinite`,
          }} />
        ))}
      </div>

      <div style={{ position: 'absolute', top: 100, left: 32, zIndex: 3 }}>
        <div className="hud-mono" style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(20,15,8,0.65)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.20)', fontSize: 11, color: 'rgba(255,250,235,0.92)' }}>
          ▸ {HERO.metric} {HERO.metricLabel}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 100, right: 32, zIndex: 3 }}>
        <div className="hud-mono" style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(20,15,8,0.65)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.20)', fontSize: 11, color: 'rgba(255,250,235,0.92)' }}>
          PROJECT {String(projectIdx).padStart(2, '0')} / {String(TOTAL_PROJECTS).padStart(2, '0')}
        </div>
      </div>

      <div className="hero-parallax__content" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ maxWidth: 720 }}>
          <div className="hud-mono" style={{ display: 'inline-block', marginBottom: 16, padding: '6px 14px', borderRadius: 999, background: 'rgba(20,15,8,0.55)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.18)', fontSize: 11, color: 'rgba(255,250,235,0.90)' }}>
            project · {PC.tags}
          </div>
          <h1 ref={titleRef} style={{
            margin: 0, fontFamily: FONTS.display, fontSize: 'clamp(52px, 8vw, 100px)',
            fontWeight: 700, color: 'oklch(0.18 0.04 50)', letterSpacing: -3, lineHeight: 0.95,
            whiteSpace: 'pre-line',
          }}>
            {p.title}
          </h1>
          <p ref={taglineRef} style={{
            marginTop: 20, fontFamily: FONTS.display, fontSize: 'clamp(20px, 2.6vw, 30px)',
            fontStyle: 'italic', fontWeight: 500, color: 'oklch(0.30 0.06 50)',
            letterSpacing: -0.5, lineHeight: 1.35, maxWidth: 520,
          }}>
            {p.tagline}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 3, textAlign: 'center' }}>
        <div className="scroll-hint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span className="hud-mono" style={{ fontSize: 10, color: 'oklch(0.35 0.04 50)', letterSpacing: 1.5 }}>scroll to explore</span>
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" stroke="oklch(0.35 0.04 50)" strokeWidth="1.5">
            <rect x="1" y="1" width="18" height="26" rx="9" />
            <circle cx="10" cy="8" r="2.5" fill="oklch(0.35 0.04 50)" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── Meta strip — mission briefing style ────────────────────────────────────
function MetaStrip({ p }) {
  const ref = useGsapStagger('.meta-item', { stagger: 0.08, y: 30 });
  const facts = [
    ['Client', p.client],
    ['Role', p.role],
    ['Team', p.team],
    ['Timeline', p.period],
    ['Platform', p.platform],
    ['Tools', p.tools],
  ];
  return (
    <div ref={ref} style={{ marginBottom: 50, maxWidth: 1180, margin: '0 auto 50px', padding: '0 32px' }}>
      <WindowCard padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {facts.map(([k, v], i) => (
            <div key={k} className="meta-item" style={{
              padding: '20px 22px',
              borderRight: (i % 3 !== 2) ? `1.5px solid ${RT.glassBorder}` : 'none',
              borderTop: i >= 3 ? `1.5px solid ${RT.glassBorder}` : 'none',
            }}>
              <div className="hud-mono" style={{ fontSize: 10, color: RT.ink3, letterSpacing: 1.2 }}>{k}</div>
              <div style={{ marginTop: 7, fontFamily: FONTS.display, fontSize: 15, fontWeight: 600, color: RT.ink, lineHeight: 1.3 }}>{v}</div>
            </div>
          ))}
        </div>
      </WindowCard>
    </div>
  );
}

// ─── Section heading ────────────────────────────────────────────────────────
function SectionHead({ id, kicker, title, sub }) {
  const ref = useGsapReveal({ y: 40 });
  return (
    <header ref={ref} id={id} style={{ scrollMarginTop: 110, marginBottom: 28 }}>
      <Kicker>{kicker}</Kicker>
      <h2 style={{ margin: '10px 0 0', fontFamily: FONTS.display, fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 700, color: RT.ink, letterSpacing: -1.5, lineHeight: 1.05, textWrap: 'balance' }}>
        {title}
      </h2>
      {sub && <p style={{ margin: '12px 0 0', fontFamily: FONTS.ui, fontSize: 17, fontWeight: 500, color: RT.ink2, lineHeight: 1.6, maxWidth: 640 }}>{sub}</p>}
    </header>
  );
}

// ─── Problem ────────────────────────────────────────────────────────────────
function Problem() {
  const d = PC.problem;
  const statRef = useGsapReveal({ y: 60, duration: 1.2 });
  const constraintsRef = useGsapReveal({ x: 40, y: 0, delay: 0.2 });

  return (
    <section style={{ marginBottom: 80 }}>
      <SectionHead id="problem" kicker="01 · the problem" title={d.title} />

      <div ref={statRef} style={{ marginBottom: 32 }}>
        <div className="glass" style={{
          position: 'relative', padding: '48px 40px', background: RT.glassFill,
          border: `2px solid ${RT.glassBorder}`, borderRadius: 24,
          backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${RT.accent} 0%, transparent 70%)`, opacity: 0.12, filter: 'blur(30px)' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 'clamp(56px, 7vw, 80px)', fontWeight: 700, color: RT.accent, lineHeight: 1, letterSpacing: -3 }}>
              <Counter to={d.statValue} suffix={d.statSuffix} dur={1800} />
            </span>
            <span className="hud-mono" style={{ fontSize: 13, color: RT.ink2 }}>{d.statUnit}</span>
          </div>
          <p style={{ margin: 0, fontFamily: FONTS.ui, fontSize: 16.5, fontWeight: 500, lineHeight: 1.7, color: RT.ink2, maxWidth: 600 }}>
            {d.description}
          </p>
        </div>
      </div>

      <div ref={constraintsRef}>
        <div className="glass" style={{
          padding: 28, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 20,
          backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderLeft: `4px solid ${RT.accent}`,
        }}>
          <div className="hud-mono" style={{ fontSize: 11, color: RT.accent, letterSpacing: 1.5, marginBottom: 14 }}>▸ constraints</div>
          <ul className="prose" style={{ margin: 0 }}>
            {d.constraints.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          <p style={{ margin: '16px 0 0', fontFamily: FONTS.ui, fontSize: 15, fontWeight: 600, color: RT.ink, lineHeight: 1.5 }}>
            <strong>{d.summary}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Process — vertical timeline ────────────────────────────────────────────
function Process() {
  const d = PC.process;
  const timelineRef = useRefC(null);
  const lineRef = useRefC(null);

  useEffectC(() => {
    const el = timelineRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 40%', scrub: 0.8 },
        }
      );
      gsap.utils.toArray('.timeline-step').forEach((step, i) => {
        gsap.from(step, {
          x: i % 2 === 0 ? -40 : 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 82%', toggleActions: 'play none none none' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section style={{ marginBottom: 80 }}>
      <SectionHead id="process" kicker="02 · process" title={d.title} sub={d.sub} />

      <div ref={timelineRef} style={{ position: 'relative', paddingLeft: 80 }}>
        <div className="timeline-line">
          <div ref={lineRef} className="timeline-line__fill" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {d.steps.map((s, i) => (
            <div key={s.n} className="timeline-step" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -50, top: 24 }} className="timeline-dot" />
              <div className="glass glass-hover" style={{
                position: 'relative', padding: '26px 28px',
                background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 20,
                backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
                boxShadow: '0 14px 28px -14px rgba(40,25,10,0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: RT.accent, lineHeight: 1, letterSpacing: -1 }}>{s.n}</div>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: RT.ink, letterSpacing: -0.5, lineHeight: 1.2 }}>{s.label}</h3>
                    <p style={{ margin: '10px 0 0', fontFamily: FONTS.ui, fontSize: 15, fontWeight: 500, lineHeight: 1.65, color: RT.ink2 }}>{s.body}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution — floating feature cards ──────────────────────────────────────
function Solution() {
  const d = PC.solution;
  const ref = useRefC(null);

  useEffectC(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          y: 60 + i * 15,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ marginBottom: 80 }}>
      <SectionHead id="solution" kicker="03 · solution" title={d.title} />

      <div style={{ marginBottom: 24 }}>
        <div className="glass" style={{
          position: 'relative', background: `linear-gradient(135deg, ${HERO.cover}, ${HERO.coverDeep})`,
          border: `2px solid ${RT.glassBorder}`, borderRadius: 24, aspectRatio: '21 / 10', overflow: 'hidden',
          boxShadow: '0 24px 50px -22px rgba(40,25,10,0.50)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.30), transparent 55%), radial-gradient(circle at 70% 75%, rgba(0,0,0,0.20), transparent 55%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, padding: 34 }}>
            {d.heroLabels.map((label, i) => (
              <div key={label} style={{
                background: 'rgba(255,250,235,0.92)', border: '2.5px solid oklch(0.28 0.04 50)',
                borderRadius: 16, boxShadow: '0 14px 28px -10px rgba(0,0,0,0.35)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}>
                <div style={{ padding: '9px 14px', borderBottom: `1.5px solid ${RT.glassBorder}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: RT.accent, border: '1px solid oklch(0.28 0.04 50)' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: RT.yellow, border: '1px solid oklch(0.28 0.04 50)' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: RT.green, border: '1px solid oklch(0.28 0.04 50)' }} />
                  <span className="hud-mono" style={{ marginLeft: 6, fontSize: 10, color: RT.ink2 }}>{label}</span>
                </div>
                <div style={{ flex: 1, background: `linear-gradient(180deg, oklch(0.88 0.06 ${230 - i * 30}), oklch(0.62 0.08 ${220 - i * 30}))`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="hud-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.80)' }}>screenshot placeholder</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: 18 }}>
            <span className="hud-mono" style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(20,15,8,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', fontSize: 10, color: 'rgba(255,250,235,0.85)' }}>
              {d.heroLabels.length} panels
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {d.features.map((f) => (
          <div key={f.title} className="feature-card glass glass-hover" style={{
            padding: 26, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 20,
            backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            boxShadow: '0 14px 28px -14px rgba(40,25,10,0.28)',
          }}>
            <div style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 999, background: resolveAccent(f.accentKey), border: '1.5px solid oklch(0.28 0.04 50)', fontFamily: FONTS.ui, fontSize: 10.5, fontWeight: 800, color: 'oklch(0.28 0.04 50)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{f.tag}</div>
            <h3 style={{ margin: '14px 0 0', fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: RT.ink, letterSpacing: -0.5, lineHeight: 1.2 }}>{f.title}</h3>
            <p style={{ margin: '10px 0 0', fontFamily: FONTS.ui, fontSize: 14.5, fontWeight: 500, lineHeight: 1.65, color: RT.ink2 }}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Gallery — image placeholder grid ───────────────────────────────────────
function Gallery() {
  const ref = useRefC(null);
  const items = PC.gallery;

  useEffectC(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
          y: 30, opacity: 0, scale: 0.97, duration: 0.7, delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ marginBottom: 80 }}>
      <SectionHead id="gallery" kicker="04 · gallery" title="The project in action." sub="Screenshots, environments, and documentation from the project." />

      <div className="gallery-grid">
        {items.map((item, i) => (
          <div key={i} className="gallery-item">
            <div style={{
              width: '100%', height: '100%', minHeight: 180,
              background: `linear-gradient(135deg, oklch(0.82 0.04 ${145 + i * 25}) 0%, oklch(0.60 0.06 ${140 + i * 25}) 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center', padding: 20 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="oklch(0.28 0.04 50)" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                  <rect x="2" y="2" width="20" height="20" rx="3" />
                  <circle cx="8.5" cy="8.5" r="2" />
                  <path d="M22 15l-5-5L5 22" />
                </svg>
                <div className="hud-mono" style={{ marginTop: 10, fontSize: 10, color: 'oklch(0.28 0.04 50)', opacity: 0.5 }}>add image</div>
              </div>
            </div>
            <div className="gallery-item__label">
              <span style={{ fontFamily: FONTS.ui, fontSize: 12, fontWeight: 600, color: 'rgba(255,250,235,0.90)' }}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Outcome — animated counters ────────────────────────────────────────────
function Outcome() {
  const d = PC.outcome;
  const ref = useRefC(null);

  useEffectC(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.outcome-stat').forEach((stat, i) => {
        gsap.from(stat, {
          y: 50, opacity: 0, duration: 0.8, delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: stat, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ marginBottom: 80 }}>
      <SectionHead id="outcome" kicker="05 · outcome" title={d.title} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 28 }}>
        {d.stats.map(s => (
          <div key={s.label} className="outcome-stat glass" style={{
            padding: 30, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 20,
            backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          }}>
            <div className="stat-block">
              <div className="stat-block__value" style={{ fontSize: 'clamp(48px, 5vw, 64px)', color: resolveAccent(s.accentKey) }}>
                <Counter to={s.val} suffix={s.suffix} dur={1600} />
              </div>
              <div className="stat-block__label" style={{ fontSize: 12, color: RT.ink2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{
        padding: 36, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 24,
        backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        borderLeft: `5px solid ${RT.accent}`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${RT.accent} 0%, transparent 70%)`, opacity: 0.10, filter: 'blur(30px)' }} />
        <div className="hud-mono" style={{ fontSize: 11, color: RT.accent, letterSpacing: 1.5, marginBottom: 16 }}>▸ key impact</div>
        <blockquote style={{
          margin: 0, fontFamily: FONTS.display, fontSize: 'clamp(22px, 2.5vw, 28px)',
          fontWeight: 600, fontStyle: 'italic', color: RT.ink, lineHeight: 1.5,
          letterSpacing: -0.4, maxWidth: 720,
        }}>
          {d.impactQuote}
        </blockquote>
        <div style={{ marginTop: 18, fontFamily: FONTS.ui, fontSize: 12, fontWeight: 700, color: RT.ink3, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {d.impactNote}
        </div>
      </div>
    </section>
  );
}

// ─── Reflection ─────────────────────────────────────────────────────────────
function Reflection() {
  const d = PC.reflection;
  const ref = useRefC(null);

  useEffectC(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reflection-card').forEach((card, i) => {
        gsap.from(card, {
          y: 40, opacity: 0, duration: 0.8, delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ marginBottom: 60 }}>
      <SectionHead id="reflection" kicker="06 · reflection" title={d.title} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        {d.cards.map((item, i) => (
          <div key={i} className="reflection-card glass glass-hover" style={{
            padding: 26, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 20,
            backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            boxShadow: '0 10px 24px -12px rgba(40,25,10,0.25)',
          }}>
            <h3 style={{ margin: '0 0 10px', fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: RT.ink, letterSpacing: -0.3, lineHeight: 1.25 }}>{item.heading}</h3>
            <p style={{ margin: 0, fontFamily: FONTS.ui, fontSize: 14.5, fontWeight: 500, lineHeight: 1.65, color: RT.ink2 }}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── On this page (sticky sidebar) ──────────────────────────────────────────
function OnThisPage() {
  const [active, setActive] = useStateC(SECTIONS[0].id);
  useEffectC(() => {
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px' });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <aside style={{ position: 'sticky', top: 110, alignSelf: 'start' }}>
      <div className="glass" style={{ padding: 18, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 18, backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' }}>
        <div className="hud-mono" style={{ fontSize: 10, color: RT.accent, letterSpacing: 1.5, marginBottom: 12 }}>▸ on this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8,
              background: active === s.id ? RT.innerFill : 'transparent',
              color: active === s.id ? RT.ink : RT.ink2,
              fontFamily: FONTS.ui, fontSize: 13, fontWeight: active === s.id ? 700 : 500,
              textDecoration: 'none', transition: 'background 0.2s, color 0.2s',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: active === s.id ? RT.accent : RT.glassBorderHi, transition: 'background 0.2s' }} />
              {s.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="glass" style={{ marginTop: 14, padding: 18, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 18, backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' }}>
        <div className="hud-mono" style={{ fontSize: 10, color: RT.accent, letterSpacing: 1.5, marginBottom: 12 }}>▸ navigate</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="Resume.html" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: RT.innerFill, border: `1.5px solid ${RT.glassBorder}`, textDecoration: 'none', fontFamily: FONTS.ui, fontSize: 12.5, fontWeight: 600, color: RT.ink }}>
            <span>Read the resume</span> <span>↗</span>
          </a>
          <a href="Portfolio.html" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: RT.innerFill, border: `1.5px solid ${RT.glassBorder}`, textDecoration: 'none', fontFamily: FONTS.ui, fontSize: 12.5, fontWeight: 600, color: RT.ink }}>
            <span>All projects</span> <span>↗</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

// ─── Prev / Next ────────────────────────────────────────────────────────────
function PrevNext({ slug }) {
  const list = window.PORTFOLIO_PROJECTS || [];
  const idx = list.findIndex(p => p.slug === slug);
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const card = (p, dir) => (
    <a href={p.href} style={{ textDecoration: 'none', flex: 1 }}>
      <div className="glass glass-hover" style={{
        padding: 24, background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 20,
        backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderLeft: dir === 'next' ? `4px solid ${RT.accent}` : `2px solid ${RT.glassBorder}`,
        borderRight: dir === 'prev' ? `4px solid ${RT.accent}` : `2px solid ${RT.glassBorder}`,
        textAlign: dir === 'prev' ? 'left' : 'right',
      }}>
        <span className="hud-mono" style={{ fontSize: 10, color: RT.accent, letterSpacing: 1.5 }}>
          {dir === 'prev' ? '← previous' : 'next →'}
        </span>
        <div style={{ marginTop: 8, fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: RT.ink, letterSpacing: -0.5, lineHeight: 1.15 }}>{p.title}</div>
        <div style={{ marginTop: 4, fontFamily: FONTS.ui, fontSize: 12.5, fontWeight: 600, color: RT.ink2 }}>{p.client} · {p.period}</div>
      </div>
    </a>
  );
  return (
    <section style={{ marginTop: 60, display: 'flex', gap: 18 }}>
      {card(prev, 'prev')}
      {card(next, 'next')}
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function ProjectApp() {
  const [theme, toggleTheme] = useTheme();

  useEffectC(() => {
    ScrollTrigger.refresh();
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {theme === 'light' ? <SiteRoom theme={theme} /> : <DarkAmbient />}
      <CursorSpotlight />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <SiteTopBar fontUI={FONTS.ui} theme={theme} toggleTheme={toggleTheme} current="Project" />
        <ProjectHero p={HERO} />
        <MetaStrip p={HERO} />
        <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px 60px' }}>
          <div id="overview" style={{ scrollMarginTop: 110 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 44, alignItems: 'start' }}>
            <div>
              <Problem />
              <Process />
              <Solution />
              <Gallery />
              <Outcome />
              <Reflection />
            </div>
            <OnThisPage />
          </div>
          <PrevNext slug={HERO.slug} />
          <footer style={{ marginTop: 60, padding: '22px 6px', display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.ui, fontWeight: 600, fontSize: 12, color: RT.ink2 }}>
            <span>© 2026 Andri Saputro</span>
            <span>Designed in Jakarta · made with care</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProjectApp />);
