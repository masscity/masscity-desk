import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { projects } from "./projectData.js";
import { VignetteShader } from "three/addons/shaders/VignetteShader.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let glbLoadFailed = false;

//Audio with Howler.js
const sounds = {
  backgroundMusic: new Howl({
    src: ["./sfx/massobeats_chamomile.ogg"],
    loop: true,
    volume: 0.3,
    preload: true,
  }),

  projectsSFX: new Howl({
    src: ["./sfx/projects.ogg"],
    volume: 0.5,
    preload: true,
  }),

  pokemonSFX: new Howl({
    src: ["./sfx/pokemon.ogg"],
    volume: 0.5,
    preload: true,
  }),

  Chair: new Howl({
    src: ["./sfx/chair.ogg"],
    volume: 0.5,
    preload: true,
  }),

  jumpSFX: new Howl({
    src: ["./sfx/jumpsfx.ogg"],
    volume: 1.0,
    preload: true,
  }),
};

let touchHappened = false;

let isMuted = false;

function playSound(soundId) {
  if (!isMuted && sounds[soundId]) {
    sounds[soundId].play();
  }
}

function stopSound(soundId) {
  if (sounds[soundId]) {
    sounds[soundId].stop();
  }
}

const pressedButtons = {
  up: false,
  down: false,
  left: false,
  right: false
};

//three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0dbd4);
// Very subtle fog — just barely softens the deepest far edges, not visible as fog
scene.fog = new THREE.FogExp2(0xe0dbd4, 0.004);
const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('DOMContentLoaded', () => {
  const message = document.getElementById('dynamicMessage');
  const phrases = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
  let current = 0;

  setInterval(() => {
    current = (current + 1) % phrases.length;
    message.textContent = phrases[current];
  }, 400);
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.0;

// Some of our DOM elements, others are scattered in the file
let isModalOpen = false;
const modal = document.querySelector(".modal");
const modalbgOverlay = document.querySelector(".modal-bg-overlay");
const modalTitle = document.querySelector(".modal-title");
const modalProjectDescription = document.querySelector(
  ".modal-project-description"
);
const modalExitButton = document.querySelector(".modal-exit-button");
const modalVisitProjectButton = document.querySelector(
  ".modal-project-visit-button"
);
const modalHint = document.querySelector(".modal-hint");
const themeToggleButton = document.querySelector(".theme-mode-toggle-button");
const firstIcon = document.querySelector(".first-icon");
const secondIcon = document.querySelector(".second-icon");

const audioToggleButton = document.querySelector(".audio-toggle-button");
const introBrand        = document.getElementById("introBrand");
const firstIconTwo = document.querySelector(".first-icon-two");
const secondIconTwo = document.querySelector(".second-icon-two");

// Modal stuff
const modalContent = {
  PC: {
    title: "I don't design products to control users.",
    content: "I design them to give people what they already want — just faster.\n\n5 years shipping SaaS, metaverses & VR simulators across Southeast Asia.",
    buttonLabel: "View Portfolio →",
    onAction: "portfolio",
  },
  PataLand: {
    title: "PataLand — Social Entertainment Metaverse",
    backgroundColor: "#1a3a6aff",
    content:
      "Web-based Social Entertainment Metaverse where people gather to socialize while enjoying virtual concerts, games, and engaging with artists. As Lead Designer, I architected a user-behavior tracking system and managed the full product lifecycle.\n\nIn-house (Paradimensi) · 2022–2024\nRoles: Product Designer · Lead Design · Visual Designer · Game Designer\nTools: Figma · Blender · Adobe · Unity · CorelDraw · Trello",
    link: "Case-Parachute.html#pataland",
  },
  Vlux: {
    title: "Vlux — Lighting Design Software + VR",
    backgroundColor: "#0d1a3aff",
    content:
      "Software specifically for designing indoor lighting with real-time render. Developed with Unreal Engine 5 for maximum realistic level — intended for experts for serious work and casual users who like to design. Includes VR experience integrated.\n\nCube Studio (in-house) · 2025 — Ongoing\nRoles: Product Designer · UI/UX Designer\nTools: Figma · Blender · Unreal Engine 5 · CorelDraw · Notion",
    link: "Case-Parachute.html#vlux",
  },
  GoTechUp: {
    title: "GoTechUp URC — International Robotics Competition",
    backgroundColor: "#1a2e5aff",
    content:
      "Web-based gamified simulation software for robotics education. A premier international competition — 21 levels, 6 countries, 100+ participants. Includes GTU+ Dashboard as central hub for sales, admin, and virtual classroom.\n\nClient: GoTechUp Malaysia & Singapore · 2023 — Ongoing\nRoles: UI/UX Designer · Level Designer · 3D Designer\nTools: Figma · Blender · Notion",
    link: "Case-Parachute.html#edutech",
  },
  Parachute: {
    title: "Parachute MR Simulator",
    backgroundColor: "#0a1e0aff",
    content:
      "Hardware-integrated VR parachute simulator for Indonesia Air Force Academy. Physical rig tilts, rotates, and simulates wind/water effects across a 100km² environment. Saves 500M+ IDR per training session and removes live-jump risk from the learning phase.\n\nClient: UpTrans Teknologi, Bandung Simulator Group · March–July 2025\nRoles: 3D Designer · Lead Design · Game Tester",
    link: "Case-Parachute.html",
  },
  PictureFrame: {
    title: "gallery.png",
    backgroundColor: "#ea7b36ff",
    images: [
        "./media/IMG_01.png",
        "./media/IMG_02.png",
        "./media/IMG_03.png",
        "./media/IMG_04.png",
        "./media/IMG_05.png"
    ],
    captions: [
        "Visiting Hong Kong",
        "Presenting Cube Studio to Teten Masduki, former Indonesia Minister of Cooperatives and SMEs",
        "Eno Bening visiting Paradimensi's booth at Comicon 2023",
        "In front of Simulation Building in Indonesia Air Force Academy",
        "Teaching Korean interns from Hanbat University"
    ]
  },
};

let currentModalId = null;
let currentImageIndex = 0;

function showModal(id) {
  const content = modalContent[id];
  if (content) {
    currentModalId = id;

    modalTitle.textContent = content.title;
    modalProjectDescription.textContent = content.content || "";
    modalProjectDescription.style.display = content.content ? "block" : "none";

    currentImageIndex = 0;

    if (content.images && content.images.length > 0) {
      document.getElementById('modalImage').src = content.images[currentImageIndex];
      var cap = document.getElementById('imageCaption');
      if (cap) cap.textContent = (content.captions && content.captions[currentImageIndex]) || '';
      document.querySelector('.modal-image-container').classList.remove('hidden');
    } else {
      document.querySelector('.modal-image-container').classList.add('hidden');
    }

    if (modalVisitProjectButton) {
      if (content.link) {
        modalVisitProjectButton.href = content.link;
        modalVisitProjectButton.classList.remove("hidden");
      } else {
        modalVisitProjectButton.classList.add("hidden");
      }
    }

    // Kill any in-flight animations from a previous open/close
    gsap.killTweensOf(modal);
    gsap.killTweensOf(modalbgOverlay);

    // Remove hidden so elements are in the DOM but invisible
    modal.classList.remove("hidden");
    modalbgOverlay.classList.remove("hidden");
    if (modalHint) modalHint.classList.remove("hidden");
    isModalOpen = true;

    // Set initial state: backdrop invisible, modal below viewport
    gsap.set(modal, { clearProps: "transform" });
    gsap.set(modalbgOverlay, { clearProps: "opacity" });
    gsap.set(modalbgOverlay, { opacity: 0 });
    gsap.set(modal, { y: window.innerHeight + 100 });

    if (prefersReducedMotion) {
      gsap.set(modalbgOverlay, { opacity: 1 });
      gsap.set(modal, { y: 0 });
    } else {
      // Animate: backdrop fades in first, then modal slides up
      const tl = gsap.timeline();
      tl.to(modalbgOverlay, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .to(modal, { y: 0, duration: 0.5, ease: "power3.out" }, "-=0.15");
    }
  }
}

function hideModal() {
  if (!isModalOpen) return;
  isModalOpen = false;

  if (modalHint) modalHint.classList.add("hidden");

  if (prefersReducedMotion) {
    modal.classList.add("hidden");
    modalbgOverlay.classList.add("hidden");
    gsap.set(modal, { clearProps: "transform" });
    gsap.set(modalbgOverlay, { clearProps: "opacity" });
    if (!isMuted) playSound("projectsSFX");
    return;
  }

  const tl = gsap.timeline();
  // Slide modal down and fade backdrop simultaneously
  tl.to(modal, { y: window.innerHeight + 100, duration: 0.4, ease: "power3.in" }, 0)
    .to(modalbgOverlay, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0)
    .add(() => {
      modal.classList.add("hidden");
      modalbgOverlay.classList.add("hidden");
      gsap.set(modal, { clearProps: "transform" });
      gsap.set(modalbgOverlay, { clearProps: "opacity" });
      if (!isMuted) playSound("projectsSFX");
    });
}

document.getElementById('prevImage').addEventListener('click', () => {
    const content = modalContent[currentModalId];
    if (!content?.images || content.images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + content.images.length) % content.images.length;
    document.getElementById('modalImage').src = content.images[currentImageIndex];
    var cap = document.getElementById('imageCaption');
    if (cap) cap.textContent = (content.captions && content.captions[currentImageIndex]) || '';
});

document.getElementById('nextImage').addEventListener('click', () => {
    const content = modalContent[currentModalId];
    if (!content?.images || content.images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % content.images.length;
    document.getElementById('modalImage').src = content.images[currentImageIndex];
    var cap = document.getElementById('imageCaption');
    if (cap) cap.textContent = (content.captions && content.captions[currentImageIndex]) || '';
});

// Our Intersecting objects
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Objects that get a floating label + glow on hover (primary actions only)
const hoverLabelMap = {
  "Behance":      "Visit Behance",
  "Cube":         "Visit Cube Studio",
  "CV":           "View Resume",
  "Dribbble":     "Visit Dribbble",
  "IG":           "Visit Instagram",
  "Kompas":       "Read Article",
  "Linkedin":     "Visit LinkedIn",
  "PC":           "View Portfolio",
  "PictureFrame": "Open Gallery",
  "Project_01":   "Open PataLand",
  "Project_02":   "Open Lighting Kungfu",
  "Project_03":   "Open GoTechUp URC",
  "Project_04":   "Open Parachute MR Sim",
  "Project_05":   "Open Techpolverse",
  "TTT":          "View Post",
};

const projectLiftNames = new Set(["Project_01", "Project_02", "Project_03", "Project_04", "Project_05"]);

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
  "Ball",
  "Behance",
  "Chair",
  "Cube",
  "CV",
  "Door",
  "Dribbble",
  "IG",
  "Kompas",
  "Lamp01",
  "Lamp02",
  "Linkedin",
  "PC",
  "Phone",
  "PictureFrame",
  "Project_01",
  "Project_02",
  "Project_03",
  "Project_04",
  "Project_05",
  "Pusheen",
  "Speakers",
  "Switch",
  "TTT",
];

// Loading screen and loading manager
// See: https://threejs.org/docs/#api/en/loaders/managers/LoadingManager
const loadingScreen = document.getElementById("loadingScreen");
const loadingText = document.querySelector("#dynamicMessage");
const enterButton = document.querySelector(".enter-button");
const instructions = document.querySelector(".instructions");

const manager = new THREE.LoadingManager();

manager.onProgress = function (url, loaded, total) {
  const percent = Math.round((loaded / total) * 100);
  const fill = document.getElementById("progressFill");
  if (fill) fill.style.transform = `scaleX(${percent / 100})`;
};

manager.onLoad = function () {
  const fill = document.getElementById("progressFill");
  const phase1 = document.getElementById("loadingPhase1");
  const phase2 = document.getElementById("loadingPhase2");
  if (fill) fill.style.transform = "scaleX(1)";

  // If the 3D scene failed to load, show the error state instead
  if (glbLoadFailed) {
    const phaseError = document.getElementById("loadingPhaseError");
    if (phase1) gsap.set(phase1, { opacity: 0, height: 0 });
    if (phaseError) phaseError.classList.add("visible");
    return;
  }

  if (prefersReducedMotion) {
    gsap.set(phase1, { opacity: 0, height: 0 });
    gsap.set(phase2, { height: "auto", opacity: 1 });
    gsap.set(enterButton, { opacity: 1 });
    return;
  }

  const t1 = gsap.timeline();

  // Step 1: fade out Phase 1 (Loading word + progress bar)
  t1.to(phase1, {
    opacity: 0,
    duration: 0.4,
    ease: "power2.inOut",
  });

  // Step 2: collapse Phase 1 height so Phase 2 can take its place
  t1.to(phase1, {
    height: 0,
    duration: 0.3,
    ease: "power2.inOut",
  });

  // Step 3: expand Phase 2 height (name + role + divider)
  t1.to(phase2, {
    height: "auto",
    duration: 0.35,
    ease: "power2.out",
  });

  // Step 4: fade in Phase 2
  t1.to(phase2, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
  }, "-=0.2");

  // Step 5: reveal Enter button
  t1.to(enterButton, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
  }, "-=0.1");
};

enterButton.addEventListener("click", () => {
  // ── Sounds ──────────────────────────────────────────────────────────
  if (!isMuted) {
    playSound("projectsSFX");
    playSound("backgroundMusic");
  }

  // ── Fade out loading screen ──────────────────────────────────────────
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => loadingScreen.remove(),
  });

  // ── Intro orbit animation ────────────────────────────────────────────
  // Derive spherical coordinates from the default camera position & target
  // so the animation always lands exactly on the correct isometric view.
  const tgt    = controls.target.clone();          // (0, 1, 0)
  const defPos = new THREE.Vector3(60, 45, 67);    // default camera position
  const rel    = defPos.clone().sub(tgt);          // relative to target

  const radius = rel.length();                     // ≈ 100
  const polar  = Math.atan2(                       // elevation angle ≈ 1.11 rad
    Math.sqrt(rel.x * rel.x + rel.z * rel.z), rel.y
  );
  const endAz   = Math.atan2(rel.x, rel.z);        // default azimuth  ≈  0.73 rad
  const startAz = endAz - Math.PI / 3;             // start 60° to the left

  // Proxy object that GSAP will tween
  const proxy = { az: startAz, zoom: 8 };

  // Applies proxy values → camera position + zoom each frame
  function applyProxy() {
    const sinP = Math.sin(polar);
    const cosP = Math.cos(polar);
    camera.position.set(
      tgt.x + radius * sinP * Math.sin(proxy.az),
      tgt.y + radius * cosP,
      tgt.z + radius * sinP * Math.cos(proxy.az)
    );
    camera.zoom = proxy.zoom;
    camera.updateProjectionMatrix();
    camera.lookAt(tgt);
  }

  // Lock controls
  controls.enabled = false;

  if (prefersReducedMotion) {
    // Skip orbit: snap directly to the final camera position
    proxy.az = endAz;
    proxy.zoom = 15;
    applyProxy();
    controls.target.set(tgt.x, tgt.y, tgt.z);
    controls.update();
    controls.enabled = true;
    hudBar.classList.add("visible");
    gsap.set(introBrand, { opacity: 1 });
    gsap.to(introBrand, { opacity: 0, duration: 0.1, delay: 2.6 });
  } else {
    // Snap camera to the orbit start position while still hidden behind loading screen
    applyProxy();

    // Orbit 60° horizontally + zoom in — runs as loading screen fades
    gsap.to(proxy, {
      az:       endAz,
      zoom:     15,
      duration: 2.8,
      delay:    0.4,
      ease:     "power2.inOut",
      onUpdate: applyProxy,
      onComplete: () => {
        // Sync OrbitControls internals to the final camera state, then unlock
        controls.target.set(tgt.x, tgt.y, tgt.z);
        controls.update();
        controls.enabled = true;
        hudBar.classList.add("visible");

        // Brand flash — fades in with the HUD, then fades out after 2 s
        gsap.to(introBrand, { opacity: 1, duration: 0.6, ease: "power2.out" });
        gsap.to(introBrand, { opacity: 0, duration: 0.8, ease: "power2.in", delay: 2.6 });
      },
    });
  }
});

//Audio

// Holds all materials named "Emission" so toggleTheme can control them
const emissionMaterials = [];

// GLTF + Draco Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader);
loader.load(
  "./Web-draco.glb",
  function (glb) {
    const model = glb.scene;
    scene.add(model);

    // Set up animation mixer
    const mixer = new THREE.AnimationMixer(model);
    window.mixer = mixer; // store globally so you can access later
    window.gltfAnimations = glb.animations;

    // Optional: auto-play animations on load (like Sphere)
    glb.animations.forEach((clip) => {
      if (clip.name === "Sphere.Action") {
        const action = mixer.clipAction(clip);
        action.play();
        action.setLoop(THREE.LoopRepeat); // loop forever
      }
    });

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // ── Critical: convert MeshBasicMaterial → MeshStandardMaterial ──
        // Blender often exports flat/shadeless materials (MeshBasicMaterial)
        // which completely ignore Three.js lights. This swap preserves the
        // original color/texture while making the mesh actually respond to light.
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat, i) => {
          if (mat && mat.type === "MeshBasicMaterial") {
            const upgraded = new THREE.MeshStandardMaterial({
              color: mat.color.clone(),
              map: mat.map || null,
              roughness: 0.82,
              metalness: 0.0,
              envMapIntensity: 0.4,
            });
            if (Array.isArray(child.material)) {
              child.material[i] = upgraded;
            } else {
              child.material = upgraded;
            }
          } else if (mat && mat.type === "MeshStandardMaterial") {
            // Already standard — just tune roughness for softer look
            mat.roughness = Math.max(mat.roughness, 0.75);
            mat.metalness = Math.min(mat.metalness, 0.3);
          }
        });

        // YellowTranslucent material — semi-transparent at 0.8
        const mats2 = Array.isArray(child.material) ? child.material : [child.material];
        mats2.forEach((mat) => {
          if (mat && mat.name === "YellowTranslucent") {
            mat.transparent = true;
            mat.opacity = 0.8;
          }

          // Emission material — off in day, glowing at night
          if (mat && mat.name === "Emission") {
            // emissive color must NOT be black or nothing will glow
            // copy the base color so it glows in its own color
            mat.emissive = mat.color.clone();
            mat.emissiveIntensity = 0; // start off (day mode)
            emissionMaterials.push(mat);
          }
        });

        // Add all meshes for raycasting
        intersectObjects.push(child);
      }
    });

    // Store Empty_Laptop world position for camera look-at
    const laptopEmpty = model.getObjectByName("Empty_Laptop");
    if (laptopEmpty) {
      laptopEmpty.getWorldPosition(laptopLookAt);
      console.log("Empty_Laptop found at", laptopLookAt);
    } else {
      console.warn("Empty_Laptop not found in GLB");
    }

  },
  undefined,
  function (error) {
    console.error("GLB load failed:", error);
    glbLoadFailed = true;
  }
);

console.log("Meshes in intersectObjects:", intersectObjects.map(obj => obj.name));

// ══════════════════════════════════════════════════════════════════
// LIGHTING SETUP — targeting the reference soft isometric look
//
// Strategy:
//   1. Low HemisphereLight — lifts shadows just enough, doesn't flatten
//   2. Strong angled DirectionalLight — the main shading across walls
//   3. Two window SpotLights — warm patches of light on floor/walls
//   4. Soft shadow radius — blurred edges, not hard lines
// ══════════════════════════════════════════════════════════════════

// 1 ── Hemisphere: low intensity so it only lifts the darkest areas
//      Does NOT dominate — just prevents pure black shadows
const light = new THREE.HemisphereLight(
  0xfff8f0, // sky: near-white warm — floods the room with bright soft light
  0xd4b896, // ground: warm wood-tan bounce
  1.6        // reduced from 2.5 — less fill in shadowed areas = darker shadows
);
scene.add(light);

// 2 ── Main sun: angled to create clear contrast between the two visible walls
//
//      In isometric view the camera looks from (+X, +Y, +Z) toward origin.
//      Two walls are visible: the LEFT wall (faces +Z) and the BACK wall (faces +X).
//      Sun comes from the LEFT side → left wall is LIT, back wall is in SHADOW.
//      This wall-to-wall contrast is exactly what makes the reference look 3D.
const sun = new THREE.DirectionalLight(0xffecd0, 0.8); // gentle warm sun — adds soft wall shading
sun.castShadow = true;
sun.position.set(-8, 10, 6);        // left-side, slightly front — lights the left wall
sun.target.position.set(0, 1, 0);
sun.shadow.mapSize.width  = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.left   = -8;
sun.shadow.camera.right  =  8;
sun.shadow.camera.top    =  8;
sun.shadow.camera.bottom = -8;
sun.shadow.normalBias = 0.05;
sun.shadow.bias       = -0.001;
sun.shadow.radius     = 6;
scene.add(sun.target);
scene.add(sun);

// Secondary fill from the opposite side — much dimmer — lifts the shadowed wall slightly
// so it reads as "dark" not "black", just like the reference
const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.0);
fillLight.position.set(8, 6, -6);   // right-back, no shadow
fillLight.castShadow = false;
scene.add(fillLight);

// 3a ── Window SpotLight — matches the back-left window in the scene (the blind/shade)
//       Shoots through from outside the back-left wall, landing on the floor
const windowLight1 = new THREE.SpotLight(0xfffae8, 0);
windowLight1.position.set(-4, 5, -5);  // outside back-left wall
windowLight1.angle    = Math.PI / 8;
windowLight1.penumbra = 0.9;
windowLight1.decay    = 1.0;
windowLight1.distance = 16;
windowLight1.castShadow = true;
windowLight1.shadow.radius     = 12;
windowLight1.shadow.mapSize.width  = 1024;
windowLight1.shadow.mapSize.height = 1024;
windowLight1.shadow.bias = -0.002;
scene.add(windowLight1);

const wl1Target = new THREE.Object3D();
wl1Target.position.set(0, 0, 2);    // patch lands on the floor center
scene.add(wl1Target);
windowLight1.target = wl1Target;

// 3b ── Second window light — right wall, softer, creates a secondary warm patch
const windowLight2 = new THREE.SpotLight(0xfffae8, 0);
windowLight2.position.set(5, 5, -5);
windowLight2.angle    = Math.PI / 9;
windowLight2.penumbra = 0.92;
windowLight2.decay    = 1.0;
windowLight2.distance = 14;
windowLight2.castShadow = false;
scene.add(windowLight2);

const wl2Target = new THREE.Object3D();
wl2Target.position.set(-1, 0, 2);
scene.add(wl2Target);
windowLight2.target = wl2Target;

const mainLight = new THREE.RectAreaLight(0xffffff, 2, 10); // (color, intensity, distance)
mainLight.position.set(0, 4, 2); // X, Y, Z coordinates
mainLight.rotation.x = -Math.PI / 2; // tilt it downward
mainLight.visible = false; // start hidden (dark mode OFF)
scene.add(mainLight);

/*const spotLight = new THREE.SpotLight(0xdea728, 1, 1); // (color, intensity, distance)
spotLight.position.set(0, 2, 0); // X, Y, Z coordinates
spotLight.angle = Math.PI / 15;      // Narrow cone
spotLight.penumbra = 1;           // Slight softness
spotLight.distance = 20;
spotLight.visible = true; // start hidden (dark mode OFF)
scene.add(spotLight);

const spotlighttarget = new THREE.Object3D();
spotlighttarget.position.set(-1.5, 0, -1.3); // Directly below the light
scene.add(spotlighttarget);

spotLight.target = spotlighttarget;*/

// Desk lamp SpotLight — warm golden cone aimed straight down, toggled by Lamp02
const pointLight = new THREE.SpotLight(0xdea728, 1, 21);
pointLight.position.set(-1.6, 1, 0.3);
pointLight.angle = Math.PI / 4;
pointLight.penumbra = 0.2;
pointLight.decay = 1;
pointLight.visible = false;
scene.add(pointLight);

const pointLightTarget = new THREE.Object3D();
pointLightTarget.position.set(-1.6, 0, 0.3); // directly below — 90° down
scene.add(pointLightTarget);
pointLight.target = pointLightTarget;

// Lamp01 SpotLight — focused warm cone (like a reading/desk spotlight)
// Toggled independently by clicking Lamp01 in the scene
const lamp01Light = new THREE.SpotLight(0xffd17a, 8);
lamp01Light.position.set(-0.57, 1.6, -1.2);  // above the desk lamp on the right side of desk
lamp01Light.angle = Math.PI / 4;
lamp01Light.penumbra = 0.45;
lamp01Light.decay = 6;
lamp01Light.distance = 5;
lamp01Light.castShadow = false;
lamp01Light.visible = false;
scene.add(lamp01Light);

// Lamp01 target — aimed down at the desk surface below the lamp
const lamp01Target = new THREE.Object3D();
lamp01Target.position.set(0.5, 0, -1.15);
scene.add(lamp01Target);
lamp01Light.target = lamp01Target;

// Monitor glow — cool blue-white light from the PC screen
// Subtle (low intensity, short range) but adds life to the desk area
const monitorLight = new THREE.PointLight(0x6ab0f5, 2, 3);
monitorLight.position.set(0.1, 1.1, -0.9); // approx in front of PC screen
scene.add(monitorLight);

// Camera Stuff
// See: https://threejs.org/docs/?q=orth#api/en/cameras/OrthographicCamera
const aspect = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -aspect * 50,
  aspect * 50,
  50,
  -50,
  1,
  1000
);

// Set camera higher and slightly back
camera.position.set(60, 45, 67); // raised Y to 60
const cameraOffset = new THREE.Vector3(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0); // adjust target height here
controls.update();

camera.zoom = 15;
camera.updateProjectionMatrix();

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = true;

controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};

// Zoom limits (orthographic camera uses zoom, not distance)
controls.minZoom = 10;   // can zoom out further if needed
controls.maxZoom = 200;   // stop user from getting too close

// Prevent camera from going under the ground
controls.minPolarAngle = Math.PI / 4;  // ~45 degrees
controls.maxPolarAngle = Math.PI / 2;  // 90 degrees (horizontal)

controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,   // hold left to rotate
  MIDDLE: THREE.MOUSE.DOLLY,  // scroll/middle to zoom
  RIGHT: THREE.MOUSE.PAN      // hold right to move camera
};

controls.update();
controls.enableDamping = true; // smoother motion
controls.update();

// ── Post-processing stack: Bloom → FXAA ─────────────────────────
// FXAA goes last so it smooths everything including bloom edges
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  0.01,  // strength
  0.3,   // radius
  0.95   // threshold
);
composer.addPass(bloomPass);

// Outline — highlights hovered objects with a coloured edge
const outlinePass = new OutlinePass(
  new THREE.Vector2(sizes.width, sizes.height),
  scene,
  camera
);
outlinePass.edgeStrength  = 4;
outlinePass.edgeGlow      = 0.5;
outlinePass.edgeThickness = 1.5;
outlinePass.visibleEdgeColor.set("#ffffff");
outlinePass.hiddenEdgeColor.set("#ffffff");
composer.addPass(outlinePass);

// Vignette — darkens screen edges, draws eye to the room center
const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms["offset"].value   = 0.9;  // how far from center it starts (higher = smaller vignette)
vignettePass.uniforms["darkness"].value = 1.4;  // how dark the edges get (1 = none, 2 = very dark)
composer.addPass(vignettePass);

// FXAA — smooths all jagged/aliased edges in one pass
// resolution uniform must match the actual pixel size
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms["resolution"].value.set(
  1 / (sizes.width  * renderer.getPixelRatio()),
  1 / (sizes.height * renderer.getPixelRatio())
);
composer.addPass(fxaaPass);

// Handle when window resizes
function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const aspect = sizes.width / sizes.height;
  camera.left = -aspect * 50;
  camera.right = aspect * 50;
  camera.top = 50;
  camera.bottom = -50;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.setSize(sizes.width, sizes.height);
  fxaaPass.material.uniforms["resolution"].value.set(
    1 / (sizes.width  * renderer.getPixelRatio()),
    1 / (sizes.height * renderer.getPixelRatio())
  );
}

// Interact with Objects and Raycaster
let isCharacterReady = true;

function jumpCharacter(meshID) {
  if (!isCharacterReady) return;

  const mesh = scene.getObjectByName(meshID);
  const jumpHeight = 0.3;
  const jumpDuration = 0.5;
  const isSnorlax = meshID === "Snorlax";

  const currentScale = {
    x: mesh.scale.x,
    y: mesh.scale.y,
    z: mesh.scale.z,
  };

  const t1 = gsap.timeline();

  t1.to(mesh.scale, {
    x: isSnorlax ? currentScale.x * 1.2 : 1.2,
    y: isSnorlax ? currentScale.y * 0.8 : 0.8,
    z: isSnorlax ? currentScale.z * 1.2 : 1.2,
    duration: jumpDuration * 0.2,
    ease: "power2.out",
  });

  t1.to(mesh.scale, {
    x: isSnorlax ? currentScale.x * 0.8 : 0.8,
    y: isSnorlax ? currentScale.y * 1.3 : 1.3,
    z: isSnorlax ? currentScale.z * 0.8 : 0.8,
    duration: jumpDuration * 0.3,
    ease: "power2.out",
  });

  t1.to(
    mesh.position,
    {
      y: mesh.position.y + jumpHeight,
      duration: jumpDuration * 0.5,
      ease: "power2.out",
    },
    "<"
  );

  t1.to(mesh.scale, {
    x: isSnorlax ? currentScale.x * 1.2 : 1,
    y: isSnorlax ? currentScale.y * 1.2 : 1,
    z: isSnorlax ? currentScale.z * 1.2 : 1,
    duration: jumpDuration * 0.3,
    ease: "power1.inOut",
  });

  t1.to(
    mesh.position,
    {
      y: mesh.position.y,
      duration: jumpDuration * 0.5,
      ease: "bounce.out",
      onComplete: () => {
        isCharacterReady = true;
      },
    },
    ">"
  );

  if (!isSnorlax) {
    t1.to(mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: jumpDuration * 0.2,
      ease: "elastic.out(1, 0.3)",
    });
  }
}

function onClick() {
  if (touchHappened) return;
  if (screenIsOpen) return;
  handleInteraction();
}

function onMouseMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  touchHappened = false;
}

function onTouchEnd(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  touchHappened = true;
  handleInteraction();
}

// Movement and Gameplay functions
function respawnCharacter() {
  character.instance.position.copy(character.spawnPosition);

  playerCollider.start
    .copy(character.spawnPosition)
    .add(new THREE.Vector3(0, CAPSULE_RADIUS, 0));
  playerCollider.end
    .copy(character.spawnPosition)
    .add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0));

  playerVelocity.set(0, 0, 0);
  character.isMoving = false;
}

function playerCollisions() {
  const result = colliderOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;
    playerCollider.translate(result.normal.multiplyScalar(result.depth));

    if (playerOnFloor) {
      character.isMoving = false;
      playerVelocity.x = 0;
      playerVelocity.z = 0;
    }
  }
}

function onKeyDown(event) {
  if (event.code.toLowerCase() === "keyr") {
    respawnCharacter();
    return;
  }

  switch (event.code.toLowerCase()) {
    case "keyw":
    case "arrowup":
      pressedButtons.up = true;
      break;
    case "keys":
    case "arrowdown":
      pressedButtons.down = true;
      break;
    case "keya":
    case "arrowleft":
      pressedButtons.left = true;
      break;
    case "keyd":
    case "arrowright":
      pressedButtons.right = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.code.toLowerCase()) {
    case "keyw":
    case "arrowup":
      pressedButtons.up = false;
      break;
    case "keys":
    case "arrowdown":
      pressedButtons.down = false;
      break;
    case "keya":
    case "arrowleft":
      pressedButtons.left = false;
      break;
    case "keyd":
    case "arrowright":
      pressedButtons.right = false;
      break;
  }
}

function toggleTheme() {
  const isDarkTheme = document.body.classList.contains("dark-theme");

  // Kill any in-progress tweens before starting new ones
  // Prevents bloom/light values spiking when toggled too fast
  gsap.killTweensOf(bloomPass);
  gsap.killTweensOf(light);
  gsap.killTweensOf(light.color);
  gsap.killTweensOf(light.groundColor);
  gsap.killTweensOf(sun);
  gsap.killTweensOf(sun.color);
  gsap.killTweensOf(monitorLight);
  gsap.killTweensOf(windowLight1);
  gsap.killTweensOf(windowLight2);
  gsap.killTweensOf(fillLight);
  emissionMaterials.forEach(mat => gsap.killTweensOf(mat));

  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");

  // Icon switching (if applicable)
  if (firstIcon.style.display === "none") {
    firstIcon.style.display = "block";
    secondIcon.style.display = "none";
  } else {
    firstIcon.style.display = "none";
    secondIcon.style.display = "block";
  }

  const bgColor = isDarkTheme ? 0xe0dbd4 : 0x11183D;
  scene.background = new THREE.Color(bgColor);
  scene.fog.color.set(bgColor);

  // HemisphereLight sky color
  // light → warm cream #fff4e8, dark → very dark night #0d1117
  gsap.to(light.color, {
    r: isDarkTheme ? 1.000 : 0.051,
    g: isDarkTheme ? 0.957 : 0.067,
    b: isDarkTheme ? 0.910 : 0.090,
    duration: 2,
    ease: "power2.inOut",
  });

  // HemisphereLight ground bounce color
  // light → warm tan #d4b896, dark → dim ember #1a0d04
  gsap.to(light.groundColor, {
    r: isDarkTheme ? 0.831 : 0.102,
    g: isDarkTheme ? 0.722 : 0.051,
    b: isDarkTheme ? 0.588 : 0.016,
    duration: 2,
    ease: "power2.inOut",
  });

  gsap.to(light, {
    intensity: isDarkTheme ? 1.6 : 1.6,
    duration: 2,
    delay: isDarkTheme ? 0.25 : 0,  // going to day: slight delay so bloom dies first
    ease: "power2.inOut",
  });

  // Sun — strong in light mode, nearly off in dark
  gsap.to(sun.color, {
    r: isDarkTheme ? 1.000 : 0.120,
    g: isDarkTheme ? 0.929 : 0.120,
    b: isDarkTheme ? 0.816 : 0.180,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(sun, {
    intensity: isDarkTheme ? 0.8 : 0.0,
    duration: 0.1,
    ease: "power2.inOut",
  });

  // Window lights — always off for both day and night
  gsap.to(windowLight1, { intensity: 0, duration: 1, ease: "power2.inOut" });
  gsap.to(windowLight2, { intensity: 0, duration: 1, ease: "power2.inOut" });

  // Fill light — always off
  gsap.to(fillLight, { intensity: 0, duration: 0.1, ease: "power2.inOut" });

  // mainLight (ceiling) — on in night, off in day
  mainLight.visible = !isDarkTheme;

  // lamp01Light (spotlight) — on in night, off in day
  lamp01Light.visible = !isDarkTheme;

  // Emission material — off in day, bright glow at night
  emissionMaterials.forEach((mat) => {
    gsap.to(mat, {
      emissiveIntensity: isDarkTheme ? 0 : 3,
      duration: 1,
      ease: "power2.inOut",
    });
  });

  // Monitor glow — brighter at night
  gsap.to(monitorLight, {
    intensity: isDarkTheme ? 0.5 : 0,
    duration: 1,
    ease: "power2.inOut",
  });

  // Bloom — night→day: kill bloom FIRST (0.3s) before lights ramp up
  //          day→night: lights dim first, then bloom grows after 0.4s delay
  if (isDarkTheme) {
    // Going to day — bloom out instantly, then lights follow
    gsap.to(bloomPass, { strength: 0.06, threshold: 0.95, duration: 0.3, ease: "power2.out" });
  } else {
    // Going to night — lights dim first, bloom comes in after
    gsap.to(bloomPass, { strength: 0.50, threshold: 0.70, duration: 0.8, delay: 0.5, ease: "power2.inOut" });
  }
}


// Toggle Audio Function
function toggleAudio() {
  if (!isMuted) {
    playSound("projectsSFX");
  }
  if (firstIconTwo.style.display === "none") {
    firstIconTwo.style.display = "block";
    secondIconTwo.style.display = "none";
    isMuted = false;
    sounds.backgroundMusic.play();
  } else {
    firstIconTwo.style.display = "none";
    secondIconTwo.style.display = "block";
    isMuted = true;
    sounds.backgroundMusic.pause();
  }
}

// Mobile controls
const mobileControls = {
  up: document.querySelector(".mobile-control.up-arrow"),
  left: document.querySelector(".mobile-control.left-arrow"),
  right: document.querySelector(".mobile-control.right-arrow"),
  down: document.querySelector(".mobile-control.down-arrow"),
};

function handleJumpAnimation() {
  if (!character.instance || !character.isMoving) return;

  const jumpDuration = 0.5;
  const jumpHeight = 2;

  const t1 = gsap.timeline();

  t1.to(character.instance.scale, {
    x: 1.08,
    y: 0.9,
    z: 1.08,
    duration: jumpDuration * 0.2,
    ease: "power2.out",
  });

  t1.to(character.instance.scale, {
    x: 0.92,
    y: 1.1,
    z: 0.92,
    duration: jumpDuration * 0.3,
    ease: "power2.out",
  });

  t1.to(character.instance.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: jumpDuration * 0.3,
    ease: "power1.inOut",
  });

  t1.to(character.instance.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: jumpDuration * 0.2,
  });
}

function handleContinuousMovement() {
  if (!character.instance) return;

  if (
    Object.values(pressedButtons).some((pressed) => pressed) &&
    !character.isMoving
  ) {
    if (!isMuted) {
      playSound("jumpSFX");
    }
    if (pressedButtons.up) {
      playerVelocity.z += MOVE_SPEED;
      targetRotation = 0;
    }
    if (pressedButtons.down) {
      playerVelocity.z -= MOVE_SPEED;
      targetRotation = Math.PI;
    }
    if (pressedButtons.left) {
      playerVelocity.x += MOVE_SPEED;
      targetRotation = Math.PI / 2;
    }
    if (pressedButtons.right) {
      playerVelocity.x -= MOVE_SPEED;
      targetRotation = -Math.PI / 2;
    }

    playerVelocity.y = JUMP_HEIGHT;
    character.isMoving = true;
    handleJumpAnimation();
  }
}

window.addEventListener("blur", () => {
  Object.keys(pressedButtons).forEach((key) => {
    pressedButtons[key] = false;
  });
});

// Adding Event Listeners (tbh could make some of these just themselves rather than seperating them, oh well)
modalExitButton.addEventListener("click", hideModal);
modalbgOverlay.addEventListener("click", hideModal);
themeToggleButton.addEventListener("click", toggleTheme);
audioToggleButton.addEventListener("click", toggleAudio);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick, { passive: false });
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchend", onTouchEnd, { passive: false });

// ── HUD Links Dropdown ───────────────────────────────────────────
const hudLinksBtn = document.getElementById("hudLinksBtn");
const hudDropdown = document.getElementById("hudDropdown");
let dropdownOpen  = false;

// Helper: find a mesh in the scene by its name (or parent's name)
function findMeshByName(name) {
  return intersectObjects.find(obj =>
    obj.name === name || (obj.parent && obj.parent.name === name)
  ) || null;
}

function openDropdown() {
  dropdownOpen = true;
  hudDropdown.classList.add("open");
  hudLinksBtn.classList.add("active");
}

function closeDropdown() {
  dropdownOpen = false;
  hudDropdown.classList.remove("open");
  hudLinksBtn.classList.remove("active");
  removeGlow();
}

hudLinksBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownOpen ? closeDropdown() : openDropdown();
});

// Close when clicking anywhere outside the dropdown
document.addEventListener("click", (e) => {
  if (dropdownOpen && !hudDropdown.contains(e.target)) closeDropdown();
});

// Per-item: glow on hover + click action
document.querySelectorAll(".hud-dropdown-item").forEach(item => {
  const meshName = item.dataset.mesh;
  const href     = item.dataset.href;
  const action   = item.dataset.action;

  // Hover → glow the matching 3D object
  item.addEventListener("mouseenter", () => {
    const mesh = findMeshByName(meshName);
    if (mesh) applyGlow(mesh);
  });
  item.addEventListener("mouseleave", () => removeGlow());

  // Click → open link or trigger action
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    closeDropdown();
    if (!isMuted) playSound("projectsSFX");

    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (action === "gallery") {
      showModal("PictureFrame");
    }
  });
});


function moveAndSpinChair() {
  const chair = scene.getObjectByName("Chair");
  if (!chair) return;

  gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(chair.position, { z: chair.position.z + 0.3, duration: 0.4 })
      .to(chair.rotation, { y: chair.rotation.y + Math.PI * 0.5, duration: 0.6 }, "<")
      .to(chair.position, { z: chair.position.z, duration: 0.4 })
      .to(chair.rotation, { y: chair.rotation.y, duration: 1.0 }, "<");
}

function nudgeBall() {
  const ball = scene.getObjectByName("Ball");
  if (!ball) return;

  gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(ball.position, { z: ball.position.z - 0.3, duration: 0.4 })
      .to(ball.rotation, { y: ball.rotation.y - Math.PI * 0.5, duration: 0.6 }, "<")
      .to(ball.position, { z: ball.position.z, duration: 0.4 })
      .to(ball.rotation, { y: ball.rotation.y, duration: 1.0 }, "<");
}

function swingDoor() {
  const door = scene.getObjectByName("Door");
  if (!door) return;

  gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(door.rotation, { y: door.rotation.y + Math.PI * 0.25, duration: 0.5 })
      .to(door.rotation, { y: door.rotation.y, duration: 0.6, ease: "bounce.out" });
}

function handleInteraction() {
  if (!modal.classList.contains("hidden")) return;
  if (screenIsOpen) return;

  raycaster.setFromCamera(pointer, camera);
const intersects = raycaster.intersectObjects(intersectObjects);

// Find the first clicked object that’s in your clickable list
const clicked = intersects.find(hit =>
    intersectObjectsNames.includes(hit.object.name) || intersectObjectsNames.includes(hit.object.parent.name)

);

if (!clicked) return;

const objectName = intersectObjectsNames.includes(clicked.object.name)
  ? clicked.object.name
  : clicked.object.parent.name;

console.log("Clicked object:", clicked.object.name, "Parent:", clicked.object.parent.name);

// 1️⃣ External links
const externalLinks = {
  Linkedin: "https://www.linkedin.com/in/masscity/",
  Behance: "https://www.behance.net/muhamadsaputro1",
  IG: "https://www.instagram.com/mass_city/",
  Dribbble: "https://dribbble.com/masscity",
  Phone: "https://mail.google.com/mail/?view=cm&fs=1&to=andri.saputro98@gmail.com&su=I+Found+Your+Website!",
  Cube: "https://www.instagram.com/cubestudio.id/",
  Kompas: "https://umkm.kompas.com/read/2022/04/20/170404883/mengintip-start-up-lokal-penyedia-produk-metaverse-ini-kisahnya",
  TTT: "https://www.instagram.com/p/DDMVfhApNpX/",
};

if (externalLinks[objectName]) {
  const url = externalLinks[objectName];
  const newTab = window.open(url, '_blank', 'noopener,noreferrer');
  if (newTab) newTab.focus(); // prevent it from being blocked
  return;
}

if (objectName === "Speakers") {
  toggleAudio();
  return;
}

// Lamp01 — standalone spotlight toggle (focused cone above desk)
if (objectName === "Lamp01") {
  lamp01Light.visible = !lamp01Light.visible;
  return;
}

// Lamp02 — day/night toggle; nearby desk light turns ON in dark, OFF in light
if (objectName === "Lamp02") {
  const willBeDark = !document.body.classList.contains("dark-theme");
  toggleTheme();
  pointLight.visible = willBeDark; // on when going dark, off when going light
  return;
}

// 3️⃣ Toggle theme when clicking the "Switch"
if (objectName === "Switch") {
  if (mainLight.visible) {
    mainLight.visible = false;
  } else {
    mainLight.visible = true;
  }
  return;
}

// 2️⃣ Special cases: Pokémon-like objects
if (objectName === "Pusheen") {
  if (!isMuted) playSound("pokemonSFX");
  jumpCharacter(objectName);
  return;
}

// 3️⃣ Animate Chair
if (objectName === "Chair") {
  moveAndSpinChair();
  if (!isMuted) playSound("Chair");
  return;
}

if (objectName === "Ball") {
  nudgeBall();
  return;
}

if (objectName === "Door") {
  swingDoor();
  return;
}

// 4️⃣ PC → open portfolio hub
if (objectName === "PC") {
  activeProject = "portfolio";
  openScreenUI();
  return;
}

// 5️⃣ CV → open resume
if (objectName === "CV") {
  activeProject = "resume";
  openScreenUI();
  return;
}

const projectMeshMap = {
  "Project_01": "pataland",
  "Project_02": "vlux",
  "Project_03": "gotechup",
  "Project_04": "parachute",
  "Project_05": "metaverse",
};
if (projectMeshMap[objectName]) {
  activeProject = projectMeshMap[objectName];
  openScreenUI();
  return;
}

// Fallback: open modal
showModal(objectName);
if (!isMuted) playSound("projectsSFX");
}

const clock = new THREE.Clock();

// Hover label + glow state
const hoverLabel     = document.getElementById("hoverLabel");
const hoverLabelText = document.getElementById("hoverLabelText");
let lastHoveredName = null; // track previous frame's hovered object name

const _worldPos = new THREE.Vector3();
const _projected = new THREE.Vector3();

function showHoverLabel(name, mesh) {
  hoverLabelText.textContent = hoverLabelMap[name];

  // Get world position of the mesh and offset upward for label anchor
  mesh.getWorldPosition(_worldPos);

  // Project world position to NDC, then to screen pixels
  _projected.copy(_worldPos);
  _projected.project(camera);
  const sx = ( _projected.x * 0.5 + 0.5) * sizes.width;
  const sy = (-_projected.y * 0.5 + 0.5) * sizes.height;

  // Position label above the object
  hoverLabel.style.left = sx + "px";
  hoverLabel.style.top  = (sy - 60) + "px";

  // Bounce in
  gsap.killTweensOf(hoverLabel);
  if (prefersReducedMotion) {
    gsap.set(hoverLabel, { opacity: 1, scale: 1, y: 0 });
  } else {
    gsap.to(hoverLabel, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      ease: "back.out(2.5)"
    });
  }
}

function hideHoverLabel() {
  gsap.killTweensOf(hoverLabel);
  if (prefersReducedMotion) {
    gsap.set(hoverLabel, { opacity: 0, scale: 0.8, y: 6 });
  } else {
    gsap.to(hoverLabel, {
      opacity: 0,
      scale: 0.8,
      y: 6,
      duration: 0.2,
      ease: "power2.in"
    });
  }
}

function applyGlow(mesh) {
  // Collect the mesh and its siblings (parent's children) for a full-object outline
  const targets = [];
  if (mesh.parent && mesh.parent.isMesh === false) {
    mesh.parent.traverse(c => { if (c.isMesh) targets.push(c); });
  } else {
    targets.push(mesh);
  }
  outlinePass.selectedObjects = targets;
}

function removeGlow() {
  outlinePass.selectedObjects = [];
}

// Like our movie strip!!! Calls on each frame.
function animate() {
  // When overlay is open, skip raycasting and orbit controls entirely
  if (screenIsOpen) {
    composer.render();
    return;
  }

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(intersectObjects);

  const hovered = intersects.find(hit =>
    intersectObjectsNames.includes(hit.object.name) ||
    intersectObjectsNames.includes(hit.object.parent.name)
  );

  const hoveredName = hovered
    ? (intersectObjectsNames.includes(hovered.object.name)
        ? hovered.object.name
        : hovered.object.parent.name)
    : null;

  document.body.style.cursor = hovered ? "pointer" : "default";

  // Label + glow — only update on change, not every frame
  if (hoveredName !== lastHoveredName) {
    if (hoveredName && hoverLabelMap[hoveredName]) {
      showHoverLabel(hoveredName, hovered.object);
      applyGlow(hovered.object);
    } else {
      hideHoverLabel();
      removeGlow();
    }
    // Lift/lower project meshes on hover
    if (lastHoveredName && projectLiftNames.has(lastHoveredName)) {
      const prev = scene.getObjectByName(lastHoveredName);
      if (prev) gsap.to(prev.position, { y: prev.userData.baseY ?? prev.position.y, duration: 0.3, ease: "power2.out" });
    }
    if (hoveredName && projectLiftNames.has(hoveredName)) {
      const mesh = scene.getObjectByName(hoveredName);
      if (mesh) {
        if (mesh.userData.baseY === undefined) mesh.userData.baseY = mesh.position.y;
        gsap.to(mesh.position, { y: mesh.userData.baseY + 0.04, duration: 0.3, ease: "power2.out" });
      }
    }
    lastHoveredName = hoveredName;
  }

  // Keep label position in sync as camera moves
  if (hoveredName && hoverLabelMap[hoveredName] && hovered) {
    hovered.object.getWorldPosition(_worldPos);
    _projected.copy(_worldPos);
    _projected.project(camera);
    const sx = ( _projected.x * 0.5 + 0.5) * sizes.width;
    const sy = (-_projected.y * 0.5 + 0.5) * sizes.height;
    hoverLabel.style.left = sx + "px";
    hoverLabel.style.top  = (sy - 60) + "px";
  }

  for (let i = 0; i < intersects.length; i++) {
    intersectObject = intersects[0].object.parent.name;
  }

  composer.render();
  if (!cameraIsAnimating && !screenIsOpen) controls.update();
}

renderer.setAnimationLoop(animate);

// ══════════════════════════════════════════════════════════════
// SCREEN UI — Portfolio viewer (opens when PC is clicked)
// ══════════════════════════════════════════════════════════════

const screenUI         = document.getElementById("screenUI");
const screenBackdrop   = document.getElementById("screenBackdrop");
const screenBackBtn    = document.getElementById("screenBackBtn");
const suTopbar         = document.getElementById("suTopbar");
const suNav            = document.getElementById("suNav");
const suFrame          = document.getElementById("suFrame");
const hudBar           = document.getElementById("hudBar");
const viewPortfolioBtn = document.getElementById("viewPortfolioBtn");
const viewResumeBtn    = document.getElementById("viewResumeBtn");
const hudHelpBtn       = document.getElementById("hudHelpBtn");
const tutorialOverlay  = document.getElementById("tutorialOverlay");

// Elements that hide when the portfolio/resume overlay opens
const sceneOnlyEls = [hudBar, tutorialOverlay].filter(Boolean);

let activeProject    = "pataland";
let screenIsOpen     = false;
let cameraIsAnimating = false;

const curtain      = document.getElementById("curtain");
const laptopLookAt = new THREE.Vector3(); // filled on model load
const camDefault   = { tx: 0, ty: 1, tz: 0, zoom: 15 }; // restored on close

// Project buttons removed — now handled by the Project dropdown in the site nav.

// ── Open / Close ─────────────────────────────────────────────
function openScreenUI() {
  if (screenIsOpen || cameraIsAnimating) return;
  screenIsOpen      = true;
  cameraIsAnimating = true;

  // Snapshot look-at + zoom to restore on close
  camDefault.tx   = controls.target.x;
  camDefault.ty   = controls.target.y;
  camDefault.tz   = controls.target.z;
  camDefault.zoom = camera.zoom;

  // Mount the container (transparent, just for layout + pointer-events)
  renderProject(activeProject);
  gsap.set(screenUI,       { opacity: 1 });
  gsap.set(screenBackdrop, { opacity: 0 });
  // Start children off-screen: header above, frame below
  gsap.set(suTopbar, { y: "-100%" });
  gsap.set(suFrame,  { y:  "100%" });
  screenUI.classList.add("open");
  screenBackdrop.classList.add("open");
  controls.enabled = false;
  hudBar.classList.remove("visible");
  sceneOnlyEls.forEach(el => el.classList.add("scene-hidden"));

  const tl = gsap.timeline();

  // 1. Zoom in
  tl.to(camera, {
    zoom: 40, duration: 0.9, ease: "power2.inOut",
    onUpdate: () => camera.updateProjectionMatrix()
  })

  // 2. Header slides in from top + frame slides in from bottom (simultaneous)
  .to(suTopbar, { y: "0%", duration: 0.55, ease: "power3.out" }, "+=0.05")
  .to(suFrame,  { y: "0%", duration: 0.55, ease: "power3.out" }, "<")

  // 3. Backdrop blur fades in
  .to(screenBackdrop, {
    opacity: 1, duration: 0.4, ease: "power2.out",
    onComplete: () => { cameraIsAnimating = false; }
  }, "-=0.2");
}

function closeScreenUI() {
  if (!screenIsOpen || cameraIsAnimating) return;
  cameraIsAnimating = true;

  const tl = gsap.timeline();

  // 1. Zoom out (runs behind the still-visible UI)
  tl.to(camera, {
    zoom: camDefault.zoom,
    duration: 0.7,
    ease: "power3.out",
    onUpdate: () => camera.updateProjectionMatrix()
  })

  // 2. Header slides out to top + frame slides out to bottom (simultaneous)
  .to(suTopbar, { y: "-100%", duration: 0.5, ease: "power3.in" })
  .to(suFrame,  { y:  "100%", duration: 0.5, ease: "power3.in" }, "<")

  // 3. Backdrop unblurs — reveals the already-zoomed-out room
  .to(screenBackdrop, { opacity: 0, duration: 0.4, ease: "power2.out" })

  // Cleanup
  .add(() => {
    screenUI.classList.remove("open");
    screenBackdrop.classList.remove("open");
    gsap.set(screenUI,  { clearProps: "opacity" });
    gsap.set(suTopbar,  { clearProps: "y" });
    gsap.set(suFrame,   { clearProps: "y" });
    controls.enabled = true;
    hudBar.classList.add("visible");
    sceneOnlyEls.forEach(el => el.classList.remove("scene-hidden"));
    screenIsOpen = false;
    suFrame.src = "";
    delete suFrame.dataset.project;
    controls.target.set(camDefault.tx, camDefault.ty, camDefault.tz);
    controls.update();
    cameraIsAnimating = false;
  });
}

screenBackBtn.addEventListener("click", closeScreenUI);
viewPortfolioBtn.addEventListener("click", () => { activeProject = "portfolio"; openScreenUI(); });
viewResumeBtn.addEventListener("click",    () => { activeProject = "resume";   openScreenUI(); });
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (isModalOpen) hideModal();
    else if (screenIsOpen) closeScreenUI();
  }
});

// ── HUD button hover glows ───────────────────────────────────────
// "View Portfolio" → glows the PC mesh
viewPortfolioBtn.addEventListener("mouseenter", () => {
  const mesh = findMeshByName("PC");
  if (mesh) applyGlow(mesh);
});
viewPortfolioBtn.addEventListener("mouseleave", () => removeGlow());

// "View Resume" → glows the CV mesh
viewResumeBtn.addEventListener("mouseenter", () => {
  const mesh = findMeshByName("CV");
  if (mesh) applyGlow(mesh);
});
viewResumeBtn.addEventListener("mouseleave", () => removeGlow());

// ? button toggles the nav guide tooltip
hudHelpBtn.addEventListener("click", () => {
  tutorialOverlay.classList.toggle("hidden");
});

// ── Sorry modal (WIP projects) ──────────────────────────────
const sorryOverlay = document.getElementById("sorryOverlay");
function openSorryModal() {
  sorryOverlay.classList.remove("hidden");
}
function closeSorryModal() {
  sorryOverlay.classList.add("hidden");
}
sorryOverlay.addEventListener("click", closeSorryModal);
sorryOverlay.querySelector(".sorry-panel").addEventListener("click", e => e.stopPropagation());
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "openSorryModal") openSorryModal();
});

// ── Intercept iframe navigation: always keep ?embed on page changes ──
let _skipNextLoad = false;
suFrame.addEventListener("load", () => {
  if (_skipNextLoad) { _skipNextLoad = false; return; }
  try {
    const loc = suFrame.contentWindow.location;
    const url  = loc.href;

    // Intercept navigation to individual case files → show sorry modal and go to portfolio
    const caseOnly = ["pataland", "vlux", "gotechup", "parachute", "metaverse"];
    for (const id of caseOnly) {
      const file = caseFiles[id];
      if (file && url.includes(file.split("/").pop())) {
        openSorryModal();
        _skipNextLoad = true;
        suFrame.src = caseFiles.portfolio + "?embed";
        activeProject = "portfolio";
        suFrame.dataset.project = "portfolio";
        updateTopbar("portfolio");
        return;
      }
    }

    if (url && url.includes(".html") && !url.includes("embed")) {
      suFrame.src = url + (url.includes("?") ? "&" : "?") + "embed";
    }
    // Sync the active nav tab if the new URL matches a known case file
    for (const [id, file] of Object.entries(caseFiles)) {
      if (url.includes(file.split("/").pop())) {
        activeProject = id;
        document.querySelectorAll(".su-nav-btn").forEach(b => {
          b.classList.toggle("active", b.dataset.project === id);
        });
        updateTopbar(id);
        break;
      }
    }
  } catch (e) { /* cross-origin guard */ }
});

// ── Project file map ────────────────────────────────────────
const caseFiles = {
  portfolio: "cases/Portfolio-standalone.html",
  pataland:  "cases/Case-Pataland.html",
  vlux:      "cases/Case-Vlux.html",
  gotechup:  "cases/Case-Edutech.html",
  parachute: "cases/Case-Parachute-standalone.html",
  metaverse: "cases/Case-Metaverse.html",
  resume:    "cases/masscitydesk_project_Resume-standalone.html",
};

// Accent colors for each section (resume gets a warm amber fallback)
const sectionColors = {
  resume: "#C4A26A",
  ...Object.fromEntries(Object.values(projects).map(p => [p.id, p.color])),
};

// ── CV button color ───────────────────────────────────────────
const suCvBtn    = document.getElementById("suCvBtn");
const suSiteNav  = document.getElementById("suSiteNav");
const RESUME_LINK    = "https://drive.google.com/file/d/1fS43JA80asxhomSJ7bch0yvdm1agD7Sk/view?usp=drive_link";
const PORTFOLIO_LINK = "https://drive.google.com/file/d/1gSBHp5xk_0T4R7v_0hZoqLNOEgP_BQn3/view?usp=sharing";

// ── Project dropdown (click-to-toggle, same pattern as HUD dropdown) ─────
const suProjectMenu    = document.getElementById("suProjectMenu");
const suProjectDropdown = document.querySelector(".su-sitenav-dropdown");
const suProjectBtn      = suProjectDropdown.querySelector(".su-sitenav-btn--dropdown");
let projectDropdownOpen = false;

Object.values(projects).forEach(p => {
  const item = document.createElement("button");
  item.className = "su-sitenav-dropdown__item";
  item.dataset.section = p.id;
  item.textContent = p.name;
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    closeProjectDropdown();
    if (activeProject === "portfolio") {
      try { suFrame.contentWindow.location.hash = p.id; } catch(ex) {}
    } else {
      selectProject("portfolio");
      suFrame.addEventListener("load", function onceLoaded() {
        suFrame.removeEventListener("load", onceLoaded);
        try { suFrame.contentWindow.location.hash = p.id; } catch(ex) {}
      }, { once: true });
    }
  });
  suProjectMenu.appendChild(item);
});

function openProjectDropdown() {
  projectDropdownOpen = true;
  suProjectDropdown.classList.add("open");
  suProjectBtn.classList.add("active");
}
function closeProjectDropdown() {
  projectDropdownOpen = false;
  suProjectDropdown.classList.remove("open");
  suProjectBtn.classList.remove("active");
}

suProjectBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  projectDropdownOpen ? closeProjectDropdown() : openProjectDropdown();
});
document.addEventListener("click", (e) => {
  if (projectDropdownOpen && !suProjectDropdown.contains(e.target)) closeProjectDropdown();
});

// ── Site nav active state ────────────────────────────────────
function setSiteNavActive(section) {
  document.querySelectorAll(".su-sitenav-btn[data-section]").forEach(b => {
    b.classList.toggle("active", b.dataset.section === section);
  });
}

// Site nav click handler
suSiteNav.addEventListener("click", e => {
  const btn = e.target.closest(".su-sitenav-btn[data-section]");
  if (!btn) return;
  const section = btn.dataset.section;
  if (section === "resume") {
    selectProject("resume");
  } else if (section === "portfolio") {
    selectProject("portfolio");
  } else {
    if (activeProject === "portfolio") {
      try { suFrame.contentWindow.location.hash = section; } catch(e) {}
    } else {
      selectProject("portfolio");
      suFrame.addEventListener("load", function onceLoaded() {
        suFrame.removeEventListener("load", onceLoaded);
        try { suFrame.contentWindow.location.hash = section; } catch(e) {}
      }, { once: true });
    }
  }
  setSiteNavActive(section);
});

function updateTopbar(id) {
  const isResume    = id === "resume";
  const isPortfolio = id === "portfolio";
  const color = sectionColors[id] || "#C4A26A";

  // Project tabs: hidden on resume + portfolio hub
  suNav.style.visibility = (isResume || isPortfolio) ? "hidden" : "visible";

  // Sync site nav active state — only Portfolio and Resume get highlighted.
  // Project button only highlights when user explicitly clicks a project from the dropdown.
  if (isResume) {
    setSiteNavActive("resume");
  } else if (isPortfolio) {
    setSiteNavActive("portfolio");
  } else {
    setSiteNavActive("");
  }

  // Button label + link switches between portfolio and resume
  suCvBtn.textContent = isResume ? "Download Resume" : "Download Portfolio";
  suCvBtn.href        = isResume ? RESUME_LINK : PORTFOLIO_LINK;
  suCvBtn.target      = "_blank";

  // Fill color
  suCvBtn.style.background  = color;
  suCvBtn.style.borderColor = color;
  suCvBtn.style.color       = "#fff";
}

// ── Project selection ────────────────────────────────────────
function selectProject(id) {
  activeProject = id;
  document.querySelectorAll(".su-nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.project === id);
  });
  updateTopbar(id);
  renderProject(id);
}

// ── Render project ───────────────────────────────────────────
function renderProject(id) {
  const src = (caseFiles[id] || caseFiles.pataland) + "?embed";
  if (suFrame.dataset.project !== id) {
    suFrame.src = src;
    suFrame.dataset.project = id;
  }
  updateTopbar(id);
  gsap.fromTo(suFrame, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
}
