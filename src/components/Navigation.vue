<template>
  <header class="cyber-nav">
    <div class="nav-container">
      <!-- Brand Logo -->
      <a href="#hero" class="brand" @click.prevent="navigate(0)">
        <span class="brand__pulse"></span>
        <span class="brand__mono">MRH</span>
        <span class="brand__sep">//</span>
        <span class="brand__role">MODEL V2</span>
      </a>

      <!-- Desktop Section Links (6 Stages of Model Lifecycle) -->
      <nav class="nav-links">
        <button
          v-for="(item, idx) in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'nav-item--active': activeScene === idx }"
          @click="navigate(idx)"
          @mouseenter="onHover"
        >
          <span class="nav-item__num">0{{ idx + 1 }}</span>
          <span class="nav-item__label">{{ item.label }}</span>
          <span v-if="activeScene === idx" class="nav-item__dot"></span>
        </button>
      </nav>

      <!-- Right Controls: Audio Toggle & Agent Launcher -->
      <div class="nav-actions">
        <!-- Procedural Audio Toggle -->
        <button
          class="audio-toggle"
          :class="{ 'audio-toggle--muted': isMuted }"
          :title="isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'"
          @click="toggleAudio"
          @mouseenter="onHover"
        >
          <div class="audio-bars" v-if="!isMuted">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </div>
          <svg v-else class="audio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <span class="audio-label">{{ isMuted ? 'MUTE' : 'AUDIO' }}</span>
        </button>

        <!-- AI Assistant Drawer Trigger -->
        <button class="cyber-btn cyber-btn--emerald nav-cta" @click="emit('open-agent')" @mouseenter="onHover">
          <span class="nav-cta__dot"></span>
          <span>AGENT</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { soundManager } from '../audio/soundManager';
import { scrollEngine } from '../animations/scroll';
import gsap from 'gsap';

const emit = defineEmits<{
  (e: 'open-agent'): void;
}>();

const navItems = [
  { id: 'hero', label: 'BOOT', href: '#hero' },
  { id: 'about', label: 'SCAN', href: '#about' },
  { id: 'skills', label: 'LATENT', href: '#skills' },
  { id: 'projects', label: 'INFERENCE', href: '#projects' },
  { id: 'journey', label: 'TRAINING', href: '#journey' },
  { id: 'contact', label: 'CALL', href: '#contact' },
];

const activeScene = ref(0);
const isMuted = ref(soundManager.getMuted());

let isNavigating = false;
let navLockTimer: any = null;
let unsubscribeLenis: (() => void) | null = null;
let lastScrollY = -1;
let sectionElements: (HTMLElement | null)[] = [];

function getSectionElements(): (HTMLElement | null)[] {
  if (sectionElements.length === navItems.length && sectionElements.every(Boolean)) {
    return sectionElements;
  }
  sectionElements = navItems.map((item) => document.querySelector(item.href) as HTMLElement | null);
  return sectionElements;
}

function computeActiveSection(): number {
  if (typeof window === 'undefined') return 0;

  const scrollY = window.scrollY || window.pageYOffset || 0;
  const docHeight = document.documentElement.scrollHeight;
  const winHeight = window.innerHeight;

  // 1. Top of page -> 01 BOOT
  if (scrollY < 100) {
    return 0;
  }

  // 2. Bottom of page -> 06 CALL
  if (scrollY + winHeight >= docHeight - 80) {
    return navItems.length - 1;
  }

  // 3. Focal line (around 38% down from viewport top)
  const focalY = winHeight * 0.38;
  const elements = getSectionElements();

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= focalY && rect.bottom > focalY) {
      return i;
    }
  }

  // 4. Fallback: closest section above focal line
  let bestIdx = 0;
  let bestTop = -Infinity;
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= focalY && rect.top > bestTop) {
      bestTop = rect.top;
      bestIdx = i;
    }
  }

  return bestIdx;
}

function updateActiveScene() {
  if (isNavigating) return;
  const currentY = Math.round(window.scrollY || window.pageYOffset || 0);
  if (currentY === lastScrollY) return;
  lastScrollY = currentY;

  activeScene.value = computeActiveSection();
}

function cancelNavLock() {
  if (isNavigating) {
    isNavigating = false;
    if (navLockTimer) clearTimeout(navLockTimer);
    lastScrollY = -1;
    updateActiveScene();
  }
}

function onHover() {
  soundManager.playHover();
}

function navigate(idx: number) {
  soundManager.playClick();
  activeScene.value = idx;

  isNavigating = true;
  if (navLockTimer) clearTimeout(navLockTimer);
  navLockTimer = setTimeout(() => {
    isNavigating = false;
    lastScrollY = -1;
    updateActiveScene();
  }, 1300);

  const item = navItems[idx];
  if (!item) return;

  if (idx === 0) {
    if (scrollEngine.lenis) {
      scrollEngine.lenis.scrollTo(0, {
        duration: 1.2,
        onComplete: () => {
          isNavigating = false;
          activeScene.value = 0;
        },
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  const el = document.querySelector(item.href) as HTMLElement | null;
  if (!el) return;

  const targetOffset = -40;

  if (scrollEngine.lenis) {
    scrollEngine.lenis.scrollTo(el, {
      offset: targetOffset,
      duration: 1.2,
      onComplete: () => {
        isNavigating = false;
        activeScene.value = idx;
      },
    });
  } else {
    const targetY = el.getBoundingClientRect().top + window.scrollY + targetOffset;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    setTimeout(() => {
      isNavigating = false;
      activeScene.value = idx;
    }, 800);
  }
}

function toggleAudio() {
  isMuted.value = soundManager.toggleMute();
  if (!isMuted.value) {
    soundManager.playChime(650);
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveScene, { passive: true });
  window.addEventListener('resize', updateActiveScene, { passive: true });
  window.addEventListener('wheel', cancelNavLock, { passive: true });
  window.addEventListener('touchmove', cancelNavLock, { passive: true });
  window.addEventListener('keydown', cancelNavLock, { passive: true });

  gsap.ticker.add(updateActiveScene);

  const tryBindLenis = () => {
    if (scrollEngine.lenis) {
      unsubscribeLenis = scrollEngine.lenis.on('scroll', updateActiveScene);
      return true;
    }
    return false;
  };

  if (!tryBindLenis()) {
    const timer = setInterval(() => {
      if (tryBindLenis()) clearInterval(timer);
    }, 100);
    setTimeout(() => clearInterval(timer), 3000);
  }

  nextTick(() => {
    getSectionElements();
    lastScrollY = -1;
    updateActiveScene();
  });
  setTimeout(() => {
    getSectionElements();
    lastScrollY = -1;
    updateActiveScene();
  }, 200);
  setTimeout(() => {
    getSectionElements();
    lastScrollY = -1;
    updateActiveScene();
  }, 600);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveScene);
  window.removeEventListener('resize', updateActiveScene);
  window.removeEventListener('wheel', cancelNavLock);
  window.removeEventListener('touchmove', cancelNavLock);
  window.removeEventListener('keydown', cancelNavLock);
  gsap.ticker.remove(updateActiveScene);
  if (unsubscribeLenis) unsubscribeLenis();
  if (navLockTimer) clearTimeout(navLockTimer);
});
</script>

<style scoped lang="scss">
.cyber-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  padding: 1rem 1.5rem;
  pointer-events: none;
}

.nav-container {
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  background: rgba(11, 19, 41, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 0.9rem;
  color: var(--text-primary);

  &__pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00f2fe;
    box-shadow: 0 0 10px #00f2fe;
  }

  &__mono {
    color: #f8fafc;
  }

  &__sep {
    color: rgba(255, 255, 255, 0.2);
  }

  &__role {
    font-size: 0.75rem;
    color: #00f2fe;
    background: rgba(0, 242, 254, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 242, 254, 0.25);
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 960px) {
    display: none;
  }
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 500;
  color: #94a3b8;
  transition: all 0.2s ease;
  position: relative;

  &__num {
    font-size: 0.65rem;
    opacity: 0.5;
  }

  &:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.05);
  }

  &--active {
    color: #00f2fe;
    background: rgba(0, 242, 254, 0.08);

    .nav-item__num {
      color: #00f2fe;
      opacity: 1;
    }
  }

  &__dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #00f2fe;
    box-shadow: 0 0 6px #00f2fe;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.audio-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.45rem 0.75rem;
  border-radius: 9999px;
  color: #94a3b8;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(0, 242, 254, 0.4);
    color: #f8fafc;
  }

  &--muted {
    opacity: 0.6;
  }
}

.audio-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;

  .bar {
    width: 2px;
    background: #00f2fe;
    border-radius: 1px;
    animation: bar-pulse 1s infinite ease-in-out;
  }

  .bar-1 { height: 6px; animation-delay: 0.1s; }
  .bar-2 { height: 12px; animation-delay: 0.3s; }
  .bar-3 { height: 8px; animation-delay: 0.2s; }
}

@keyframes bar-pulse {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

.audio-icon {
  width: 14px;
  height: 14px;
}

.nav-cta {
  padding: 0.45rem 1rem;
  font-size: 0.78rem;

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #030712;
  }
}
</style>
