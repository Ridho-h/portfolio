<template>
  <section ref="sectionRef" class="training-log" id="journey">
    <div class="training-container" ref="containerRef">
      <!-- Section Header -->
      <div class="section-lead" ref="headerRef">
        <div class="cyber-badge cyber-badge--amber">
          <span class="pulse-dot"></span>
          <span>STAGE 05 // MODEL TRAINING RUN</span>
        </div>
        <h2 class="section-title">
          <span>TRAINING</span>
          <span class="title-gradient">LOG</span>
        </h2>
        <p class="section-desc">
          Career milestones framed as training epochs along an optimization trajectory,
          converging toward production excellence.
        </p>

        <!-- Live Telemetry & Loss Convergence Pill -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="tele-label">SCHEDULER:</span>
            <span class="tele-val text-cyan">CosineAnnealingLR</span>
          </div>
          <div class="tele-item">
            <span class="tele-label">CURRENT STEP:</span>
            <span class="tele-val">{{ currentEpoch.step }} / 7,200</span>
          </div>
          <div class="tele-item">
            <span class="tele-label">VAL LOSS:</span>
            <span class="tele-val text-emerald">
              {{ currentEpoch.valLoss.toFixed(3) }}
              <span v-if="activeIdx === trainingEpochs.length - 1" class="converged-tag">[CONVERGED]</span>
            </span>
          </div>
          <div class="tele-play-btn">
            <button
              class="auto-play-btn"
              :class="{ 'auto-play-btn--active': isAutoPlaying }"
              @click="toggleAutoPlay"
              @mouseenter="onHover"
            >
              <span>{{ isAutoPlaying ? '⏸ PAUSE RUN' : '▶ AUTO-RUN' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Interactive Horizontal Epoch Rail -->
      <div class="epoch-rail" ref="railRef">
        <!-- Connecting Track SVG Line -->
        <div class="rail-track-bg">
          <div
            class="rail-track-fill"
            :style="{ width: `${(activeIdx / (trainingEpochs.length - 1)) * 100}%` }"
          ></div>
        </div>

        <!-- 6 Epoch Milestone Nodes -->
        <div class="rail-nodes">
          <button
            v-for="(ep, idx) in trainingEpochs"
            :key="ep.id"
            class="rail-node-btn"
            :class="{
              'rail-node-btn--active': activeIdx === idx,
              'rail-node-btn--passed': activeIdx > idx,
            }"
            @click="selectEpoch(idx)"
            @mouseenter="onHover"
          >
            <div class="node-circle">
              <span class="node-num">0{{ ep.epoch }}</span>
            </div>
            <div class="node-meta">
              <span class="node-short-title">{{ shortTitles[idx] }}</span>
              <span class="node-loss">loss: {{ ep.valLoss.toFixed(3) }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Single Focused Milestone Card -->
      <div class="milestone-card glass-panel" ref="cardRef">
        <!-- Card Top Bar -->
        <div class="card-top-bar">
          <div class="top-left">
            <span class="epoch-tag">EPOCH 0{{ currentEpoch.epoch }} / 0{{ currentEpoch.totalEpochs }}</span>
            <span class="step-tag">STEP {{ currentEpoch.step }}</span>
            <span class="kind-tag">{{ currentEpoch.kind }}</span>
          </div>
          <div class="top-right">
            <span class="period-badge">{{ currentEpoch.period }}</span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <div class="title-row">
            <div class="title-wrap">
              <h3 class="institution-title">{{ currentEpoch.title }}</h3>
              <div class="role-wrap">
                <span class="role-arrow">></span>
                <span class="role-title">{{ currentEpoch.role }}</span>
              </div>
            </div>
            <div class="loss-badge">
              <span class="loss-lbl">VAL LOSS</span>
              <span class="loss-val">{{ currentEpoch.valLoss.toFixed(3) }}</span>
            </div>
          </div>

          <!-- Highlight Summary -->
          <p class="milestone-summary">{{ currentEpoch.summary }}</p>

          <!-- Key Outputs -->
          <div class="outputs-list">
            <div v-for="(outp, oIdx) in currentEpoch.keyOutputs.slice(0, 2)" :key="oIdx" class="outp-item">
              <span class="outp-icon">▹</span>
              <span class="outp-text">{{ outp }}</span>
            </div>
          </div>

          <!-- Metric Badges Row -->
          <div class="metrics-row">
            <div v-for="[lbl, val] in currentEpoch.metrics" :key="lbl" class="metric-pill">
              <span class="m-lbl">{{ lbl }}:</span>
              <span class="m-val">{{ val }}</span>
            </div>
          </div>

          <!-- Tags & Stepper Controls -->
          <div class="card-footer">
            <div class="tags-row">
              <span v-for="tag in currentEpoch.tags" :key="tag" class="tag-pill">
                #{{ tag }}
              </span>
            </div>

            <!-- Stepper Navigation -->
            <div class="stepper-controls">
              <button
                class="step-arrow-btn"
                :disabled="activeIdx === 0"
                @click="cycleEpoch(-1)"
                title="Previous Epoch"
                @mouseenter="onHover"
              >
                ‹ PREV
              </button>
              <span class="step-indicator">
                EPOCH 0{{ activeIdx + 1 }} / 0{{ trainingEpochs.length }}
              </span>
              <button
                class="step-arrow-btn"
                :disabled="activeIdx === trainingEpochs.length - 1"
                @click="cycleEpoch(1)"
                title="Next Epoch"
                @mouseenter="onHover"
              >
                NEXT ›
              </button>
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
import { trainingEpochs } from '../../data/timeline-epochs';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const railRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const activeIdx = ref(0);
const isAutoPlaying = ref(false);
let autoPlayTimer: any = null;

const currentEpoch = computed(() => trainingEpochs[activeIdx.value]);

const shortTitles = [
  'UNSRI (B.Sc.)',
  'Samsung Campus',
  'Bangkit Academy',
  'Bank Jambi',
  'GDG on Campus',
  'Google APAC',
];

function onHover() {
  soundManager.playHover();
}

function selectEpoch(idx: number, isAutomatic = false) {
  if (idx === activeIdx.value) return;
  activeIdx.value = idx;

  if (!isAutomatic) {
    soundManager.playClick();
  }

  // Smooth card transition
  if (cardRef.value) {
    gsap.fromTo(
      cardRef.value,
      { opacity: 0.8, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }
}

function cycleEpoch(delta: number) {
  const next = Math.max(0, Math.min(trainingEpochs.length - 1, activeIdx.value + delta));
  selectEpoch(next);
}

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value;
  soundManager.playClick();

  if (isAutoPlaying.value) {
    runAutoPlayStep();
  } else if (autoPlayTimer) {
    clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
  }
}

function runAutoPlayStep() {
  if (!isAutoPlaying.value) return;

  autoPlayTimer = setTimeout(() => {
    if (!isAutoPlaying.value) return;
    const nextIdx = (activeIdx.value + 1) % trainingEpochs.length;
    selectEpoch(nextIdx, true);
    soundManager.playChime(500 + nextIdx * 60);

    if (nextIdx === trainingEpochs.length - 1) {
      // Completed full run, pause after reaching final converged epoch
      setTimeout(() => {
        isAutoPlaying.value = false;
      }, 1800);
    } else {
      runAutoPlayStep();
    }
  }, 2000);
}

const stTriggers: ScrollTrigger[] = [];

onMounted(() => {
  if (!sectionRef.value) return;

  // 1. Entrance animation
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        soundManager.playHover();
      },
    },
  });

  if (headerRef.value) {
    entranceTl.from(headerRef.value, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
    });
  }

  if (railRef.value) {
    entranceTl.from(
      railRef.value,
      {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  }

  if (cardRef.value) {
    entranceTl.from(
      cardRef.value,
      {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.2'
    );
  }

  stTriggers.push(entranceTl.scrollTrigger as ScrollTrigger);

  // 2. Scroll-scrubbed epoch advancement (Desktop only for optimal touch experience)
  const isDesktop = window.matchMedia('(min-width: 860px)').matches;
  if (isDesktop && containerRef.value) {
    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 12%',
      end: '+=1100',
      pin: true,
      pinSpacing: true,
      scrub: 0.4,
      onUpdate: (self) => {
        if (isAutoPlaying.value) return;
        const targetIdx = Math.min(
          trainingEpochs.length - 1,
          Math.floor(self.progress * trainingEpochs.length)
        );
        if (targetIdx !== activeIdx.value) {
          activeIdx.value = targetIdx;
          soundManager.playHover();
        }
      },
    });
    stTriggers.push(pinTrigger);
  }
});

onBeforeUnmount(() => {
  if (autoPlayTimer) clearTimeout(autoPlayTimer);
  stTriggers.forEach((st) => st.kill());
});
</script>

<style scoped lang="scss">
.training-log {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem;
  background-color: #030712;
  box-sizing: border-box;
}

.training-container {
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
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
    background: linear-gradient(135deg, #f59e0b 0%, #10b981 100%);
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

/* Telemetry & Loss Strip */
.telemetry-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 0.75rem 1.25rem;
  margin-top: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  .tele-item {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .tele-label {
    color: #64748b;
  }

  .tele-val {
    color: #f8fafc;
    font-weight: 700;
  }

  .text-cyan {
    color: #00f2fe;
  }

  .text-emerald {
    color: #10b981;
  }

  .converged-tag {
    color: #10b981;
    font-size: 0.7rem;
    margin-left: 0.2rem;
  }

  .tele-play-btn {
    margin-left: auto;

    @media (max-width: 640px) {
      margin-left: 0;
      width: 100%;
    }
  }

  .auto-play-btn {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #f59e0b;
    padding: 0.35rem 0.85rem;
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(245, 158, 11, 0.25);
      border-color: #f59e0b;
      transform: translateY(-1px);
    }

    &--active {
      background: #f59e0b;
      color: #030712;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.4);
    }
  }
}

/* Horizontal Epoch Rail */
.epoch-rail {
  position: relative;
  width: 100%;
  padding: 1.5rem 0.5rem 0.5rem 0.5rem;
  box-sizing: border-box;
}

.rail-track-bg {
  position: absolute;
  top: 36px;
  left: 30px;
  right: 30px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  z-index: 1;

  @media (max-width: 640px) {
    left: 20px;
    right: 20px;
  }
}

.rail-track-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #00f2fe 50%, #10b981 100%);
  border-radius: 3px;
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}

.rail-nodes {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
}

.rail-node-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  gap: 0.65rem;
  outline: none;

  .node-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #0b1329;
    border: 2px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    .node-num {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      color: #94a3b8;
      transition: color 0.2s ease;
    }
  }

  .node-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;

    .node-short-title {
      font-family: var(--font-display);
      font-size: 0.82rem;
      font-weight: 700;
      color: #94a3b8;
      white-space: nowrap;
      transition: color 0.2s ease;

      @media (max-width: 768px) {
        display: none;
      }
    }

    .node-loss {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #64748b;
      white-space: nowrap;

      @media (max-width: 640px) {
        display: none;
      }
    }
  }

  &:hover {
    .node-circle {
      border-color: rgba(0, 242, 254, 0.5);
      transform: scale(1.08);

      .node-num {
        color: #f8fafc;
      }
    }
  }

  &--passed {
    .node-circle {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.15);

      .node-num {
        color: #10b981;
      }
    }
  }

  &--active {
    .node-circle {
      border-color: #00f2fe;
      background: #00f2fe;
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.6);
      transform: scale(1.15);

      .node-num {
        color: #030712;
        font-weight: 800;
      }
    }

    .node-meta {
      .node-short-title {
        color: #00f2fe;
      }

      .node-loss {
        color: #f8fafc;
        font-weight: 700;
      }
    }
  }
}

/* Milestone Card */
.milestone-card {
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(11, 19, 41, 0.92);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(0, 242, 254, 0.3);
  }
}

.card-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.75rem;
  background: rgba(4, 8, 22, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  flex-wrap: wrap;
  gap: 0.75rem;

  .top-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .epoch-tag {
      color: #f59e0b;
      font-weight: 700;
    }

    .step-tag {
      color: #94a3b8;
    }

    .kind-tag {
      font-size: 0.68rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
    }
  }

  .top-right {
    .period-badge {
      color: #94a3b8;
    }
  }
}

.card-body {
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;

  .title-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    .institution-title {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(1.6rem, 2.8vw, 2.2rem);
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.01em;
    }

    .role-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.95rem;
      color: #00f2fe;

      .role-arrow {
        color: #10b981;
      }
    }
  }

  .loss-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0.5rem 0.9rem;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 8px;

    .loss-lbl {
      font-family: var(--font-mono);
      font-size: 0.64rem;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    .loss-val {
      font-family: var(--font-mono);
      font-size: 1.25rem;
      font-weight: 800;
      color: #10b981;
    }
  }
}

.milestone-summary {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: #cbd5e1;
  max-width: 920px;
}

.outputs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .outp-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    font-size: 0.9rem;
    color: #cbd5e1;
    line-height: 1.5;

    .outp-icon {
      color: #10b981;
      font-size: 0.8rem;
      margin-top: 0.15rem;
    }
  }
}

.metrics-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;

  .metric-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.76rem;
    background: rgba(0, 242, 254, 0.06);
    border: 1px solid rgba(0, 242, 254, 0.2);
    padding: 0.35rem 0.75rem;
    border-radius: 6px;

    .m-lbl {
      color: #94a3b8;
    }

    .m-val {
      color: #00f2fe;
      font-weight: 700;
    }
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 1rem;

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    .tag-pill {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: #64748b;
    }
  }

  .stepper-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .step-arrow-btn {
      padding: 0.4rem 0.9rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #cbd5e1;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: #00f2fe;
        color: #00f2fe;
      }

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
    }

    .step-indicator {
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: #64748b;
    }
  }
}
</style>
