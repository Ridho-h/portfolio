<template>
  <section ref="sectionRef" class="about-scan" id="about">
    <div class="scan-container">
      <!-- Section Header -->
      <div class="section-lead">
        <div class="cyber-badge cyber-badge--emerald">
          <span class="pulse-dot"></span>
          <span>STAGE 02 // COMPUTER VISION INFERENCE</span>
        </div>
        <h2 class="section-title">
          <span>DIAGNOSTIC</span>
          <span class="title-gradient">SCAN</span>
        </h2>
        <p class="section-desc">
          Camera pulls back as computer vision inference sweeps the subject frame.
          Object detection bounding boxes snap onto feature coordinates with calibrated confidence scores.
        </p>
      </div>

      <!-- Main Layout: CV Inference Viewport (Left) + Extracted Dossier (Right) -->
      <div class="scan-grid">
        <!-- 1. Left: CV Object Detection Frame with Animated Scanline & Bounding Boxes -->
        <div class="detector-frame glass-panel" ref="frameRef">
          <!-- Target Corner Reticles -->
          <div class="reticle reticle--tl"></div>
          <div class="reticle reticle--tr"></div>
          <div class="reticle reticle--bl"></div>
          <div class="reticle reticle--br"></div>

          <!-- Top Detection HUD Bar -->
          <div class="detector-hud">
            <span class="hud-mono">YOLO-V8 // INFERENCE_PASS_01</span>
            <span class="hud-fps">CONF: >0.80 · 60 FPS</span>
          </div>

          <!-- Subject Image Container -->
          <div class="subject-wrapper">
            <img src="/photo.jpeg" alt="Muhammad Ridho Hidayat" class="subject-img" />
            <div class="subject-gradient-map"></div>

            <!-- Sweeping Laser Scanline -->
            <div
              class="scan-laser-line"
              :style="{ top: `${scanProgress * 100}%` }"
              v-show="scanProgress > 0 && scanProgress < 1"
            >
              <div class="laser-beam"></div>
              <div class="laser-flare"></div>
              <span class="laser-label">SCAN_Y: {{ Math.round(scanProgress * 100) }}%</span>
            </div>

            <!-- Snapping Object Detector Bounding Boxes (Nested Hierarchy) -->
            <!-- Level 1: Outer Person Frame (Trigger at Y >= 15%) -->
            <div
              class="bbox bbox--outer"
              :class="{ 'bbox--active': scanProgress >= 0.15 }"
              style="top: 4%; left: 4%; width: 92%; height: 92%;"
            >
              <div class="bbox-tag bbox-tag--tl bbox-tag--cyan">
                <span class="tag-label">[01: PERSON // CANDIDATE: 99.8%]</span>
              </div>
              <div class="bbox-reticle bbox-reticle--tl"></div>
              <div class="bbox-reticle bbox-reticle--tr"></div>
              <div class="bbox-reticle bbox-reticle--bl"></div>
              <div class="bbox-reticle bbox-reticle--br"></div>

              <!-- Level 2: Nested AI Engineer Core (Trigger at Y >= 40%) -->
              <div
                class="bbox bbox--mid"
                :class="{ 'bbox--active': scanProgress >= 0.40 }"
                style="top: 10%; left: 6%; width: 88%; height: 82%;"
              >
                <div class="bbox-tag bbox-tag--tr bbox-tag--emerald">
                  <span class="tag-label">[02: AI/ML ENGINEER CORE: 98.9%]</span>
                </div>
                <div class="bbox-reticle bbox-reticle--tl"></div>
                <div class="bbox-reticle bbox-reticle--tr"></div>
                <div class="bbox-reticle bbox-reticle--bl"></div>
                <div class="bbox-reticle bbox-reticle--br"></div>

                <!-- Level 3: Nested Technical Stack (Trigger at Y >= 65%) -->
                <div
                  class="bbox bbox--inner"
                  :class="{ 'bbox--active': scanProgress >= 0.65 }"
                  style="top: 14%; left: 8%; width: 84%; height: 76%;"
                >
                  <div class="bbox-tag bbox-tag--bl bbox-tag--violet">
                    <span class="tag-label">[03: PYTHON · PYTORCH · MEDIAPIPE: 98.4%]</span>
                  </div>
                  <div class="bbox-reticle bbox-reticle--tl"></div>
                  <div class="bbox-reticle bbox-reticle--tr"></div>
                  <div class="bbox-reticle bbox-reticle--bl"></div>
                  <div class="bbox-reticle bbox-reticle--br"></div>

                  <!-- Level 4: Core Academic Foundation (Trigger at Y >= 85%) -->
                  <div
                    class="bbox bbox--core"
                    :class="{ 'bbox--active': scanProgress >= 0.85 }"
                    style="top: 18%; left: 10%; width: 80%; height: 68%;"
                  >
                    <div class="bbox-tag bbox-tag--br bbox-tag--amber">
                      <span class="tag-label">[04: UNSRI CS (GPA 3.92 / CUM LAUDE)]</span>
                    </div>
                    <div class="bbox-reticle bbox-reticle--tl"></div>
                    <div class="bbox-reticle bbox-reticle--tr"></div>
                    <div class="bbox-reticle bbox-reticle--bl"></div>
                    <div class="bbox-reticle bbox-reticle--br"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Detection Telemetry -->
          <div class="detector-telemetry">
            <span class="tele-box-count">DETECTIONS: {{ activeBoxCount }} / 4 NESTED BOXES</span>
            <span class="tele-status">{{ scanProgress >= 0.9 ? 'INFERENCE VERIFIED' : 'SCANNING TENSORS...' }}</span>
          </div>
        </div>

        <!-- 2. Right: Extracted Diagnostic Dossier & Technical Profile -->
        <div class="dossier-card glass-panel">
          <div class="dossier-header">
            <span class="dossier-code">// DIAGNOSTIC_DOSSIER_REPORT</span>
            <span class="dossier-badge">CONFIRMED</span>
          </div>

          <!-- Dossier Body -->
          <div class="dossier-body">
            <h3 class="dossier-headline">
              Engineering AI systems where mathematical rigor meets high-velocity production pipelines.
            </h3>

            <p class="dossier-text">
              Computer Science graduate from <strong>Universitas Sriwijaya (GPA 3.92 / 4.00, Cum Laude)</strong>.
              I architect end-to-end intelligence systems with an emphasis on low latency, observable reasoning traces,
              and verifiable evaluation benchmarks.
            </p>

            <!-- Detected Capability Cards -->
            <div class="capability-list">
              <div class="cap-card" :class="{ 'cap-card--revealed': scanProgress >= 0.40 }">
                <div class="cap-header">
                  <span class="cap-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </span>
                  <span class="cap-title">Computer Vision &amp; Kinematics</span>
                </div>
                <p class="cap-detail">
                  Sub-50ms skeletal tracking with 33 MediaPipe landmarks, Bi-LSTM motion phase classification, and joint-angle form analysis in SpotterAI.
                </p>
              </div>

              <div class="cap-card" :class="{ 'cap-card--revealed': scanProgress >= 0.65 }">
                <div class="cap-header">
                  <span class="cap-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </span>
                  <span class="cap-title">Autonomous Agents &amp; FastMCP</span>
                </div>
                <p class="cap-detail">
                  Model Context Protocol servers with calibrated confidence gating, multi-agent DAG review loops, and Docker container sandboxing.
                </p>
              </div>

              <div class="cap-card" :class="{ 'cap-card--revealed': scanProgress >= 0.85 }">
                <div class="cap-header">
                  <span class="cap-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </span>
                  <span class="cap-title">Hybrid RAG &amp; Vector Search</span>
                </div>
                <p class="cap-detail">
                  Reciprocal Rank Fusion (BM25 + FAISS dense retrieval) with LangSmith golden-dataset tracing and zero-hallucination guarantees.
                </p>
              </div>
            </div>

            <!-- Credentials Badges -->
            <div class="credentials-bar">
              <span class="cred-chip">UNSRI GPA 3.92</span>
              <span class="cred-chip">Google APAC Winner</span>
              <span class="cred-chip">Samsung Batch 5 Finalist</span>
              <span class="cred-chip">Bangkit ML Distinction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const frameRef = ref<HTMLElement | null>(null);

const scanProgress = ref(0);

const activeBoxCount = computed(() => {
  let count = 0;
  if (scanProgress.value >= 0.15) count++;
  if (scanProgress.value >= 0.40) count++;
  if (scanProgress.value >= 0.65) count++;
  if (scanProgress.value >= 0.85) count++;
  return count;
});

let stInstance: ScrollTrigger | null = null;
let lastBoxCount = 0;

onMounted(() => {
  if (!sectionRef.value) return;

  stInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 0.15,
    onUpdate: (self) => {
      // Complete 100% of the scan animation within the first 25% of entering the About section
      const p = Math.min(1, self.progress / 0.25);
      scanProgress.value = p;

      // Play tactical audio tick when new bounding box snaps into view
      if (activeBoxCount.value > lastBoxCount) {
        soundManager.playClick();
        lastBoxCount = activeBoxCount.value;
      } else if (activeBoxCount.value < lastBoxCount) {
        lastBoxCount = activeBoxCount.value;
      }
    },
  });
});

onBeforeUnmount(() => {
  stInstance?.kill();
});
</script>

<style scoped lang="scss">
.about-scan {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem;
  background-color: #030712;
  box-sizing: border-box;
}

.scan-container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
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
    background: linear-gradient(135deg, #00f2fe 0%, #10b981 100%);
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

/* Scan Grid */
.scan-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 2rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

/* Detector Frame */
.detector-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #020617;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 242, 254, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

/* Corner Reticles */
.reticle {
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 5;
  border-color: #00f2fe;

  &--tl {
    top: 8px;
    left: 8px;
    border-top: 2px solid;
    border-left: 2px solid;
  }

  &--tr {
    top: 8px;
    right: 8px;
    border-top: 2px solid;
    border-right: 2px solid;
  }

  &--bl {
    bottom: 8px;
    left: 8px;
    border-bottom: 2px solid;
    border-left: 2px solid;
  }

  &--br {
    bottom: 8px;
    right: 8px;
    border-bottom: 2px solid;
    border-right: 2px solid;
  }
}

.detector-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: rgba(4, 8, 22, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.72rem;

  .hud-mono {
    color: #00f2fe;
    font-weight: 700;
  }

  .hud-fps {
    color: #94a3b8;
  }
}

.subject-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #060a14;
}

.subject-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(0.92);
  display: block;
}

.subject-gradient-map {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(3, 7, 18, 0.1) 0%, rgba(3, 7, 18, 0.6) 100%);
  pointer-events: none;
}

/* Sweeping Laser Scanline */
.scan-laser-line {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 10;
  pointer-events: none;
  transform: translateY(-50%);

  .laser-beam {
    width: 100%;
    height: 3px;
    background: #00f2fe;
    box-shadow: 0 0 16px 3px #00f2fe, 0 0 30px #10b981;
  }

  .laser-flare {
    position: absolute;
    top: 50%;
    left: 20%;
    width: 60%;
    height: 20px;
    transform: translateY(-50%);
    background: radial-gradient(ellipse, rgba(0, 242, 254, 0.4) 0%, transparent 70%);
  }

  .laser-label {
    position: absolute;
    right: 12px;
    top: -20px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: #00f2fe;
    background: rgba(3, 7, 18, 0.85);
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 242, 254, 0.4);
  }
}

/* Snapping Bounding Boxes (Nested Hierarchy) */
.bbox {
  position: absolute;
  box-sizing: border-box;
  border: 1.5px dashed rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: transparent;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;

  &--active {
    opacity: 1;
    transform: scale(1);
    border-style: solid;
  }

  &--outer {
    color: #00f2fe;
    border-color: rgba(0, 242, 254, 0.6);
    background: rgba(0, 242, 254, 0.03);
    box-shadow: inset 0 0 15px rgba(0, 242, 254, 0.05);
  }

  &--mid {
    color: #10b981;
    border-color: rgba(16, 185, 129, 0.65);
    background: rgba(16, 185, 129, 0.03);
    box-shadow: inset 0 0 15px rgba(16, 185, 129, 0.05);
  }

  &--inner {
    color: #a855f7;
    border-color: rgba(168, 85, 247, 0.7);
    background: rgba(168, 85, 247, 0.03);
    box-shadow: inset 0 0 15px rgba(168, 85, 247, 0.05);
  }

  &--core {
    color: #f59e0b;
    border-color: rgba(245, 158, 11, 0.8);
    background: rgba(245, 158, 11, 0.05);
    box-shadow: inset 0 0 15px rgba(245, 158, 11, 0.08);
  }

  /* Internal Reticle Markers on each box corner */
  .bbox-reticle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-color: currentColor;

    &--tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
    &--tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
    &--bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
    &--br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }
  }

  /* Corner tags positioned internally with no overlapping */
  .bbox-tag {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 700;
    padding: 0.18rem 0.45rem;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);

    &--tl { top: 6px; left: 6px; }
    &--tr { top: 6px; right: 6px; }
    &--bl { bottom: 6px; left: 6px; }
    &--br { bottom: 6px; right: 6px; }

    &--cyan {
      background: rgba(0, 242, 254, 0.95);
      color: #030712;
    }

    &--emerald {
      background: rgba(16, 185, 129, 0.95);
      color: #030712;
    }

    &--violet {
      background: rgba(168, 85, 247, 0.95);
      color: #ffffff;
    }

    &--amber {
      background: rgba(245, 158, 11, 0.95);
      color: #030712;
    }
  }
}

.detector-telemetry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: rgba(4, 8, 22, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.72rem;

  .tele-box-count {
    color: #10b981;
    font-weight: 600;
  }

  .tele-status {
    color: #64748b;
  }
}

/* Right Dossier Card */
.dossier-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(11, 19, 41, 0.9);
}

.dossier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.85rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;

  .dossier-code {
    color: #94a3b8;
  }

  .dossier-badge {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.35);
    padding: 0.2rem 0.55rem;
    border-radius: 9999px;
    font-weight: 700;
  }
}

.dossier-headline {
  margin: 0 0 1rem 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.4;
}

.dossier-text {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #94a3b8;
  margin: 0 0 1.5rem 0;

  strong {
    color: #00f2fe;
    font-weight: 600;
  }
}

/* Capability List */
.capability-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.cap-card {
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  opacity: 0.4;
  transform: translateY(4px);
  transition: all 0.35s ease;

  &--revealed {
    opacity: 1;
    transform: translateY(0);
    border-color: rgba(0, 242, 254, 0.25);
    background: rgba(0, 242, 254, 0.04);
  }

  .cap-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.3rem;

    .cap-icon {
      color: #00f2fe;
      display: flex;
    }

    .cap-title {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      color: #f8fafc;
    }
  }

  .cap-detail {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: #94a3b8;
  }
}

.credentials-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .cred-chip {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
  }
}
</style>
