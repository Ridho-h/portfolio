<template>
  <section ref="sectionRef" class="chapter-projects" id="projects">
    <!-- GSAP Pinned Viewport Container -->
    <div ref="padRef" class="projects-pinned-pad">
      <div class="projects-inner">
        <!-- Floating Chapter Top Rail -->
        <div class="projects-hud-rail">
          <div class="chapter-badge">
            <span class="badge-num">03</span>
            <span class="badge-title">SELECTED WORKS // INFERENCE ARCHITECTURES</span>
          </div>

          <!-- Minimalist Project Index Switcher -->
          <div class="project-switcher-pills">
            <button
              v-for="(proj, idx) in projectsData"
              :key="proj.id"
              class="switcher-pill"
              :class="{ 'is-active': activeIdx === idx }"
              @click="jumpToProject(idx)"
            >
              <span class="pill-dot" :style="{ backgroundColor: proj.accentColor }"></span>
              <span class="pill-num">0{{ idx + 1 }}</span>
              <span class="pill-name">{{ proj.name }}</span>
            </button>
          </div>
        </div>

        <!-- Floating Split Layout (Text on Left 55%, 3D Beacon in Open Negative Space on Right) -->
        <div class="editorial-showcase-grid">
          <!-- Left Column: Monumental Project Information -->
          <transition name="project-swap" mode="out-in">
            <div
              :key="currentProj.id"
              class="project-details"
              :style="{ '--accent': currentProj.accentColor }"
            >
              <div class="project-meta">
                <span class="meta-cat">{{ currentProj.category }}</span>
                <span class="meta-sep">//</span>
                <span class="meta-status">{{ currentProj.status }}</span>
              </div>

              <div class="title-lockup">
                <span class="giant-index">0{{ activeIdx + 1 }}</span>
                <h2 class="project-title">{{ currentProj.name }}</h2>
              </div>

              <p class="project-tagline">{{ currentProj.tagline }}</p>

              <p class="project-summary">
                {{ currentProj.summary }}
              </p>

              <!-- Verified Metric Strip -->
              <div class="metrics-rail">
                <div
                  v-for="[val, lbl] in currentProj.metrics"
                  :key="lbl"
                  class="metric-item"
                >
                  <span class="m-val">{{ val }}</span>
                  <span class="m-lbl">{{ lbl }}</span>
                </div>
              </div>

              <!-- Tech Stack Tags & Direct Link -->
              <div class="project-actions-row">
                <div class="stack-pills">
                  <span v-for="t in currentProj.stack" :key="t" class="tech-tag">{{ t }}</span>
                </div>

                <a
                  :href="currentProj.repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="repo-link-btn"
                >
                  <span>SOURCE CODE</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>
          </transition>

          <!-- Right Column: Dedicated Open Stage for 3D Holographic Beacon -->
          <div class="stage-hologram-window">
            <div class="scroll-instruction">
              <span class="instruction-line"></span>
              <span class="instruction-text">SCROLL TO STEP THROUGH [ 0{{ activeIdx + 1 }} / 0{{ projectsData.length }} ]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { projectsData } from '../../data/projects-data';
import { scrollEngine } from '../../animations/scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const emit = defineEmits<{
  (e: 'change-project', idx: number): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const padRef = ref<HTMLElement | null>(null);
const activeIdx = ref(0);
const currentProj = computed(() => projectsData[activeIdx.value]);
let triggerInstance: ScrollTrigger | null = null;

function jumpToProject(idx: number) {
  if (!triggerInstance) {
    activeIdx.value = idx;
    emit('change-project', idx);
    return;
  }
  const startY = triggerInstance.start;
  const total = triggerInstance.end - startY;
  const targetY = startY + (total * (idx / projectsData.length)) + 50;

  scrollEngine.scrollTo(targetY, { duration: 1.0 });
  activeIdx.value = idx;
  emit('change-project', idx);
}

onMounted(() => {
  if (sectionRef.value && padRef.value) {
    // True GSAP Pinning: Locks padRef in the viewport across a 2400px scroll runway
    triggerInstance = ScrollTrigger.create({
      trigger: sectionRef.value,
      pin: padRef.value,
      start: 'top top',
      end: '+=2400',
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 to 1.0
        const step = 1 / projectsData.length;
        const newIdx = Math.min(projectsData.length - 1, Math.floor(p / step));
        if (newIdx !== activeIdx.value) {
          activeIdx.value = newIdx;
          emit('change-project', newIdx);
        }
      },
    });

    // Initialize project 0
    emit('change-project', 0);
  }
});

onBeforeUnmount(() => {
  if (triggerInstance) {
    triggerInstance.kill();
  }
});
</script>

<style scoped lang="scss">
.chapter-projects {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}

.projects-pinned-pad {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 3.5rem 3rem;
  box-sizing: border-box;
  pointer-events: none;
}

.projects-inner {
  max-width: 1240px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  pointer-events: auto;
}

.projects-hud-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .chapter-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Martian Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: #10b981;

    .badge-num {
      padding: 2px 6px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 4px;
    }
  }

  .project-switcher-pills {
    display: flex;
    gap: 8px;

    .switcher-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(8, 12, 22, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      color: #94a3b8;
      cursor: pointer;
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      transition: all 0.25s ease;

      .pill-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        opacity: 0.5;
        transition: opacity 0.25s ease;
      }

      .pill-num {
        color: #64748b;
        font-size: 10px;
      }

      &:hover {
        color: #f1f5f9;
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.is-active {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;

        .pill-dot {
          opacity: 1;
          box-shadow: 0 0 6px currentColor;
        }

        .pill-num {
          color: #00f2fe;
        }
      }
    }
  }
}

.editorial-showcase-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 3rem;
  align-items: center;
  flex: 1;
}

.project-details {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .project-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Martian Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent, #00f2fe);
    margin-bottom: 0.75rem;

    .meta-sep {
      color: rgba(255, 255, 255, 0.15);
    }

    .meta-status {
      color: #94a3b8;
    }
  }

  .title-lockup {
    display: flex;
    align-items: baseline;
    gap: 1.25rem;
    margin-bottom: 0.5rem;

    .giant-index {
      font-family: 'Martian Mono', monospace;
      font-size: clamp(2rem, 3.5vw, 3rem);
      font-weight: 800;
      color: rgba(255, 255, 255, 0.15);
      line-height: 1;
    }

    .project-title {
      font-size: clamp(2.5rem, 5vw, 4.4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #ffffff;
      line-height: 1;
      margin: 0;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.95);
    }
  }

  .project-tagline {
    font-size: clamp(14px, 1.3vw, 16px);
    color: #94a3b8;
    margin: 0 0 1.5rem;
    font-weight: 500;
  }

  .project-summary {
    font-size: clamp(14px, 1.1vw, 15px);
    color: #cbd5e1;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 0 2rem;
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.9);
  }

  .metrics-rail {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 14px 20px;
    background: rgba(8, 12, 22, 0.65);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    margin-bottom: 2rem;
    max-width: 620px;

    .metric-item {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .m-val {
        font-family: 'Martian Mono', monospace;
        font-size: clamp(15px, 1.4vw, 18px);
        font-weight: 700;
        color: #f8fafc;
      }

      .m-lbl {
        font-size: 10px;
        color: #64748b;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
    }
  }

  .project-actions-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    max-width: 620px;

    .stack-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .tech-tag {
        font-family: 'Martian Mono', monospace;
        font-size: 10px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        color: #cbd5e1;
      }
    }

    .repo-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: #f1f5f9;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      color: #030712;
      text-decoration: none;
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;

      &:hover {
        background: var(--accent, #00f2fe);
        border-color: var(--accent, #00f2fe);
        box-shadow: 0 0 16px var(--accent, rgba(0, 242, 254, 0.4));
      }
    }
  }
}

.stage-hologram-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding-bottom: 2rem;

  .scroll-instruction {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Martian Mono', monospace;
    font-size: 10px;
    color: #64748b;
    letter-spacing: 0.12em;

    .instruction-line {
      width: 24px;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

// Seamless Project Transitions
.project-swap-enter-active,
.project-swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-swap-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.project-swap-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 900px) {
  .projects-pinned-pad {
    padding: 4.5rem 1.25rem 2rem;
  }

  .projects-hud-rail {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .project-switcher-pills {
    width: 100%;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 4px;

    .switcher-pill {
      padding: 5px 10px;
      font-size: 10px;
    }
  }

  .editorial-showcase-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stage-hologram-window {
    display: none;
  }

  .project-details {
    .title-lockup {
      .giant-index {
        font-size: 2rem;
      }
      .project-title {
        font-size: 2rem;
      }
    }

    .metrics-rail {
      gap: 0.75rem;
      padding: 10px 12px;
      overflow-x: auto;
      flex-wrap: nowrap;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }

      .metric-item {
        flex-shrink: 0;
      }
    }

    .project-actions-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;

      .repo-link-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .projects-pinned-pad {
    padding: 4rem 1rem 1.5rem;
  }

  .project-details {
    .title-lockup {
      .giant-index {
        display: none;
      }
      .project-title {
        font-size: 1.75rem;
      }
    }

    .project-tagline {
      font-size: 13px;
    }

    .project-summary {
      font-size: 13px;
      line-height: 1.5;
    }
  }

  .project-switcher-pills {
    .switcher-pill {
      padding: 4px 8px;
      font-size: 9px;

      .pill-name {
        display: none;
      }
    }
  }
}
</style>
