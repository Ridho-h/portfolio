<template>
  <section ref="sectionRef" class="projects-inference" id="projects">
    <div class="projects-container">
      <!-- Section Header -->
      <div class="section-lead" ref="headerRef">
        <div class="cyber-badge cyber-badge--emerald">
          <span class="pulse-dot"></span>
          <span>STAGE 04 // INFERENCE REVEAL</span>
        </div>
        <h2 class="section-title">
          <span>INFERENCE</span>
          <span class="title-gradient">TESTBENCH</span>
        </h2>
        <p class="section-desc">
          Select a neural model checkpoint to inspect live telemetry, run simulated inference,
          and review verified benchmark metrics.
        </p>
      </div>

      <!-- Model Switcher Tabs (Minimalist & Intuitive) -->
      <div class="model-tabs-rail" ref="tabsRef">
        <button
          v-for="(proj, idx) in projectsData"
          :key="proj.id"
          class="model-tab-btn"
          :class="{ 'model-tab-btn--active': activeIdx === idx }"
          :style="{ '--proj-accent': proj.accentColor }"
          @click="selectProject(idx)"
          @mouseenter="onHover"
        >
          <span class="tab-index">0{{ idx + 1 }}</span>
          <span class="tab-dot" :style="{ backgroundColor: proj.accentColor }"></span>
          <span class="tab-name">{{ proj.name }}</span>
          <span class="tab-category">{{ proj.category.split('&')[0].trim() }}</span>
        </button>
      </div>

      <!-- Single Focused Showcase Card -->
      <div
        class="showcase-card glass-panel"
        ref="cardRef"
        :style="{ '--accent': currentProj.accentColor }"
      >
        <!-- Scanning Laser Beam (Fires on entrance & on 'Run Inference') -->
        <div class="scan-laser" :class="{ 'scan-laser--active': isInferring }"></div>

        <!-- Card Top Bar: Metadata & Status -->
        <div class="card-top-bar">
          <div class="top-left">
            <span class="cat-badge">{{ currentProj.category }}</span>
            <span class="code-badge">{{ currentProj.codename }}</span>
          </div>
          <div class="top-right">
            <span class="status-pill">
              <span class="pulse-dot"></span>
              {{ currentProj.status }}
            </span>
          </div>
        </div>

        <!-- Card Main Content -->
        <div class="card-body">
          <div class="content-header">
            <div class="title-wrap">
              <h3 class="model-title">{{ currentProj.name }}</h3>
              <p class="model-tagline">{{ currentProj.tagline }}</p>
            </div>
            <!-- Quick GitHub Button -->
            <a
              :href="currentProj.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="cyber-btn cyber-btn--secondary repo-link-btn"
              @mouseenter="onHover"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>SOURCE REPO ↗</span>
            </a>
          </div>

          <!-- Concise Summary -->
          <p class="model-summary">{{ currentProj.summary }}</p>

          <!-- Verified Benchmark Metrics -->
          <div class="metrics-strip">
            <div
              v-for="[val, lbl] in currentProj.metrics"
              :key="lbl"
              class="metric-item"
            >
              <span class="m-val">{{ val }}</span>
              <span class="m-lbl">{{ lbl }}</span>
            </div>
          </div>

          <!-- Tech Stack Tags -->
          <div class="stack-row">
            <span v-for="tech in currentProj.stack" :key="tech" class="tech-pill">
              {{ tech }}
            </span>
          </div>

          <!-- Interactive Inference Action & Real-Time Verdict Bar -->
          <div class="inference-action-panel">
            <div class="action-left">
              <button
                class="cyber-btn cyber-btn--primary run-btn"
                :disabled="isInferring"
                @click="triggerInference"
                @mouseenter="onHover"
              >
                <span class="btn-icon" :class="{ 'btn-icon--spin': isInferring }">⚡</span>
                <span>{{ isInferring ? 'EXECUTING INFERENCE...' : 'RUN INFERENCE' }}</span>
              </button>
            </div>

            <!-- Live Output Terminal Verdict -->
            <div class="action-verdict">
              <div class="verdict-bar">
                <span class="term-sym">></span>
                <span class="term-msg">{{ inferenceMsg }}</span>
              </div>
            </div>

            <!-- Previous / Next Quick Stepper -->
            <div class="action-nav">
              <button
                class="nav-arrow-btn"
                @click="cycleProject(-1)"
                title="Previous Model"
                @mouseenter="onHover"
              >
                ‹
              </button>
              <span class="nav-count">0{{ activeIdx + 1 }} / 0{{ projectsData.length }}</span>
              <button
                class="nav-arrow-btn"
                @click="cycleProject(1)"
                title="Next Model"
                @mouseenter="onHover"
              >
                ›
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
import { projectsData } from '../../data/projects-data';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const tabsRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const activeIdx = ref(0);
const isInferring = ref(false);

const currentProj = computed(() => projectsData[activeIdx.value]);

const verdictMap: Record<string, string> = {
  spotterai: 'CONVERGED: 42ms // 33 LANDMARKS TRACKED · BI-LSTM ATTENTION VERIFIED · REP +1',
  'food-agent': 'CONVERGED: 42ms // CONFIDENCE 0.91 >= 0.65 · ROUTED TO LOCAL EFFICIENTNET-B4',
  'coding-agent': 'CONVERGED: 1.2s // 4-AGENT DAG EXECUTION PASSED · 20/20 DOCKER PYTESTS GREEN',
  shopai: 'CONVERGED: REACT LOOP // PINECONE RETRIEVAL + DUCKDUCKGO FALLBACK · GROUNDED RESPONSE',
};

const inferenceMsg = ref(verdictMap[projectsData[0].id]);

function onHover() {
  soundManager.playHover();
}

function selectProject(idx: number) {
  if (idx === activeIdx.value) return;
  activeIdx.value = idx;
  soundManager.playClick();
  inferenceMsg.value = verdictMap[projectsData[idx].id];

  // Quick card transition
  if (cardRef.value) {
    gsap.fromTo(
      cardRef.value,
      { opacity: 0.75, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }
}

function cycleProject(delta: number) {
  const nextIdx = (activeIdx.value + delta + projectsData.length) % projectsData.length;
  selectProject(nextIdx);
}

function triggerInference() {
  if (isInferring.value) return;
  isInferring.value = true;
  soundManager.playTerminalBeep();
  inferenceMsg.value = `SAMPLING LATENT SPACE FOR [${currentProj.value.name}]...`;

  setTimeout(() => {
    isInferring.value = false;
    inferenceMsg.value = verdictMap[currentProj.value.id];
    soundManager.playChime(620 + activeIdx.value * 70);
  }, 450);
}

const stTriggers: ScrollTrigger[] = [];

onMounted(() => {
  if (!sectionRef.value) return;

  // ScrollTrigger entrance animation
  const tl = gsap.timeline({
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
    tl.from(headerRef.value, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
    });
  }

  if (tabsRef.value) {
    tl.from(
      tabsRef.value.children,
      {
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  }

  if (cardRef.value) {
    tl.from(
      cardRef.value,
      {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          // Trigger a quick initial entrance sweep
          isInferring.value = true;
          setTimeout(() => {
            isInferring.value = false;
          }, 400);
        },
      },
      '-=0.2'
    );
  }

  stTriggers.push(tl.scrollTrigger as ScrollTrigger);
});

onBeforeUnmount(() => {
  stTriggers.forEach((st) => st.kill());
});
</script>

<style scoped lang="scss">
.projects-inference {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem;
  background-color: #030712;
  box-sizing: border-box;
}

.projects-container {
  max-width: 1140px;
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
    background: linear-gradient(135deg, #10b981 0%, #00f2fe 100%);
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

/* Model Switcher Rail */
.model-tabs-rail {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.model-tab-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0.9rem 1.15rem;
  background: rgba(11, 19, 41, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);

  .tab-index {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: #64748b;
    font-weight: 700;
  }

  .tab-dot {
    display: none;
  }

  .tab-name {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    color: #cbd5e1;
    transition: color 0.2s ease;
  }

  .tab-category {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: #94a3b8;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(15, 26, 56, 0.85);
    transform: translateY(-2px);

    .tab-name {
      color: #f8fafc;
    }
  }

  &--active {
    background: rgba(15, 26, 56, 0.95);
    border-color: var(--proj-accent, #00f2fe);
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.15), inset 0 0 12px rgba(0, 242, 254, 0.05);

    .tab-index {
      color: var(--proj-accent, #00f2fe);
    }

    .tab-name {
      color: #f8fafc;
    }

    .tab-category {
      color: var(--proj-accent, #00f2fe);
    }
  }
}

/* Showcase Card */
.showcase-card {
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(11, 19, 41, 0.92);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
  transition: border-color 0.4s ease;

  &:hover {
    border-color: var(--accent, #00f2fe);
  }
}

/* Scanning Laser Animation */
.scan-laser {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent, #00f2fe), transparent);
  box-shadow: 0 0 12px var(--accent, #00f2fe);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.2s ease;

  &--active {
    opacity: 1;
    animation: sweep-down 0.45s ease-in-out infinite alternate;
  }
}

@keyframes sweep-down {
  0% {
    top: 0%;
  }
  100% {
    top: 100%;
  }
}

/* Card Top Bar */
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

    .cat-badge {
      color: var(--accent, #00f2fe);
      background: rgba(0, 242, 254, 0.08);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      border: 1px solid rgba(0, 242, 254, 0.2);
    }

    .code-badge {
      color: #64748b;
    }
  }

  .top-right {
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: #10b981;
      font-weight: 700;
      font-size: 0.72rem;
    }
  }
}

/* Card Body */
.card-body {
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
}

.content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;

  .title-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .model-title {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.01em;
    }

    .model-tagline {
      margin: 0;
      font-family: var(--font-mono);
      font-size: 0.92rem;
      color: var(--accent, #00f2fe);
      font-weight: 500;
    }
  }

  .repo-link-btn {
    white-space: nowrap;
    padding: 0.6rem 1.15rem;
    font-size: 0.78rem;
  }
}

.model-summary {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: #cbd5e1;
  max-width: 900px;
}

/* Metrics Strip */
.metrics-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    padding: 0.9rem 1.15rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.16);
    }

    .m-val {
      font-family: var(--font-mono);
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--accent, #00f2fe);
    }

    .m-lbl {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.2rem;
    }
  }
}

/* Tech Stack Tags */
.stack-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .tech-pill {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
  }
}

/* Interactive Action & Verdict Bar */
.inference-action-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;

  .run-btn {
    padding: 0.75rem 1.4rem;
    font-size: 0.82rem;
    background: linear-gradient(135deg, var(--accent, #00f2fe) 0%, #0284c7 100%);
    color: #030712;
    border: none;
    cursor: pointer;

    .btn-icon {
      font-size: 0.95rem;

      &--spin {
        animation: spin 0.6s linear infinite;
      }
    }
  }

  .action-verdict {
    flex: 1;
    min-width: 260px;

    .verdict-bar {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(4, 8, 22, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0.7rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;

      .term-sym {
        color: var(--accent, #00f2fe);
        font-weight: 700;
      }

      .term-msg {
        color: #f8fafc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .action-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .nav-arrow-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #cbd5e1;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent, #00f2fe);
        border-color: var(--accent, #00f2fe);
      }
    }

    .nav-count {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #64748b;
      min-width: 60px;
      text-align: center;
    }
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
