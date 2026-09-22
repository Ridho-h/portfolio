<template>
  <section ref="sectionRef" class="latent-space" id="skills">
    <div class="latent-container">
      <!-- Section Header -->
      <div class="section-lead">
        <div class="cyber-badge cyber-badge--violet">
          <span class="pulse-dot"></span>
          <span>STAGE 03 // EMBEDDING GALAXY</span>
        </div>
        <h2 class="section-title">
          <span>LATENT</span>
          <span class="title-gradient">SPACE</span>
        </h2>
        <p class="section-desc">
          Dimensionality reduction (t-SNE / UMAP) projecting skills into a 3D manifold.
          Activations fire across synapses as the camera orbits through cluster topologies.
        </p>

        <!-- Cluster Category Filters -->
        <div class="cluster-filters">
          <button
            class="filter-pill"
            :class="{ 'filter-pill--active': activeCluster === 'all' }"
            @click="filterCluster('all')"
          >
            <span>ALL CLUSTERS (18 NODES)</span>
          </button>
          <button
            v-for="c in skillClusters"
            :key="c.id"
            class="filter-pill"
            :class="{ 'filter-pill--active': activeCluster === c.id }"
            :style="{ '--c-color': c.color }"
            @click="filterCluster(c.id)"
          >
            <span class="pill-dot" :style="{ backgroundColor: c.color }"></span>
            <span>{{ c.name }}</span>
          </button>
        </div>
      </div>

      <!-- 3D Latent Galaxy Canvas Viewport -->
      <div class="canvas-viewport glass-panel" ref="viewportRef">
        <canvas ref="canvasRef" class="galaxy-canvas"></canvas>

        <!-- Floating HUD Inspector on Hover -->
        <Transition name="fade-scale">
          <div
            v-if="hoveredNode"
            class="node-inspector glass-panel"
            :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
          >
            <div class="inspector-header">
              <span class="inspector-dot" :style="{ backgroundColor: hoveredNode.color }"></span>
              <span class="inspector-name">{{ hoveredNode.name }}</span>
              <span class="inspector-lvl">{{ hoveredNode.level }}%</span>
            </div>
            <div class="inspector-cluster" :style="{ color: hoveredNode.color }">
              // {{ hoveredNode.clusterName }}
            </div>
            <p class="inspector-note">{{ hoveredNode.note }}</p>
            <div class="inspector-meter-track">
              <div
                class="inspector-meter-fill"
                :style="{ width: `${hoveredNode.level}%`, backgroundColor: hoveredNode.color }"
              ></div>
            </div>
          </div>
        </Transition>

        <!-- Viewport Controls & Instructions -->
        <div class="viewport-hud-bottom">
          <div class="hud-item">
            <span class="hud-key">DRAG / HOVER:</span>
            <span class="hud-val">Inspect Node Coordinates</span>
          </div>
          <div class="hud-item">
            <span class="hud-key">SCROLL:</span>
            <span class="hud-val">Manifold Orbital Rotation</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillNodes, skillClusters, SkillNode } from '../../data/skills-galaxy';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const activeCluster = ref<string>('all');
const hoveredNode = ref<SkillNode | null>(null);
const tooltipPos = ref({ x: 0, y: 0 });

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animId: number = 0;
let nodeMeshes: { mesh: THREE.Mesh; data: SkillNode }[] = [];
let synapseLines: THREE.LineSegments | null = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(-999, -999);
let stInstance: ScrollTrigger | null = null;
let orbitProgress = 0;
let lastHoveredId: string | null = null;
let lastHoverSoundTime = 0;
let missFrameCount = 0;

function filterCluster(clusterId: string) {
  activeCluster.value = clusterId;
  soundManager.playClick();

  nodeMeshes.forEach(({ mesh, data }) => {
    const isVisible = clusterId === 'all' || data.cluster === clusterId;
    gsap.to(mesh.scale, {
      x: isVisible ? 1 : 0.2,
      y: isVisible ? 1 : 0.2,
      z: isVisible ? 1 : 0.2,
      duration: 0.4,
      ease: 'power2.out',
    });
    const mat = mesh.material as THREE.MeshStandardMaterial;
    gsap.to(mat, {
      opacity: isVisible ? 1 : 0.15,
      duration: 0.4,
    });
  });
}

function initThree() {
  if (!canvasRef.value || !viewportRef.value) return;

  const rect = viewportRef.value.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height || 540;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, 0.08);

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
  camera.position.set(0, 1.2, 5.8);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Directional Lights
  const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  // Background Particle Dust
  const pCount = 300;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 16;
    pPos[i + 1] = (Math.random() - 0.5) * 12;
    pPos[i + 2] = (Math.random() - 0.5) * 12;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.04,
    transparent: true,
    opacity: 0.35,
  });
  const dust = new THREE.Points(pGeo, pMat);
  scene.add(dust);

  // 1. Create Glowing Skill Nodes
  const nodeGeo = new THREE.SphereGeometry(0.14, 24, 24);

  nodeMeshes = skillNodes.map((node) => {
    const mat = new THREE.MeshStandardMaterial({
      color: node.hexColor,
      emissive: node.hexColor,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(node.x, node.y, node.z);
    scene.add(mesh);
    return { mesh, data: node };
  });

  // 2. Create Synapse Lines within clusters
  const linePoints: THREE.Vector3[] = [];
  for (let i = 0; i < skillNodes.length; i++) {
    for (let j = i + 1; j < skillNodes.length; j++) {
      const a = skillNodes[i];
      const b = skillNodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
      if (a.cluster === b.cluster && dist < 1.8) {
        linePoints.push(new THREE.Vector3(a.x, a.y, a.z));
        linePoints.push(new THREE.Vector3(b.x, b.y, b.z));
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.28,
  });
  synapseLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(synapseLines);

  // Event Listeners
  window.addEventListener('resize', onResize);
  viewportRef.value.addEventListener('mousemove', onMouseMove);
  viewportRef.value.addEventListener('mouseleave', onMouseLeave);

  animate();
}

function onMouseMove(e: MouseEvent) {
  if (!viewportRef.value) return;
  const rect = viewportRef.value.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  // Position tooltip relative to viewport
  tooltipPos.value = {
    x: Math.min(rect.width - 280, Math.max(16, e.clientX - rect.left + 15)),
    y: Math.min(rect.height - 180, Math.max(16, e.clientY - rect.top - 20)),
  };
}

function onMouseLeave() {
  mouse.x = -999;
  mouse.y = -999;
  hoveredNode.value = null;
  lastHoveredId = null;
  missFrameCount = 0;
  nodeMeshes.forEach(({ mesh }) => {
    gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.25, overwrite: 'auto' });
  });
}

function onResize() {
  if (!viewportRef.value || !renderer || !camera) return;
  const rect = viewportRef.value.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height || 540;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  animId = requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  // Gentle floating oscillation for nodes
  nodeMeshes.forEach(({ mesh }, i) => {
    mesh.position.y += Math.sin(time * 1.5 + i) * 0.0008;
  });

  // Orbital camera rotation mapped to scroll progress + slow ambient drift
  const angle = orbitProgress * Math.PI * 1.4 + time * 0.08;
  const radius = 5.8;
  camera.position.x = Math.sin(angle) * radius;
  camera.position.z = Math.cos(angle) * radius;
  camera.position.y = 1.0 + Math.sin(time * 0.4) * 0.2;
  camera.lookAt(0, 0, 0);

  // Raycasting for hover tooltip with debouncing & hysteresis
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

  if (intersects.length > 0) {
    missFrameCount = 0;
    const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
    if (hit) {
      if (hit.data.id !== lastHoveredId) {
        lastHoveredId = hit.data.id;
        hoveredNode.value = hit.data;

        // Throttled sound: only play if at least 200ms passed since last sound
        const now = performance.now();
        if (now - lastHoverSoundTime > 200) {
          soundManager.playHover();
          lastHoverSoundTime = now;
        }

        // Animate node scale cleanly without flickering
        nodeMeshes.forEach(({ mesh, data }) => {
          if (data.id === hit.data.id) {
            gsap.to(mesh.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.2, overwrite: 'auto' });
          } else {
            gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.2, overwrite: 'auto' });
          }
        });
      }
    }
  } else {
    // Hysteresis: only clear hover state after mouse is away for 10 consecutive frames
    missFrameCount++;
    if (missFrameCount > 10 && hoveredNode.value) {
      nodeMeshes.forEach(({ mesh }) => {
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.25, overwrite: 'auto' });
      });
      hoveredNode.value = null;
      lastHoveredId = null;
    }
  }

  renderer.render(scene, camera);
}

onMounted(() => {
  initThree();

  if (sectionRef.value) {
    stInstance = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => {
        orbitProgress = self.progress;
      },
    });
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
  window.removeEventListener('resize', onResize);
  viewportRef.value?.removeEventListener('mousemove', onMouseMove);
  viewportRef.value?.removeEventListener('mouseleave', onMouseLeave);
  stInstance?.kill();
  renderer?.dispose();
});
</script>

<style scoped lang="scss">
.latent-space {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem;
  background-color: #030712;
  box-sizing: border-box;
}

.latent-container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Section Header */
.section-lead {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.section-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f8fafc;
  display: flex;
  gap: 0.6rem;

  .title-gradient {
    background: linear-gradient(135deg, #a855f7 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.section-desc {
  max-width: 680px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #94a3b8;
}

/* Cluster Filters */
.cluster-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;

  .pill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &:hover {
    color: #f8fafc;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }

  &--active {
    background: rgba(255, 255, 255, 0.1);
    color: #f8fafc;
    border-color: var(--c-color, #00f2fe);
    box-shadow: 0 0 12px rgba(0, 242, 254, 0.2);
  }
}

/* Canvas Viewport */
.canvas-viewport {
  position: relative;
  width: 100%;
  height: 580px;
  border-radius: 16px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(168, 85, 247, 0.25);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}

.galaxy-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Floating Node Inspector */
.node-inspector {
  position: absolute;
  z-index: 20;
  width: 270px;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(4, 8, 22, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 242, 254, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.inspector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;

  .inspector-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .inspector-name {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    color: #f8fafc;
    margin-right: auto;
    margin-left: 0.5rem;
  }

  .inspector-lvl {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: #00f2fe;
    font-weight: 700;
  }
}

.inspector-cluster {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.inspector-note {
  margin: 0 0 0.65rem 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: #94a3b8;
}

.inspector-meter-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;

  .inspector-meter-fill {
    height: 100%;
    border-radius: 2px;
  }
}

/* Tooltip Animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

/* Viewport Bottom Controls */
.viewport-hud-bottom {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(3, 7, 18, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  pointer-events: none;

  .hud-item {
    display: flex;
    gap: 0.4rem;
  }

  .hud-key {
    color: #64748b;
  }

  .hud-val {
    color: #00f2fe;
  }
}
</style>
