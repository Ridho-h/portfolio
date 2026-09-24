<template>
  <section class="chapter-about" id="about">
    <div class="about-container">
      <!-- Minimalist Top Chapter Badge -->
      <header class="about-header">
        <div class="chapter-badge">
          <span class="badge-num">02</span>
          <span class="badge-title">ABOUT // ARCHITECTURAL FOUNDATION</span>
        </div>
      </header>

      <!-- Cinematic Editorial Overlay (Nodal & Heckhoff Aesthetic) -->
      <div class="about-editorial-stage">
        <!-- Left: Slim Architectural Portrait Frame -->
        <aside class="about-side-portrait">
          <div class="portrait-capsule">
            <img src="/photo.jpeg" alt="Muhammad Ridho Hidayat" class="portrait-img" />
            <div class="portrait-vignette"></div>
          </div>

          <div class="portrait-meta">
            <span class="meta-name">RIDHO HIDAYAT</span>
            <span class="meta-role">AI / ML SYSTEMS ENGINEER</span>
            <div class="meta-pedigree">
              <span class="pedigree-bullet"></span>
              <span class="pedigree-text">3.92 CUM LAUDE · BANGKIT TOP ML · SAMSUNG SIC</span>
            </div>
          </div>
        </aside>

        <!-- Right: Concise Statement & Technical Skills Matrix -->
        <main class="about-main-content">
          <h2 class="editorial-monument">
            Engineering Production AI & Computer Vision.
          </h2>

          <p class="editorial-credo">
            Bridging deep learning research with sub-millisecond production inference.
          </p>

          <!-- Technical Skills Showcase -->
          <div class="skills-matrix">
            <div
              v-for="cat in skillCategories"
              :key="cat.name"
              class="skill-group"
            >
              <div class="group-header">
                <span class="group-dot" :style="{ backgroundColor: cat.accent, boxShadow: `0 0 8px ${cat.accent}` }"></span>
                <span class="group-title">{{ cat.name }}</span>
              </div>
              <div class="pills-wrap">
                <span
                  v-for="skill in cat.skills"
                  :key="skill"
                  class="tech-pill"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'open-chat'): void;
}>();

interface SkillCategory {
  name: string;
  accent: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'COMPUTER VISION & MEDICAL AI',
    accent: '#00f2fe',
    skills: ['PyTorch', 'MediaPipe (60 FPS)', 'OpenCV', 'SegFormer-B0', 'U-Net++', 'TensorFlow'],
  },
  {
    name: 'AUTONOMOUS AGENTS & LLMs',
    accent: '#10b981',
    skills: ['FastMCP', 'LangChain', 'ReAct Loops', 'Function Calling', 'Pinecone / RAG'],
  },
  {
    name: 'MLOps & CLOUD SYSTEMS',
    accent: '#38bdf8',
    skills: ['Python', 'Docker', 'FastAPI', 'Git / CI-CD', 'Celery / Redis', 'Streamlit / Gradio'],
  },
];
</script>

<style scoped lang="scss">
.chapter-about {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6.5rem 2.5rem 5rem;
  box-sizing: border-box;
  z-index: 1;
  pointer-events: none; // Allows full 3D interaction across open canvas
}

.about-container {
  max-width: 1200px;
  width: 100%;
  pointer-events: auto;
}

.about-header {
  margin-bottom: 2.5rem;
}

.chapter-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Martian Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #00f2fe;

  .badge-num {
    padding: 2px 6px;
    background: rgba(0, 242, 254, 0.1);
    border: 1px solid rgba(0, 242, 254, 0.3);
    border-radius: 4px;
  }
}

.about-editorial-stage {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 4.5rem;
  align-items: center;
}

// -------------------------------------------------------------
// Left: Slim Architectural Portrait
// -------------------------------------------------------------
.about-side-portrait {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .portrait-capsule {
    position: relative;
    width: 220px;
    height: 290px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.09);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);

    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(20%) contrast(105%);
      display: block;
      transition: filter 0.3s ease;
    }

    &:hover .portrait-img {
      filter: grayscale(0%) contrast(108%);
    }

    .portrait-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 60%, rgba(3, 7, 18, 0.8) 100%);
    }
  }

  .portrait-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .meta-name {
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #f8fafc;
    }

    .meta-role {
      font-family: 'Martian Mono', monospace;
      font-size: 9.5px;
      letter-spacing: 0.1em;
      color: #00f2fe;
    }

    .meta-pedigree {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;

      .pedigree-bullet {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        flex-shrink: 0;
      }

      .pedigree-text {
        font-family: 'Martian Mono', monospace;
        font-size: 8.5px;
        letter-spacing: 0.04em;
        color: #94a3b8;
      }
    }
  }
}

// -------------------------------------------------------------
// Right: Monumental Headline & Telemetry Tickers
// -------------------------------------------------------------
.about-main-content {
  display: flex;
  flex-direction: column;

  .editorial-monument {
    font-size: clamp(1.9rem, 3.2vw, 2.85rem);
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.025em;
    color: #ffffff;
    margin: 0 0 1.25rem;
    max-width: 820px;
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.9);
  }

  .editorial-credo {
    font-size: clamp(14px, 1.1vw, 16px);
    line-height: 1.65;
    color: #94a3b8;
    margin: 0;
    max-width: 720px;
  }

  // Technical Skills Matrix
  .skills-matrix {
    margin-top: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    max-width: 780px;

    .skill-group {
      background: rgba(15, 23, 42, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 0.75rem 1.1rem;
      backdrop-filter: blur(10px);
      transition: all 0.25s ease;

      &:hover {
        background: rgba(15, 23, 42, 0.75);
        border-color: rgba(0, 242, 254, 0.25);
        transform: translateX(3px);
      }

      .group-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 0.5rem;

        .group-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .group-title {
          font-family: 'Martian Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #94a3b8;
          text-transform: uppercase;
        }
      }

      .pills-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .tech-pill {
          font-family: 'Martian Mono', monospace;
          font-size: 11px;
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 6px;
          padding: 3px 9px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(0, 242, 254, 0.12);
            border-color: rgba(0, 242, 254, 0.4);
            color: #00f2fe;
          }
        }
      }
    }
  }
}

// -------------------------------------------------------------
// Responsive Breakpoints
// -------------------------------------------------------------
@media (max-width: 960px) {
  .about-editorial-stage {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .about-side-portrait {
    max-width: 220px;
    margin: 0 auto;
  }
}
</style>
