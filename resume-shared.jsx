// Hi-fi resume primitives — Ooblets-inspired cozy glass
// Three-tier color system: ONE hero coral · muted sage/wheat/terracotta for roles
const RT_LIGHT = {
  bg0: 'oklch(0.96 0.025 75)',        // top of warm cream gradient
  bg1: 'oklch(0.92 0.04 65)',         // bottom — adds depth
  glass: 'rgba(255, 248, 232, 0.30)',
  glassFill: 'rgba(255, 250, 238, 0.55)',
  glassBorder: 'rgba(110, 75, 45, 0.28)',   // bumped up for real edges
  glassBorderHi: 'rgba(110, 75, 45, 0.42)',
  cream: 'oklch(0.97 0.025 85)',
  ink: 'oklch(0.28 0.04 50)',         // warmer cocoa
  ink2: 'oklch(0.44 0.035 55)',
  ink3: 'oklch(0.60 0.025 55)',
  accent: 'oklch(0.72 0.16 45)',      // HERO — warm coral, the only "loud" color
  accentDeep: 'oklch(0.52 0.13 42)',  // darker coral for kickers/links
  // Role tiers — desaturated so three big cards don't shout
  yellow: 'oklch(0.86 0.085 92)',     // wheat (Paradimensi)
  green: 'oklch(0.80 0.06 145)',      // sage (Cube)
  pink: 'oklch(0.78 0.075 38)',       // terracotta (Techpolitan)
  wall: 'oklch(0.82 0.04 70)',
  wood: 'oklch(0.78 0.06 75)',
  // Scrim tints for inner cards (against page bg)
  innerFill: 'rgba(255, 248, 232, 0.6)',
  innerBorder: 'rgba(110, 75, 45, 0.22)',
  fontDisplay: '"Fraunces", "Cooper", Georgia, serif',
  fontUI: '"Quicksand", "Nunito", system-ui, sans-serif',
  fontLabel: '"Nunito", "Quicksand", system-ui, sans-serif',
};

const RT_DARK = {
  bg0: 'oklch(0.22 0.025 50)',        // deep cocoa top
  bg1: 'oklch(0.16 0.03 45)',         // deeper bottom
  glass: 'rgba(50, 35, 22, 0.30)',
  glassFill: 'rgba(60, 42, 28, 0.55)',
  glassBorder: 'rgba(255, 235, 200, 0.18)',
  glassBorderHi: 'rgba(255, 235, 200, 0.30)',
  cream: 'oklch(0.30 0.03 50)',
  ink: 'oklch(0.94 0.02 80)',         // cream text
  ink2: 'oklch(0.78 0.025 75)',
  ink3: 'oklch(0.62 0.025 70)',
  accent: 'oklch(0.78 0.16 50)',      // coral pops harder on dark
  accentDeep: 'oklch(0.85 0.14 55)',
  yellow: 'oklch(0.72 0.10 92)',
  green: 'oklch(0.68 0.07 145)',
  pink: 'oklch(0.66 0.08 38)',
  wall: 'oklch(0.30 0.03 50)',
  wood: 'oklch(0.32 0.04 55)',
  innerFill: 'rgba(40, 28, 18, 0.55)',
  innerBorder: 'rgba(255, 235, 200, 0.16)',
  fontDisplay: '"Fraunces", "Cooper", Georgia, serif',
  fontUI: '"Quicksand", "Nunito", system-ui, sans-serif',
  fontLabel: '"Nunito", "Quicksand", system-ui, sans-serif',
};

// RT is a mutable proxy — toggling theme reassigns props in place
const RT = { ...RT_LIGHT };

function applyTheme(mode) {
  const src = mode === 'dark' ? RT_DARK : RT_LIGHT;
  Object.keys(src).forEach(k => { RT[k] = src[k]; });
  // Update document bg gradient + scrollbar
  document.documentElement.dataset.theme = mode;
  document.body.style.background = `linear-gradient(180deg, ${src.bg0} 0%, ${src.bg1} 100%)`;
  document.body.style.color = src.ink;
}

const { useEffect, useRef, useState } = React;

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // fallback: ensure visible no matter what
    const fallback = setTimeout(() => el.classList.add('in'), 600);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((x) => {
        if (x.isIntersecting || x.intersectionRatio > 0) {
          x.target.classList.add('in');
          io.unobserve(x.target);
        }
      }),
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => { clearTimeout(fallback); io.disconnect(); };
  }, []);
  return ref;
}

function useTilt(strength = 6) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--tx', (-py * strength).toFixed(2) + 'deg');
      el.style.setProperty('--ty', (px * strength).toFixed(2) + 'deg');
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    };
    const reset = () => { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); };
    el.addEventListener('mousemove', onMove); el.addEventListener('mouseleave', reset);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', reset); };
  }, [strength]);
  return ref;
}

function Counter({ to, suffix = '', dur = 1400, format = (n) => n }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf, started = false;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, dur]);
  return <span ref={ref}>{format(v)}{suffix}</span>;
}

function Magnetic({ children, strength = 0.3, style = {}, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      el.style.transform = `translate(${(e.clientX - cx) * strength}px, ${(e.clientY - cy) * strength}px)`;
    };
    const reset = () => { el.style.transform = ''; };
    const parent = el.parentElement;
    parent.addEventListener('mousemove', onMove); parent.addEventListener('mouseleave', reset);
    return () => { parent.removeEventListener('mousemove', onMove); parent.removeEventListener('mouseleave', reset); };
  }, [strength]);
  return <span ref={ref} style={{ display: 'inline-block', transition: 'transform 0.25s cubic-bezier(.2,.8,.2,1)', ...style }} {...rest}>{children}</span>;
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const jakarta = new Date(now.getTime() + (now.getTimezoneOffset() + 420) * 60000);
  const hh = String(jakarta.getHours()).padStart(2, '0');
  const mm = String(jakarta.getMinutes()).padStart(2, '0');
  return (
    <span style={{ fontFamily: RT.fontUI, fontSize: 13, fontWeight: 600, color: RT.ink, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: RT.green, boxShadow: '0 0 10px ' + RT.green }} />
      Jakarta · {hh}:{mm}
    </span>
  );
}

function CursorSpotlight() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = (e) => { el.style.setProperty('--sx', e.clientX + 'px'); el.style.setProperty('--sy', e.clientY + 'px'); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} style={{
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
    background: `radial-gradient(420px circle at var(--sx,50%) var(--sy,50%), oklch(0.95 0.10 90 / 0.18), transparent 60%)`,
  }} />;
}

// Chunky Ooblets-style glass panel — thick rounded, cream-tinted, soft drop shadow
function Glass({ children, style = {}, hoverable = true, padding = 26, radius = 28, ...rest }) {
  return (
    <div className={`glass ${hoverable ? 'glass-hover' : ''}`} style={{
      position: 'relative',
      background: RT.glassFill,
      backdropFilter: 'blur(22px) saturate(140%)',
      WebkitBackdropFilter: 'blur(22px) saturate(140%)',
      border: `2.5px solid ${RT.glassBorder}`,
      borderRadius: radius,
      padding,
      overflow: 'hidden',
      boxShadow: '0 18px 36px -18px rgba(60,30,15,0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
      ...style,
    }} {...rest}>
      {children}
    </div>
  );
}

function Kicker({ children, style = {} }) {
  return <span style={{ fontFamily: RT.fontUI, fontSize: 12, fontWeight: 700, color: RT.accentDeep, letterSpacing: 1.2, textTransform: 'uppercase', ...style }}>{children}</span>;
}

// Theme hook — flips the RT proxy in place + persists, returns [mode, toggle]
function useTheme() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('resume-theme') || 'light'; } catch { return 'light'; }
  });
  // Apply synchronously DURING render so children read the right RT values on the same pass.
  // applyTheme is idempotent and cheap (just object-key assignment + 2 inline style writes).
  applyTheme(mode);
  useEffect(() => {
    try { localStorage.setItem('resume-theme', mode); } catch {}
  }, [mode]);
  const toggle = () => setMode(m => m === 'light' ? 'dark' : 'light');
  return [mode, toggle];
}

Object.assign(window, { RT, applyTheme, useTheme, useReveal, useTilt, Counter, Magnetic, LiveClock, CursorSpotlight, Glass, Kicker });

// ─── Shared chrome (used on Resume, Portfolio, Project pages) ────────────────
function SiteTopBar({ fontUI, theme, toggleTheme, current = 'Resume' }) {
  const isDark = theme === 'dark';
  return (
    <header style={{ position: 'fixed', top: 16, left: 16, right: 16, zIndex: 30, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)', background: RT.glassFill, border: `2px solid ${RT.glassBorder}`, borderRadius: 18, boxShadow: '0 10px 30px -12px rgba(40,25,10,0.30)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Magnetic strength={0.18}>
          <a href="Wireframes.html" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999, background: RT.innerFill, border: `2px solid ${RT.ink}`, color: RT.ink, fontFamily: fontUI, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 0 ' + RT.ink, textDecoration: 'none' }}>
            <span style={{ fontSize: 14 }}>←</span> Back to room
          </a>
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
          }}>
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            )}
          </button>
        </Magnetic>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <LiveClock />
        <span style={{ width: 1.5, height: 18, background: RT.glassBorderHi }} />
        {[
          { label: 'Portfolio', href: 'Portfolio.html' },
          { label: 'Resume', href: 'Resume.html' },
          { label: 'Contact', href: 'Wireframes.html' },
        ].map(({ label, href }) => (
          <a key={label} href={href} style={{ fontFamily: fontUI, fontSize: 13, fontWeight: label === current ? 700 : 500, color: label === current ? RT.accentDeep : RT.ink2, textDecoration: 'none' }}>{label}</a>
        ))}
        <Magnetic>
          <button style={{ padding: '9px 18px', borderRadius: 999, background: RT.accent, border: `2px solid ${RT.ink}`, color: 'white', fontFamily: fontUI, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 0 ' + RT.ink }}>Download CV ↓</button>
        </Magnetic>
      </div>
    </header>
  );
}

function SiteRoom({ theme = 'light' }) {
  const isDark = theme === 'dark';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', filter: isDark ? 'brightness(0.45) saturate(0.7) hue-rotate(-8deg)' : 'none', transition: 'filter 0.4s' }}>
      <img src="assets/room-background.png" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, oklch(0.95 0.10 90 / 0.35), transparent 65%)', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(80,50,30,0.22) 100%)' }} />
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

function DarkAmbient() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${RT.accent} 0%, transparent 65%)`, opacity: 0.18, filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${RT.yellow} 0%, transparent 65%)`, opacity: 0.10, filter: 'blur(40px)' }} />
    </div>
  );
}

function WindowCard({ title, children, padding = 28, hoverable = false, accent = RT.accent, style = {} }) {
  return (
    <div className={hoverable ? 'glass glass-hover' : 'glass'} style={{
      position: 'relative',
      background: RT.glassFill,
      backdropFilter: 'blur(22px) saturate(150%)',
      WebkitBackdropFilter: 'blur(22px) saturate(150%)',
      border: `2px solid ${RT.glassBorder}`,
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 18px 36px -16px rgba(40,25,10,0.32), inset 0 1px 0 rgba(255,255,255,0.5)',
      ...style,
    }}>
      {title && (
        <div style={{ padding: '11px 16px', borderBottom: `2px solid ${RT.glassBorder}`, background: RT.innerFill, display: 'flex', alignItems: 'center', gap: 8 }}>
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

Object.assign(window, { SiteTopBar, SiteRoom, DarkAmbient, WindowCard });
