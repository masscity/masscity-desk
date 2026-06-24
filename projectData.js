export const projects = {

  pataland: {
    id: "pataland",
    name: "PataLand",
    subtitle: "Social Entertainment Metaverse",
    color: "#6B7B5E",
    tags: ["METAVERSE", "CROSS-PLATFORM", "SOCIAL", "ENTERTAINMENT"],
    period: "2022 — 2024",
    client: "In-house (Paradimensi)",
    tools: "Figma · Blender · Adobe · Unity · CorelDraw · Trello",
    roles: ["Product Designer", "Lead Design", "Visual Designer", "Game Designer"],
    problem: {
      sub: "Entertainment and social were fragmented. Fans had no shared space with the artists they loved.",
      text: "Online entertainment was stuck in passive mode — streams you watch, feeds you scroll, concerts you sit through. PataLand's challenge was to design a social-entertainment metaverse where users weren't just audiences but active participants. That meant solving identity, presence, and real-time interaction simultaneously — across a web platform that had to work across Southeast Asia's wildly varied device landscape.",
      constraints: [
        "Web-based — no app install, must run in browser across device tiers.",
        "Real-time multi-user presence without the lag that kills social immersion.",
        "Designed to scale: from a 5-person social space to a 500-person virtual concert.",
      ],
    },
    process: {
      sub: "From competitive audit to live events — a 2-year design lifecycle.",
      steps: [
        { num: "01", title: "Landscape Mapping", desc: "Audited Roblox, VRChat, Gather.town, and Concert platforms to extract what made users stay — and what made them leave. Persistent identity and low-friction entry were the two constants." },
        { num: "02", title: "Product Lifecycle Management", desc: "Managed the product lifecycle by translating stakeholder requirements into functional specifications and UX logic. Led technical discussions with developers to ensure seamless system integration before assigning tasks to the creative team." },
        { num: "03", title: "Space Architecture", desc: "Designed modular virtual spaces in Blender — concert halls, social plazas, game zones — built to be remixed for different events without re-engineering the whole environment." },
        { num: "04", title: "Interaction System", desc: "Prototyped avatar interaction, emote systems, and live event UX in Figma. Led technical reviews with Unity devs to ensure every animation and UI state was buildable in the agreed timeline." },
        { num: "05", title: "Live Events & Iteration", desc: "Ran 3+ live virtual concerts and social events across 5 countries. Gathered real-time feedback and iterated on crowd flow, stage visibility, and social space density between events." },
      ],
    },
    solution: {
      sub: "A metaverse where the event is the UI — not a screen you stare at.",
      content: "PataLand launched as a web-based Social Entertainment Metaverse where users attended virtual concerts, hung out with avatars of friends and artists, and played games inside persistent social spaces. As Lead Designer I architected the UX system, ran cross-functional design-dev syncs, and managed the full product lifecycle from 2022 to 2024 — shipping 3+ virtual events across 5 countries.",
    },
    stats: [
      { value: "3+",  label: "Virtual Events Shipped" },
      { value: "5",   label: "Countries" },
      { value: "2",   label: "Years Active" },
      { value: "5",   label: "Team Members Led" },
    ],
    reflection: "The hardest design problems on PataLand weren't screens — they were the invisible social dynamics that determine whether people actually want to stay. Getting that right meant obsessing over the 30 seconds after a user spawns in, not the onboarding flow.",
    link: "https://www.behance.net/muhamadsaputro1",
  },

  parachute: {
    id: "parachute",
    name: "Mobile Parachute MR",
    subtitle: "VR Military Parachute Training System",
    color: "#5C6B4A",
    tags: ["VR/MR", "MILITARY SIM", "3D DESIGN", "HARDWARE"],
    period: "March 2025 — July 2025",
    client: "UpTrans Teknologi, Bandung Simulator Group",
    tools: "Blender · Unreal Engine 5",
    roles: ["3D Designer", "Lead Design", "Game Tester"],
    problem: {
      sub: "Live parachute training costs 500M+ IDR per session and puts trainees at real physical risk.",
      text: "Indonesia Air Force Academy students must complete parachute training before deployment. Live training flights cost over 500 million Rupiah per session and carry real risk of injury. UpTrans Teknologi needed a hardware-integrated VR simulator that was accurate enough to replace portions of live training — synchronizing a 100km² virtual environment with physical hardware controls that tilt, rotate, and simulate wind and water effects.",
      constraints: [
        "Military-grade accuracy — any mismatch between VR and hardware breaks the training value.",
        "100km² environment with seamless terrain streaming — no pop-in mid-jump.",
        "Physical rig must sync to VR at <20ms latency to prevent simulator sickness.",
      ],
    },
    process: {
      sub: "Five months from brief to a simulator that trains real soldiers.",
      steps: [
        { num: "01", title: "Technical Briefing", desc: "Deep session with UpTrans Teknologi and Bandung Simulator Group engineers. Mapped the hardware spec — how the physical rig tilts, rotates, and generates wind/water resistance — before touching any design work." },
        { num: "02", title: "Environment Research", desc: "Studied existing flight and parachute simulators (military and commercial). Identified the three failure modes that break training value: terrain inaccuracy, latency between hardware and VR, and poor wind-force visualization." },
        { num: "03", title: "100km² Environment Design", desc: "Built the VR terrain in Blender — modular landscape tiles assembled into a 100km² drop zone with altitude markers, landing zones, wind corridors, and water landing areas. Optimized for UE5's Nanite streaming." },
        { num: "04", title: "Hardware-VR Synchronization", desc: "Worked with engineers to design the visual feedback layer that mirrors physical rig movement — ensuring tilt, rotation, and vibration feedback in UE5 matched the hardware state in real time." },
        { num: "05", title: "Scenario Testing", desc: "Built and tested 5 training scenarios with increasing complexity: basic descent, crosswind correction, night jump, water landing, and emergency malfunction. Validated with academy instructors across 4 weeks of iteration." },
      ],
    },
    solution: {
      sub: "500M+ IDR saved per session. Zero risk to trainees.",
      content: "A hardware-integrated Mixed Reality parachute simulator deployed at Indonesia Air Force Academy. The system covers 100km² of VR terrain synchronized with a physical rig that tilts, rotates, and simulates wind and water effects. Five training scenarios of escalating difficulty replace a full cycle of live training flights — saving over 500 million Rupiah per session and eliminating physical risk to trainees in the learning phase.",
    },
    stats: [
      { value: "500M+", label: "IDR Saved Per Session" },
      { value: "5",     label: "Training Scenarios" },
      { value: "5 mo",  label: "Timeline" },
      { value: "TNI AU",label: "Client" },
    ],
    reflection: "Working on defense tech taught me that design decisions have real stakes. When the system you built determines whether a trainee reacts correctly mid-jump, precision beats creativity every time. The hardest part wasn't the 3D — it was earning the trust of military instructors who'd spent 20 years doing this the live way.",
    link: "https://www.behance.net/muhamadsaputro1",
  },

  vlux: {
    id: "vlux",
    name: "Lighting Kungfu",
    subtitle: "Lighting Design Software + VR",
    color: "#C4A882",
    tags: ["DESKTOP APP", "VR", "B2B", "ARCHITECTURE"],
    period: "2025 — Ongoing",
    client: "Cube Studio (in-house product)",
    tools: "Figma · Blender · Unreal Engine 5 · CorelDraw · Notion",
    roles: ["Product Designer", "UI/UX Designer"],
    problem: {
      sub: "Professional lighting tools terrify casual users. Consumer tools don't satisfy professionals.",
      text: "Interior lighting design sits in an awkward middle — professional tools like Dialux are dense and intimidating for homeowners and casual designers, while consumer apps lack the technical precision that lighting consultants need. Vlux's design challenge was to build a single product that could serve both without compromising either — using progressive disclosure to hide complexity until it was actually needed.",
      constraints: [
        "One product, two radically different user types: lighting engineers and homeowners.",
        "Real-time rendering at professional accuracy — inside Unreal Engine 5.",
        "VR walkthrough must work on standard PC hardware without dedicated VR rigs.",
      ],
    },
    process: {
      sub: "Progressive disclosure as a product philosophy, not just a pattern.",
      steps: [
        { num: "01", title: "Competitive Audit", desc: "Deep-dived Dialux, AGi32, and consumer tools like RoomSketcher. Mapped where professionals hit ceilings on consumer apps and where casual users hit walls on pro tools — those gaps became the design brief." },
        { num: "02", title: "User Interviews", desc: "Interviewed 8 lighting consultants and 12 interior design enthusiasts. The finding that shaped everything: professionals don't want a simpler tool — they want a faster one. Casual users don't need more features — they need more confidence." },
        { num: "03", title: "Progressive Disclosure System", desc: "Designed a layered control system: Simple mode shows luminaire placement and color temperature. Expert mode surfaces intensity curves, lux calculations, and unit conversions. Same interface, different depth." },
        { num: "04", title: "VR Integration", desc: "Designed the VR walkthrough handoff — how a user goes from desktop lighting editor to standing inside their own design without losing context. Defined the interaction model for in-VR adjustments." },
        { num: "05", title: "Roadmap & Monetization", desc: "Defined the product roadmap and monetization framework: subscription base, premium asset packs (luminaire libraries), and custom preset bundles for studios. Aligned the feature backlog to the revenue model." },
      ],
    },
    solution: {
      sub: "One tool. Two users. Infinite configurations.",
      content: "Vlux is a desktop-first indoor lighting design application built on Unreal Engine 5. Progressive disclosure separates the consumer and professional experience at the UI layer — same product, different depth on demand. Users can design a room in Simple mode in under 10 minutes, then walk through it in VR without leaving the application. Aimed at both lighting professionals needing technical precision and homeowners who just want to see their space.",
    },
    stats: [
      { value: "2",      label: "User Types Served" },
      { value: "PC+VR",  label: "Platforms" },
      { value: "UE5",    label: "Engine" },
      { value: "Active", label: "Status" },
    ],
    reflection: "Designing for two radically different users in one product forced me to treat progressive disclosure as a philosophy, not a pattern. The question isn't 'how do we hide complexity' — it's 'how do we respect two different definitions of what this tool should do'.",
    link: "https://www.behance.net/muhamadsaputro1",
  },

  gotechup: {
    id: "gotechup",
    name: "GoTechUp URC",
    subtitle: "International Robotics Competition for Schools",
    color: "#7A8C6E",
    tags: ["EDTECH", "GAMIFICATION", "WEB APP", "MULTI-COUNTRY"],
    period: "2023 — Ongoing",
    client: "GoTechUp Malaysia & Singapore",
    tools: "Figma · Blender · Notion",
    roles: ["UI/UX Designer", "Level Designer", "3D Designer"],
    problem: {
      sub: "Robotics education is expensive, hardware-heavy, and stops at the classroom door.",
      text: "Traditional robotics training requires physical kits that most schools in developing regions can't afford or maintain. Students in Malaysia and Singapore were engaged in class but had no way to compete internationally or practice beyond school hours. GoTechUp needed a web-based platform that could simulate robotics challenges gamefully — leveled by age, accessible without hardware, and scalable to international competition.",
      constraints: [
        "Must run in a school browser — no app install, no special hardware.",
        "Content for ages 10–16 across 6 countries with different curricula.",
        "Judging system must support international competition without in-person oversight.",
      ],
    },
    process: {
      sub: "21 levels designed across 6 countries — and counting.",
      steps: [
        { num: "01", title: "Stakeholder Discovery", desc: "Workshop sessions with GoTechUp's team in Kuala Lumpur and Singapore. Mapped the existing competition format, identified what couldn't translate online, and defined what a gamified version needed to preserve." },
        { num: "02", title: "Classroom Research", desc: "Observed robotics lessons and mapped where engagement dropped. The pattern: students lost interest when challenges were purely theoretical with no visual feedback. Gamification wasn't cosmetic — it was the fix." },
        { num: "03", title: "Level Architecture", desc: "Designed a 21-level progression system grouped by age band. Each level introduces one new robotics concept — sensors, loops, pathfinding — escalating in complexity while staying within curriculum scope for each country." },
        { num: "04", title: "3D Environment Design", desc: "Built 3D simulated robotics environments in Blender — modular arenas that could be reassembled for different challenge types. Designed to render fast in-browser on mid-range school hardware." },
        { num: "05", title: "Pilot & International Rollout", desc: "Piloted with 3 schools in Malaysia before rolling out to 6 countries. Iterated on difficulty calibration and localization requirements — the same level had to feel fair in Singapore and Indonesia simultaneously." },
      ],
    },
    solution: {
      sub: "The competition came to the classroom — and then to 6 countries.",
      content: "A web-based gamified LMS that simulates robotics challenges across 21 progressive levels, enabling students aged 10–16 to compete internationally without physical hardware. I designed the full level architecture, 3D simulation environments, and UI system. At rollout, 100+ participants competed across 6 countries — including Malaysia, Singapore, and Indonesia.",
    },
    stats: [
      { value: "21",   label: "Levels Designed" },
      { value: "6",    label: "Countries" },
      { value: "100+", label: "Participants" },
      { value: "10–16",label: "Age Range" },
    ],
    reflection: "This project proved that gamification, done right, doesn't just make things fun — it creates genuine motivation that bridges real skill gaps. Seeing kids in different countries compete on equal footing, without needing a robotics kit, was the real outcome.",
    link: "https://www.behance.net/muhamadsaputro1",
  },

  metaverse: {
    id: "metaverse",
    name: "Mobile Metaverse",
    subtitle: "Integrating brands into one social ecosystem.",
    color: "#8B6B8B",
    tags: ["MOBILE", "METAVERSE", "SOCIAL", "BRAND INTEGRATION"],
    period: "2022 — 2023",
    client: "Techpolitan",
    tools: "Blender · Unity · Internal PM Tool",
    roles: ["Business Development", "Project Manager", "3D Design"],
    problem: {
      sub: "Brands lived in silos. Users lived on feeds.",
      text: "Techpolitan is a mobile Metaverse project to integrate brands under PT. Walden Global Service into one social-ecosystem to promote and sell digital goods and services. The challenge was to create a unified virtual space where multiple brands could coexist, interact with users, and drive engagement — all within a mobile-first experience.",
      constraints: [
        "Must integrate multiple brands under one parent company into a cohesive experience.",
        "Mobile-first — smooth performance on mid-range Android and iOS devices.",
        "Social ecosystem that promotes and sells digital goods and services.",
      ],
    },
    process: {
      sub: "From brand audit to social ecosystem — wearing three hats.",
      steps: [
        { num: "01", title: "Brand Ecosystem Mapping", desc: "Audited all brands under PT. Walden Global Service to understand their digital presence, product offerings, and target audiences. Identified overlaps and gaps that a unified metaverse could address." },
        { num: "02", title: "Business Development", desc: "Defined the business case for a unified social-ecosystem: how integrated brand presence could drive cross-selling, increase engagement time, and create new digital goods revenue streams." },
        { num: "03", title: "3D Environment Design", desc: "Designed the virtual spaces in Blender — brand zones, social areas, and marketplace environments. Each space had to feel distinct to the brand while cohesive within the overall metaverse aesthetic." },
        { num: "04", title: "Project Management", desc: "Managed the development pipeline using internal PM tools. Coordinated across brand stakeholders, engineering, and creative teams to maintain scope and timeline alignment." },
        { num: "05", title: "Integration & Launch", desc: "Integrated brand experiences into the Unity-built mobile app. Ensured consistent performance across devices while maintaining visual quality that represented each brand accurately." },
      ],
    },
    solution: {
      sub: "One social ecosystem for multiple brands.",
      content: "A mobile Metaverse that integrates brands under PT. Walden Global Service into one social-ecosystem to promote and sell digital goods and services. Each brand maintains its identity while users flow naturally between experiences. Commerce feels native to the social space, not bolted on.",
    },
    stats: [
      { value: "1",    label: "Unified Social Ecosystem" },
      { value: "3",    label: "Roles Held Simultaneously" },
      { value: "2",    label: "Platforms (Android & iOS)" },
      { value: "1 yr", label: "Project Timeline" },
    ],
    reflection: "This was the first project where I held business development, project management, and 3D design roles simultaneously. The breadth taught me how every design decision has a business consequence — and vice versa.",
    link: "https://www.behance.net/muhamadsaputro1",
  },

};
