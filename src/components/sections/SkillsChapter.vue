<template>
  <section class="chapter-skills" id="skills">
    <div class="skills-editorial-frame">
      <!-- 1. Top Chapter Rail (Elevated so center is open) -->
      <header class="skills-top-rail">
        <div class="chapter-badge">
          <span class="badge-num">04</span>
          <span class="badge-title">SYSTEM ARCHITECTURES // LATENT MANIFOLD</span>
        </div>

        <h2 class="editorial-headline">
          Core Capabilities & Applied ML Systems
        </h2>

        <!-- Interactive Cluster Filter Pills -->
        <div class="cluster-filters">
          <button
            class="filter-pill"
            :class="{ 'is-active': selectedCluster === null }"
            @click="onSelectCluster(null)"
            @mouseenter="soundManager.playHover()"
          >
            <span class="pill-dot pill-dot--all"></span>
            <span class="pill-label">ALL DOMAINS</span>
            <span class="pill-count">18</span>
          </button>

          <button
            v-for="cluster in skillClusters"
            :key="cluster.id"
            class="filter-pill"
            :class="{ 'is-active': selectedCluster === cluster.id }"
            :style="{ '--c-color': cluster.color }"
            @click="onSelectCluster(cluster.id)"
            @mouseenter="soundManager.playHover()"
          >
            <span class="pill-dot"></span>
            <span class="pill-label">{{ cluster.name }}</span>
          </button>
        </div>
      </header>

      <!-- 2. Wide-Open Negative Center: Dedicated to the 3D Latent Galaxy (No text collisions!) -->
      <div class="skills-center-stage"></div>

      <!-- 3. Bottom Dedicated Inspection HUD (No cursor overlap or duplicate tooltips!) -->
      <footer class="skills-bottom-hud">
        <transition name="hud-swap" mode="out-in">
          <!-- Active Node Card -->
          <div
            v-if="activeNode"
            :key="activeNode.id"
            class="node-hud-card glass-panel"
            :style="{ '--accent-color': activeNode.color }"
          >
            <div class="hud-header">
              <div class="hud-cluster-tag" :style="{ color: activeNode.color }">
                <span class="hud-dot" :style="{ backgroundColor: activeNode.color }"></span>
                {{ activeNode.clusterName }}
              </div>
              <span class="hud-focus-badge">{{ activeNode.tag }}</span>
            </div>

            <div class="hud-body">
              <h3 class="hud-title">{{ activeNode.name }}</h3>
              <p class="hud-note">{{ activeNode.note }}</p>
            </div>
          </div>

          <!-- Default Ambient State -->
          <div v-else key="empty-hint" class="hud-idle-pill glass-chip">
            <span class="idle-pulse"></span>
            <span class="idle-text">HOVER ANY 3D CAPABILITY NODE TO INSPECT ARCHITECTURAL IMPLEMENTATIONS</span>
          </div>
        </transition>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { skillClusters, SkillNode } from '../../data/skills-galaxy';
import { soundManager } from '../../audio/soundManager';

defineProps<{
  activeNode?: SkillNode | null;
}>();

const emit = defineEmits<{
  (e: 'filter-cluster', clusterId: string | null): void;
}>();

const selectedCluster = ref<string | null>(null);

function onSelectCluster(id: string | null) {
  selectedCluster.value = id;
  soundManager.playClick();
  emit('filter-cluster', id);
}
</script>

<style scoped lang="scss">
.chapter-skills {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 2.5rem 3rem;
  box-sizing: border-box;
  z-index: 1;
  pointer-events: none; // Allows full 3D interaction across open canvas
}

.skills-editorial-frame {
  max-width: 1240px;
  width: 100%;
  height: calc(100vh - 8.5rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

// 1. Top HUD Rail
.skills-top-rail {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  .chapter-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Martian Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: #a855f7;

    .badge-num {
      padding: 2px 6px;
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 4px;
    }
  }

  .editorial-headline {
    font-size: clamp(1.8rem, 3.2vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin: 0;
    text-shadow: 0 4px 25px rgba(0, 0, 0, 0.9);
  }

  .cluster-filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 0.5rem;

    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 14px;
      background: rgba(8, 12, 22, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.25s ease;

      .pill-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: var(--c-color, #f8fafc);
        box-shadow: 0 0 6px var(--c-color, #f8fafc);
        opacity: 0.6;
        transition: opacity 0.2s ease;

        &--all {
          background-color: #38bdf8;
          box-shadow: 0 0 6px #38bdf8;
        }
      }

      .pill-count {
        font-size: 9px;
        color: #64748b;
      }

      &:hover {
        color: #f1f5f9;
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);

        .pill-dot {
          opacity: 1;
        }
      }

      &.is-active {
        background: rgba(255, 255, 255, 0.09);
        border-color: var(--c-color, #38bdf8);
        color: #ffffff;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);

        .pill-dot {
          opacity: 1;
          box-shadow: 0 0 8px var(--c-color, #38bdf8);
        }
      }
    }
  }
}

// 2. Wide Open Center Stage (Zero UI interference)
.skills-center-stage {
  flex: 1;
  width: 100%;
  pointer-events: none;
}

// 3. Bottom Dedicated HUD
.skills-bottom-hud {
  pointer-events: auto;
  max-width: 680px;
  width: 100%;
  min-height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .node-hud-card {
    width: 100%;
    padding: 1.1rem 1.6rem;
    background: rgba(8, 12, 22, 0.88);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-left: 3px solid var(--accent-color, #00f2fe);
    border-radius: 14px;
    text-align: left;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
    transition: all 0.25s ease;

    .hud-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;

      .hud-cluster-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: 'Martian Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;

        .hud-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      }

      .hud-focus-badge {
        font-family: 'Martian Mono', monospace;
        font-size: 9px;
        padding: 2px 7px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: #e2e8f0;
        letter-spacing: 0.06em;
      }
    }

    .hud-body {
      .hud-title {
        font-size: 18px;
        font-weight: 700;
        color: #f8fafc;
        margin: 0 0 6px;
      }

      .hud-note {
        font-size: 13px;
        color: #cbd5e1;
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  .hud-idle-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    background: rgba(8, 12, 22, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9999px;

    .idle-pulse {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #a855f7;
      box-shadow: 0 0 8px #a855f7;
      animation: pulse 2s infinite;
    }

    .idle-text {
      font-family: 'Martian Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: #94a3b8;
    }
  }
}

// Seamless HUD Transition
.hud-swap-enter-active,
.hud-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hud-swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.hud-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 768px) {
  .skills-editorial-frame {
    height: auto;
    min-height: calc(100vh - 6rem);
  }

  .skills-center-stage {
    min-height: 240px;
  }
}
</style>
