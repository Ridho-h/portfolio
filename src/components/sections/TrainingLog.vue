<template>
  <section ref="sectionRef" class="training-log" id="journey">
    <div class="training-container">
      <!-- Section Header -->
      <div class="section-lead">
        <div class="cyber-badge cyber-badge--amber">
          <span class="pulse-dot"></span>
          <span>STAGE 05 // MODEL TRAINING RUN</span>
        </div>
        <h2 class="section-title">
          <span>TRAINING</span>
          <span class="title-gradient">LOG</span>
        </h2>
        <p class="section-desc">
          Career milestones framed as training epochs along an optimization trajectory.
          The validation loss curve converges lower from Epoch 01 (0.082) down to Epoch 06 (0.009).
        </p>

        <!-- Live TensorBoard Telemetry Strip -->
        <div class="telemetry-run-strip glass-panel">
          <div class="tele-item">
            <span class="k">RUN ID:</span>
            <span class="v">mrh-career-trajectory-v2</span>
          </div>
          <div class="tele-item">
            <span class="k">SCHEDULER:</span>
            <span class="v">CosineAnnealingLR</span>
          </div>
          <div class="tele-item">
            <span class="k">TOTAL STEPS:</span>
            <span class="v text-cyan">7,200</span>
          </div>
          <div class="tele-item">
            <span class="k">FINAL VAL LOSS:</span>
            <span class="v text-emerald">0.009 (CONVERGED)</span>
          </div>
        </div>
      </div>

      <!-- Training Run Timeline Track with Animated SVG Loss Curve -->
      <div class="timeline-track-wrapper">
        <!-- SVG Loss Curve Path (Drawn along the left on desktop) -->
        <div class="loss-curve-column" aria-hidden="true">
          <svg class="loss-curve-svg" viewBox="0 0 80 1200" preserveAspectRatio="none">
            <!-- Background faint grid guide -->
            <line x1="40" y1="0" x2="40" y2="1200" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4" />
            <!-- Active convergence loss curve -->
            <path
              ref="lossPathRef"
              d="M 60,0 C 50,200 45,400 35,600 C 28,800 22,1000 15,1200"
              fill="none"
              stroke="url(#lossGrad)"
              stroke-width="3"
              stroke-linecap="round"
            />
            <defs>
              <linearGradient id="lossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="50%" stop-color="#00f2fe" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Epoch Milestone Cards Stream -->
        <div class="milestones-stream">
          <div
            v-for="(epoch, idx) in trainingEpochs"
            :key="epoch.id"
            class="epoch-card glass-panel"
            :class="{ 'epoch-card--revealed': revealedEpochs[idx] }"
            :ref="(el) => setEpochRef(el, idx)"
          >
            <!-- Epoch Header Bar -->
            <div class="epoch-header-bar">
              <div class="epoch-badge-grp">
                <span class="epoch-num">EPOCH 0{{ epoch.epoch }}/0{{ epoch.totalEpochs }}</span>
                <span class="epoch-step">STEP {{ epoch.step }}</span>
                <span class="epoch-lr">LR: {{ epoch.learningRate }}</span>
              </div>
              <div class="loss-metric-pill">
                <span class="loss-k">VAL_LOSS:</span>
                <span class="loss-v">{{ epoch.valLoss.toFixed(3) }}</span>
              </div>
            </div>

            <!-- Epoch Content -->
            <div class="epoch-content">
              <div class="title-row">
                <h3 class="epoch-title">{{ epoch.title }}</h3>
                <span class="epoch-period">{{ epoch.period }}</span>
              </div>

              <div class="epoch-role">
                <span class="role-arrow">></span>
                <span>{{ epoch.role }}</span>
                <span class="kind-tag">{{ epoch.kind }}</span>
              </div>

              <p class="epoch-summary">{{ epoch.summary }}</p>

              <!-- Key Outputs -->
              <div class="outputs-list">
                <div v-for="(outp, oIdx) in epoch.keyOutputs" :key="oIdx" class="outp-item">
                  <span class="outp-dot">▹</span>
                  <span class="outp-text">{{ outp }}</span>
                </div>
              </div>

              <!-- Metric Pills -->
              <div class="metrics-row">
                <div v-for="[lbl, val] in epoch.metrics" :key="lbl" class="m-pill">
                  <span class="m-lbl">{{ lbl }}:</span>
                  <span class="m-val">{{ val }}</span>
                </div>
              </div>

              <!-- Tags -->
              <div class="tags-row">
                <span v-for="tag in epoch.tags" :key="tag" class="tag-pill">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trainingEpochs } from '../../data/timeline-epochs';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const lossPathRef = ref<SVGPathElement | null>(null);
const epochElements: HTMLElement[] = [];

function setEpochRef(el: any, idx: number) {
  if (el) epochElements[idx] = el as HTMLElement;
}

const revealedEpochs = reactive<boolean[]>(new Array(trainingEpochs.length).fill(false));
const stTriggers: ScrollTrigger[] = [];

onMounted(() => {
  if (!sectionRef.value) return;

  // 1. Loss Curve SVG drawing scrubbed with scroll
  if (lossPathRef.value) {
    const path = lossPathRef.value;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const stPath = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 70%',
      end: 'bottom 20%',
      scrub: 0.3,
      onUpdate: (self) => {
        path.style.strokeDashoffset = `${length * (1 - self.progress)}`;
      },
    });
    stTriggers.push(stPath);
  }

  // 2. Individual Epoch Card reveals as user passes them
  epochElements.forEach((cardEl, idx) => {
    if (!cardEl) return;
    const stCard = ScrollTrigger.create({
      trigger: cardEl,
      start: 'top 80%',
      onEnter: () => {
        if (!revealedEpochs[idx]) {
          revealedEpochs[idx] = true;
          soundManager.playHover();
        }
      },
    });
    stTriggers.push(stCard);
  });
});

onBeforeUnmount(() => {
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

/* Telemetry Strip */
.telemetry-run-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 0.75rem 1.25rem;
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  border-radius: 10px;

  .tele-item {
    display: flex;
    gap: 0.45rem;
  }

  .k {
    color: #64748b;
  }

  .v {
    color: #f8fafc;
    font-weight: 600;
  }

  .text-cyan { color: #00f2fe; }
  .text-emerald { color: #10b981; }
}

/* Timeline Track */
.timeline-track-wrapper {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1.5rem;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

/* SVG Loss Curve Column */
.loss-curve-column {
  position: relative;
  width: 80px;

  @media (max-width: 768px) {
    display: none;
  }
}

.loss-curve-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

/* Milestones Stream */
.milestones-stream {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.epoch-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 19, 41, 0.88);
  opacity: 0.4;
  transform: translateY(16px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &--revealed {
    opacity: 1;
    transform: translateY(0);
    border-color: rgba(0, 242, 254, 0.25);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }
}

.epoch-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  background: rgba(4, 8, 22, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.75rem;

  .epoch-badge-grp {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .epoch-num {
    color: #f59e0b;
    font-weight: 700;
  }

  .epoch-step {
    color: #94a3b8;
  }

  .epoch-lr {
    color: #64748b;
    font-size: 0.7rem;
  }

  .loss-metric-pill {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 0.2rem 0.55rem;
    border-radius: 4px;

    .loss-k {
      color: #64748b;
      font-size: 0.68rem;
    }

    .loss-v {
      color: #10b981;
      font-weight: 700;
    }
  }
}

.epoch-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .epoch-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .epoch-period {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: #94a3b8;
  }
}

.epoch-role {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: #00f2fe;

  .role-arrow {
    color: #10b981;
  }

  .kind-tag {
    font-size: 0.65rem;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
    margin-left: 0.5rem;
  }
}

.epoch-summary {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #94a3b8;
}

.outputs-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .outp-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.84rem;
    color: #cbd5e1;
    line-height: 1.45;

    .outp-dot {
      color: #10b981;
      font-size: 0.75rem;
    }
  }
}

.metrics-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;

  .m-pill {
    display: inline-flex;
    gap: 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    background: rgba(0, 242, 254, 0.08);
    border: 1px solid rgba(0, 242, 254, 0.2);
    padding: 0.25rem 0.6rem;
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

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;

  .tag-pill {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: #64748b;
  }
}
</style>
