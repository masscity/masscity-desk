// Test: generate the case study code string and check for JS syntax errors
import fs from 'fs';

const BRIDGE = 'http://127.0.0.1:3845';

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

const code = `
const sections = ${JSON.stringify(CASE_SECTIONS)};
return 'sections ok: ' + sections.length;
`;

// Write it out so we can inspect
fs.writeFileSync('C:/Users/Andri Saputro/Documents/Claude/masscity-desk/case_code_test.js', code, 'utf8');
console.log('Code length:', code.length, 'chars');

// Syntax check locally
try {
  const fn = new Function(code);
  const r = fn();
  console.log('Local syntax OK:', r);
} catch(e) {
  console.log('Local syntax ERROR:', e.message);
}

// Send to bridge
const res = await fetch(`${BRIDGE}/api/inject`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code, timeout_ms: 10000 }),
});
const data = await res.json();
console.log('Figma result:', data);
