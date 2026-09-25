<template>
  <header class="floating-nav" :class="{ 'nav--scrolled': isScrolled }">
    <div class="nav-pill glass-panel">
      <!-- Brand Logo -->
      <a href="#hero" class="brand" @click.prevent="scrollTo(0)">
        <span class="brand-pulse"></span>
        <span class="brand-text">RIDHO HIDAYAT</span>
        <span class="brand-sep">//</span>
        <span class="brand-role">AI / ML</span>
      </a>

      <!-- Minimalist Stage Links -->
      <nav class="nav-links">
        <button
          v-for="(item, idx) in navItems"
          :key="item.id"
          class="nav-link-btn"
          :class="{ 'is-active': activeSection === item.id }"
          @click="scrollToSection(item.id)"
        >
          <span class="link-num">0{{ idx + 1 }}</span>
          <span class="link-label">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Right Controls: Direct Action -->
      <div class="nav-actions">
        <!-- Direct Contact Trigger -->
        <button
          class="action-btn"
          @click="scrollToSection('contact')"
        >
          <span>TALK</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

import { scrollEngine } from '../animations/scroll';

const props = defineProps<{
  currentChapter?: string;
}>();

const isScrolled = ref(false);
const internalActiveSection = ref('hero');
const activeSection = computed(() => props.currentChapter || internalActiveSection.value);

const navItems = [
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
];

function scrollTo(y: number) {
  scrollEngine.scrollTo(y);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = (id === 'projects' && el.parentElement?.classList.contains('pin-spacer'))
    ? el.parentElement
    : el;
  scrollEngine.scrollTo(target, { offset: -20 });
}

function handleScroll() {
  const y = window.scrollY || 0;
  isScrolled.value = y > 50;

  // Fallback section spy if currentChapter prop not passed
  if (!props.currentChapter) {
    const sections = ['contact', 'skills', 'projects', 'about', 'hero'];
    for (const s of sections) {
      const el = document.getElementById(s);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.45) {
          internalActiveSection.value = s;
          break;
        }
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.floating-nav {
  position: fixed;
  top: 1.5rem;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
  pointer-events: none;
}

.nav-pill {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 8px 18px;
  background: rgba(8, 12, 22, 0.72);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  max-width: 1040px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #f8fafc;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;

    .brand-pulse {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f2fe;
      box-shadow: 0 0 8px #00f2fe;
    }

    .brand-sep {
      color: #475569;
    }

    .brand-role {
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      color: #94a3b8;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;

    .nav-link-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.08em;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s ease;

      .link-num {
        color: #475569;
        font-size: 9px;
      }

      &:hover {
        color: #f1f5f9;
      }

      &.is-active {
        color: #00f2fe;

        .link-num {
          color: #00f2fe;
        }
      }
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      background: #f1f5f9;
      border: 1px solid #f1f5f9;
      border-radius: 9999px;
      color: #030712;
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;

      &:hover {
        background: #00f2fe;
        border-color: #00f2fe;
        box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
      }
    }
  }
}

@media (max-width: 768px) {
  .nav-pill {
    padding: 6px 12px;
    gap: 1rem;

    .brand .brand-role {
      display: none;
    }

    .nav-links {
      display: none;
    }
  }
}
</style>
