<template>
  <footer ref="footerRef" class="call-model" id="contact">
    <div class="call-container">
      <!-- Section Lead -->
      <div class="section-lead">
        <div class="cyber-badge cyber-badge--emerald">
          <span class="pulse-dot"></span>
          <span>STAGE 06 // CLOSING INFERENCE</span>
        </div>
        <h2 class="section-title">
          <span>CALL THE</span>
          <span class="title-gradient">MODEL</span>
        </h2>
        <p class="section-desc">
          Hitting inference one last time. As you reach the terminus, call the model
          to establish direct communication channels.
        </p>
      </div>

      <!-- Minimized Console that Calls on Scroll -->
      <div class="call-terminal-card glass-panel" :class="{ 'terminal--active': isCalled }">
        <div class="terminal-top">
          <div class="t-dots">
            <span class="t-dot t-dot--red"></span>
            <span class="t-dot t-dot--yellow"></span>
            <span class="t-dot t-dot--green"></span>
          </div>
          <span class="t-title">dispatch_model.sh // STAGE_06</span>
          <span class="t-mode">{{ isCalled ? 'STATUS: CONNECTED' : 'STATUS: READY TO CALL' }}</span>
        </div>

        <div class="terminal-screen">
          <div class="code-line">
            <span class="code-prompt">$</span>
            <span class="code-typed">{{ typedCommand }}</span>
            <span class="code-cursor" v-if="isTyping">_</span>
          </div>

          <div class="response-stream" v-if="isCalled">
            <div class="res-line">
              <span class="res-status text-emerald">> INFERENCE DISPATCH: 200 OK</span>
              <span class="res-latency">[12ms]</span>
            </div>
            <div class="res-line">
              <span class="text-cyan">> TARGET: Muhammad Ridho Hidayat (AI &amp; ML Engineer)</span>
            </div>
            <div class="res-line">
              <span class="text-gray">> "Available for full-time AI/ML roles, research-to-production engineering, and contracts."</span>
            </div>
          </div>
        </div>

        <!-- Illuminated Contact Channels -->
        <div class="channels-grid" :class="{ 'channels-grid--revealed': isCalled }">
          <!-- 1. One-Click Copy Email -->
          <div class="channel-card">
            <div class="channel-meta">
              <span class="c-lbl">DIRECT TRANSMISSION:</span>
              <span class="c-val">mridhohidayat09@gmail.com</span>
            </div>
            <button class="cyber-btn cyber-btn--primary c-btn" @click="copyEmail" @mouseenter="onHover">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{{ copied ? 'COPIED TO CLIPBOARD!' : 'COPY EMAIL' }}</span>
            </button>
          </div>

          <!-- 2. GitHub Profile -->
          <a
            href="https://github.com/Ridho-h"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-link glass-panel"
            @mouseenter="onHover"
          >
            <div class="link-left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <div class="link-meta">
                <span class="l-name">GitHub</span>
                <span class="l-sub">github.com/Ridho-h</span>
              </div>
            </div>
            <span class="link-arrow">↗</span>
          </a>

          <!-- 3. LinkedIn Profile -->
          <a
            href="https://linkedin.com/in/muhammad-ridho-hidayat"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-link glass-panel"
            @mouseenter="onHover"
          >
            <div class="link-left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <div class="link-meta">
                <span class="l-name">LinkedIn</span>
                <span class="l-sub">linkedin.com/in/muhammad-ridho-hidayat</span>
              </div>
            </div>
            <span class="link-arrow">↗</span>
          </a>

          <!-- 4. Launch Grounded AI Assistant -->
          <button class="channel-card channel-card--agent" @click="emit('open-agent')" @mouseenter="onHover">
            <div class="channel-meta">
              <span class="c-lbl text-emerald">INTERACTIVE GROUNDED AGENT:</span>
              <span class="c-val">Ask questions regarding benchmarks, code, and thesis research</span>
            </div>
            <div class="cyber-btn cyber-btn--emerald c-btn">
              <span class="pulse-dot"></span>
              <span>LAUNCH AI ASSISTANT</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Infinite Marquee Ticker -->
      <div class="marquee-track" aria-hidden="true">
        <div class="marquee-content">
          <span v-for="i in 6" :key="i" class="marquee-item">
            LET'S BUILD // REAL-TIME CV // AUTONOMOUS AGENTS // FASTMCP // HYBRID RAG // AVAILABLE FOR ROLES ·
          </span>
        </div>
      </div>

      <!-- Footer Bottom Copyright -->
      <div class="footer-meta-bar">
        <span class="meta-copy">© 2026 MUHAMMAD RIDHO HIDAYAT · ALL RIGHTS RESERVED</span>
        <span class="meta-tech">STACK: VUE 3 · THREE.JS · GSAP SCROLLTRIGGER · LENIS</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundManager } from '../../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

const emit = defineEmits<{
  (e: 'open-agent'): void;
}>();

const footerRef = ref<HTMLElement | null>(null);
const isCalled = ref(false);
const isTyping = ref(false);
const typedCommand = ref('');
const copied = ref(false);

const fullCommand = 'POST /v1/dispatch-model --channel "contact" --recipient "ridho"';
let stInstance: ScrollTrigger | null = null;

function onHover() {
  soundManager.playHover();
}

function copyEmail() {
  navigator.clipboard.writeText('mridhohidayat09@gmail.com');
  copied.value = true;
  soundManager.playChime(750);
  setTimeout(() => {
    copied.value = false;
  }, 3000);
}

function startCallSequence() {
  if (isCalled.value) return;
  isTyping.value = true;

  let currentIdx = 0;
  const interval = setInterval(() => {
    if (currentIdx <= fullCommand.length) {
      typedCommand.value = fullCommand.slice(0, currentIdx);
      currentIdx++;
      if (currentIdx % 4 === 0) soundManager.playHover();
    } else {
      clearInterval(interval);
      isTyping.value = false;
      isCalled.value = true;
      soundManager.playChime(680);
    }
  }, 24);
}

onMounted(() => {
  if (!footerRef.value) return;

  stInstance = ScrollTrigger.create({
    trigger: footerRef.value,
    start: 'top 75%',
    onEnter: () => {
      startCallSequence();
    },
  });
});

onBeforeUnmount(() => {
  stInstance?.kill();
});
</script>

<style scoped lang="scss">
.call-model {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem 3rem;
  background-color: #030712;
  box-sizing: border-box;
}

.call-container {
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

/* Call Terminal Card */
.call-terminal-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 19, 41, 0.88);
  transition: all 0.5s ease;

  &.terminal--active {
    border-color: rgba(16, 185, 129, 0.4);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.12);
  }
}

.terminal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  background: rgba(4, 8, 22, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.75rem;

  .t-dots {
    display: flex;
    gap: 6px;

    .t-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &--red { background: #ef4444; }
      &--yellow { background: #f59e0b; }
      &--green { background: #10b981; }
    }
  }

  .t-title {
    color: #94a3b8;
  }

  .t-mode {
    color: #10b981;
    font-weight: 700;
  }
}

.terminal-screen {
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 120px;

  .code-line {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #f8fafc;

    .code-prompt {
      color: #10b981;
    }

    .code-cursor {
      color: #00f2fe;
      animation: blink 1s step-start infinite;
    }
  }

  .response-stream {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);

    .res-line {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.82rem;
    }

    .text-emerald { color: #10b981; font-weight: 700; }
    .text-cyan { color: #00f2fe; }
    .text-gray { color: #94a3b8; }
    .res-latency { color: #64748b; font-size: 0.72rem; }
  }
}

@keyframes blink {
  50% { opacity: 0; }
}

/* Channels Grid */
.channels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0.3;
  transform: translateY(8px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &--revealed {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

.channel-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;

  &--agent {
    border-color: rgba(16, 185, 129, 0.3);
    cursor: pointer;
    text-align: left;
  }

  .channel-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .c-lbl {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: #64748b;
    }

    .c-val {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: #f8fafc;
      font-weight: 600;
    }

    .text-emerald { color: #10b981; }
  }

  .c-btn {
    padding: 0.5rem 1rem;
    font-size: 0.78rem;
    white-space: nowrap;
  }
}

.channel-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: #f8fafc;

  .link-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .link-meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    .l-name {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .l-sub {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: #64748b;
    }
  }

  .link-arrow {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: #00f2fe;
    transition: transform 0.2s ease;
  }

  &:hover .link-arrow {
    transform: translate(2px, -2px);
  }
}

/* Marquee */
.marquee-track {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .marquee-content {
    display: inline-block;
    animation: marquee-anim 35s linear infinite;
  }

  .marquee-item {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #64748b;
    margin-right: 2rem;
  }
}

@keyframes marquee-anim {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Footer Bottom Bar */
.footer-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #64748b;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
