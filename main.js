import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
scene.background = new THREE.Color(0x658ebf);
const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('DOMContentLoaded', () => {
  const message = document.getElementById('dynamicMessage');
  const phrases = ['Now Loading', 'Now Loading.', 'Now Loading..', 'Now Loading...'];
  let current = 0;

  setInterval(() => {
    current = (current + 1) % phrases.length;
    message.textContent = phrases[current];
  }, 2500);
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.7;

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
const themeToggleButton = document.querySelector(".theme-mode-toggle-button");
const firstIcon = document.querySelector(".first-icon");
const secondIcon = document.querySelector(".second-icon");

const audioToggleButton = document.querySelector(".audio-toggle-button");
const firstIconTwo = document.querySelector(".first-icon-two");
const secondIconTwo = document.querySelector(".second-icon-two");

// Modal stuff
const modalContent = {
  PC: {
    title: "Welcome to My Website",
    backgroundColor: "#2b7fbfff",
    content:
      "Hello! Please feel free to look around my Portfolio!",
    link: "https://drive.google.com/file/d/1iB2tqXs-E7mtHesY6clckTBc-WIjdzcg/view?usp=drive_link",
  },
  PictureFrame: {
    title: "Gallery",
    backgroundColor: "#ea7b36ff",
    images: [
        "./media/IMG1.png",
        "./media/IMG2.png"
    ]
  },
  Project_3: {
    title: "🌞Weather App😎",
    content:
      "Rise and shine as they say (but sometimes it's not all that shiny outside). Using a location-based API the user can automatically detect their location and my application will show them the weather near them. I also put some of my design skills to use using Figma.",
    link: "https://example.com/",
  },
  Chest: {
    title: "💁‍♀️ About Me",
    content:
      "Hi you found my chest👋, I'm Bella Xu and I am an aspiring creative developer and designer. I just started web development this year! In the signs, you will see some of my most recent projects that I'm proud of. I hope to add a lot more in the future. In my free time, I like to draw, watch TV shows (especially Pokémon), do clay sculpting and needle felting. Reach out if you wanna chat. Bella is OUT!!! 🏃‍♀️",
  },
  Picnic: {
    title: "🍷 Uggh yesss 🧺",
    content:
      " Picnics are my thanggg don't @ me. Lying down with some good grape juice inna wine glass and a nice book at a park is my total vibe. If this isn't max aura points 💯 idk what is.",
  },
};

let currentModalId = null;
let currentImageIndex = 0;

function showModal(id) {
  const content = modalContent[id];
  if (content) {
    currentModalId = id; // remember the ID
    modal.querySelector('.modal-wrapper').style.backgroundColor = content.backgroundColor || '#1a1a1a';

    modalTitle.textContent = content.title;
    modalProjectDescription.textContent = content.content;

    currentImageIndex = 0;

    if (content.images && content.images.length > 0) {
      document.getElementById('modalImage').src = content.images[currentImageIndex];
      document.querySelector('.modal-image-container').classList.remove('hidden');
    } else {
      document.querySelector('.modal-image-container').classList.add('hidden');
    }

    modal.classList.remove("hidden");
    modalbgOverlay.classList.remove("hidden");
    isModalOpen = true;

    if (content.link) {
      modalVisitProjectButton.href = content.link;
      modalVisitProjectButton.classList.remove("hidden");
    } else {
      modalVisitProjectButton.classList.add("hidden");
    }
  }
}

function hideModal() {
  isModalOpen = false;
  modal.classList.add("hidden");
  modalbgOverlay.classList.add("hidden");
  if (!isMuted) {
    playSound("projectsSFX");
  }
}

document.getElementById('prevImage').addEventListener('click', () => {
    const images = modalContent[currentModalId]?.images;
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    document.getElementById('modalImage').src = images[currentImageIndex];
});

document.getElementById('nextImage').addEventListener('click', () => {
    const images = modalContent[currentModalId]?.images;
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('modalImage').src = images[currentImageIndex];
});

// Our Intersecting objects
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
  "Basket",
  "Behance",
  "Speakers",
  "Chair",
  "CV",
  "Dribbble",
  "IG",
  "Lamp",
  "Linkedin",
  "PC",
  "Phone",
  "PictureFrame",
];

// Loading screen and loading manager
// See: https://threejs.org/docs/#api/en/loaders/managers/LoadingManager
const loadingScreen = document.getElementById("loadingScreen");
const loadingText = document.querySelector(".loading-text");
const enterButton = document.querySelector(".enter-button");
const instructions = document.querySelector(".instructions");

const manager = new THREE.LoadingManager();

manager.onLoad = function () {
  const t1 = gsap.timeline();

  t1.to(loadingText, {
    opacity: 0,
    duration: 0,
  });

  t1.to(enterButton, {
    opacity: 1,
    duration: 0,
  });
};

enterButton.addEventListener("click", () => {
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 0,
  });
  gsap.to(instructions, {
    opacity: 0,
    duration: 0,
    onComplete: () => {
      loadingScreen.remove();
    },
  });

  if (!isMuted) {
    playSound("projectsSFX");
    playSound("backgroundMusic");
  }
});

//Audio

// GLTF Loader
// See: https://threejs.org/docs/?q=glt#examples/en/loaders/GLTFLoader
const loader = new GLTFLoader(manager);

loader.load(
  "./Web.glb",
  function (glb) {
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Add all meshes for raycasting
        intersectObjects.push(child);
      }
    });

    scene.add(glb.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

console.log("Meshes in intersectObjects:", intersectObjects.map(obj => obj.name));

// Lighting and Enviornment Stuff
const sun = new THREE.DirectionalLight(0xffffff);
sun.castShadow = true;
sun.position.set(280, 100, -80);
sun.target.position.set(100, 0, -10);
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -150;
sun.shadow.camera.right = 300;
sun.shadow.camera.top = 150;
sun.shadow.camera.bottom = -100;
sun.shadow.normalBias = 0.2;
scene.add(sun.target);
scene.add(sun);

const light = new THREE.AmbientLight(0x242424, 2.7);
scene.add(light);

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
controls.update();;

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

  // 🎨 Change scene background color
  scene.background = new THREE.Color(isDarkTheme ? 0x658ebf : 0x181b3b);

  // 🎛 Optional: Animate light color
  gsap.to(light.color, {
    r: isDarkTheme ? 1.0 : 0.2,
    g: isDarkTheme ? 1.0 : 0.2,
    b: isDarkTheme ? 1.0 : 0.3,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(light, {
    intensity: isDarkTheme ? 0.3 : 0.75,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(sun.color, {
    r: isDarkTheme ? 1.0 : 0.2,
    g: isDarkTheme ? 0.8 : 0.2,
    b: isDarkTheme ? 0.6 : 0.3,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(sun, {
    intensity: isDarkTheme ? 1.0 : 0.3,
    duration: 1,
    ease: "power2.inOut",
  });
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
//themeToggleButton.addEventListener("click", toggleTheme);
//audioToggleButton.addEventListener("click", toggleAudio);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick, { passive: false });
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchend", onTouchEnd, { passive: false });

function moveAndSpinChair() {
  const chair = scene.getObjectByName("Chair");
  if (!chair) return;

  gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(chair.position, { z: chair.position.z - 0.3, duration: 0.4 })      // nudge forward
      .to(chair.rotation, { y: chair.rotation.y + Math.PI * 0.5, duration: 0.6 }, "<") // half‑spin
      .to(chair.position, { z: chair.position.z, duration: 0.4 })           // return
      .to(chair.rotation, { y: chair.rotation.y, duration: 1.0 }, "<");     // spin back
}

function handleInteraction() {
  if (!modal.classList.contains("hidden")) return;

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
  CV: "https://drive.google.com/file/d/1fS43JA80asxhomSJ7bch0yvdm1agD7Sk/view?usp=drive_link",
  Phone: "https://mail.google.com/mail/?view=cm&fs=1&to=andri.saputro98@gmail.com&su=I+Found+Your+Website!",
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

// 3️⃣ Toggle theme when clicking the "Lamp"
if (objectName === "Lamp") {
  toggleTheme();
  return;
}

// 2️⃣ Special cases: Pokémon-like objects
if (["Basket"].includes(objectName)) {
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

// 4️⃣ Fallback: open modal
showModal(objectName);
if (!isMuted) playSound("projectsSFX");
}

// Like our movie strip!!! Calls on each frame.
function animate() {

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(intersectObjects);

const hovered = intersects.find(hit =>
    intersectObjectsNames.includes(hit.object.name) || intersectObjectsNames.includes(hit.object.parent.name)

);

document.body.style.cursor = hovered ? "pointer" : "default";

  for (let i = 0; i < intersects.length; i++) {
    intersectObject = intersects[0].object.parent.name;
  }

  renderer.render(scene, camera);
  controls.update();
}

renderer.setAnimationLoop(animate);
