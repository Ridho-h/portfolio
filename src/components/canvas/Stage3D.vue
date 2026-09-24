<template>
  <div class="stage-3d-wrapper" :class="{ 'is-interactive': isInteractiveMode }">
    <canvas ref="canvasRef" class="stage-3d-canvas"></canvas>

    <!-- Floating Robot Cybernetic Speech Badge -->
    <div
      v-if="robotBadgeVisible"
      class="robot-screen-badge"
      :class="{ 'is-hovered': isRobotHovered }"
      :style="{
        left: `${robotBadgePos.x}px`,
        top: `${robotBadgePos.y}px`
      }"
      @click="$emit('click-robot')"
    >
      <span class="badge-radar"></span>
      <div class="badge-content">
        <span class="badge-title">UNIT_01 // AI COMPANION</span>
        <span class="badge-message">{{ isRobotHovered ? 'Ready! Click to launch chat' : 'Click to chat with me' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { projectsData } from '../../data/projects-data';

export type ChapterId = 'hero' | 'about' | 'projects' | 'contact';

const emit = defineEmits<{
  (e: 'click-robot'): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isInteractiveMode = ref(false);

// Three.js instances
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let animationFrameId: number = 0;

// Raycasting for interactive 3D robot
const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();
let isRobotHovered = false;
let currentRobotScale = 0.65;

// Cursor sightline tracking objects (reused every frame to prevent GC pressure)
const cursorPlane = new THREE.Plane();
const camForward = new THREE.Vector3();
const cursorWorldHit = new THREE.Vector3();
const robotHeadWorld = new THREE.Vector3();
const robotLocalTarget = new THREE.Vector3();
const planeTargetPoint = new THREE.Vector3();
const mouseNDC = new THREE.Vector2();

// Screen projection for floating robot speech badge
const robotBadgePos = ref({ x: 0, y: 0 });
const robotBadgeVisible = ref(false);

// Natural eye blinking state
let timeUntilNextBlink = 2.5;
let blinkProgress = 0;
let isBlinking = false;
let isDoubleBlink = false;
const BLINK_DURATION = 0.16; // 160ms smooth eye blink

// Groups
const rootGroup = new THREE.Group();
const heroGroup = new THREE.Group();
const aboutGroup = new THREE.Group();
const projectsGroup = new THREE.Group();
const starsGroup = new THREE.Group();
const robotGroup = new THREE.Group();
const robotHeadGroup = new THREE.Group();
const robotEyesGroup = new THREE.Group();
const robotRotorGroup = new THREE.Group();

// Robot Companion objects
let robotLeftEye: THREE.Mesh | null = null;
let robotRightEye: THREE.Mesh | null = null;
let robotMouth: THREE.Mesh | null = null;
let robotThrusterLight: THREE.PointLight | null = null;
let robotHitMesh: THREE.Mesh | null = null;

const CORE_PARTICLE_COUNT = 600;
let coreBasePos: Float32Array;
let coreExplodeDir: Float32Array;
let coreExplodeDist: Float32Array;
let coreCurrentPos: Float32Array;
let coreSpeedFactor: Float32Array;
let coreParticles: THREE.Points | null = null;
let coreIcosahedron: THREE.LineSegments | null = null;
let coreAura: THREE.Mesh | null = null;

// =============================================================
// Projects: Cybernetic Projector Drone & Dynamic Hologram HUD
// =============================================================
const projectorDroneGroup = new THREE.Group();
const projectorBeamsGroup = new THREE.Group();
const hologramScreenGroup = new THREE.Group();

// Projector Drone & Volumetric Holographic Light Beam
let droneRotorRing: THREE.Mesh | null = null;
let droneLensLeft: THREE.Mesh | null = null;
let droneLensRight: THREE.Mesh | null = null;
let droneAccentRing: THREE.Mesh | null = null;
let droneBeaconLight: THREE.PointLight | null = null;
let holoLightBeamMesh: THREE.Mesh | null = null;
let holoLightBeamMesh2: THREE.Mesh | null = null;
let holoLightBeamMat: THREE.MeshBasicMaterial | null = null;
let lensCoronaMat: THREE.MeshBasicMaterial | null = null;

// Drone Mesh Materials with Dynamic Opacity
let dronePodMat: THREE.MeshStandardMaterial | null = null;
let droneRingMat: THREE.MeshBasicMaterial | null = null;
let droneRotorMat: THREE.MeshBasicMaterial | null = null;
let droneLensShellMat: THREE.MeshStandardMaterial | null = null;
let droneLensLightMat: THREE.MeshBasicMaterial | null = null;

// Drone Lateral Flight Navigation (Fly in from right side, fly out to right side)
let droneFlightX = 6.5; // Starts far offscreen to the right
let droneFlightBankZ = 0.0;

// Dynamic High-Res 2D Hologram HUD Texture
const HOLO_CANVAS_W = 1024;
const HOLO_CANVAS_H = 680;
let holoCanvas: HTMLCanvasElement | null = null;
let holoCtx: CanvasRenderingContext2D | null = null;
let holoTexture: THREE.CanvasTexture | null = null;
let holoScreenMesh: THREE.Mesh | null = null;
let holoScreenMat: THREE.MeshBasicMaterial | null = null;

// Clock for delta time
const clock = new THREE.Clock();

// Continuous Scroll & State Tracking
const state = {
  currentChapter: 'hero' as ChapterId,
  globalProgress: 0.0,
  targetGlobalProgress: 0.0,
  scrollY: 0,
  chapterProgress: {
    hero: 1.0,
    about: 0.0,
    projects: 0.0,
    contact: 0.0,
  },
  currentCamPos: [0.0, 0.0, 4.8],
  currentCamLook: [0.0, 0.0, 0.0],
  mouseX: 0,
  mouseY: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  activeProjectIdx: 0,
  currentProjectColor: new THREE.Color('#10b981'),
  targetProjectColor: new THREE.Color('#10b981'),
  explodeProgress: 0.0,
};

// Smooth opacities for each group
const opacities = {
  hero: 1.0,
  about: 0.0,
  projects: 0.0,
};

// -------------------------------------------------------------
// Robot Companion Geometry Helpers (High-Craft Squircle & Facial Features)
// -------------------------------------------------------------
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - radius);
  shape.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + height);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
  return shape;
}

function createArchEyeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const outerR = 0.046;
  const innerR = 0.024;
  const capR = (outerR - innerR) / 2;
  const midR = (outerR + innerR) / 2;

  const startA = Math.PI * 0.08;
  const endA = Math.PI * 0.92;

  // 1. Outer arch curve (clockwise across the top)
  shape.absarc(0, 0, outerR, endA, startA, true);
  // 2. Right rounded end cap
  const rx = midR * Math.cos(startA);
  const ry = midR * Math.sin(startA);
  shape.absarc(rx, ry, capR, startA, startA + Math.PI, true);
  // 3. Inner arch curve (counter-clockwise back)
  shape.absarc(0, 0, innerR, startA, endA, false);
  // 4. Left rounded end cap
  const lx = midR * Math.cos(endA);
  const ly = midR * Math.sin(endA);
  shape.absarc(lx, ly, capR, endA, endA + Math.PI, true);

  const geo = new THREE.ShapeGeometry(shape, 24);
  geo.center();
  return geo;
}

function createSmileMouthGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const r = 0.034;
  // Semicircular open smile (flat on top, curved downward at bottom)
  shape.moveTo(-r, 0);
  shape.lineTo(r, 0);
  shape.absarc(0, 0, r, 0, -Math.PI, true);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 24);
  geo.center();
  return geo;
}

// =============================================================
// Helper: Glowing Circular Particle Texture for Exploded Core Dots
// =============================================================
function createParticleDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 1.0)'); // Solid brilliant white core
  grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.65)'); // Luminous halo
  grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.20)');
  grad.addColorStop(1.00, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createHoloBeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Vertical light gradient:
  // In Three.js CanvasTexture with default flipY:
  // Canvas Y = 0 maps to V = 1.0 (Top / Drone emitter - radiant light source)
  // Canvas Y = 512 maps to V = 0.0 (Bottom / Fully faded out into deep space)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.00, 'rgba(255, 255, 255, 0.88)'); // Radiant at emitter nozzle
  grad.addColorStop(0.15, 'rgba(255, 255, 255, 0.60)'); // Upper projection cone
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.30)'); // Top of screen (V = 0.65)
  grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.15)'); // Middle of screen (V = 0.45)
  grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.06)'); // Lower screen (V = 0.25)
  grad.addColorStop(0.90, 'rgba(255, 255, 255, 0.015)');// Near bottom of screen
  grad.addColorStop(1.00, 'rgba(255, 255, 255, 0.00)'); // 100% transparent into deep space

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Soft lateral vignette to feather the left and right edges smoothly into transparency
  const hGrad = ctx.createLinearGradient(0, 0, 256, 0);
  hGrad.addColorStop(0.00, 'rgba(0, 0, 0, 1.0)');
  hGrad.addColorStop(0.12, 'rgba(0, 0, 0, 0.0)');
  hGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.0)');
  hGrad.addColorStop(1.00, 'rgba(0, 0, 0, 1.0)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, 256, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function buildProjectorAndHolograms() {
  // Starts docked off-screen to the right (flies in laterally when Projects becomes active)
  projectsGroup.position.set(6.5, 0.0, 0.0);
  projectsGroup.add(projectorDroneGroup);
  projectsGroup.add(projectorBeamsGroup);
  projectsGroup.add(hologramScreenGroup);

  // 1. Cybernetic Projector Drone
  projectorDroneGroup.position.set(0, 1.25, 0);

  const podGeo = new THREE.CylinderGeometry(0.28, 0.36, 0.14, 24);
  dronePodMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.25,
    metalness: 0.85,
    transparent: true,
    opacity: 0.0,
  });
  const podMesh = new THREE.Mesh(podGeo, dronePodMat);
  projectorDroneGroup.add(podMesh);

  // Glowing Dynamic Accent Ring around drone
  const droneRingGeo = new THREE.TorusGeometry(0.38, 0.012, 12, 32);
  droneRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.0 });
  droneAccentRing = new THREE.Mesh(droneRingGeo, droneRingMat);
  droneAccentRing.rotation.x = Math.PI / 2;
  projectorDroneGroup.add(droneAccentRing);

  // Rotating Gyroscopic Stabilizer Rotor
  const rotorGeo = new THREE.TorusGeometry(0.50, 0.008, 8, 36);
  droneRotorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 });
  droneRotorRing = new THREE.Mesh(rotorGeo, droneRotorMat);
  droneRotorRing.rotation.x = Math.PI / 2;
  projectorDroneGroup.add(droneRotorRing);

  // Articulated Projector Lens Heads (Left & Right, tilted downward toward screen)
  const lensGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.09, 16);
  lensGeo.rotateX(Math.PI / 3.5);
  droneLensShellMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.0 });
  droneLensLightMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.0 });

  // Left Lens Pod
  const leftPod = new THREE.Group();
  leftPod.position.set(-0.32, -0.06, 0.08);
  const leftShell = new THREE.Mesh(lensGeo, droneLensShellMat);
  const leftBulbGeo = new THREE.SphereGeometry(0.045, 12, 12);
  droneLensLeft = new THREE.Mesh(leftBulbGeo, droneLensLightMat);
  droneLensLeft.position.set(0, -0.045, 0.045);
  leftPod.add(leftShell);
  leftPod.add(droneLensLeft);
  projectorDroneGroup.add(leftPod);

  // Right Lens Pod
  const rightPod = new THREE.Group();
  rightPod.position.set(0.32, -0.06, 0.08);
  const rightShell = new THREE.Mesh(lensGeo, droneLensShellMat);
  droneLensRight = new THREE.Mesh(leftBulbGeo.clone(), droneLensLightMat);
  droneLensRight.position.set(0, -0.045, 0.045);
  rightPod.add(rightShell);
  rightPod.add(droneLensRight);
  projectorDroneGroup.add(rightPod);

  // Bottom Projector Beacon Light
  droneBeaconLight = new THREE.PointLight(0x10b981, 0.0, 4.0);
  droneBeaconLight.position.set(0, -0.15, 0);
  projectorDroneGroup.add(droneBeaconLight);

  // 2. Radiant Volumetric Holographic Light Beam Background
  // Seamless contoured light: fans out from drone lenses to the screen top,
  // then fully backs the entire screen with smooth distance dimming (makin jauh makin redup).
  const beamTex = createHoloBeamTexture();
  holoLightBeamMat = new THREE.MeshBasicMaterial({
    map: beamTex,
    color: 0x10b981,
    transparent: true,
    opacity: 0.40,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // 6 Vertices defining the entire projector light beam + full screen backdrop:
  // 0, 1: Top at drone emitter lenses (y = 1.20, w = 0.72)
  // 2, 3: Upper screen top edge (y = 0.72, w = 2.44)
  // 4, 5: Screen bottom edge (y = -0.88, w = 2.44)
  const beamGeo = new THREE.BufferGeometry();
  const beamVertices = new Float32Array([
    -0.36,  1.20, -0.02,  // 0: Top-Left (drone emitter)
     0.36,  1.20, -0.02,  // 1: Top-Right (drone emitter)
    -1.22,  0.72, -0.02,  // 2: Screen Top-Left
     1.22,  0.72, -0.02,  // 3: Screen Top-Right
    -1.22, -0.88, -0.04,  // 4: Screen Bottom-Left
     1.22, -0.88, -0.04,  // 5: Screen Bottom-Right
  ]);
  const beamUvs = new Float32Array([
    0.20, 1.0,  // 0: Top-Left (V = 1.0 is canvas Y = 0, brightest radiant light)
    0.80, 1.0,  // 1: Top-Right (V = 1.0 is canvas Y = 0, brightest radiant light)
    0.00, 0.65, // 2: Screen Top-Left
    1.00, 0.65, // 3: Screen Top-Right
    0.00, 0.00, // 4: Screen Bottom-Left (V = 0.0 is canvas Y = 512, completely transparent)
    1.00, 0.00, // 5: Screen Bottom-Right (V = 0.0 is canvas Y = 512, completely transparent)
  ]);
  const beamIndices = [
    0, 2, 1,   // Upper beam triangle 1
    1, 2, 3,   // Upper beam triangle 2
    2, 4, 3,   // Screen backing triangle 1
    3, 4, 5,   // Screen backing triangle 2
  ];
  beamGeo.setAttribute('position', new THREE.BufferAttribute(beamVertices, 3));
  beamGeo.setAttribute('uv', new THREE.BufferAttribute(beamUvs, 2));
  beamGeo.setIndex(beamIndices);

  holoLightBeamMesh = new THREE.Mesh(beamGeo, holoLightBeamMat);
  projectorBeamsGroup.add(holoLightBeamMesh);

  // Secondary Volumetric Cross-Sheet (Angled deeper in Z [-0.01, -0.12] for 3D atmospheric backdrop)
  const beamGeo2 = new THREE.BufferGeometry();
  const beamVertices2 = new Float32Array([
    -0.36,  1.20, -0.01,
     0.36,  1.20, -0.01,
    -1.22,  0.72, -0.06,
     1.22,  0.72, -0.06,
    -1.22, -0.88, -0.12,
     1.22, -0.88, -0.12,
  ]);
  beamGeo2.setAttribute('position', new THREE.BufferAttribute(beamVertices2, 3));
  beamGeo2.setAttribute('uv', new THREE.BufferAttribute(beamUvs, 2));
  beamGeo2.setIndex(beamIndices);
  holoLightBeamMesh2 = new THREE.Mesh(beamGeo2, holoLightBeamMat);
  projectorBeamsGroup.add(holoLightBeamMesh2);

  // Glowing Lens Halos / Coronas right under the emitter lenses
  const coronaGeo = new THREE.RingGeometry(0.01, 0.09, 24);
  lensCoronaMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const haloLeft = new THREE.Mesh(coronaGeo, lensCoronaMat);
  haloLeft.position.set(-0.32, 1.17, 0.06);
  haloLeft.rotation.x = Math.PI * 0.4;
  projectorBeamsGroup.add(haloLeft);

  const haloRight = new THREE.Mesh(coronaGeo.clone(), lensCoronaMat);
  haloRight.position.set(0.32, 1.17, 0.06);
  haloRight.rotation.x = Math.PI * 0.4;
  projectorBeamsGroup.add(haloRight);

  // 3. Dynamic Off-screen HTML5 Canvas for the Hologram Screen
  holoCanvas = document.createElement('canvas');
  holoCanvas.width = HOLO_CANVAS_W;
  holoCanvas.height = HOLO_CANVAS_H;
  holoCtx = holoCanvas.getContext('2d');

  holoTexture = new THREE.CanvasTexture(holoCanvas);
  holoTexture.minFilter = THREE.LinearFilter;
  holoTexture.magFilter = THREE.LinearFilter;

  // Translucent Holographic Glass Screen Plane (FrontSide: in front of the background light at z = 0.02)
  const screenGeo = new THREE.PlaneGeometry(2.30, 1.52);
  holoScreenMat = new THREE.MeshBasicMaterial({
    map: holoTexture,
    transparent: true,
    opacity: 0.0,
    side: THREE.FrontSide, // Front side only so text is always forward-facing
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  holoScreenMesh = new THREE.Mesh(screenGeo, holoScreenMat);
  holoScreenMesh.position.set(0, -0.05, 0.02);
  hologramScreenGroup.add(holoScreenMesh);

  projectsGroup.visible = false;
}

function drawHoloScreen(time: number, projectIdx: number, accentHex: string) {
  if (!holoCtx) return;
  const ctx = holoCtx;
  const w = HOLO_CANVAS_W;
  const h = HOLO_CANVAS_H;

  // 1. Clear canvas completely (100% transparent - NO solid gray/slate rectangle background!)
  ctx.clearRect(0, 0, w, h);

  // 2. Holographic Corner Brackets & Cyber HUD Framing (Pure floating luminous wireframe, NO STRIPES)
  const pad = 12;
  const bracketSize = 28;

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  // Top-Left Bracket
  ctx.moveTo(pad, pad + bracketSize);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + bracketSize, pad);
  // Top-Right Bracket
  ctx.moveTo(w - pad - bracketSize, pad);
  ctx.lineTo(w - pad, pad);
  ctx.lineTo(w - pad, pad + bracketSize);
  // Bottom-Left Bracket
  ctx.moveTo(pad, h - pad - bracketSize);
  ctx.lineTo(pad, h - pad);
  ctx.lineTo(pad + bracketSize, h - pad);
  // Bottom-Right Bracket
  ctx.moveTo(w - pad - bracketSize, h - pad);
  ctx.lineTo(w - pad, h - pad);
  ctx.lineTo(w - pad, h - pad - bracketSize);
  ctx.stroke();

  // Subtle dashed boundary line (very faint cybernetic boundary, completely transparent interior)
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.18)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 10]);
  ctx.strokeRect(pad + 4, pad + 4, w - (pad + 4) * 2, h - (pad + 4) * 2);
  ctx.setLineDash([]);

  // 3. Top HUD Header Bar (Luminous wireframe HUD)
  // Status pulse indicator
  ctx.fillStyle = accentHex;
  ctx.beginPath();
  ctx.arc(36, 42, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 13px "Martian Mono", monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('LIVE INFERENCE // 60 FPS', 52, 47);

  // Right Header Tag
  const sysTags = [
    'SYS: SPOTTER_AI // CV_KINEMATICS',
    'SYS: NUTRI_AGENT // MULTIMODAL_VLM',
    'SYS: CODE_AGENT // AUTONOMOUS_DAG',
    'SYS: SHOP_AI // REACT_RAG_AGENT',
  ];
  ctx.textAlign = 'right';
  ctx.fillStyle = accentHex;
  ctx.fillText(sysTags[projectIdx] || 'SYS_ACTIVE', w - 30, 47);
  ctx.textAlign = 'left';

  // Luminous horizontal divider line
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pad + 6, 64);
  ctx.lineTo(w - pad - 6, 64);
  ctx.stroke();

  // 4. Project-Specific Rich Interactive UI (Floating Hologram Visualizations)
  if (projectIdx === 0) {
    // ---------------------------------------------------------
    // Project 0: SpotterAI (MediaPipe Human Pose with Natural Athletic Forward Arms & Real Proportions)
    // ---------------------------------------------------------
    const squatT = (Math.sin(time * 2.2) + 1) * 0.5; // 0 = standing lockout, 1 = optimal depth squat

    const baseX = 220;
    const floorY = 515;

    // Feet & Ankles (Firmly grounded on the floor)
    const lAnkleX = baseX - 40, lAnkleY = floorY - 18;
    const lHeelX = lAnkleX - 18, lHeelY = floorY - 6;
    const lToeX = lAnkleX + 28, lToeY = floorY - 6;

    const rAnkleX = baseX + 35, rAnkleY = floorY - 26;
    const rHeelX = rAnkleX - 16, rHeelY = floorY - 14;
    const rToeX = rAnkleX + 30, rToeY = floorY - 14;

    // Knees (Track forward over toes naturally during descent)
    const lKneeX = (baseX - 45) - squatT * 32;
    const lKneeY = (floorY - 120) + squatT * 18;
    const rKneeX = (baseX + 30) - squatT * 22;
    const rKneeY = (floorY - 130) + squatT * 18;

    // Hips / Pelvis (Hinge backward during descent to parallel depth)
    const lHipX = (baseX - 22) + squatT * 42;
    const lHipY = (floorY - 225) + squatT * 115;
    const rHipX = (baseX + 32) + squatT * 42;
    const rHipY = (floorY - 238) + squatT * 115;
    const pelvisCenterX = (lHipX + rHipX) * 0.5;
    const pelvisCenterY = (lHipY + rHipY) * 0.5;

    // Torso & Shoulders (Torso tilts naturally forward at ~35 deg for athletic squat balance)
    const lShoulderX = (baseX - 35) - squatT * 18;
    const lShoulderY = (floorY - 325) + squatT * 105;
    const rShoulderX = (baseX + 22) - squatT * 18;
    const rShoulderY = (floorY - 338) + squatT * 105;
    const shoulderCenterX = (lShoulderX + rShoulderX) * 0.5;
    const shoulderCenterY = (lShoulderY + rShoulderY) * 0.5;

    // Neck & Head
    const headX = shoulderCenterX - 10 - squatT * 8;
    const headY = shoulderCenterY - 32;

    // ARMS & HANDS (EXTENDED FORWARD AT CHEST LEVEL FOR COUNTERBALANCE - NO HANDS ON HIPS!)
    // Both arms reach forward to the left in the air, creating massive clearance from hips:
    const lElbowX = lShoulderX - 48 - squatT * 8;
    const lElbowY = lShoulderY + 8 - squatT * 12;
    const lWristX = lElbowX - 46;
    const lWristY = lElbowY - 2;
    const lHandX = lWristX - 16;
    const lHandY = lWristY;

    const rElbowX = rShoulderX - 42 - squatT * 8;
    const rElbowY = rShoulderY + 12 - squatT * 12;
    const rWristX = rElbowX - 44;
    const rWristY = rElbowY - 2;
    const rHandX = rWristX - 16;
    const rHandY = rWristY;

    // Draw MediaPipe BlazePose Skeleton Lines (Cyan & Sky Blue Neon)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    // Head circle & Gaze indicator
    ctx.arc(headX, headY, 16, 0, Math.PI * 2);

    // Spine
    ctx.moveTo(shoulderCenterX, shoulderCenterY);
    ctx.lineTo(pelvisCenterX, pelvisCenterY);

    // Clavicle (Shoulders) & Pelvis (Hips)
    ctx.moveTo(lShoulderX, lShoulderY);
    ctx.lineTo(rShoulderX, rShoulderY);
    ctx.moveTo(lHipX, lHipY);
    ctx.lineTo(rHipX, rHipY);

    // Torso Ribcage Enclosure (Left & Right Flanks)
    ctx.moveTo(lShoulderX, lShoulderY);
    ctx.lineTo(lHipX, lHipY);
    ctx.moveTo(rShoulderX, rShoulderY);
    ctx.lineTo(rHipX, rHipY);

    // Left Arm (Shoulder -> Elbow -> Wrist -> Hand knuckles)
    ctx.moveTo(lShoulderX, lShoulderY);
    ctx.lineTo(lElbowX, lElbowY);
    ctx.lineTo(lWristX, lWristY);
    ctx.lineTo(lHandX, lHandY);

    // Right Arm (Shoulder -> Elbow -> Wrist -> Hand knuckles)
    ctx.moveTo(rShoulderX, rShoulderY);
    ctx.lineTo(rElbowX, rElbowY);
    ctx.lineTo(rWristX, rWristY);
    ctx.lineTo(rHandX, rHandY);

    // Left Leg (Hip -> Knee -> Ankle -> Heel -> Toe)
    ctx.moveTo(lHipX, lHipY);
    ctx.lineTo(lKneeX, lKneeY);
    ctx.lineTo(lAnkleX, lAnkleY);
    ctx.lineTo(lHeelX, lHeelY);
    ctx.lineTo(lToeX, lToeY);
    ctx.lineTo(lAnkleX, lAnkleY);

    // Right Leg (Hip -> Knee -> Ankle -> Heel -> Toe)
    ctx.moveTo(rHipX, rHipY);
    ctx.lineTo(rKneeX, rKneeY);
    ctx.lineTo(rAnkleX, rAnkleY);
    ctx.lineTo(rHeelX, rHeelY);
    ctx.lineTo(rToeX, rToeY);
    ctx.lineTo(rAnkleX, rAnkleY);

    ctx.stroke();

    // Draw MediaPipe Landmark Keypoints (Glowing Cyan/Emerald Nodes)
    ctx.fillStyle = accentHex;
    const landmarks = [
      [headX, headY],
      [shoulderCenterX, shoulderCenterY],
      [lShoulderX, lShoulderY],
      [rShoulderX, rShoulderY],
      [lElbowX, lElbowY],
      [rElbowX, rElbowY],
      [lWristX, lWristY],
      [rWristX, rWristY],
      [lHandX, lHandY],
      [rHandX, rHandY],
      [lHipX, lHipY],
      [rHipX, rHipY],
      [lKneeX, lKneeY],
      [rKneeX, rKneeY],
      [lAnkleX, lAnkleY],
      [rAnkleX, rAnkleY],
      [lHeelX, lHeelY],
      [rHeelX, rHeelY],
      [lToeX, lToeY],
      [rToeX, rToeY],
    ];

    for (const [lx, ly] of landmarks) {
      ctx.beginPath();
      ctx.arc(lx, ly, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic Knee Angle Arc at Left Knee
    const kneeAngle = Math.round(172 - squatT * 76);
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(lKneeX, lKneeY, 26, Math.PI * 0.1, Math.PI * 0.7);
    ctx.stroke();

    ctx.font = 'bold 13px "Martian Mono", monospace';
    ctx.fillStyle = accentHex;
    ctx.fillText(kneeAngle + '°', lKneeX - 48, lKneeY + 5);

    // Parallel Crease Target Guideline
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.28)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(baseX - 90, lKneeY);
    ctx.lineTo(baseX + 110, lKneeY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Form Status Banner (Glowing Wireframe HUD Badge - NO gray solid box!)
    const isOptimal = squatT > 0.82;
    ctx.strokeStyle = isOptimal ? '#10b981' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(50, 560, 320, 44);

    ctx.fillStyle = isOptimal ? '#10b981' : '#38bdf8';
    ctx.font = 'bold 12px "Martian Mono", monospace';
    ctx.fillText(isOptimal ? '● OPTIMAL DEPTH // REP #08' : '● ECCENTRIC SQUAT // BALANCED', 68, 587);

    // Right: Kinematic Depth Waveform Oscilloscope (Transparent Holographic Wireframe Card)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(430, 90, 530, 230);

    // Corner accents for oscilloscope card
    const oX = 430, oY = 90, oW = 530, oH = 230;
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(oX, oY + 14); ctx.lineTo(oX, oY); ctx.lineTo(oX + 14, oY);
    ctx.moveTo(oX + oW - 14, oY); ctx.lineTo(oX + oW, oY); ctx.lineTo(oX + oW, oY + 14);
    ctx.moveTo(oX, oY + oH - 14); ctx.lineTo(oX, oY + oH); ctx.lineTo(oX + 14, oY + oH);
    ctx.moveTo(oX + oW - 14, oY + oH); ctx.lineTo(oX + oW, oY + oH); ctx.lineTo(oX + oW, oY + oH - 14);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Martian Mono", monospace';
    ctx.fillText('TEMPORAL KINEMATIC TRAJECTORY (Bi-LSTM)', 455, 120);

    // Grid center line
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(450, 215);
    ctx.lineTo(940, 215);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing sine wave
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let x = 0; x < 490; x += 4) {
      const wx = 450 + x;
      const waveT = (x * 0.02) - time * 3.0;
      const wy = 215 + Math.sin(waveT) * 55 + Math.sin(waveT * 2.0) * 14;
      if (x === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // 4 Telemetry Metrics Wireframe Cards (Completely transparent)
    const metrics = [
      ['F1 SCORE', '100% (4,000+ Reps)'],
      ['LATENCY', '16.4ms (60 FPS on CPU)'],
      ['BACKBONE', 'MediaPipe 33 Landmarks'],
      ['TEMPORAL', 'Bidirectional LSTM (2-Layer)'],
    ];
    for (let m = 0; m < metrics.length; m++) {
      const mx = 430 + (m % 2) * 275;
      const my = 345 + Math.floor(m / 2) * 115;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1.0;
      ctx.strokeRect(mx, my, 255, 95);

      // Card corner tick
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(mx, my + 10); ctx.lineTo(mx, my); ctx.lineTo(mx + 10, my);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Martian Mono", monospace';
      ctx.fillText(metrics[m][0], mx + 16, my + 30);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13.5px "Martian Mono", monospace';
      ctx.fillText(metrics[m][1], mx + 16, my + 62);
    }

  } else if (projectIdx === 1) {
    // ---------------------------------------------------------
    // Project 1: Multimodal Food Agent (CV & Nutrition Gating)
    // ---------------------------------------------------------
    const cx = 220, cy = 340;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.stroke();

    const sweepA = time * 2.0;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepA) * 140, cy + Math.sin(sweepA) * 140);
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(100, 220, 240, 240);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px "Martian Mono", monospace';
    ctx.fillText('SALAD_BOWL // CONF: 94.8%', 104, 210);

    const scanY = 230 + ((time * 120) % 220);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, scanY);
    ctx.lineTo(340, scanY);
    ctx.stroke();

    // Right Nutrition Telemetry Wireframe Card (Transparent)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(430, 90, 530, 415);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px "Martian Mono", monospace';
    ctx.fillText('ESTIMATED MACRO NUTRIENT TELEMETRY', 455, 130);

    const nutrients = [
      ['CALORIES', '420 kcal', 0.75, '#f59e0b'],
      ['PROTEIN', '34.5 g', 0.82, '#00f2fe'],
      ['CARBOHYDRATES', '42.0 g', 0.65, '#38bdf8'],
      ['LIPIDS / FATS', '14.2 g', 0.38, '#10b981'],
    ];

    for (let n = 0; n < nutrients.length; n++) {
      const [name, val, pct, col] = nutrients[n];
      const by = 175 + n * 75;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Martian Mono", monospace';
      ctx.fillText(name as string, 455, by);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px "Martian Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val as string, 930, by);
      ctx.textAlign = 'left';

      // Bar outline & filled bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
      ctx.lineWidth = 1;
      ctx.strokeRect(455, by + 12, 475, 16);

      ctx.fillStyle = col as string;
      const barW = 475 * (pct as number);
      ctx.fillRect(455, by + 12, barW, 16);
    }

    // Confidence Gating Wireframe Banner
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(430, 530, 530, 70);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px "Martian Mono", monospace';
    ctx.fillText('✓ MULTIMODAL CONFIDENCE GATING: PASS (> 0.65 THRESHOLD)', 455, 572);

  } else if (projectIdx === 2) {
    // ---------------------------------------------------------
    // Project 2: Multi-Agent Coding Assistant (Autonomous Systems)
    // ---------------------------------------------------------
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(50, 90, 900, 165);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Martian Mono", monospace';
    ctx.fillText('AUTONOMOUS MULTI-AGENT DAG WORKFLOW PIPELINE', 75, 122);

    const nodes = ['PLANNER', 'CODER', 'REVIEWER', 'TESTER'];
    const activeNodeIdx = Math.floor((time * 0.8) % 4);

    for (let i = 0; i < 4; i++) {
      const nx = 85 + i * 220;
      const ny = 150;
      const isActive = i === activeNodeIdx;

      ctx.strokeStyle = isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = isActive ? 2.5 : 1;
      ctx.strokeRect(nx, ny, 160, 68);

      ctx.fillStyle = isActive ? '#a78bfa' : '#94a3b8';
      ctx.font = 'bold 13px "Martian Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nodes[i], nx + 80, ny + 38);

      ctx.fillStyle = isActive ? '#10b981' : '#64748b';
      ctx.font = '10px "Martian Mono", monospace';
      ctx.fillText(isActive ? '● EXECUTING' : 'IDLE / WAIT', nx + 80, ny + 56);
      ctx.textAlign = 'left';

      if (i < 3) {
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nx + 160, ny + 34);
        ctx.lineTo(nx + 220, ny + 34);
        ctx.stroke();
      }
    }

    // Terminal wireframe card (Transparent)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(50, 280, 900, 320);

    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 12px "Martian Mono", monospace';
    ctx.fillText('DOCKER SECURE RUNTIME // python:3.11-slim', 75, 310);

    const logs = [
      '> [PLANNER] Decomposing task: implement JWT rotation & auth middleware',
      '> [CODER] Generating diff in auth/session.py (+48 lines, -12 lines)',
      '> [REVIEWER] Static analysis: AST verified, 0 security vulnerabilities',
      '> [TESTER] Running isolated pytest in container sandbox...',
      '> tests/test_auth.py::test_token_refresh .................. [PASS]',
      '> tests/test_security.py::test_replay_attack .............. [PASS]',
      '> 20 passed, 0 failed in 0.84s (Test Coverage: 96.4%)',
      '> STATUS: PR #142 AUTO-APPROVED AND READY TO MERGE ✓',
    ];

    for (let l = 0; l < logs.length; l++) {
      const isSuccess = logs[l].includes('STATUS') || logs[l].includes('PASS');
      ctx.fillStyle = isSuccess ? '#10b981' : '#94a3b8';
      ctx.font = '11.5px "Martian Mono", monospace';
      ctx.fillText(logs[l], 75, 350 + l * 28);
    }

  } else if (projectIdx === 3) {
    // ---------------------------------------------------------
    // Project 3: ShopAI (ReAct RAG agent over Pinecone + Groq + DuckDuckGo)
    // ---------------------------------------------------------
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(50, 90, 900, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Martian Mono", monospace';
    ctx.fillText('REACT AGENT PIPELINE (PINECONE + DUCKDUCKGO + GROQ)', 75, 122);

    // Pinecone box
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(85, 150, 255, 90);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px "Martian Mono", monospace';
    ctx.fillText('PINECONE VECTOR INDEX', 105, 185);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Martian Mono", monospace';
    ctx.fillText('Dense catalogue retrieval (top-k matches)', 105, 212);

    // ReAct agent node
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(405, 150, 190, 90);
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 13px "Martian Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('REACT AGENT', 500, 185);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px "Martian Mono", monospace';
    ctx.fillText('tool-calling loop', 500, 212);
    ctx.textAlign = 'left';

    // DuckDuckGo box
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(660, 150, 255, 90);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px "Martian Mono", monospace';
    ctx.fillText('DUCKDUCKGO WEB SEARCH', 680, 185);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Martian Mono", monospace';
    ctx.fillText('Live fallback for catalogue coverage gaps', 680, 212);

    // Connector lines to ReAct
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 195);
    ctx.lineTo(405, 195);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(660, 195);
    ctx.lineTo(595, 195);
    ctx.stroke();

    // Bottom: Top Ranked Product HUD Wireframe Card
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(50, 295, 900, 305);

    // Rank 1 Badge
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px "Martian Mono", monospace';
    ctx.fillText('#1 RANKED MATCH // GROUNDED', 80, 335);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Nike Air Zoom Pegasus 40 - Road Running Shoes', 80, 375);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Engineered mesh upper with responsive React foam cushioning and dual Zoom Air units.', 80, 405);

    const metaTags = [
      ['PRICE', '$139.99'],
      ['INVENTORY', '24 In Stock'],
      ['LLM', 'Groq Llama-3.3-70B'],
      ['AUTH', 'JWT / RBAC'],
    ];

    for (let t = 0; t < metaTags.length; t++) {
      const tx = 80 + t * 215;
      const ty = 445;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, 195, 75);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "Martian Mono", monospace';
      ctx.fillText(metaTags[t][0], tx + 14, ty + 28);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px "Martian Mono", monospace';
      ctx.fillText(metaTags[t][1], tx + 14, ty + 56);
    }
  }

  if (holoTexture) {
    holoTexture.needsUpdate = true;
  }
}

function animateProjectorAndHolograms(
  time: number,
  delta: number,
  gp: number,
  op: number,
  flightBankZ: number = 0,
  restingX: number = 2.15
) {
  if (!projectsGroup.visible) return;

  state.currentProjectColor.lerp(state.targetProjectColor, 0.08);

  const pScale = 0.85 + 0.15 * op;
  projectsGroup.scale.set(pScale, pScale, pScale);

  // STABLE FORWARD-FACING PROJECTION WITH DYNAMIC FLIGHT BANKING
  // Responsive mouse parallax + banking roll when flying laterally
  projectsGroup.rotation.y = state.mouseX * 0.04;
  projectsGroup.rotation.x = -state.mouseY * 0.02;
  projectsGroup.rotation.z = flightBankZ * 0.35;

  // Drone Subtle Hover Bobbing & Banking
  const droneBobY = Math.sin(time * 2.6) * 0.025;
  const droneTiltZ = Math.cos(time * 1.8) * 0.015;
  projectorDroneGroup.position.y = 1.25 + droneBobY;
  projectorDroneGroup.rotation.z = droneTiltZ + flightBankZ;

  if (droneRotorRing) {
    // Rotor spins faster during lateral thrust/movement
    const rotorSpeed = 3.5 + Math.abs(flightBankZ) * 8.0;
    droneRotorRing.rotation.z += delta * rotorSpeed;
  }
  if (droneAccentRing) {
    (droneAccentRing.material as THREE.MeshBasicMaterial).color.copy(state.currentProjectColor);
  }
  if (droneLensLeft) {
    (droneLensLeft.material as THREE.MeshBasicMaterial).color.copy(state.currentProjectColor);
  }
  if (droneLensRight) {
    (droneLensRight.material as THREE.MeshBasicMaterial).color.copy(state.currentProjectColor);
  }

  // Hardware visibility: As the drone physically flies into the viewport from the right,
  // the drone hardware body becomes fully solid and visible
  const distFromResting = Math.max(0, droneFlightX - restingX);
  const droneFlightOp = Math.max(0, Math.min(1.0, 1.0 - (distFromResting - 0.4) / 2.6));
  const effectiveDroneOp = Math.max(op, droneFlightOp);

  if (droneBeaconLight) {
    droneBeaconLight.color.copy(state.currentProjectColor);
    droneBeaconLight.intensity = (1.6 + Math.sin(time * 4.0) * 0.4) * effectiveDroneOp;
  }

  // Update Opacity across ALL Drone meshes & materials
  if (dronePodMat) dronePodMat.opacity = effectiveDroneOp;
  if (droneRingMat) droneRingMat.opacity = effectiveDroneOp;
  if (droneRotorMat) droneRotorMat.opacity = 0.45 * effectiveDroneOp;
  if (droneLensShellMat) droneLensShellMat.opacity = effectiveDroneOp;
  if (droneLensLightMat) droneLensLightMat.opacity = effectiveDroneOp;

  // Hologram Light Beam & Screen HUD bloom as drone approaches resting position:
  const beamOp = op * Math.max(0, Math.min(1.0, 1.0 - distFromResting / 1.5));

  // Update Volumetric Light Beam Color & Pulse
  if (holoLightBeamMat) {
    holoLightBeamMat.color.copy(state.currentProjectColor);
    holoLightBeamMat.opacity = (0.38 + Math.sin(time * 2.5) * 0.04) * beamOp;
  }
  if (lensCoronaMat) {
    lensCoronaMat.color.copy(state.currentProjectColor);
    lensCoronaMat.opacity = 0.85 * beamOp;
  }
  if (holoScreenMat) {
    holoScreenMat.opacity = 0.92 * beamOp;
  }

  // Redraw dynamic HUD canvas
  drawHoloScreen(time, state.activeProjectIdx, '#' + state.currentProjectColor.getHexString());
}

function buildScene() {
  if (!scene) return;

  scene.add(rootGroup);
  scene.add(robotGroup);
  rootGroup.add(starsGroup);
  rootGroup.add(heroGroup);
  rootGroup.add(aboutGroup);
  rootGroup.add(projectsGroup);

  // Lighting for MeshStandardMaterial objects
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.8);
  dirLight1.position.set(4, 6, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
  dirLight2.position.set(-4, -2, 3);
  scene.add(dirLight2);

  // A. Deep Space Horizon Starfield (Subtle ambient stars)
  const starCount = 220;
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3 + 0] = (Math.random() - 0.5) * 45;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 45;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 45 - 5;

    const shade = 0.2 + Math.random() * 0.4;
    starColors[i * 3 + 0] = shade * 0.7;
    starColors[i * 3 + 1] = shade * 0.8;
    starColors[i * 3 + 2] = shade;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });
  const starField = new THREE.Points(starGeo, starMat);
  starsGroup.add(starField);

  // B. Hero: Iron Man Exploding Particle Core & Ambient Galaxy Background
  coreBasePos = new Float32Array(CORE_PARTICLE_COUNT * 3);
  coreExplodeDir = new Float32Array(CORE_PARTICLE_COUNT * 3);
  coreExplodeDist = new Float32Array(CORE_PARTICLE_COUNT);
  coreCurrentPos = new Float32Array(CORE_PARTICLE_COUNT * 3);
  coreSpeedFactor = new Float32Array(CORE_PARTICLE_COUNT);

  const coreCols = new Float32Array(CORE_PARTICLE_COUNT * 3);
  const colWhite = new THREE.Color('#ffffff');
  const colCyan = new THREE.Color('#38bdf8');
  const colEmerald = new THREE.Color('#34d399');

  for (let i = 0; i < CORE_PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 1.30 + (Math.random() - 0.5) * 0.25;

    const bx = r * Math.sin(phi) * Math.cos(theta);
    const by = r * Math.sin(phi) * Math.sin(theta);
    const bz = r * Math.cos(phi);

    coreBasePos[i3 + 0] = bx;
    coreBasePos[i3 + 1] = by;
    coreBasePos[i3 + 2] = bz;

    coreCurrentPos[i3 + 0] = bx;
    coreCurrentPos[i3 + 1] = by;
    coreCurrentPos[i3 + 2] = bz;

    // Radial explosion vector with organic dispersion
    let nx = bx / r;
    let ny = by / r;
    let nz = bz / r;
    nx += (Math.random() - 0.5) * 0.35;
    ny += (Math.random() - 0.5) * 0.35;
    nz += (Math.random() - 0.5) * 0.35;
    const len = Math.hypot(nx, ny, nz) || 1.0;
    coreExplodeDir[i3 + 0] = nx / len;
    coreExplodeDir[i3 + 1] = ny / len;
    coreExplodeDir[i3 + 2] = nz / len;

    // CALIBRATED EXPLOSION DISTANCE (doesn't go too far, stays visible on screen!):
    // Horizontal expands up to 2.4, vertical up to 0.95, depth up to 1.6
    const dirX = Math.abs(nx);
    const dirY = Math.abs(ny);
    const dirZ = Math.abs(nz);
    const maxTravel = 0.85 * dirY + 2.35 * dirX + 1.55 * dirZ;
    coreExplodeDist[i] = 0.55 + Math.random() * maxTravel;
    coreSpeedFactor[i] = 0.70 + Math.random() * 0.60;

    // Predominantly luminous white dots (as requested by user) with cyan/mint cyber accents
    const randCol = Math.random();
    let col: THREE.Color;
    if (randCol < 0.78) {
      col = colWhite;
    } else if (randCol < 0.90) {
      col = colCyan;
    } else {
      col = colEmerald;
    }
    coreCols[i3 + 0] = col.r;
    coreCols[i3 + 1] = col.g;
    coreCols[i3 + 2] = col.b;
  }

  const coreGeo = new THREE.BufferGeometry();
  coreGeo.setAttribute('position', new THREE.BufferAttribute(coreCurrentPos, 3));
  coreGeo.setAttribute('color', new THREE.BufferAttribute(coreCols, 3));

  const dotTex = createParticleDotTexture();
  const coreMat = new THREE.PointsMaterial({
    size: 0.050,
    map: dotTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.80,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  coreParticles = new THREE.Points(coreGeo, coreMat);
  heroGroup.add(coreParticles);

  // Restore Hero wireframe icosahedron & aura (Hero like before!)
  const icoGeo = new THREE.IcosahedronGeometry(1.05, 1);
  const icoWire = new THREE.WireframeGeometry(icoGeo);
  const icoMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
  });
  coreIcosahedron = new THREE.LineSegments(icoWire, icoMat);
  heroGroup.add(coreIcosahedron);

  const glowGeo = new THREE.SphereGeometry(0.75, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.20,
    wireframe: true,
  });
  coreAura = new THREE.Mesh(glowGeo, glowMat);
  heroGroup.add(coreAura);
  heroGroup.position.set(0, 0.1, -0.4);

  // D. Projects: Cybernetic Projector Drone & 4 Dynamic Project Holograms
  buildProjectorAndHolograms();

  // =============================================================
  // E. Autonomous 3D AI Robot Companion (Sleek High-Tech Cyber Drone)
  // Ceramic Pearl White + Curved Obsidian OLED Visor + Glowing Cyan LED Eyes
  // =============================================================

  // =============================================================
  // E. Autonomous 3D AI Robot Companion: Polished Copter Drone
  // High-fidelity stylized character based on user illustration:
  // - Glossy aerodynamic white helmet
  // - Clean non-intersecting curved royal-blue visor shield with crisp bevel
  // - Expressive slanted glowing cyan digital eyes & smirk
  // - Sleek aerodynamic blue swept-back ear fins
  // - Rotating helicopter copter rotor with blur disc
  // - Right arm in superhero flying punch pose
  // - Left arm streamlined in flight pose (NO PACKAGE!)
  // =============================================================

  // Materials
  // Materials
  const whiteShellMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.05,
    clearcoat: 0.45,
    clearcoatRoughness: 0.08,
  });

  const oledScreenMat = new THREE.MeshStandardMaterial({
    color: 0x070c18, // Deep sleek obsidian OLED display glass
    roughness: 0.08,
    metalness: 0.85,
    clearcoat: 0.95,
    clearcoatRoughness: 0.04,
  });

  const blueAccentMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Vibrant cyber sky/blue accent
    roughness: 0.18,
    metalness: 0.2,
  });

  const darkJointMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Slate dark bezel border
    roughness: 0.35,
    metalness: 0.6,
  });

  const cyanGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe, // Luminous digital face glow
  });

  const rotorBlurMat = new THREE.MeshBasicMaterial({
    color: 0xa5f3fc,
    transparent: true,
    opacity: 0.45,
  });

  robotGroup.add(robotHeadGroup);

  // 1. Sleek Rounded White Helmet Shell (High-Craft Squircle)
  const helmetShape = createRoundedRectShape(0.66, 0.48, 0.16);
  const helmetGeo = new THREE.ExtrudeGeometry(helmetShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSegments: 12,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  helmetGeo.center();
  const helmetMesh = new THREE.Mesh(helmetGeo, whiteShellMat);
  robotHeadGroup.add(helmetMesh);

  // 2. Beveled Dark Visor Frame / Outer Bezel
  const bezelShape = createRoundedRectShape(0.56, 0.40, 0.11);
  const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  bezelGeo.center();
  const bezelMesh = new THREE.Mesh(bezelGeo, darkJointMat);
  bezelMesh.position.set(0, 0.01, 0.215);
  robotHeadGroup.add(bezelMesh);

  // 3. Dark Glossy OLED Screen Display
  const screenShape = createRoundedRectShape(0.50, 0.34, 0.085);
  const screenGeo = new THREE.ExtrudeGeometry(screenShape, {
    depth: 0.01,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
  screenGeo.center();
  const screenMesh = new THREE.Mesh(screenGeo, oledScreenMat);
  screenMesh.position.set(0, 0.01, 0.23);
  robotHeadGroup.add(screenMesh);

  // 4. Expressive Digital Face Display (Glowing Arched Cyan Eyes & Open Smile)
  // Eye Group contains ONLY eyes so blinking does not squash the mouth!
  robotEyesGroup.position.set(0, 0.025, 0.252);
  robotHeadGroup.add(robotEyesGroup);

  const archEyeGeo = createArchEyeGeometry();

  // Left Arched Eye
  robotLeftEye = new THREE.Mesh(archEyeGeo, cyanGlowMat);
  robotLeftEye.position.set(-0.11, 0, 0);
  robotEyesGroup.add(robotLeftEye);

  // Right Arched Eye
  const rightEyeGeo = archEyeGeo.clone();
  robotRightEye = new THREE.Mesh(rightEyeGeo, cyanGlowMat);
  robotRightEye.position.set(0.11, 0, 0);
  robotEyesGroup.add(robotRightEye);

  // Cheerful Glowing Cyan Open Smile Mouth (centered below eyes)
  const mouthGeo = createSmileMouthGeometry();
  robotMouth = new THREE.Mesh(mouthGeo, cyanGlowMat);
  robotMouth.position.set(0, -0.052, 0.252);
  robotHeadGroup.add(robotMouth);

  // 5. Sleek Side Headphone Ear Pods (matching reference image)
  const earGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 32);
  earGeo.rotateZ(Math.PI * 0.5); // align with X axis

  const leftEar = new THREE.Mesh(earGeo, whiteShellMat);
  leftEar.position.set(-0.39, 0.01, 0);
  robotHeadGroup.add(leftEar);

  const rightEarGeo = earGeo.clone();
  const rightEar = new THREE.Mesh(rightEarGeo, whiteShellMat);
  rightEar.position.set(0.39, 0.01, 0);
  robotHeadGroup.add(rightEar);

  // Outer Blue Accent Rings on Ear Pods
  const ringGeo = new THREE.TorusGeometry(0.06, 0.008, 12, 28);
  ringGeo.rotateY(Math.PI * 0.5);

  const leftRing = new THREE.Mesh(ringGeo, blueAccentMat);
  leftRing.position.set(-0.416, 0.01, 0);
  robotHeadGroup.add(leftRing);

  const rightRingGeo = ringGeo.clone();
  const rightRing = new THREE.Mesh(rightRingGeo, blueAccentMat);
  rightRing.position.set(0.416, 0.01, 0);
  robotHeadGroup.add(rightRing);

  // 6. Copter Rotor on Top of Helmet
  robotRotorGroup.position.set(0, 0.32, 0);
  robotHeadGroup.add(robotRotorGroup);

  // Base mount collar
  const mountCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.02, 24), darkJointMat);
  robotRotorGroup.add(mountCollar);

  // Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 12);
  const shaft = new THREE.Mesh(shaftGeo, darkJointMat);
  shaft.position.set(0, 0.06, 0);
  robotRotorGroup.add(shaft);

  // Aerodynamic Blue Hub Cap
  const hubGeo = new THREE.SphereGeometry(0.034, 16, 16);
  hubGeo.scale(1.0, 0.7, 1.0);
  const hub = new THREE.Mesh(hubGeo, blueAccentMat);
  hub.position.set(0, 0.12, 0);
  robotRotorGroup.add(hub);

  // Curved Propeller Blades
  const propBladeGeo = new THREE.BoxGeometry(0.72, 0.006, 0.055);
  const propBlade = new THREE.Mesh(propBladeGeo, whiteShellMat);
  propBlade.position.set(0, 0.12, 0);
  robotRotorGroup.add(propBlade);

  // Rotor Motion Blur Disc (semi-transparent glowing blur)
  const blurDiscGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.004, 32);
  const blurDisc = new THREE.Mesh(blurDiscGeo, rotorBlurMat);
  blurDisc.position.set(0, 0.12, 0);
  robotRotorGroup.add(blurDisc);

  // 6. Cute Blue Pod Cushions / Feet Under Body
  const footGeo = new THREE.CapsuleGeometry(0.055, 0.12, 8, 16);
  footGeo.scale(1.1, 0.65, 1.25);

  const leftFoot = new THREE.Mesh(footGeo, blueAccentMat);
  leftFoot.position.set(-0.16, -0.34, 0);
  leftFoot.rotation.x = 0.25;
  robotHeadGroup.add(leftFoot);

  const rightFootGeo = footGeo.clone();
  const rightFoot = new THREE.Mesh(rightFootGeo, blueAccentMat);
  rightFoot.position.set(0.16, -0.34, 0);
  rightFoot.rotation.x = 0.25;
  robotHeadGroup.add(rightFoot);

  // 7. Flight Thruster / Anti-Gravity Light
  robotThrusterLight = new THREE.PointLight(0x00f2fe, 1.8, 3.5);
  robotThrusterLight.position.set(0, -0.42, 0);
  robotHeadGroup.add(robotThrusterLight);

  // 8. Invisible Hit Mesh for Raycasting
  const hitGeo = new THREE.SphereGeometry(0.72, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  robotHitMesh = new THREE.Mesh(hitGeo, hitMat);
  robotGroup.add(robotHitMesh);

  // Initial Position at Hero Waypoint
  robotGroup.position.set(1.75, 0.35, 1.0);
}

// -------------------------------------------------------------
// 2. Animation & Render Loop (Continuous Scroll-Driven)
// -------------------------------------------------------------
function animate(timeMs: number) {
  animationFrameId = requestAnimationFrame(animate);
  const time = timeMs * 0.001;
  const delta = Math.min(clock.getDelta(), 0.1);
  const lerpFactor = 1.0 - Math.exp(-6.0 * delta);

  state.mouseX += (state.targetMouseX - state.mouseX) * 0.14;
  state.mouseY += (state.targetMouseY - state.mouseY) * 0.14;

  state.globalProgress += (state.targetGlobalProgress - state.globalProgress) * 0.08;
  const gp = state.globalProgress; // 0.0 to 1.0 across site

  // Chapter-locked camera waypoints:
  // Eliminates camera rotation drift during pinned multi-project scroll,
  // guaranteeing the hologram drone stays 100% solidly locked on the right side.
  let targetX = 0, targetY = 0, targetZ = 4.8;
  let lookX = 0, lookY = 0, lookZ = 0;

  if (state.currentChapter === 'hero') {
    targetX = 0.0;
    targetY = 0.0;
    targetZ = 4.8;
    lookX = 0.0;
    lookY = 0.0;
    lookZ = 0.0;
  } else if (state.currentChapter === 'about') {
    targetX = 0.0;
    targetY = 0.0;
    targetZ = 5.0;
    lookX = 0.0;
    lookY = 0.0;
    lookZ = 0.0;
  } else if (state.currentChapter === 'projects') {
    // Solidly locked during all 4 projects so the right-hand hologram NEVER shifts or drifts to the center!
    targetX = 0.0;
    targetY = 0.0;
    targetZ = 5.0;
    lookX = 0.0;
    lookY = 0.0;
    lookZ = 0.0;
  } else {
    // Contact
    targetX = 0.0;
    targetY = -0.2;
    targetZ = 5.8;
    lookX = 0.0;
    lookY = 0.0;
    lookZ = 0.0;
  }

  for (let i = 0; i < 3; i++) {
    const tPos = [targetX, targetY, targetZ][i];
    const tLook = [lookX, lookY, lookZ][i];
    state.currentCamPos[i] += (tPos - state.currentCamPos[i]) * lerpFactor;
    state.currentCamLook[i] += (tLook - state.currentCamLook[i]) * lerpFactor;
  }

  if (camera) {
    camera.position.x = state.currentCamPos[0];
    camera.position.y = state.currentCamPos[1];
    camera.position.z = state.currentCamPos[2];
    camera.lookAt(state.currentCamLook[0], state.currentCamLook[1], state.currentCamLook[2]);
  }

  // Smooth Group Opacities (Asymmetric: smooth bloom on entry, rapid crisp dismissal on exit)
  const isProjectsActive = state.currentChapter === 'projects';
  const targetProjectsOp = isProjectsActive ? 1.0 : 0.0;
  const fadeRate = isProjectsActive ? 9.0 : 22.0;
  opacities.projects += (targetProjectsOp - opacities.projects) * (1.0 - Math.exp(-fadeRate * delta));
  if (opacities.projects < 0.005) {
    opacities.projects = 0.0;
  }
  aboutGroup.visible = false;

  // -------------------------------------------------------------
  // Dynamic Iron Man Core Explosion & Rotating Galaxy Background
  // - In Hero: Compact neural core at rest (explodeProgress = 0.0)
  // - Scroll down Hero towards About: Explodes radially outward (explodeProgress 0.0 -> 1.0)
  // - About, Projects, Contact: Stays expanded as an ambient 3D rotating starfield of white dots
  // -------------------------------------------------------------
  let targetExplode = 0.0;
  if (state.currentChapter === 'hero') {
    const scrollThreshold = (window.innerHeight * 0.70) || 600;
    targetExplode = Math.min(1.0, Math.max(0.0, state.scrollY / scrollThreshold));
  } else {
    // About, Projects, Contact all maintain full exploded galaxy state
    targetExplode = 1.0;
  }

  // Smooth lerp for explosion transition
  state.explodeProgress += (targetExplode - state.explodeProgress) * 0.08;
  const ep = state.explodeProgress;

  // Punchy cinematic cubic-out shockwave curve
  const burstEase = 1.0 - Math.pow(1.0 - ep, 3);

  // Update dynamic particle positions for explosion & persistent background galaxy
  if (coreParticles && coreBasePos && coreExplodeDir) {
    const posAttr = coreParticles.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < CORE_PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const p = Math.min(1.0, burstEase * coreSpeedFactor[i]);
      const dist = coreExplodeDist[i] * p;

      posArr[i3 + 0] = coreBasePos[i3 + 0] + coreExplodeDir[i3 + 0] * dist;
      posArr[i3 + 1] = coreBasePos[i3 + 1] + coreExplodeDir[i3 + 1] * dist;
      posArr[i3 + 2] = coreBasePos[i3 + 2] + coreExplodeDir[i3 + 2] * dist;
    }
    posAttr.needsUpdate = true;

    // Continuous 3D slow celestial rotation across all sections (independent of cursor)
    coreParticles.rotation.y = time * 0.045 + gp * 2.2;
    coreParticles.rotation.x = Math.sin(time * 0.028) * 0.10;
    coreParticles.rotation.z = Math.cos(time * 0.022) * 0.08;

    // Opacity: bright at core in hero, radiant white galaxy when exploded
    const coreMat = coreParticles.material as THREE.PointsMaterial;
    coreMat.opacity = THREE.MathUtils.lerp(0.80, 0.70, ep);
    coreMat.size = THREE.MathUtils.lerp(0.048, 0.056, ep);
  }

  // Wireframe Cage & Aura Shatter/Fade (Hero sphere dissolves cleanly as you scroll into About)
  if (coreIcosahedron && coreAura) {
    const wireFade = Math.max(0, 1.0 - ep * 1.5);
    const wireScale = 1.0 + burstEase * 3.2;

    coreIcosahedron.scale.set(wireScale, wireScale, wireScale);
    coreIcosahedron.rotation.y = -time * 0.25 - ep * 2.8;
    coreIcosahedron.rotation.z = time * 0.12 + ep * 1.4;
    (coreIcosahedron.material as THREE.LineBasicMaterial).opacity = 0.18 * wireFade;

    coreAura.scale.set(wireScale, wireScale, wireScale);
    (coreAura.material as THREE.MeshBasicMaterial).opacity = 0.20 * wireFade;
  }

  // heroGroup is ALWAYS visible so the rotating white dots galaxy serves as the background
  // for all subsequent sections (About, Projects, Contact)!
  heroGroup.visible = true;

  // -------------------------------------------------------------
  // Animate Projects: Flying Projector Drone & 4 Dynamic Holograms
  // Lateral flight navigation: Swoops in from right, settles into hover,
  // and accelerates out to the right when exiting!
  // -------------------------------------------------------------
  const aspect = camera ? camera.aspect : 1.77;
  const restingProjX = Math.max(1.65, Math.min(2.15, aspect * 1.22));
  const offscreenProjX = Math.max(restingProjX + 3.8, aspect * 2.4);

  const targetFlightX = isProjectsActive ? restingProjX : offscreenProjX;
  const flightSpeed = isProjectsActive ? 6.5 : 8.5;
  const prevFlightX = droneFlightX;
  droneFlightX += (targetFlightX - droneFlightX) * (1.0 - Math.exp(-flightSpeed * delta));

  // Velocity-derived banking for authentic flight dynamics
  const flightVelX = (droneFlightX - prevFlightX) / Math.max(0.001, delta);
  // Negative velocity (flying left/entering) banks left (+Z); positive (flying right/exiting) banks right (-Z)
  const targetBankZ = THREE.MathUtils.clamp(-flightVelX * 0.055, -0.22, 0.22);
  droneFlightBankZ += (targetBankZ - droneFlightBankZ) * (1.0 - Math.exp(-12.0 * delta));

  projectsGroup.position.x = droneFlightX;

  // Group is visible whenever the drone is inside the screen area or still has opacity
  projectsGroup.visible = (droneFlightX < (offscreenProjX - 0.1)) || (opacities.projects > 0.001) || isProjectsActive;

  if (projectsGroup.visible) {
    animateProjectorAndHolograms(time, delta, gp, opacities.projects, droneFlightBankZ, restingProjX);
  }

  // -------------------------------------------------------------
  // Animate 3D Robot Companion: Chapter-Mapped Flight Waypoints
  // - Hero: Hovering upper right of hero [1.75, 0.35, 1.0]
  // - About: Hovering peacefully in the upper-right open space [1.75, 0.45, 1.1]
  //   Completely clear of the photo on the left, safely below the top navbar!
  // - Projects: Upper-left corner [-1.65, 1.25, 1.2] watching the hologram from across the screen
  // - Contact: Lower right assistant position [1.35, 0.15, 1.5]
  // -------------------------------------------------------------
  let rTargetX = 1.75, rTargetY = 0.35, rTargetZ = 1.0;
  if (state.currentChapter === 'hero') {
    rTargetX = 1.75;
    rTargetY = 0.35;
    rTargetZ = 1.0;
  } else if (state.currentChapter === 'about') {
    // Open negative space in the upper-right:
    // Completely unblocked by photo (on the left), well below the top navbar!
    rTargetX = 1.75;
    rTargetY = 0.45;
    rTargetZ = 1.1;
  } else if (state.currentChapter === 'projects') {
    // Gracefully hovers on upper-left: completely clear of hologram stage and project text
    rTargetX = -1.65;
    rTargetY = 1.25;
    rTargetZ = 1.2;
  } else {
    // Contact
    rTargetX = 1.35;
    rTargetY = 0.15;
    rTargetZ = 1.5;
  }

  const bobY = Math.sin(time * 2.8) * 0.06;
  const bobTilt = Math.cos(time * 1.8) * 0.04;

  // Smooth position lerping
  robotGroup.position.x += (rTargetX - robotGroup.position.x) * lerpFactor;
  robotGroup.position.y += (rTargetY + bobY - robotGroup.position.y) * lerpFactor;
  robotGroup.position.z += (rTargetZ - robotGroup.position.z) * lerpFactor;

  // Smooth scale on hover (compact drone scale)
  const targetScale = isRobotHovered ? 0.72 : 0.65;
  currentRobotScale += (targetScale - currentRobotScale) * 0.12;
  robotGroup.scale.set(currentRobotScale, currentRobotScale, currentRobotScale);

  // Natural Occasional Eye Blinking Animation
  if (!isBlinking) {
    timeUntilNextBlink -= delta;
    if (timeUntilNextBlink <= 0) {
      isBlinking = true;
      blinkProgress = 0;
    }
  } else {
    blinkProgress += delta / BLINK_DURATION;
    if (blinkProgress >= 1.0) {
      if (!isDoubleBlink && Math.random() < 0.25) {
        // Occasional cute double-blink!
        isDoubleBlink = true;
        blinkProgress = 0;
      } else {
        isBlinking = false;
        isDoubleBlink = false;
        timeUntilNextBlink = 2.8 + Math.random() * 2.2;
      }
    }
  }

  // Smooth sinusoidal eye closure curve
  let eyeScaleY = 1.0;
  if (isBlinking) {
    const sinBlink = Math.sin(Math.min(1.0, blinkProgress) * Math.PI);
    eyeScaleY = Math.max(0.06, 1.0 - sinBlink * 0.94);
  } else if (isRobotHovered) {
    eyeScaleY = 1.15; // slightly wider eyes on hover
  }
  robotEyesGroup.scale.y = eyeScaleY;

  // Fast Propeller Rotor Spin
  robotRotorGroup.rotation.y += delta * 32.0;

  // -------------------------------------------------------------
  // True 3D Cursor Sightline Tracking (Industry standard Raycaster + Plane intersection)
  // Calculates the exact 3D ray from the camera through the mouse cursor and finds its intersection
  // with a virtual plane in front of the robot. The robot computes the exact local sightline angle
  // so its head and cyan cyber-eyes focus directly on the user's cursor from any position on screen.
  // -------------------------------------------------------------
  if (camera && robotGroup && robotHeadGroup) {
    robotHeadGroup.getWorldPosition(robotHeadWorld);
    camera.getWorldDirection(camForward);

    // Focal plane sits ~1.8 units in front of the robot towards the camera
    planeTargetPoint.copy(robotHeadWorld).addScaledVector(camForward, -1.8);
    cursorPlane.setFromNormalAndCoplanarPoint(camForward.clone().negate(), planeTargetPoint);

    mouseNDC.set(state.mouseX, -state.mouseY);
    raycaster.setFromCamera(mouseNDC, camera);

    const hit = raycaster.ray.intersectPlane(cursorPlane, cursorWorldHit);
    if (hit) {
      // Transform world intersection into the robot's local coordinate system
      robotLocalTarget.copy(cursorWorldHit);
      robotGroup.worldToLocal(robotLocalTarget);

      // Local coordinate axes: +Z = forward out of visor, +X = right, +Y = top
      const lx = robotLocalTarget.x;
      const ly = robotLocalTarget.y;
      const lz = Math.max(0.3, robotLocalTarget.z);
      const distXZ = Math.hypot(lx, lz);

      // True 3D trigonometric sightline angles
      const rawYaw = Math.atan2(lx, lz);
      const rawPitch = -Math.atan2(ly, distXZ);

      // Natural clamped range of motion (prevents neck over-rotation)
      const maxYaw = 0.65;       // ~37 degrees max yaw turn
      const maxPitchUp = 0.42;   // ~24 degrees max tilt up
      const maxPitchDown = 0.38; // ~22 degrees max tilt down

      const clampedYaw = THREE.MathUtils.clamp(rawYaw, -maxYaw, maxYaw);
      const clampedPitch = THREE.MathUtils.clamp(rawPitch, -maxPitchUp, maxPitchDown);

      // Aerodynamic forward flight posture + interactive tracking + bob
      const flightPitch = 0.16;
      const targetHeadRotX = flightPitch + clampedPitch + bobTilt;
      const targetHeadRotY = clampedYaw + Math.sin(time * 1.5) * 0.03;

      robotHeadGroup.rotation.x += (targetHeadRotX - robotHeadGroup.rotation.x) * 0.15;
      robotHeadGroup.rotation.y += (targetHeadRotY - robotHeadGroup.rotation.y) * 0.15;

      // Cyan cyber-eyes inside dark OLED visor glance directly toward the cursor
      const eyeGlanceX = (clampedYaw / maxYaw) * 0.024;
      const eyeGlanceY = (-clampedPitch / maxPitchUp) * 0.020;
      robotEyesGroup.position.x += (eyeGlanceX - robotEyesGroup.position.x) * 0.18;
      robotEyesGroup.position.y += (0.025 + eyeGlanceY - robotEyesGroup.position.y) * 0.18;

      // Banking into curves: realistic drone roll when looking or turning left/right
      const rollTarget = -clampedYaw * 0.32;
      robotGroup.rotation.z += (rollTarget + Math.sin(time * 1.8) * 0.03 - robotGroup.rotation.z) * 0.08;
    }
  }

  // Thruster light & levitation glow
  if (robotThrusterLight) {
    robotThrusterLight.intensity = 1.6 + Math.sin(time * 8.0) * 0.5 + (isRobotHovered ? 1.2 : 0.0);
  }

  // Project 3D Robot Position to 2D Screen Space for Speech Badge
  if (camera && robotGroup) {
    const wp = new THREE.Vector3();
    robotGroup.getWorldPosition(wp);
    wp.y += 0.38; // Float slightly above head at 0.65 scale
    wp.project(camera);

    const screenX = (wp.x * 0.5 + 0.5) * (window.innerWidth || 1);
    const screenY = (-(wp.y * 0.5) + 0.5) * (window.innerHeight || 1);

    if (wp.z < 1.0 && screenX > -50 && screenX < window.innerWidth + 50) {
      robotBadgePos.value.x = screenX;
      robotBadgePos.value.y = screenY;
      robotBadgeVisible.value = true;
    } else {
      robotBadgeVisible.value = false;
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// -------------------------------------------------------------
// 3. External API & Interaction
// -------------------------------------------------------------
function setChapter(chapter: ChapterId) {
  state.currentChapter = chapter;
}

function setScrollState(
  globalProgress: number,
  scrollY: number,
  chapterProgress: { hero: number; about: number; projects: number; contact: number }
) {
  state.targetGlobalProgress = Math.min(1, Math.max(0, globalProgress));
  state.scrollY = scrollY;
  state.chapterProgress = chapterProgress;
}

function setActiveProject(idx: number) {
  state.activeProjectIdx = idx;
  const proj = projectsData[idx];
  if (proj) {
    state.targetProjectColor.set(proj.accentColor);
  }
}

function checkRobotRaycast(clientX: number, clientY: number): boolean {
  if (!camera || !robotHitMesh) return false;
  mouseVec.x = (clientX / window.innerWidth) * 2 - 1;
  mouseVec.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouseVec, camera);
  const intersects = raycaster.intersectObject(robotHitMesh);
  return intersects.length > 0;
}

function handleMouseMove(e: MouseEvent) {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  state.targetMouseX = (e.clientX / w) * 2 - 1;
  state.targetMouseY = (e.clientY / h) * 2 - 1;

  const hit = checkRobotRaycast(e.clientX, e.clientY);
  if (hit !== isRobotHovered) {
    isRobotHovered = hit;
    document.body.style.cursor = hit ? 'pointer' : '';
  }
}

function handleCanvasClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  // Don't intercept clicks meant for interactive HTML elements
  if (target && target.closest('button, a, input, textarea, .quick-chip, .close-btn, .chat-terminal, .nav-container')) {
    return;
  }
  if (isRobotHovered || checkRobotRaycast(e.clientX, e.clientY)) {
    emit('click-robot');
  }
}

function handleResize() {
  if (!renderer || !camera || !canvasRef.value) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

onMounted(() => {
  if (!canvasRef.value) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, 0.04);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.8);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  buildScene();

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('click', handleCanvasClick);

  animationFrameId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('click', handleCanvasClick);
  document.body.style.cursor = '';
  if (renderer) renderer.dispose();
});

defineExpose({
  setChapter,
  setScrollState,
  setActiveProject,
});
</script>

<style scoped lang="scss">
.stage-3d-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  &.is-interactive {
    pointer-events: auto;
  }
}

.stage-3d-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

// Floating Robot Cybernetic Speech Badge
.robot-screen-badge {
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: auto;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 12px;
  background: rgba(10, 16, 30, 0.85);
  border: 1px solid rgba(0, 242, 254, 0.35);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 242, 254, 0.15);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  user-select: none;

  &:hover,
  &.is-hovered {
    background: rgba(15, 23, 42, 0.95);
    border-color: #00f2fe;
    transform: translate(-50%, -115%) scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.75), 0 0 25px rgba(0, 242, 254, 0.3);

    .badge-radar {
      box-shadow: 0 0 12px #00f2fe;
    }
  }

  .badge-radar {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00f2fe;
    box-shadow: 0 0 8px #00f2fe;
    animation: radar-pulse 1.8s infinite ease-in-out;
    flex-shrink: 0;
  }

  .badge-content {
    display: flex;
    flex-direction: column;
    gap: 1px;

    .badge-title {
      font-family: 'Martian Mono', monospace;
      font-size: 8.5px;
      font-weight: 700;
      color: #00f2fe;
      letter-spacing: 0.08em;
    }

    .badge-message {
      font-size: 11px;
      color: #f1f5f9;
      font-weight: 500;
    }
  }
}

@keyframes radar-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

@media (max-width: 768px) {
  .robot-screen-badge {
    display: none; // Keep clean on mobile, mobile uses bottom pill
  }
}
</style>
