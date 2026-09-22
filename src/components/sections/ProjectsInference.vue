<template>
  <section ref="sectionRef" class="projects-inference" id="projects">
    <div class="projects-container">
      <!-- Section Header -->
      <div class="section-lead">
        <div class="cyber-badge cyber-badge--emerald">
          <span class="pulse-dot"></span>
          <span>STAGE 04 // DIFFUSION INFERENCE</span>
        </div>
        <h2 class="section-title">
          <span>INFERENCE</span>
          <span class="title-gradient">REVEAL</span>
        </h2>
        <p class="section-desc">
          Each project resolves like a generative diffusion generation. Cards start as high-entropy
          latent noise and denoise into production architectures as they enter the viewport.
        </p>
      </div>

      <!-- Project Cards Stack -->
      <div class="cards-stack">
        <div
          v-for="(proj, idx) in projectsData"
          :key="proj.id"
          class="project-diffusion-card glass-panel"
          :ref="(el) => setCardRef(el, idx)"
          :class="{ 'card--denoised': cardStates[idx]?.denoised }"
        >
          <!-- 1. Live Terminal Caption Typing Above Each Card -->
          <div class="card-terminal-bar">
            <div class="term-left">
              <span class="term-prompt">></span>
              <span class="term-typing">{{ cardStates[idx]?.captionText || '> sampling latent prior...' }}</span>
            </div>
            <div class="term-right">
              <span class="step-badge" :class="{ 'step-badge--done': cardStates[idx]?.denoised }">
                {{ cardStates[idx]?.denoised ? 'STEP 50/50 [CONVERGED]' : `DENOISING: ${cardStates[idx]?.step || 0}/50` }}
              </span>
            </div>
          </div>

          <!-- 2. Main Card Content (Subject to Diffusion Denoise CSS filter) -->
          <div
            class="card-inner"
            :style="{
              filter: `blur(${cardStates[idx]?.blur ?? 20}px)`,
              opacity: cardStates[idx]?.opacity ?? 0.6,
            }"
          >
            <!-- Noise Texture Overlay Layer -->
            <div
              class="noise-overlay"
              :style="{ opacity: cardStates[idx]?.noiseOpacity ?? 0.8 }"
              v-show="!cardStates[idx]?.denoised"
            ></div>

            <div class="card-main-grid">
              <!-- Left Column: Metadata & Core Summary -->
              <div class="card-col-left">
                <div class="proj-category">
                  <span class="cat-tag">{{ proj.category }}</span>
                  <span class="code-tag">{{ proj.codename }}</span>
                </div>

                <h3 class="proj-title" :style="{ '--proj-accent': proj.accentColor }">
                  {{ proj.name }}
                </h3>

                <p class="proj-tagline">{{ proj.tagline }}</p>
                <p class="proj-summary">{{ proj.summary }}</p>

                <!-- Architecture Highlight Callout -->
                <div class="highlight-callout" :style="{ borderLeftColor: proj.accentColor }">
                  <span class="highlight-label">PIPELINE CORE:</span>
                  <span class="highlight-text">{{ proj.architectureHighlight }}</span>
                </div>

                <!-- Tech Stack Tags -->
                <div class="stack-wrap">
                  <span v-for="tech in proj.stack" :key="tech" class="tech-pill">
                    {{ tech }}
                  </span>
                </div>

                <!-- Direct GitHub Repo Action Button -->
                <div class="card-actions">
                  <a
                    :href="proj.repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cyber-btn cyber-btn--primary"
                    @mouseenter="onHover"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>GITHUB REPO ↗</span>
                  </a>
                </div>
              </div>

              <!-- Right Column: Live Benchmark Badges & 4-Step Pipeline -->
              <div class="card-col-right">
                <!-- Verified Metric Badges -->
                <div class="metrics-grid">
                  <div
                    v-for="[val, lbl] in proj.metrics"
                    :key="lbl"
                    class="metric-chip"
                    :style="{ '--metric-accent': proj.accentColor }"
                  >
                    <span class="m-val">{{ val }}</span>
                    <span class="m-lbl">{{ lbl }}</span>
                  </div>
                </div>

                <!-- 4-Step Pipeline Architecture Flow -->
                <div class="pipeline-card">
                  <div class="pipeline-header">
                    <span class="pipe-code">// PIPELINE DATA FLOW</span>
                    <span class="pipe-badge">REAL-TIME</span>
                  </div>
                  <div class="pipeline-steps">
                    <div v-for="step in proj.pipeline" :key="step.step" class="pipe-step-item">
                      <span class="step-num" :style="{ color: proj.accentColor }">{{ step.step }}</span>
                      <div class="step-desc-wrap">
                        <span class="step-title">{{ step.title }}</span>
                        <span class="step-desc">{{ step.desc }}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
import { projectsData } from '../../data/projects-data';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const cardElements: HTMLElement[] = [];

function setCardRef(el: any, idx: number) {
  if (el) cardElements[idx] = el as HTMLElement;
}

interface CardState {
  blur: number;
  opacity: number;
  noiseOpacity: number;
  step: number;
  denoised: boolean;
  captionText: string;
}

const cardStates = reactive<CardState[]>(
  projectsData.map((p) => ({
    blur: 20,
    opacity: 0.5,
    noiseOpacity: 0.8,
    step: 0,
    denoised: false,
    captionText: `> initializing latent prior for [${p.name}]...`,
  }))
);

const stTriggers: ScrollTrigger[] = [];

function onHover() {
  soundManager.playHover();
}

onMounted(() => {
  cardElements.forEach((cardEl, idx) => {
    if (!cardEl) return;
    const proj = projectsData[idx];

    // ScrollTrigger for each card's diffusion denoising reveal
    const st = ScrollTrigger.create({
      trigger: cardEl,
      start: 'top 82%',
      onEnter: () => {
        if (cardStates[idx].denoised) return;

        // Animate diffusion denoising over 0.7s
        const state = cardStates[idx];
        const tweenObj = { blur: 20, noise: 0.8, step: 0 };

        soundManager.playHover();

        gsap.to(tweenObj, {
          blur: 0,
          noise: 0,
          step: 50,
          duration: 0.75,
          ease: 'power2.out',
          onUpdate: () => {
            state.blur = tweenObj.blur;
            state.noiseOpacity = tweenObj.noise;
            state.step = Math.round(tweenObj.step);
            state.opacity = 0.5 + (tweenObj.step / 50) * 0.5;

            // Stream terminal caption
            if (tweenObj.step < 20) {
              state.captionText = proj.denoiseSteps[0];
            } else if (tweenObj.step < 40) {
              state.captionText = proj.denoiseSteps[1];
            } else {
              state.captionText = proj.denoiseSteps[3];
            }
          },
          onComplete: () => {
            state.denoised = true;
            soundManager.playChime(560 + idx * 80);
          },
        });
      },
    });

    stTriggers.push(st);
  });
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

/* Cards Stack */
.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.project-diffusion-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 19, 41, 0.88);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;

  &.card--denoised {
    border-color: rgba(0, 242, 254, 0.3);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 242, 254, 0.08);
  }
}

/* Terminal Caption Bar */
.card-terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  background: rgba(4, 8, 22, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.76rem;

  .term-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;

    .term-prompt {
      color: #00f2fe;
    }
  }

  .step-badge {
    color: #f59e0b;
    font-size: 0.72rem;
    font-weight: 700;

    &--done {
      color: #10b981;
    }
  }
}

/* Card Inner & Diffusion Noise Overlay */
.card-inner {
  position: relative;
  padding: 2rem;
  transition: filter 0.05s linear, opacity 0.05s linear;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 8px 8px;
  pointer-events: none;
}

/* Card Main Grid */
.card-main-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Left Column */
.card-col-left {
  display: flex;
  flex-direction: column;
}

.proj-category {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;

  .cat-tag {
    color: #00f2fe;
    background: rgba(0, 242, 254, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 242, 254, 0.25);
  }

  .code-tag {
    color: #64748b;
  }
}

.proj-title {
  margin: 0 0 0.5rem 0;
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 800;
  color: #f8fafc;
}

.proj-tagline {
  margin: 0 0 1rem 0;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: #cbd5e1;
  font-weight: 500;
}

.proj-summary {
  margin: 0 0 1.25rem 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #94a3b8;
}

.highlight-callout {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid #00f2fe;
  border-radius: 0 8px 8px 0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .highlight-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: #64748b;
    font-weight: 700;
  }

  .highlight-text {
    font-size: 0.85rem;
    color: #f8fafc;
    line-height: 1.5;
  }
}

.stack-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.75rem;

  .tech-pill {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
  }
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

/* Right Column */
.card-col-right {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  .metric-chip {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;

    .m-val {
      font-family: var(--font-mono);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--metric-accent, #00f2fe);
    }

    .m-lbl {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }
}

/* Pipeline Architecture Flow */
.pipeline-card {
  padding: 1.25rem;
  background: rgba(4, 8, 22, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  .pipeline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding-bottom: 0.5rem;

    .pipe-code {
      color: #64748b;
    }

    .pipe-badge {
      color: #10b981;
      font-weight: 700;
    }
  }

  .pipeline-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .pipe-step-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    .step-num {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      min-width: 22px;
    }

    .step-desc-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      .step-title {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        font-weight: 700;
        color: #f8fafc;
      }

      .step-desc {
        font-size: 0.75rem;
        line-height: 1.4;
        color: #94a3b8;
      }
    }
  }
}
</style>
