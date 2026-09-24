<template>
  <div class="app-root">
    <!-- 1. Persistent 3D WebGL Canvas (Fixed Fullscreen Background) -->
    <Stage3D ref="stageRef" @click-robot="isChatOpen = true" />

    <!-- 2. Minimalist Floating Glass Navigation -->
    <Navigation :current-chapter="activeChapter" />

    <!-- 3. Unified Scroll Conductor Narrative Chapters -->
    <main class="scroll-flow">
      <!-- Chapter 01: Hero // Identity & Awakening -->
      <HeroChapter />

      <!-- Chapter 02: About // Diagnostic Foundation -->
      <AboutChapter @open-chat="isChatOpen = true" />

      <!-- Chapter 03: Projects // Selected Works -->
      <ProjectsChapter @change-project="onProjectChange" />

      <!-- Chapter 04: Contact // Communication Relay -->
      <ContactChapter />
    </main>

    <!-- 4. Persistent Floating AI Companion Quick Launcher Pill -->
    <button class="ai-companion-pill" @click="isChatOpen = true" title="Launch Autonomous AI Agent Terminal">
      <span class="pill-dot"></span>
      <span class="pill-label">AI COMPANION</span>
      <span class="pill-unit">UNIT_01</span>
    </button>

    <!-- 5. Autonomous AI Agent Chatbot Modal -->
    <AgentChatbot :is-open="isChatOpen" @close="isChatOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Stage3D, { ChapterId } from './components/canvas/Stage3D.vue';
import Navigation from './components/Navigation.vue';
import HeroChapter from './components/sections/HeroChapter.vue';
import AboutChapter from './components/sections/AboutChapter.vue';
import ProjectsChapter from './components/sections/ProjectsChapter.vue';
import ContactChapter from './components/sections/ContactChapter.vue';
import AgentChatbot from './components/chat/AgentChatbot.vue';

import { scrollEngine } from './animations/scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stageRef = ref<InstanceType<typeof Stage3D> | null>(null);
const activeChapter = ref<ChapterId>('hero');
const isChatOpen = ref(false);

function onProjectChange(idx: number) {
  stageRef.value?.setActiveProject(idx);
}

const CHAPTER_IDS: ChapterId[] = ['hero', 'about', 'projects', 'contact'];

function evaluateActiveChapter() {
  const vH = window.innerHeight || 800;

  // 1. Precise boundary check for Projects (GSAP pinned section):
  // Projects is only active when its top is locked near the viewport top (top <= 50px)
  // and its bottom has not finished scrolling past the viewport (bottom >= vH - 50px).
  // This prevents early entry while still in About and late lingering over Contact.
  const projectsEl = document.getElementById('projects');
  const targetProjectsEl = (projectsEl?.querySelector('.pin-spacer') as HTMLElement) ||
    (projectsEl?.parentElement?.classList.contains('pin-spacer') ? projectsEl.parentElement : projectsEl);

  if (targetProjectsEl) {
    const pRect = targetProjectsEl.getBoundingClientRect();
    if (pRect.top <= 90 && pRect.bottom >= (vH - 60)) {
      if (activeChapter.value !== 'projects') {
        activeChapter.value = 'projects';
        stageRef.value?.setChapter('projects');
      }
      return;
    }
  }

  // 2. Otherwise evaluate standard sections (hero, about, contact):
  const standardIds: ChapterId[] = ['hero', 'about', 'contact'];
  let highestOverlap = -1;
  let winner: ChapterId = 'hero';

  for (const id of standardIds) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(vH, rect.bottom);
    const overlap = visibleBottom - visibleTop;

    if (overlap > highestOverlap) {
      highestOverlap = overlap;
      winner = id;
    }
  }

  if (winner !== activeChapter.value) {
    activeChapter.value = winner;
    stageRef.value?.setChapter(winner);
  }
}

function handleScroll() {
  const lenis = scrollEngine.lenis;
  const vH = window.innerHeight || 800;
  const docH = document.documentElement.scrollHeight - vH;
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const globalProgress = docH > 0 ? Math.min(1, Math.max(0, scrollY / docH)) : 0;

  const chapterProgress = {
    hero: 0,
    about: 0,
    projects: 0,
    contact: 0,
  };

  for (const id of CHAPTER_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const targetEl = (id === 'projects')
      ? ((el.querySelector('.pin-spacer') as HTMLElement) || (el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el))
      : el;

    const rect = targetEl.getBoundingClientRect();
    const totalSpan = rect.height + vH;
    const progress = totalSpan > 0 ? (vH - rect.top) / totalSpan : 0;
    chapterProgress[id] = Math.min(1, Math.max(0, progress));
  }

  stageRef.value?.setScrollState(globalProgress, scrollY, chapterProgress);
  evaluateActiveChapter();
}

onMounted(() => {
  // Initialize Lenis smooth scroll conductor
  scrollEngine.init();

  window.addEventListener('scroll', handleScroll, { passive: true });
  scrollEngine.lenis?.on('scroll', handleScroll);

  // Initial chapter synchronization
  evaluateActiveChapter();

  setTimeout(() => {
    ScrollTrigger.refresh();
    evaluateActiveChapter();
  }, 250);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  scrollEngine.destroy();
});
</script>

<style scoped lang="scss">
.app-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #030712;
  color: #f8fafc;
}

.scroll-flow {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.ai-companion-pill {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(10, 16, 30, 0.85);
  border: 1px solid rgba(0, 242, 254, 0.35);
  border-radius: 30px;
  backdrop-filter: blur(16px);
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 242, 254, 0.15);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(15, 23, 42, 0.95);
    border-color: #00f2fe;
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.3);

    .pill-dot {
      box-shadow: 0 0 12px #00f2fe;
    }
  }

  .pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #00f2fe;
    box-shadow: 0 0 8px #00f2fe;
    animation: pulse-dot 1.8s infinite ease-in-out;
  }

  .pill-label {
    font-family: 'Martian Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #ffffff;
  }

  .pill-unit {
    font-family: 'Martian Mono', monospace;
    font-size: 8.5px;
    color: #10b981;
    letter-spacing: 0.05em;
    padding: 1px 5px;
    background: rgba(16, 185, 129, 0.12);
    border-radius: 3px;
  }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

@media (max-width: 640px) {
  .ai-companion-pill {
    bottom: 1.25rem;
    right: 1.25rem;
    padding: 6px 12px;
  }
}
</style>
