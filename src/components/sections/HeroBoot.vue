<template>
  <section ref="sectionRef" class="hero-boot" id="hero">
    <!-- Ambient Cold Standby Glow Layer -->
    <div class="standby-backdrop" :class="{ 'standby-backdrop--awake': isAwake }">
      <div class="ambient-glow" :style="{ opacity: screenGlowOpacity }"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Central Workstation Standby Rig & Terminal -->
    <div
      class="boot-container"
      :style="{ opacity: heroContentOpacity, transform: `scale(${heroContentScale})` }"
    >
      <!-- 1. System Standby Status Header -->
      <div
        class="system-status-bar glass-panel"
        :class="{ 'status-bar--standby': !isAwake }"
        @click="!isAwake && triggerWakeImmediately()"
        :title="!isAwake ? 'Click to wake system' : ''"
      >
        <div class="status-left">
          <span class="power-led" :class="isAwake ? 'power-led--online' : 'power-led--standby'"></span>
          <span class="status-mode">{{ isAwake ? 'SYSTEM: FULLY OPERATIONAL' : 'SYSTEM: STANDBY (COLD BOOT)' }}</span>
        </div>
        <div class="status-right">
          <span class="tele-val">{{ isAwake ? 'INFERENCE: READY (CUDA_0)' : 'STANDBY // CLICK OR SCROLL TO WAKE' }}</span>
        </div>
      </div>

      <!-- 2. Dual Panel: Stylized Workstation Avatar / Console (Left) + Boot Terminal (Right) -->
      <div class="main-display-grid">
        <!-- Left: Workstation Console Screen -->
        <div
          class="console-screen-card glass-panel"
          :class="{ 'screen-powered': isAwake }"
          @click="triggerWakeImmediately"
          title="Click to wake system"
        >
          <div class="screen-bezel">
            <div class="screen-crt-scanline"></div>
            <div class="screen-content">
              <div class="screen-brand">
                <span class="brand-code">MRH // AI-CORE-V2</span>
                <span class="brand-fps">{{ isAwake ? '60 FPS' : '00 FPS (HALT)' }}</span>
              </div>

              <!-- Sleeping / Slumped State Graphic -->
              <div class="standby-visual" v-if="!isAwake">
                <div class="pulse-ring"></div>
                <div class="standby-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                    <line x1="9" y1="10" x2="9" y2="10.01" stroke-width="2.5"></line>
                    <line x1="15" y1="10" x2="15" y2="10.01" stroke-width="2.5"></line>
                    <path d="M10 14c1 0.5 3 0.5 4 0"></path>
                  </svg>
                </div>
                <span class="standby-caption">[ MACHINE IN STANDBY // SCROLL TO WAKE ]</span>
              </div>

              <!-- Awake Operational State Graphic -->
              <div class="active-visual" v-else>
                <div class="waveform-box">
                  <div v-for="i in 16" :key="i" class="wave-bar" :style="{ animationDelay: `${i * 0.08}s` }"></div>
                </div>
                <div class="active-metrics-grid">
                  <div class="a-metric">
                    <span class="m-val">100%</span>
                    <span class="m-lbl">Rep F1</span>
                  </div>
                  <div class="a-metric">
                    <span class="m-val">91.7%</span>
                    <span class="m-lbl">Form Acc</span>
                  </div>
                  <div class="a-metric">
                    <span class="m-val">42ms</span>
                    <span class="m-lbl">Latency</span>
                  </div>
                  <div class="a-metric">
                    <span class="m-val">3.92</span>
                    <span class="m-lbl">UNSRI GPA</span>
                  </div>
                </div>
                <div class="active-radar">
                  <span class="radar-dot"></span>
                  <span class="radar-txt">BIOMECHANICS POSE TRACKER: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Streaming Boot Terminal & Resolved Identity -->
        <div class="boot-terminal-card glass-panel">
          <!-- Terminal Header -->
          <div class="terminal-bar">
            <div class="term-dots">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <span class="term-title">mrh@ai-node:~/boot.log</span>
            <span class="term-pid">PID: 4096</span>
          </div>

          <!-- Boot Log Stream -->
          <div class="terminal-body" ref="terminalBodyRef">
            <div
              v-for="(line, idx) in visibleLogs"
              :key="idx"
              class="terminal-line"
              :class="{ 'terminal-line--accent': line.includes('READY') || line.includes('INITIALIZING') }"
            >
              <span class="line-prompt">></span>
              <span class="line-text">{{ line }}</span>
            </div>
            <div class="terminal-line terminal-line--cursor" v-if="!isAwake">
              <span class="line-prompt">></span>
              <span class="line-cursor">_</span>
            </div>
          </div>

          <!-- Kinetic Typography / Final Print Statement -->
          <div class="hero-identity-block" :class="{ 'hero-identity-block--visible': isAwake }">
            <div class="identity-lead">
              <span class="cyber-badge cyber-badge--emerald">
                <span class="pulse-dot"></span>
                <span>INFERENCE OPERATIONAL</span>
              </span>
            </div>

            <h1 class="hero-name">
              <span class="name-first">MUHAMMAD RIDHO</span>
              <span class="name-last">HIDAYAT</span>
            </h1>

            <p class="hero-role">
              <span class="role-arrow">></span>
              <span class="role-text">AI &amp; Machine Learning Engineer</span>
            </p>

            <p class="hero-bio">
              Specializing in <span class="text-cyan">Real-Time Computer Vision &amp; Kinematics</span>,
              <span class="text-emerald">Autonomous Multi-Agent Systems</span>, and
              <span class="text-violet">Grounded Enterprise RAG</span>.
            </p>

            <div class="hero-action-buttons">
              <a
                href="#about"
                class="cyber-btn cyber-btn--primary"
                @click.prevent="scrollEngine.scrollTo('#about', { offset: -40 })"
              >
                <span>COMMENCE DIAGNOSTIC SCAN</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              <a
                href="#projects"
                class="cyber-btn cyber-btn--secondary"
                @click.prevent="scrollEngine.scrollTo('#projects', { offset: -40 })"
              >
                <span>INFERENCE PROJECTS</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Bottom Scroll Indicator -->
      <div class="scroll-prompt">
        <span class="prompt-text">[ SCROLL TO ADVANCE MODEL STAGES ]</span>
        <div class="prompt-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="7 13 12 18 17 13"></polyline>
            <polyline points="7 6 12 11 17 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollEngine } from '../../animations/scroll';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const terminalBodyRef = ref<HTMLElement | null>(null);

const isAwake = ref(false);
const wasWokenManually = ref(false);
const screenGlowOpacity = ref(0.08);

const allBootLogs = [
  '[0.000s] SYSTEM STATE: STANDBY // POWER DRAW: 1.2W',
  '[0.114s] WAKE_SIGNAL: INTERRUPT_VECTOR_0x1A CAPTURED FROM SCROLL',
  '[0.245s] BOOT_SEQUENCE: INITIALIZING PYTORCH 2.4 ON CUDA_0',
  '[0.380s] LOADING WEIGHT CHECKPOINT checkpoint_epoch_100.pt... [42% ... 100%]',
  '[0.520s] ALLOCATING VRAM: 24.0 GB GDDR6 MEMORY BUFFER... OK',
  '[0.685s] MOUNTING FAST-MCP TOOLS & POSE ESTIMATION RUNTIMES... READY',
  '[0.820s] EXECUTING PRINT STATEMENT: > Hello, I am Muhammad Ridho Hidayat',
];

const visibleLogs = ref<string[]>([allBootLogs[0]]);

const heroContentOpacity = ref(1);
const heroContentScale = ref(1);

let stInstance: ScrollTrigger | null = null;

function triggerWakeImmediately() {
  if (isAwake.value) return;
  wasWokenManually.value = true;
  isAwake.value = true;
  visibleLogs.value = allBootLogs;
  screenGlowOpacity.value = 0.85;
}

onMounted(() => {
  if (!sectionRef.value) return;

  // Pin Hero for scrubbed boot sequence: wakes quickly, then immediately exits
  stInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: '+=30%',
    pin: true,
    pinSpacing: true,
    scrub: 0.15,
    onUpdate: (self) => {
      const progress = self.progress;

      // If awakened by click, maintain fully awake state and never reset boot sequence
      if (wasWokenManually.value) {
        if (!isAwake.value) isAwake.value = true;
        if (visibleLogs.value.length !== allBootLogs.length) {
          visibleLogs.value = allBootLogs;
        }
        screenGlowOpacity.value = 0.85;
        heroContentOpacity.value = 1;
        heroContentScale.value = 1;
        return;
      }

      // Scrubbed boot sequence:
      // Boot stream completes from 0.0 to 0.70
      const bootProgress = Math.min(1, progress / 0.70);
      const targetCount = Math.max(1, Math.min(allBootLogs.length, Math.floor(bootProgress * (allBootLogs.length + 1))));
      if (visibleLogs.value.length !== targetCount) {
        visibleLogs.value = allBootLogs.slice(0, targetCount);
        
      }

      // Screen glow & awake state
      if (progress < 0.15) {
        screenGlowOpacity.value = 0.08;
        isAwake.value = false;
      } else if (progress < 0.65) {
        // Quick CRT flicker while booting
        screenGlowOpacity.value = Math.random() > 0.35 ? 0.75 : 0.2;
        isAwake.value = false;
      } else {
        // FULLY AWAKENED at >= 0.65
        screenGlowOpacity.value = 0.85;
        if (!isAwake.value) {
          isAwake.value = true;
        }
      }

      heroContentOpacity.value = 1;
      heroContentScale.value = 1;
    },
  });
});

onBeforeUnmount(() => {
  stInstance?.kill();
});
</script>

<style scoped lang="scss">
.hero-boot {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #030712;
  overflow: hidden;
  padding: 6rem 1.5rem 3rem;
  box-sizing: border-box;
}

.standby-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: all 0.6s ease;

  .ambient-glow {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75vw;
    height: 55vh;
    background: radial-gradient(circle, rgba(0, 242, 254, 0.22) 0%, rgba(16, 185, 129, 0.08) 45%, transparent 70%);
    filter: blur(80px);
    transition: opacity 0.2s ease;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    opacity: 0.6;
  }
}

.boot-container {
  position: relative;
  z-index: 10;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Status Bar */
.system-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  border-radius: 12px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &.status-bar--standby {
    cursor: pointer;

    &:hover {
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.1);
    }
  }

  .status-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .power-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;

    &--standby {
      background: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
      animation: pulse-amber 2s infinite ease-in-out;
    }

    &--online {
      background: #10b981;
      box-shadow: 0 0 12px #10b981;
    }
  }

  .status-mode {
    color: #f8fafc;
    font-weight: 600;
    letter-spacing: 0.06em;
  }

  .status-right {
    color: #94a3b8;
    font-size: 0.72rem;
  }
}

@keyframes pulse-amber {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Main Display Grid */
.main-display-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 1.5rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

/* Left Screen Card */
.console-screen-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 440px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #020617;
  transition: all 0.4s ease;

  &.screen-powered {
    border-color: rgba(0, 242, 254, 0.4);
    box-shadow: 0 0 35px rgba(0, 242, 254, 0.15), inset 0 0 20px rgba(0, 242, 254, 0.06);
  }

  &:not(.screen-powered) {
    cursor: pointer;

    &:hover {
      border-color: rgba(245, 158, 11, 0.45);
      box-shadow: 0 0 24px rgba(245, 158, 11, 0.12);
    }
  }
}

.screen-bezel {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

.screen-crt-scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04));
  background-size: 100% 3px, 3px 100%;
  pointer-events: none;
  opacity: 0.6;
}

.screen-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.screen-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #64748b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;

  .brand-code {
    color: #00f2fe;
    font-weight: 700;
  }
}

.standby-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1.25rem;
  color: #64748b;

  .pulse-ring {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px dashed rgba(245, 158, 11, 0.35);
    animation: rotate-slow 12s linear infinite;
  }

  .standby-icon {
    position: relative;
    z-index: 2;
    color: #f59e0b;
  }

  .standby-caption {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
  }
}

@keyframes rotate-slow {
  to { transform: rotate(360deg); }
}

.active-visual {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 1.25rem 0;
  gap: 1.25rem;
}

.waveform-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 48px;

  .wave-bar {
    width: 4px;
    height: 100%;
    background: #00f2fe;
    border-radius: 2px;
    animation: wave-anim 1.2s infinite ease-in-out;
  }
}

@keyframes wave-anim {
  0%, 100% { transform: scaleY(0.2); opacity: 0.4; }
  50% { transform: scaleY(1); opacity: 1; }
}

.active-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  .a-metric {
    display: flex;
    flex-direction: column;
    padding: 0.65rem 0.85rem;
    background: rgba(0, 242, 254, 0.06);
    border: 1px solid rgba(0, 242, 254, 0.2);
    border-radius: 8px;

    .m-val {
      font-family: var(--font-mono);
      font-size: 1.25rem;
      font-weight: 700;
      color: #00f2fe;
    }

    .m-lbl {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #94a3b8;
      text-transform: uppercase;
    }
  }
}

.active-radar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #10b981;

  .radar-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }
}

/* Right Boot Terminal Card */
.boot-terminal-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(11, 19, 41, 0.9);
}

.terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;

  .term-dots {
    display: flex;
    gap: 6px;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &--red { background: #ef4444; }
      &--yellow { background: #f59e0b; }
      &--green { background: #10b981; }
    }
  }

  .term-title {
    color: #94a3b8;
  }

  .term-pid {
    color: #64748b;
    font-size: 0.7rem;
  }
}

.terminal-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  min-height: 110px;
  margin-bottom: 1.25rem;

  .terminal-line {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: #94a3b8;

    .line-prompt {
      color: #64748b;
    }

    &--accent {
      color: #00f2fe;
      font-weight: 600;
    }

    &--cursor .line-cursor {
      color: #f59e0b;
      font-weight: 700;
      animation: blink 1s step-start infinite;
    }
  }
}

@keyframes blink {
  50% { opacity: 0; }
}

/* Resolved Identity Block */
.hero-identity-block {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(14px);
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s ease;

  &--visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }
}

.identity-lead {
  margin-bottom: 0.75rem;
}

.hero-name {
  margin: 0 0 0.5rem 0;
  display: flex;
  flex-direction: column;
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;

  .name-first {
    color: #f8fafc;
  }

  .name-last {
    background: linear-gradient(135deg, #00f2fe 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero-role {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 600;
  color: #00f2fe;
  margin: 0 0 0.85rem 0;

  .role-arrow {
    color: #10b981;
  }
}

.hero-bio {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0 0 1.5rem 0;

  .text-cyan { color: #00f2fe; font-weight: 600; }
  .text-emerald { color: #10b981; font-weight: 600; }
  .text-violet { color: #a855f7; font-weight: 600; }
}

.hero-action-buttons {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

/* Scroll Prompt */
.scroll-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 0.5rem;

  .prompt-arrow {
    color: #00f2fe;
    animation: bounce-subtle 2s infinite ease-in-out;
  }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
</style>
