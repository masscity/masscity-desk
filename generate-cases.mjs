import { writeFileSync, readFileSync } from 'fs';

const OUT = 'C:/Users/Andri Saputro/Desktop/MassCityDesk-handoff/masscitydesk/project';

// Updated hrefs for all projects
const PROJECTS_JS = `
const PORTFOLIO_PROJECTS = [
  { slug:'parachute', title:'VR Parachute Simulator', client:'Indonesian Air Force Academy', role:'Lead Designer · 3D / UX', period:'2023', studio:'Cube Studio', discipline:['3D','VR','Simulation'], cover:'oklch(0.80 0.06 145)', coverDeep:'oklch(0.55 0.08 145)', summary:'A VR training rig that lets cadets rehearse a full parachute jump — from cabin to canopy to landing — without the cost or risk of a real airframe.', metric:'90%', metricLabel:'cost reduction vs. live training', href:'Case-Parachute-standalone.html', featured:true },
  { slug:'vlux', title:'Vlux', client:'Cube Studio (in-house product)', role:'Founder · Product Designer', period:'2024 — Now', studio:'Cube Studio', discipline:['SaaS','Tooling','UE5'], cover:'oklch(0.78 0.08 240)', coverDeep:'oklch(0.50 0.10 245)', summary:'Desktop tool for UE5 lighting artists. Real-time precision controls, scene snapshots, and a node-based color pipeline.', metric:'5×', metricLabel:'faster lighting iteration', href:'Case-Vlux.html', featured:false },
  { slug:'edutech', title:'Edutech Suite', client:'Multiple SEA institutions', role:'Design Lead', period:'2022 — 2024', studio:'Cube Studio', discipline:['SaaS','Education','Design System'], cover:'oklch(0.78 0.075 38)', coverDeep:'oklch(0.52 0.10 38)', summary:'A family of LMS, admin, and student-facing apps unified by a single design system. Asset throughput rose 5× after rollout.', metric:'500%', metricLabel:'asset production lift', href:'Case-Edutech.html', featured:false },
  { slug:'pataland', title:'Pataland', client:'Paradimensi', role:'Lead Designer', period:'2023 — 2024', studio:'Paradimensi', discipline:['Brand','Web','Product'], cover:'oklch(0.86 0.085 92)', coverDeep:'oklch(0.62 0.12 90)', summary:'Brand identity, marketing site, and core product UI for a corporate prototyping platform.', metric:'4 mo', metricLabel:'from kick-off to launch', href:'Case-Pataland.html', featured:false },
  { slug:'metaverse', title:'Mobile Metaverse', client:'Techpolitan (internal)', role:'3D Designer / UX', period:'2022 — 2023', studio:'Techpolitan', discipline:['3D','Mobile','Social'], cover:'oklch(0.72 0.16 45)', coverDeep:'oklch(0.48 0.13 45)', summary:'Internal mobile-first social space. Voxel avatars, real-time rooms, and a custom in-engine UI toolkit.', metric:'12k', metricLabel:'monthly active sessions', href:'Case-Metaverse.html', featured:false },
];`;

// Read the parachute template to extract shared infrastructure
const base = readFileSync(`${OUT}/Case-Parachute-standalone.html`, 'utf8');

// Extract everything from <head> up to the portfolio data comment
const headAndShared = base.slice(0, base.indexOf('// ─── Portfolio data'));

// Extract footer/closing from ReactDOM.createRoot onward
const closing = `
ReactDOM.createRoot(document.getElementById('root')).render(<CaseStudyApp />);
</script>
</body>
</html>`;

// ─── Project definitions ──────────────────────────────────────────────────────
const CASES = [

// ══════════════════════════════════════════════════════════════════════════════
{
  file: 'Case-Vlux.html',
  title: 'Andri · Vlux — Case Study',
  num: '02',
  hero: {
    slug: 'vlux',
    title: 'Vlux',
    tagline: 'Precision lighting for people who care about pixels.',
    cover: 'oklch(0.78 0.08 240)',
    coverDeep: 'oklch(0.38 0.10 245)',
    client: 'Cube Studio (in-house product)',
    role: 'Founder · Product Designer',
    team: 'Cube Studio · 3 people',
    period: '2024 · ongoing',
    platform: 'Windows · Electron desktop app',
  },
  coverSVG: `
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Monitor outline */}
      <rect x="350" y="80" width="500" height="310" rx="12" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.55)" strokeWidth="3"/>
      <rect x="560" y="392" width="80" height="24" fill="rgba(255,255,255,0.20)"/>
      <rect x="460" y="414" width="280" height="8" rx="4" fill="rgba(255,255,255,0.20)"/>
      {/* Panel interior — color nodes */}
      <rect x="370" y="100" width="460" height="270" rx="6" fill="rgba(20,15,40,0.55)"/>
      {/* Sidebar */}
      <rect x="370" y="100" width="80" height="270" rx="6" fill="rgba(255,255,255,0.06)"/>
      {[0,1,2,3,4,5].map((i) =>
        <rect key={i} x="382" y={120+i*36} width="56" height="24" rx="6" fill={i===1?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.06)"}/>
      )}
      {/* Node graph */}
      <circle cx="580" cy="180" r="18" fill="oklch(0.72 0.16 45)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <circle cx="700" cy="160" r="14" fill="oklch(0.80 0.06 145)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <circle cx="780" cy="220" r="16" fill="oklch(0.86 0.085 92)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <circle cx="650" cy="270" r="12" fill="rgba(255,255,255,0.60)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <circle cx="750" cy="300" r="10" fill="oklch(0.78 0.075 38)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <line x1="580" y1="180" x2="700" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="6 4"/>
      <line x1="700" y1="160" x2="780" y2="220" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="6 4"/>
      <line x1="780" y1="220" x2="650" y2="270" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="6 4"/>
      <line x1="650" y1="270" x2="750" y2="300" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="6 4"/>
      {/* Light ray from first node */}
      <line x1="580" y1="180" x2="440" y2="140" stroke="oklch(0.72 0.16 45)" strokeWidth="1.5" opacity="0.6"/>
      <line x1="580" y1="180" x2="460" y2="220" stroke="oklch(0.72 0.16 45)" strokeWidth="1.5" opacity="0.4"/>
      <line x1="580" y1="180" x2="455" y2="175" stroke="oklch(0.72 0.16 45)" strokeWidth="1.5" opacity="0.3"/>
      {/* Bottom bar */}
      <rect x="455" y="340" width="320" height="18" rx="4" fill="rgba(255,255,255,0.08)"/>
      <rect x="455" y="340" width="140" height="18" rx="4" fill="rgba(255,255,255,0.20)"/>
    </svg>`,
  hudTL: '▸ SCENE: warehouse_v04',
  hudBR: '[Vlux · UE5 · build 0.9.1]',
  problem: {
    head: 'Lighting iteration in UE5 takes forever. Artists lose hours to import loops.',
    col1: `<p>Every tweak to a light's intensity, temperature, or position meant re-importing, re-building lighting, waiting 3–8 minutes per iteration. Over a 10-hour day, an artist might manage 12–15 meaningful changes. The feedback loop was broken — not the artist.</p><p>Most studios had patched this with spreadsheets, naming conventions, and Slack threads. <strong>There was no tool that treated the lighting pipeline as a first-class design problem.</strong></p>`,
    col2: `<li>Standalone Windows app — no engine plugin</li><li>Non-destructive — every snapshot recoverable</li><li>One-click compare between any two snapshots</li><li>Export values as UE5-ready data tables</li><li>Ship a v1 that artists would actually keep open</li>`,
  },
  process: [
    { n:'01', label:'Shadow a lighting artist', body:'Spent one week embedded with a senior lighting artist at Cube Studio. Logged every context switch, every wait state, every workaround. Mapped 14 distinct friction points.' },
    { n:'02', label:'Define the core loop', body:'Distilled the job to: tweak → preview → compare → commit. Everything else is secondary. The whole product had to fit inside that loop without breaking it.' },
    { n:'03', label:'Wire the Electron shell', body:'Built a minimal Electron window that reads UE5 project files directly. No plugin, no engine mod — just file-system reads and a websocket to a UE5 editor macro.' },
    { n:'04', label:'Node graph + snapshot system', body:'Designed the color pipeline as a node graph. Each node is a light parameter set. Snapshots are named saves of the full graph state — recoverable in one click.' },
    { n:'05', label:'Artist beta + ship', body:'Three artists used v0.8 daily for 6 weeks. Refined the compare view, added keyboard shortcuts, and reduced cold-start time from 14 seconds to under 3.' },
  ],
  solutionHead: 'One panel. Every lighting decision. No context switching.',
  solutionCanvas: `linear-gradient(135deg, oklch(0.60 0.08 240), oklch(0.35 0.10 245))`,
  solutionPhases: ['Nodes','Snapshots','Compare'],
  solutionPhaseBg: (i) => `linear-gradient(180deg, oklch(0.65 0.08 ${240 - i * 20}), oklch(0.42 0.10 ${235 - i * 20}))`,
  features: [
    { tag:'For artists', title:'Node-based color pipeline.', body:'Every light parameter is a node. Chain them, branch them, override at any level. Non-destructive all the way down.' },
    { tag:'For leads', title:'Scene snapshots with diff.', body:'Name and save any state of the full scene. Compare any two snapshots side by side with a pixel-diff overlay.' },
    { tag:'For studios', title:'UE5-ready export.', body:'One click exports all light values as a UE5 data table asset. Drop it into the engine — no manual re-entry.' },
  ],
  outcome: {
    head: 'Artists stop waiting. Work starts compounding.',
    stats: [
      { val:'5×', label:'faster lighting iteration cycle', accent:'RT.accent' },
      { val:'3 s', label:'cold-start time after optimization', accent:'RT.green' },
      { val:'v1', label:'shipped and in daily use at Cube Studio', accent:'RT.yellow' },
    ],
    quote: '"I used to plan my day around the lighting build queue. Now I just work."',
    attr: '— Senior Lighting Artist, Cube Studio',
  },
  reflection: `<p>Building a tool for yourself is seductive and dangerous. The first version had 22 features I wanted and 4 the artists needed. Cutting 18 features before the beta saved the product.</p><p>The node graph was the right abstraction — but I shipped it too early. Artists expected a simpler list-based UI first. I should have launched with the list and added the graph in v2. The power user feature obscured the basic one.</p><p>Next: a web companion that renders snapshots in-browser for stakeholder review without needing UE5 installed. That's the meeting killer I keep getting asked for.</p>`,
},

// ══════════════════════════════════════════════════════════════════════════════
{
  file: 'Case-Edutech.html',
  title: 'Andri · Edutech Suite — Case Study',
  num: '03',
  hero: {
    slug: 'edutech',
    title: 'Edutech Suite',
    tagline: 'One design system. Five products. Five months.',
    cover: 'oklch(0.78 0.075 38)',
    coverDeep: 'oklch(0.40 0.10 38)',
    client: 'Multiple SEA institutions',
    role: 'Design Lead',
    team: 'Cube Studio · 8 people',
    period: '2022 — 2024 · 18 months',
    platform: 'Web · iOS · Android',
  },
  coverSVG: `
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Browser chrome */}
      <rect x="180" y="70" width="840" height="370" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.40)" strokeWidth="2.5"/>
      <rect x="180" y="70" width="840" height="38" rx="14" fill="rgba(255,255,255,0.20)"/>
      <circle cx="210" cy="89" r="7" fill="rgba(255,100,80,0.7)"/>
      <circle cx="234" cy="89" r="7" fill="rgba(255,210,80,0.7)"/>
      <circle cx="258" cy="89" r="7" fill="rgba(100,210,100,0.7)"/>
      <rect x="300" y="77" width="500" height="24" rx="6" fill="rgba(255,255,255,0.15)"/>
      {/* Left nav sidebar */}
      <rect x="180" y="108" width="140" height="332" fill="rgba(255,255,255,0.08)"/>
      {[0,1,2,3,4,5,6].map((i) =>
        <rect key={i} x="196" y={124+i*38} width="108" height="24" rx="6" fill={i===0?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.07)"}/>
      )}
      {/* Main grid — course cards */}
      {[0,1,2,3,4,5].map((i) =>
        <rect key={i} x={340+(i%3)*180} y={i<3?128:258} width="160" height="110" rx="10"
          fill={i===0?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.09)"}
          stroke={i===0?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.15)"}
          strokeWidth={i===0?2:1}/>
      )}
      {/* Progress bars */}
      {[0,1,2].map((i) =>
        <g key={i}>
          <rect x={352+(i*180)} y={344} width="136" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
          <rect x={352+(i*180)} y={344} width={[96,48,120][i]} height="6" rx="3" fill="rgba(255,255,255,0.60)"/>
        </g>
      )}
      {/* Top stat strip */}
      {[0,1,2,3].map((i) =>
        <rect key={i} x={340+i*200} y={400} width="180" height="40" rx="8" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      )}
    </svg>`,
  hudTL: '▸ STUDENTS ONLINE: 1,240',
  hudBR: '[LMS · Web · v3.2]',
  problem: {
    head: 'Five institutions. Five codebases. Zero shared language between designers and developers.',
    col1: `<p>Each institution had hired a different agency. The LMS looked different from the student portal, which looked different from the admin dashboard, which looked different from the mobile app. Every new feature required four separate implementations — and four separate design decisions that were almost always different.</p><p>The brief was ostensibly "refresh the LMS". The real problem was <strong>there was no system at all — just five products pretending to be one.</strong></p>`,
    col2: `<li>Token-based system that works across web and native</li><li>Component library with 40+ production-ready components</li><li>One Figma file — not four</li><li>Design-to-dev handoff in under 2 hours per feature</li><li>Adopted by all teams within the first sprint</li>`,
  },
  process: [
    { n:'01', label:'Audit across all five products', body:'Documented every UI pattern across all five codebases. Found 47 distinct button styles, 12 card variants, and 6 different shades of "primary blue". The chaos was quantifiable.' },
    { n:'02', label:'Token architecture', body:'Defined a three-tier token system: global → semantic → component. Built the full token set in Figma variables and exported to CSS custom properties and React Native themes simultaneously.' },
    { n:'03', label:'Core component library', body:'Built 40 production-ready components, each with: design spec in Figma, Storybook story, unit tests, and accessibility audit. All five teams reviewed every component before it shipped.' },
    { n:'04', label:'Rollout sprint by sprint', body:'Released the system product by product, starting with the most-used surfaces. Each sprint retired legacy components. By month 14, all five products were on the same system.' },
    { n:'05', label:'Governance + handoff tooling', body:'Wrote contribution guidelines, ran bi-weekly design system office hours, and built a Figma plugin that flags out-of-system usage. The system maintains itself now.' },
  ],
  solutionHead: 'One system. Every product speaks the same language.',
  solutionCanvas: `linear-gradient(135deg, oklch(0.65 0.075 38), oklch(0.40 0.10 38))`,
  solutionPhases: ['Tokens','Components','Handoff'],
  solutionPhaseBg: (i) => `linear-gradient(180deg, oklch(0.70 0.07 ${38 + i * 15}), oklch(0.45 0.09 ${38 + i * 15}))`,
  features: [
    { tag:'For designers', title:'Single source of truth.', body:'One Figma file. Token variables sync automatically. No more "which version of this component is current?"' },
    { tag:'For developers', title:'CSS tokens + Storybook.', body:'Every component ships with a Storybook story, typed props, and accessibility audit. Implementation time dropped from days to hours.' },
    { tag:'For product teams', title:'5× asset throughput.', body:'Designers stopped reinventing. Asset production per sprint rose 500% because the decisions were already made.' },
  ],
  outcome: {
    head: 'Five products, one team, one language. Asset throughput 5×.',
    stats: [
      { val:'500%', label:'asset production lift post-rollout', accent:'RT.accent' },
      { val:'40+', label:'production-ready components shipped', accent:'RT.green' },
      { val:'5', label:'products unified under one system', accent:'RT.yellow' },
    ],
    quote: '"Before this, every sprint started with a debate about buttons. Now we just build."',
    attr: '— Product Lead, SEA institution',
  },
  reflection: `<p>The hardest part wasn't building the system — it was getting five teams with five opinions to agree on what a button should look like. I underestimated the politics and overestimated how much good design speaks for itself. The governance process mattered as much as the components.</p><p>The token architecture held up perfectly. Three tiers was exactly right — global tokens for brand, semantic tokens for intent, component tokens for overrides. I'd use the same structure again without hesitation.</p><p>What I'd change: launch the Figma plugin earlier. Flagging out-of-system usage from day one would have saved months of gradual drift before the rollout was complete.</p>`,
},

// ══════════════════════════════════════════════════════════════════════════════
{
  file: 'Case-Pataland.html',
  title: 'Andri · Pataland — Case Study',
  num: '04',
  hero: {
    slug: 'pataland',
    title: 'Pataland',
    tagline: 'Brand, web, and product. Four months, one team.',
    cover: 'oklch(0.86 0.085 92)',
    coverDeep: 'oklch(0.50 0.12 90)',
    client: 'Paradimensi',
    role: 'Lead Designer',
    team: 'Paradimensi · 5 people',
    period: '2023 — 2024 · 4 months',
    platform: 'Web · Desktop-first',
  },
  coverSVG: `
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Brand mark — P letterform */}
      <g transform="translate(180, 120)">
        <rect x="0" y="0" width="80" height="260" rx="8" fill="rgba(255,255,255,0.85)" stroke="rgba(80,60,20,0.30)" strokeWidth="2"/>
        <rect x="0" y="0" width="130" height="120" rx="8" fill="rgba(255,255,255,0.85)" stroke="rgba(80,60,20,0.30)" strokeWidth="2"/>
        <rect x="50" y="40" width="100" height="80" rx="6" fill="rgba(80,60,20,0.12)"/>
      </g>
      {/* Web layout wireframe */}
      <rect x="360" y="80" width="660" height="360" rx="14" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.55)" strokeWidth="2"/>
      {/* Nav */}
      <rect x="360" y="80" width="660" height="44" rx="14" fill="rgba(255,255,255,0.30)"/>
      <rect x="380" y="91" width="80" height="22" rx="4" fill="rgba(80,60,20,0.25)"/>
      {[0,1,2,3].map((i) =>
        <rect key={i} x={780+i*54} y={91} width={44} height={22} rx={4} fill="rgba(255,255,255,0.20)"/>
      )}
      {/* Hero area */}
      <rect x="380" y="146" width="400" height="100" rx="8" fill="rgba(80,60,20,0.12)"/>
      <rect x="380" y="258" width="200" height="24" rx="4" fill="rgba(80,60,20,0.18)"/>
      <rect x="380" y="294" width="160" height="16" rx="4" fill="rgba(80,60,20,0.12)"/>
      {/* CTA button */}
      <rect x="380" y="326" width="120" height="36" rx="18" fill="rgba(80,60,20,0.45)"/>
      {/* Right illustration placeholder */}
      <rect x="820" y="146" width="180" height="200" rx="12" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5"/>
      {/* Cards row */}
      {[0,1,2].map((i) =>
        <rect key={i} x={380+i*215} y={380} width="200" height="50" rx="8" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.30)" strokeWidth="1"/>
      )}
    </svg>`,
  hudTL: '▸ BRAND · WEB · PRODUCT',
  hudBR: '[Figma · 4 months · shipped]',
  problem: {
    head: 'A funding round in four months with no brand, no site, and no product UI.',
    col1: `<p>Paradimensi had a concept, a team, and a deadline. Investors were lined up for a Q1 review. The ask was everything a company needs to be credible in a room: a name with a visual identity behind it, a marketing site that explains the product, and a working prototype of the product itself.</p><p><strong>Four months. One designer. All three layers of the stack, at the same time.</strong></p>`,
    col2: `<li>Brand identity: wordmark + mark + motion language</li><li>Marketing site: 6 pages, desktop-first, live by week 12</li><li>Product UI: prototyping platform, core flows only</li><li>Design token system shared across site + product</li><li>All deliverables handoff-ready for dev on day 1</li>`,
  },
  process: [
    { n:'01', label:'Discovery sprint', body:'Two days with the founding team. Mapped the competitive landscape, defined the positioning, and chose the brand direction from three distinct concepts. Week one done by Friday.' },
    { n:'02', label:'Brand system', body:'Wordmark, mark, type pairing, color palette, and motion principles. Delivered in week 3. Everything downstream — site + product — is built on these tokens. The brand is the system.' },
    { n:'03', label:'Site architecture + content', body:'Worked with the CEO to write every page. Architecture is simple: Home, Product, Use cases, Pricing, Blog, Contact. No fluff. Every section answers a question the investor asks.' },
    { n:'04', label:'Site build + product UI', body:'Ran both tracks in parallel from week 6. Site in Webflow. Product UI in Figma + prototype. Weekly design reviews with the founding team. No surprises at handoff.' },
    { n:'05', label:'QA + launch', body:'Two weeks of QA across browsers and devices. Fixed 34 issues. Launched on a Tuesday — three days ahead of the investor review. The product prototype closed the round.' },
  ],
  solutionHead: 'One design language from the logo to the last input field.',
  solutionCanvas: `linear-gradient(135deg, oklch(0.75 0.085 92), oklch(0.48 0.12 90))`,
  solutionPhases: ['Brand','Site','Product'],
  solutionPhaseBg: (i) => `linear-gradient(180deg, oklch(0.78 0.08 ${92 + i * 10}), oklch(0.52 0.10 ${90 + i * 10}))`,
  features: [
    { tag:'Brand', title:'Token-first identity.', body:'Every color, type size, and spacing value is a Figma variable that flows directly into the site and product. One update propagates everywhere.' },
    { tag:'Site', title:'Six pages, zero ambiguity.', body:'Each page has one job. The homepage gets you to the product demo. The pricing page gets you to contact. Investors found what they needed without a guided tour.' },
    { tag:'Product', title:'Core flows, full fidelity.', body:'Focused on the three flows an investor actually runs: create a prototype, share it, review feedback. Everything else was out of scope — and visibly so.' },
  ],
  outcome: {
    head: 'On schedule. Under budget. The prototype closed the round.',
    stats: [
      { val:'4 mo', label:'from kick-off to investor-ready launch', accent:'RT.accent' },
      { val:'3 d', label:'ahead of the investor review deadline', accent:'RT.green' },
      { val:'1', label:'design system across brand, site, and product', accent:'RT.yellow' },
    ],
    quote: '"The prototype answered every question before I could ask it. That\'s rare."',
    attr: '— Lead Investor, Q1 review session',
  },
  reflection: `<p>Running brand, site, and product in parallel is only possible if you establish the token system first. I did — and it saved approximately 3 weeks of rework that would have happened if I'd built each layer independently.</p><p>The content writing was the slowest part and the most underestimated. Founders are rarely good at explaining their own product. Factor it in as a deliverable, not a given.</p><p>What I'd do again: the weekly design review with the founding team. Synchronous, 30 minutes, show everything. It sounds expensive and it pays back everything it costs.</p>`,
},

// ══════════════════════════════════════════════════════════════════════════════
{
  file: 'Case-Metaverse.html',
  title: 'Andri · Mobile Metaverse — Case Study',
  num: '05',
  hero: {
    slug: 'metaverse',
    title: 'Mobile Metaverse',
    tagline: 'Voxel rooms for real conversations.',
    cover: 'oklch(0.72 0.16 45)',
    coverDeep: 'oklch(0.36 0.13 45)',
    client: 'Techpolitan (internal)',
    role: '3D Designer / UX',
    team: 'Techpolitan · 4 people',
    period: '2022 — 2023 · 14 months',
    platform: 'iOS · Android · React Native',
  },
  coverSVG: `
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Voxel grid isometric */}
      <g transform="translate(200, 80)">
        {[0,1,2,3,4].map((row) =>
          [0,1,2,3,4].map((col) => {
            const x = (col - row) * 44 + 250;
            const y = (col + row) * 22 + 60;
            const active = (row===2&&col===2)||(row===1&&col===3)||(row===3&&col===1);
            return (
              <g key={row+'-'+col}>
                <polygon points={x+','+y+' '+(x+44)+','+(y+22)+' '+(x+44)+','+(y+66)+' '+x+','+(y+44)}
                  fill={active?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.10)"}
                  stroke="rgba(255,255,255,0.30)" strokeWidth="1"/>
                <polygon points={x+','+y+' '+(x+44)+','+(y+22)+' '+(x+88)+','+y+' '+(x+44)+','+(y-22)}
                  fill={active?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.18)"}
                  stroke="rgba(255,255,255,0.30)" strokeWidth="1"/>
                <polygon points={(x+44)+','+(y+22)+' '+(x+88)+','+y+' '+(x+88)+','+(y+44)+' '+(x+44)+','+(y+66)}
                  fill={active?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.07)"}
                  stroke="rgba(255,255,255,0.30)" strokeWidth="1"/>
              </g>
            );
          })
        )}
      </g>
      {/* Phone mockup */}
      <rect x="880" y="80" width="180" height="340" rx="24" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"/>
      <rect x="896" y="106" width="148" height="288" rx="10" fill="rgba(20,10,5,0.55)"/>
      {/* Avatar bubbles on phone */}
      {[0,1,2].map((i) =>
        <circle key={i} cx={920+i*40} cy={180} r={18}
          fill={["oklch(0.80 0.06 145)","oklch(0.86 0.085 92)","oklch(0.78 0.075 38)"][i]}
          stroke="rgba(255,255,255,0.60)" strokeWidth="2"/>
      )}
      {/* Chat bubbles */}
      <rect x="904" y="218" width="120" height="28" rx="14" fill="rgba(255,255,255,0.20)"/>
      <rect x="912" y="258" width="100" height="24" rx="12" fill="rgba(255,255,255,0.12)"/>
      <rect x="908" y="294" width="112" height="24" rx="12" fill="rgba(255,255,255,0.20)"/>
      {/* Bottom nav on phone */}
      <rect x="896" y="356" width="148" height="38" rx="6" fill="rgba(255,255,255,0.10)"/>
      {[0,1,2,3].map((i) =>
        <circle key={i} cx={914+i*36} cy={375} r={8} fill={i===0?"rgba(255,255,255,0.70)":"rgba(255,255,255,0.20)"}/>
      )}
    </svg>`,
  hudTL: '▸ ROOMS LIVE: 847',
  hudBR: '[iOS · Android · v1.4]',
  problem: {
    head: 'Social apps on mobile feel flat. The "place" is the missing ingredient.',
    col1: `<p>Techpolitan's research showed that users wanted persistent spaces — rooms that felt like theirs — not feeds, not threads, not channels. The closest existing product was Gather.town, which is desktop-only and browser-dependent. The ask: a mobile-first social space that feels like a place, not a timeline.</p><p><strong>Voxel avatars were the solution to the hardest design problem: how do you give a user a sense of self in a space without a face camera?</strong></p>`,
    col2: `<li>Runs smoothly on mid-range Android — no PC required</li><li>Voxel avatar builder: 200+ combinations on device</li><li>Persistent rooms: stays alive even when owner is offline</li><li>In-engine UI toolkit — no generic component library</li><li>Launch target: 1k DAU in the first quarter</li>`,
  },
  process: [
    { n:'01', label:'Social mechanics research', body:'Studied Discord, Gather, Roblox, and WeChat for social primitives. Identified three that mattered: persistent identity, a place to hang out, and low-friction joining. Everything else is noise.' },
    { n:'02', label:'Voxel system design', body:'Designed the avatar builder as a constraint-based system: fixed grid, limited palette, maximum expressiveness. 200+ combinations from 18 components. Built entirely in the game engine for consistent rendering.' },
    { n:'03', label:'Room architecture', body:'Rooms are 12×12 voxel grids. Users can place furniture, pin links, and set ambient audio. The room persists without the owner — you can visit a friend\'s room when they\'re offline.' },
    { n:'04', label:'In-engine UI toolkit', body:'Standard mobile UI components don\'t render well inside a 3D engine. Built 22 custom UI components that match the voxel aesthetic and render at 60fps on mid-range devices.' },
    { n:'05', label:'Soft launch + iteration', body:'Launched to 200 internal users at Techpolitan. Three major iterations over 6 weeks — simplified the room editor, added room search, and fixed avatar rendering on low-end devices before public launch.' },
  ],
  solutionHead: 'A place that feels like yours. On a phone. At 60fps.',
  solutionCanvas: `linear-gradient(135deg, oklch(0.62 0.16 45), oklch(0.38 0.13 45))`,
  solutionPhases: ['Avatar','Room','Social'],
  solutionPhaseBg: (i) => `linear-gradient(180deg, oklch(0.68 0.14 ${45 + i * 12}), oklch(0.44 0.12 ${45 + i * 12}))`,
  features: [
    { tag:'For users', title:'Voxel avatar builder.', body:'200+ combinations from 18 components. Build your identity in under 2 minutes. The constraint is the feature — everyone is recognizably a person.' },
    { tag:'For communities', title:'Persistent rooms.', body:'Your room stays alive when you leave. Friends can visit, leave notes, and hang out in your space without you. The place outlasts the session.' },
    { tag:'For the engine', title:'Custom UI toolkit.', body:'22 components built inside the engine. Consistent with the voxel aesthetic, render at 60fps on mid-range Android, and handle touch input at game-engine precision.' },
  ],
  outcome: {
    head: 'Twelve thousand monthly sessions. The room became the product.',
    stats: [
      { val:'12k', label:'monthly active sessions at peak', accent:'RT.accent' },
      { val:'60', label:'fps on mid-range Android devices', accent:'RT.green' },
      { val:'200+', label:'avatar combinations in the builder', accent:'RT.yellow' },
    ],
    quote: '"I check my room every morning before I check my messages. That surprised me."',
    attr: '— Internal user, Techpolitan beta',
  },
  reflection: `<p>The voxel constraint was the best design decision on the project and the hardest to defend internally. Everyone wanted more customization options. The data was clear: users who finished the avatar builder in under 90 seconds had 3× better retention than those who took longer. The constraint kept them in the flow state.</p><p>The in-engine UI toolkit was slower to build than a generic library would have been, and worth every day. When the UI feels like part of the world, users stop noticing the seam between game and app.</p><p>What I'd change: the room editor. It's functional but not delightful. The next version needs a direct-manipulation editor, not the current menu-based system. That's the gap between "users build rooms" and "users design spaces".</p>`,
},

]; // end CASES

// ─── HTML generator ───────────────────────────────────────────────────────────
function renderCase(c) {
  const h = c.hero;
  const featColors = ['RT.green', 'RT.yellow', 'RT.pink'];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${c.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
<style>
  html,body,#root{margin:0;min-height:100vh;background:linear-gradient(180deg,oklch(0.96 0.025 75) 0%,oklch(0.92 0.04 65) 100%);color:oklch(0.28 0.04 50);font-family:"Plus Jakarta Sans",system-ui,sans-serif;transition:background 0.4s,color 0.4s;}
  html[data-theme="dark"],html[data-theme="dark"] body,html[data-theme="dark"] #root{background:linear-gradient(180deg,oklch(0.22 0.025 50) 0%,oklch(0.16 0.03 45) 100%);color:oklch(0.94 0.02 80);}
  *{box-sizing:border-box;} body{overflow-x:hidden;}
  .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.8s cubic-bezier(.2,.8,.2,1),transform 0.8s cubic-bezier(.2,.8,.2,1);}
  .reveal.in{opacity:1;transform:none;}
  .glass-hover{transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s;transform-style:preserve-3d;will-change:transform;}
  .glass-hover:hover{transform:translateY(-3px);box-shadow:0 28px 50px -20px rgba(40,25,10,0.45),inset 0 1px 0 rgba(255,255,255,0.7);}
  .glass::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(280px circle at var(--mx,50%) var(--my,50%),rgba(255,250,230,0.25),transparent 60%);opacity:0;transition:opacity 0.3s;border-radius:inherit;}
  .glass:hover::before{opacity:1;}
  ::selection{background:oklch(0.72 0.16 45 / 0.35);color:oklch(0.28 0.04 50);}
  @keyframes mote{0%,100%{transform:translateY(0) translateX(0);opacity:0.4;}50%{transform:translateY(-30px) translateX(15px);opacity:0.9;}}
  body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:100;opacity:0.06;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>");}
  ::-webkit-scrollbar{width:12px;} ::-webkit-scrollbar-track{background:oklch(0.88 0.03 75);}
  ::-webkit-scrollbar-thumb{background:oklch(0.72 0.16 45);border-radius:999px;border:2px solid oklch(0.88 0.03 75);}
  html[data-theme="dark"] ::-webkit-scrollbar-track{background:oklch(0.22 0.025 50);}
  html[data-theme="dark"] ::-webkit-scrollbar-thumb{background:oklch(0.78 0.16 50);border-color:oklch(0.22 0.025 50);}
  .prose p{font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:16px;line-height:1.7;font-weight:500;margin:0 0 16px;}
  .prose h3{font-family:"Fraunces",Georgia,serif;font-size:26px;font-weight:700;letter-spacing:-0.5px;margin:28px 0 14px;}
  .prose strong{font-weight:700;} .prose ul{padding-left:0;list-style:none;margin:0 0 18px;}
  .prose li{font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:15.5px;line-height:1.6;font-weight:500;margin:0 0 10px;padding-left:24px;position:relative;}
  .prose li::before{content:'✓';position:absolute;left:0;top:0;font-weight:800;color:oklch(0.72 0.16 45);}
</style>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
</head>
<body>
<div id="root"></div>
<script type="text/babel">

const RT_LIGHT={bg0:'oklch(0.96 0.025 75)',bg1:'oklch(0.92 0.04 65)',glass:'rgba(255,248,232,0.30)',glassFill:'rgba(255,250,238,0.55)',glassBorder:'rgba(110,75,45,0.28)',glassBorderHi:'rgba(110,75,45,0.42)',cream:'oklch(0.97 0.025 85)',ink:'oklch(0.28 0.04 50)',ink2:'oklch(0.44 0.035 55)',ink3:'oklch(0.60 0.025 55)',accent:'oklch(0.72 0.16 45)',accentDeep:'oklch(0.52 0.13 42)',yellow:'oklch(0.86 0.085 92)',green:'oklch(0.80 0.06 145)',pink:'oklch(0.78 0.075 38)',innerFill:'rgba(255,248,232,0.6)',innerBorder:'rgba(110,75,45,0.22)',fontDisplay:'"Fraunces","DM Serif Display",Georgia,serif',fontUI:'"Plus Jakarta Sans",system-ui,sans-serif'};
const RT_DARK={bg0:'oklch(0.22 0.025 50)',bg1:'oklch(0.16 0.03 45)',glass:'rgba(50,35,22,0.30)',glassFill:'rgba(60,42,28,0.55)',glassBorder:'rgba(255,235,200,0.18)',glassBorderHi:'rgba(255,235,200,0.30)',cream:'oklch(0.30 0.03 50)',ink:'oklch(0.94 0.02 80)',ink2:'oklch(0.78 0.025 75)',ink3:'oklch(0.62 0.025 70)',accent:'oklch(0.78 0.16 50)',accentDeep:'oklch(0.85 0.14 55)',yellow:'oklch(0.72 0.10 92)',green:'oklch(0.68 0.07 145)',pink:'oklch(0.66 0.08 38)',innerFill:'rgba(40,28,18,0.55)',innerBorder:'rgba(255,235,200,0.16)',fontDisplay:'"Fraunces","DM Serif Display",Georgia,serif',fontUI:'"Plus Jakarta Sans",system-ui,sans-serif'};
const RT={...RT_LIGHT};
function applyTheme(mode){const src=mode==='dark'?RT_DARK:RT_LIGHT;Object.keys(src).forEach(k=>{RT[k]=src[k];});document.documentElement.dataset.theme=mode;document.body.style.background=\`linear-gradient(180deg,\${src.bg0} 0%,\${src.bg1} 100%)\`;document.body.style.color=src.ink;}
const{useEffect,useRef,useState}=React;
function useReveal(){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const fb=setTimeout(()=>el.classList.add('in'),600);const io=new IntersectionObserver((entries)=>entries.forEach(x=>{if(x.isIntersecting||x.intersectionRatio>0){x.target.classList.add('in');io.unobserve(x.target);}}),{threshold:0.05,rootMargin:'0px 0px -10% 0px'});io.observe(el);return()=>{clearTimeout(fb);io.disconnect();};},[]);return ref;}
function useTilt(s=6){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const m=(e)=>{const r=el.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-0.5;const py=(e.clientY-r.top)/r.height-0.5;el.style.setProperty('--tx',(-py*s).toFixed(2)+'deg');el.style.setProperty('--ty',(px*s).toFixed(2)+'deg');el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');};const rs=()=>{el.style.setProperty('--tx','0deg');el.style.setProperty('--ty','0deg');};el.addEventListener('mousemove',m);el.addEventListener('mouseleave',rs);return()=>{el.removeEventListener('mousemove',m);el.removeEventListener('mouseleave',rs);};},[s]);return ref;}
function useTheme(){const[mode,setMode]=useState(()=>{try{return localStorage.getItem('resume-theme')||'light';}catch{return'light';}});applyTheme(mode);useEffect(()=>{try{localStorage.setItem('resume-theme',mode);}catch{}},[mode]);return[mode,()=>setMode(m=>m==='light'?'dark':'light')];}
function Counter({to,suffix='',dur=1400}){const[v,setV]=useState(0);const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;let raf,started=false;const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!started){started=true;const t0=performance.now();const tick=t=>{const p=Math.min(1,(t-t0)/dur);setV(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}});io.observe(el);return()=>{io.disconnect();cancelAnimationFrame(raf);};},[to,dur]);return<span ref={ref}>{v}{suffix}</span>;}
function Magnetic({children,strength=0.3,style={},...rest}){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const m=e=>{const r=el.getBoundingClientRect();el.style.transform=\`translate(\${(e.clientX-r.left-r.width/2)*strength}px,\${(e.clientY-r.top-r.height/2)*strength}px)\`;};const rs=()=>{el.style.transform='';};const p=el.parentElement;p.addEventListener('mousemove',m);p.addEventListener('mouseleave',rs);return()=>{p.removeEventListener('mousemove',m);p.removeEventListener('mouseleave',rs);};},[strength]);return<span ref={ref} style={{display:'inline-block',transition:'transform 0.25s cubic-bezier(.2,.8,.2,1)',...style}}{...rest}>{children}</span>;}
function LiveClock(){const[now,setNow]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);const j=new Date(now.getTime()+(now.getTimezoneOffset()+420)*60000);return<span style={{fontFamily:RT.fontUI,fontSize:13,fontWeight:600,color:RT.ink,display:'inline-flex',alignItems:'center',gap:8}}><span style={{width:8,height:8,borderRadius:'50%',background:RT.green,boxShadow:'0 0 10px '+RT.green}}/>Jakarta · {String(j.getHours()).padStart(2,'0')}:{String(j.getMinutes()).padStart(2,'0')}</span>;}
function CursorSpotlight(){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const m=e=>{el.style.setProperty('--sx',e.clientX+'px');el.style.setProperty('--sy',e.clientY+'px');};window.addEventListener('mousemove',m);return()=>window.removeEventListener('mousemove',m);},[]);return<div ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,background:'radial-gradient(420px circle at var(--sx,50%) var(--sy,50%),oklch(0.95 0.10 90 / 0.18),transparent 60%)'}}/>;}
function Glass({children,style={},hoverable=true,padding=26,radius=28,...rest}){return<div className={\`glass \${hoverable?'glass-hover':''}\`} style={{position:'relative',background:RT.glassFill,backdropFilter:'blur(22px) saturate(140%)',WebkitBackdropFilter:'blur(22px) saturate(140%)',border:\`2.5px solid \${RT.glassBorder}\`,borderRadius:radius,padding,overflow:'hidden',boxShadow:'0 18px 36px -18px rgba(60,30,15,0.35),inset 0 1px 0 rgba(255,255,255,0.6)',...style}}{...rest}>{children}</div>;}
function Kicker({children,style={}}){return<span style={{fontFamily:RT.fontUI,fontSize:12,fontWeight:700,color:RT.accentDeep,letterSpacing:1.2,textTransform:'uppercase',...style}}>{children}</span>;}
function SiteTopBar({theme,toggleTheme}){const isDark=theme==='dark';return<header style={{position:'fixed',top:16,left:16,right:16,zIndex:30,padding:'12px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)',background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,boxShadow:'0 10px 30px -12px rgba(40,25,10,0.30)'}}><div style={{display:'flex',alignItems:'center',gap:10}}><Magnetic strength={0.18}><a href="Wireframes.html" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'9px 16px',borderRadius:999,background:RT.innerFill,border:\`2px solid \${RT.ink}\`,color:RT.ink,fontFamily:RT.fontUI,fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 3px 0 '+RT.ink,textDecoration:'none'}}><span style={{fontSize:14}}>←</span> Back to room</a></Magnetic><Magnetic strength={0.22}><button onClick={toggleTheme} style={{width:40,height:40,borderRadius:'50%',background:isDark?RT.ink:RT.yellow,border:\`2px solid \${RT.ink}\`,color:isDark?RT.yellow:RT.ink,cursor:'pointer',boxShadow:'0 3px 0 '+RT.ink,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{isDark?<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>}</button></Magnetic></div><div style={{display:'flex',alignItems:'center',gap:16}}><LiveClock/><span style={{width:1.5,height:18,background:RT.glassBorderHi}}/>{[{label:'About',href:'Wireframes.html'},{label:'Work',href:'Portfolio.html'},{label:'Resume',href:'Resume.html'},{label:'Contact',href:'Wireframes.html'}].map(({label,href})=><a key={label} href={href} style={{fontFamily:RT.fontUI,fontSize:13,fontWeight:label==='Work'?700:500,color:label==='Work'?RT.accentDeep:RT.ink2,textDecoration:'none'}}>{label}</a>)}<Magnetic><button style={{padding:'9px 18px',borderRadius:999,background:RT.accent,border:\`2px solid \${RT.ink}\`,color:'white',fontFamily:RT.fontUI,fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 3px 0 '+RT.ink}}>Download CV ↓</button></Magnetic></div></header>;}
function SiteRoom({theme}){const isDark=theme==='dark';return<div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',filter:isDark?'brightness(0.45) saturate(0.7) hue-rotate(-8deg)':'none',transition:'filter 0.4s'}}><img src="assets/room-background.png" alt="" aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/><div style={{position:'absolute',top:'-15%',right:'-10%',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,oklch(0.95 0.10 90 / 0.35),transparent 65%)',mixBlendMode:'screen'}}/><div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 55%,rgba(80,50,30,0.22) 100%)'}}/>{[...Array(14)].map((_,i)=><div key={i} style={{position:'absolute',left:\`\${(i*73+7)%100}%\`,top:\`\${(i*47+13)%100}%\`,width:5,height:5,borderRadius:'50%',background:'oklch(0.96 0.06 90 / 0.6)',boxShadow:'0 0 8px oklch(0.96 0.06 90)',animation:\`mote \${8+(i%5)}s ease-in-out \${i*0.4}s infinite\`}}/>)}</div>;}
function DarkAmbient(){return<div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}><div style={{position:'absolute',top:'-15%',right:'-10%',width:700,height:700,borderRadius:'50%',background:\`radial-gradient(circle,\${RT.accent} 0%,transparent 65%)\`,opacity:0.18,filter:'blur(40px)'}}/><div style={{position:'absolute',bottom:'-20%',left:'-15%',width:600,height:600,borderRadius:'50%',background:\`radial-gradient(circle,\${RT.yellow} 0%,transparent 65%)\`,opacity:0.10,filter:'blur(40px)'}}/></div>;}
function WindowCard({title,children,padding=28,hoverable=false,accent,style={}}){const _a=accent||RT.accent;return<div className={hoverable?'glass glass-hover':'glass'} style={{position:'relative',background:RT.glassFill,backdropFilter:'blur(22px) saturate(150%)',WebkitBackdropFilter:'blur(22px) saturate(150%)',border:\`2px solid \${RT.glassBorder}\`,borderRadius:22,overflow:'hidden',boxShadow:'0 18px 36px -16px rgba(40,25,10,0.32),inset 0 1px 0 rgba(255,255,255,0.5)',...style}}>{title&&<div style={{padding:'11px 16px',borderBottom:\`2px solid \${RT.glassBorder}\`,background:RT.innerFill,display:'flex',alignItems:'center',gap:8}}><span style={{width:10,height:10,borderRadius:'50%',background:_a,border:\`1.5px solid \${RT.ink}\`}}/><span style={{width:10,height:10,borderRadius:'50%',background:RT.yellow,border:\`1.5px solid \${RT.ink}\`}}/><span style={{width:10,height:10,borderRadius:'50%',background:RT.green,border:\`1.5px solid \${RT.ink}\`}}/><span style={{marginLeft:8,fontFamily:RT.fontUI,fontSize:11.5,fontWeight:700,color:RT.ink2,letterSpacing:0.5,textTransform:'uppercase'}}>{title}</span></div>}<div style={{padding}}>{children}</div></div>;}

const PORTFOLIO_PROJECTS=[
  {slug:'parachute',title:'VR Parachute Simulator',client:'Indonesian Air Force Academy',role:'Lead Designer · 3D / UX',period:'2023',cover:'oklch(0.80 0.06 145)',coverDeep:'oklch(0.55 0.08 145)',metric:'90%',metricLabel:'cost reduction vs. live training',href:'Case-Parachute-standalone.html'},
  {slug:'vlux',title:'Vlux',client:'Cube Studio (in-house product)',role:'Founder · Product Designer',period:'2024 — Now',cover:'oklch(0.78 0.08 240)',coverDeep:'oklch(0.50 0.10 245)',metric:'5×',metricLabel:'faster lighting iteration',href:'Case-Vlux.html'},
  {slug:'edutech',title:'Edutech Suite',client:'Multiple SEA institutions',role:'Design Lead',period:'2022 — 2024',cover:'oklch(0.78 0.075 38)',coverDeep:'oklch(0.52 0.10 38)',metric:'500%',metricLabel:'asset production lift',href:'Case-Edutech.html'},
  {slug:'pataland',title:'Pataland',client:'Paradimensi',role:'Lead Designer',period:'2023 — 2024',cover:'oklch(0.86 0.085 92)',coverDeep:'oklch(0.62 0.12 90)',metric:'4 mo',metricLabel:'from kick-off to launch',href:'Case-Pataland.html'},
  {slug:'metaverse',title:'Mobile Metaverse',client:'Techpolitan (internal)',role:'3D Designer / UX',period:'2022 — 2023',cover:'oklch(0.72 0.16 45)',coverDeep:'oklch(0.48 0.13 45)',metric:'12k',metricLabel:'monthly active sessions',href:'Case-Metaverse.html'},
];

const SECTIONS=[{id:'overview',label:'Overview'},{id:'problem',label:'Problem'},{id:'process',label:'Process'},{id:'solution',label:'Solution'},{id:'outcome',label:'Outcome'},{id:'reflection',label:'Reflection'}];

const PROJECT = {
  slug: '${h.slug}',
  title: '${h.title}',
  tagline: '${h.tagline}',
  cover: '${h.cover}',
  coverDeep: '${h.coverDeep}',
  client: '${h.client}',
  role: '${h.role}',
  team: '${h.team}',
  period: '${h.period}',
  platform: '${h.platform}',
};

function CaseHero(){const ref=useReveal();return<header ref={ref} className="reveal" style={{marginBottom:30}}><Kicker>case study · ${c.num} / 05</Kicker><h1 style={{margin:'12px 0 0',fontFamily:RT.fontDisplay,fontSize:'clamp(48px,7vw,92px)',fontWeight:700,color:RT.ink,letterSpacing:-2.5,lineHeight:1.0,textWrap:'balance'}}>{PROJECT.title}</h1><p style={{marginTop:16,fontFamily:RT.fontDisplay,fontSize:'clamp(20px,2.4vw,28px)',fontStyle:'italic',fontWeight:500,color:RT.accent,letterSpacing:-0.5,lineHeight:1.3}}>{PROJECT.tagline}</p></header>;}

function CoverArt(){const ref=useReveal();return<div ref={ref} className="reveal" style={{marginBottom:36}}><div className="glass" style={{position:'relative',background:\`linear-gradient(135deg,\${PROJECT.cover} 0%,\${PROJECT.coverDeep} 100%)\`,border:\`2.5px solid \${RT.glassBorder}\`,borderRadius:26,overflow:'hidden',aspectRatio:'21 / 9',boxShadow:'0 30px 60px -25px rgba(40,25,10,0.55)'}}><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 25% 30%,rgba(255,250,200,0.40),transparent 50%),radial-gradient(circle at 75% 70%,rgba(0,0,0,0.15),transparent 55%)'}}/>
${c.coverSVG}
<div style={{position:'absolute',top:22,left:22,padding:'7px 14px',borderRadius:999,background:'rgba(20,15,8,0.70)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',border:'1.5px solid rgba(255,255,255,0.25)',fontFamily:'"JetBrains Mono",monospace',fontSize:11,fontWeight:600,color:'rgba(255,250,235,0.95)',letterSpacing:1,textTransform:'uppercase'}}>${c.hudTL}</div>
<div style={{position:'absolute',bottom:22,right:22,padding:'7px 14px',borderRadius:8,background:'rgba(20,15,8,0.70)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',border:'1.5px solid rgba(255,255,255,0.25)',fontFamily:'"JetBrains Mono",monospace',fontSize:11,fontWeight:600,color:'rgba(255,250,235,0.95)',letterSpacing:1}}>${c.hudBR}</div>
</div></div>;}

function MetaStrip(){const ref=useReveal();const facts=[['Client',PROJECT.client],['Role',PROJECT.role],['Team',PROJECT.team],['Timeline',PROJECT.period],['Platform',PROJECT.platform]];return<div ref={ref} className="reveal" style={{marginBottom:40}}><WindowCard padding={0}><div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',borderTop:\`2px solid \${RT.glassBorder}\`}}>{facts.map(([k,v],i)=><div key={k} style={{padding:'18px 20px',borderRight:i<4?\`1.5px solid \${RT.glassBorder}\`:'none'}}><div style={{fontFamily:RT.fontUI,fontSize:10.5,fontWeight:700,color:RT.ink3,textTransform:'uppercase',letterSpacing:1}}>{k}</div><div style={{marginTop:6,fontFamily:RT.fontDisplay,fontSize:15,fontWeight:600,color:RT.ink,lineHeight:1.25}}>{v}</div></div>)}</div></WindowCard></div>;}

function SectionHead({id,kicker,title}){return<header id={id} style={{scrollMarginTop:110,marginBottom:22}}><Kicker>{kicker}</Kicker><h2 style={{margin:'8px 0 0',fontFamily:RT.fontDisplay,fontSize:42,fontWeight:700,color:RT.ink,letterSpacing:-1.2,lineHeight:1.1,textWrap:'balance'}}>{title}</h2></header>;}

function Problem(){const ref=useReveal();return<section ref={ref} className="reveal" style={{marginBottom:60}}><SectionHead id="problem" kicker="01 · the problem" title={${JSON.stringify(c.problem.head)}}/><div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:26,marginTop:8}}><div className="prose" dangerouslySetInnerHTML={{__html:\`${c.problem.col1}\`}}/><div className="glass" style={{padding:24,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)'}}><Kicker>constraints</Kicker><ul className="prose" style={{marginTop:12}}>${c.problem.col2.split('</li>').filter(s=>s.includes('<li>')).map(li=>`<li style={{fontFamily:RT.fontUI,fontSize:15,lineHeight:1.6,fontWeight:500,margin:'0 0 10px',paddingLeft:24,position:'relative'}}>${li.replace(/<\/?li>/g,'').trim()}</li>`).join('')}</ul></div></div></section>;}

const STEPS = ${JSON.stringify(c.process)};
function Process(){const ref=useReveal();return<section ref={ref} className="reveal" style={{marginBottom:60}}><SectionHead id="process" kicker="02 · process" title="Five steps from the brief to the build."/><div style={{display:'flex',flexDirection:'column',gap:14}}>{STEPS.map((s,i)=><div key={s.n} className="glass glass-hover" style={{position:'relative',display:'grid',gridTemplateColumns:'80px 1fr',gap:22,padding:'22px 26px',background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(18px) saturate(140%)',WebkitBackdropFilter:'blur(18px) saturate(140%)',boxShadow:'0 14px 28px -14px rgba(40,25,10,0.30)'}}><div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}><div style={{fontFamily:RT.fontDisplay,fontSize:38,fontWeight:700,color:RT.accent,lineHeight:1,letterSpacing:-1}}>{s.n}</div>{i<STEPS.length-1&&<div style={{width:2,flex:1,marginTop:10,marginLeft:18,background:RT.glassBorderHi,opacity:0.5}}/>}</div><div><h3 style={{margin:0,fontFamily:RT.fontDisplay,fontSize:22,fontWeight:700,color:RT.ink,letterSpacing:-0.5}}>{s.label}</h3><p style={{margin:'8px 0 0',fontFamily:RT.fontUI,fontSize:15,fontWeight:500,lineHeight:1.6,color:RT.ink2}}>{s.body}</p></div></div>)}</div></section>;}

const FEATURES = ${JSON.stringify(c.features)};
function Solution(){const ref=useReveal();return<section ref={ref} className="reveal" style={{marginBottom:60}}><SectionHead id="solution" kicker="03 · solution" title={${JSON.stringify(c.solutionHead)}}/><div className="glass" style={{marginBottom:22,position:'relative',background:\`${c.solutionCanvas}\`,border:\`2px solid \${RT.glassBorder}\`,borderRadius:22,aspectRatio:'21 / 10',overflow:'hidden',boxShadow:'0 24px 50px -22px rgba(40,25,10,0.50)'}}><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 30%,rgba(255,255,255,0.25),transparent 55%),radial-gradient(circle at 70% 75%,rgba(0,0,0,0.18),transparent 55%)'}}/><div style={{position:'absolute',inset:0,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,padding:32}}>{${JSON.stringify(c.solutionPhases)}.map((label,i)=><div key={label} style={{background:'rgba(255,250,235,0.90)',border:\`2.5px solid \${RT.ink}\`,borderRadius:14,boxShadow:'0 14px 28px -10px rgba(0,0,0,0.35)',display:'flex',flexDirection:'column',overflow:'hidden'}}><div style={{padding:'8px 12px',borderBottom:\`1.5px solid \${RT.glassBorder}\`,fontFamily:'"JetBrains Mono",monospace',fontSize:10.5,fontWeight:600,color:RT.ink2,letterSpacing:0.8,textTransform:'uppercase'}}>0{i+1} · {label}</div><div style={{flex:1,background:\`linear-gradient(180deg,oklch(0.82 0.06 \${200-i*25}),oklch(0.58 0.09 \${190-i*25}))\`,position:'relative'}}><div style={{position:'absolute',bottom:10,left:10,fontFamily:'"JetBrains Mono",monospace',fontSize:9,fontWeight:600,color:'rgba(255,255,255,0.80)',letterSpacing:0.5}}>panel</div></div></div>)}</div></div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>{FEATURES.map((f,i)=><div key={f.title} className="glass glass-hover" style={{padding:22,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(18px) saturate(140%)',WebkitBackdropFilter:'blur(18px) saturate(140%)',boxShadow:'0 14px 28px -14px rgba(40,25,10,0.30)'}}><div style={{display:'inline-block',padding:'4px 10px',borderRadius:999,background:[RT.green,RT.yellow,RT.pink][i],border:\`1.5px solid \${RT.ink}\`,fontFamily:RT.fontUI,fontSize:10.5,fontWeight:800,color:RT.ink,letterSpacing:0.6,textTransform:'uppercase'}}>{f.tag}</div><h3 style={{margin:'12px 0 0',fontFamily:RT.fontDisplay,fontSize:22,fontWeight:700,color:RT.ink,letterSpacing:-0.5,lineHeight:1.2}}>{f.title}</h3><p style={{margin:'10px 0 0',fontFamily:RT.fontUI,fontSize:14,fontWeight:500,lineHeight:1.6,color:RT.ink2}}>{f.body}</p></div>)}</div></section>;}

const STATS = ${JSON.stringify(c.outcome.stats)};
function Outcome(){const ref=useReveal();const accentMap={RT_accent:RT.accent,'RT.accent':RT.accent,'RT.green':RT.green,'RT.yellow':RT.yellow};return<section ref={ref} className="reveal" style={{marginBottom:60}}><SectionHead id="outcome" kicker="04 · outcome" title={${JSON.stringify(c.outcome.head)}}/><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>{STATS.map((s,i)=><div key={s.label} className="glass" style={{padding:26,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(18px) saturate(140%)',WebkitBackdropFilter:'blur(18px) saturate(140%)'}}><div style={{fontFamily:RT.fontDisplay,fontSize:56,fontWeight:700,color:[RT.accent,RT.green,RT.yellow][i],lineHeight:1,letterSpacing:-2}}>{s.val}</div><div style={{marginTop:10,fontFamily:RT.fontUI,fontSize:12.5,fontWeight:700,color:RT.ink2,letterSpacing:0.4,textTransform:'uppercase'}}>{s.label}</div></div>)}</div><div className="glass" style={{padding:32,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:22,backdropFilter:'blur(18px) saturate(140%)',WebkitBackdropFilter:'blur(18px) saturate(140%)',borderLeft:\`5px solid \${RT.accent}\`}}><Kicker>quote</Kicker><blockquote style={{margin:'14px 0 0',fontFamily:RT.fontDisplay,fontSize:24,fontWeight:600,fontStyle:'italic',color:RT.ink,lineHeight:1.45,letterSpacing:-0.4,maxWidth:760}}>${c.outcome.quote}</blockquote><div style={{marginTop:18,fontFamily:RT.fontUI,fontSize:12,fontWeight:700,color:RT.ink3,letterSpacing:0.5,textTransform:'uppercase'}}>${c.outcome.attr}</div></div></section>;}

function Reflection(){const ref=useReveal();return<section ref={ref} className="reveal" style={{marginBottom:60}}><SectionHead id="reflection" kicker="05 · reflection" title="What I'd do differently."/><div className="prose" style={{maxWidth:720}} dangerouslySetInnerHTML={{__html:\`${c.reflection}\`}}/></section>;}

function OnThisPage(){const[active,setActive]=useState('overview');useEffect(()=>{const io=new IntersectionObserver(entries=>{const vis=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(vis[0])setActive(vis[0].target.id);},{rootMargin:'-30% 0px -55% 0px'});SECTIONS.forEach(s=>{const el=document.getElementById(s.id);if(el)io.observe(el);});return()=>io.disconnect();},[]);return<aside style={{position:'sticky',top:110,alignSelf:'start'}}><div className="glass" style={{padding:18,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)'}}><Kicker>on this page</Kicker><nav style={{marginTop:12,display:'flex',flexDirection:'column',gap:2}}>{SECTIONS.map(s=><a key={s.id} href={\`#\${s.id}\`} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,background:active===s.id?RT.innerFill:'transparent',color:active===s.id?RT.ink:RT.ink2,fontFamily:RT.fontUI,fontSize:13,fontWeight:active===s.id?700:500,textDecoration:'none',transition:'background 0.2s,color 0.2s'}}><span style={{width:6,height:6,borderRadius:'50%',background:active===s.id?RT.accent:RT.glassBorderHi}}/>{s.label}</a>)}</nav></div><div className="glass" style={{marginTop:12,padding:18,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)'}}><Kicker>share</Kicker><div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8}}><a href="Resume.html" style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',borderRadius:10,background:RT.innerFill,border:\`1.5px solid \${RT.glassBorder}\`,textDecoration:'none',fontFamily:RT.fontUI,fontSize:12.5,fontWeight:600,color:RT.ink}}><span>Read the resume</span><span>↗</span></a><a href="Portfolio.html" style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',borderRadius:10,background:RT.innerFill,border:\`1.5px solid \${RT.glassBorder}\`,textDecoration:'none',fontFamily:RT.fontUI,fontSize:12.5,fontWeight:600,color:RT.ink}}><span>All projects</span><span>↗</span></a></div></div></aside>;}

function PrevNext(){const idx=PORTFOLIO_PROJECTS.findIndex(p=>p.slug===PROJECT.slug);const prev=PORTFOLIO_PROJECTS[(idx-1+PORTFOLIO_PROJECTS.length)%PORTFOLIO_PROJECTS.length];const next=PORTFOLIO_PROJECTS[(idx+1)%PORTFOLIO_PROJECTS.length];const card=(p,dir)=><a href={p.href} style={{textDecoration:'none',flex:1}}><div className="glass glass-hover" style={{padding:22,background:RT.glassFill,border:\`2px solid \${RT.glassBorder}\`,borderRadius:18,backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)',borderLeft:dir==='next'?\`5px solid \${RT.accent}\`:\`2px solid \${RT.glassBorder}\`,borderRight:dir==='prev'?\`5px solid \${RT.accent}\`:\`2px solid \${RT.glassBorder}\`,textAlign:dir==='prev'?'left':'right'}}><Kicker>{dir==='prev'?'← previous':'next →'}</Kicker><div style={{marginTop:6,fontFamily:RT.fontDisplay,fontSize:22,fontWeight:700,color:RT.ink,letterSpacing:-0.5,lineHeight:1.15}}>{p.title}</div><div style={{marginTop:4,fontFamily:RT.fontUI,fontSize:12.5,fontWeight:600,color:RT.ink2}}>{p.client} · {p.period}</div></div></a>;return<section style={{marginTop:60,display:'flex',gap:16}}>{card(prev,'prev')}{card(next,'next')}</section>;}

function App(){const[theme,toggleTheme]=useTheme();return<div style={{minHeight:'100vh',position:'relative'}}>{theme==='light'?<SiteRoom theme={theme}/>:<DarkAmbient/>}<CursorSpotlight/><div style={{position:'relative',zIndex:2}}><SiteTopBar theme={theme} toggleTheme={toggleTheme}/><main style={{maxWidth:1180,margin:'0 auto',padding:'120px 32px 60px'}}><CaseHero/><CoverArt/><MetaStrip/><div id="overview" style={{scrollMarginTop:110}}/><div style={{display:'grid',gridTemplateColumns:'1fr 240px',gap:40,alignItems:'start'}}><div><Problem/><Process/><Solution/><Outcome/><Reflection/></div><OnThisPage/></div><PrevNext/><footer style={{marginTop:60,padding:'20px 6px',display:'flex',justifyContent:'space-between',fontFamily:RT.fontUI,fontWeight:600,fontSize:12,color:RT.ink2}}><span>© 2026 Andri Saputro</span><span>Designed in Jakarta · made with care</span></footer></main></div></div>;}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
</script>
</body>
</html>`;
}

// Write all 4 files
for (const c of CASES) {
  const html = renderCase(c);
  const path = `${OUT}/${c.file}`;
  writeFileSync(path, html, 'utf8');
  console.log(`✓ ${c.file} (${Math.round(html.length/1024)}kb)`);
}
console.log('\nAll 4 case studies written.');
