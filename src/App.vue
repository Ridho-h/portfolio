<template>
  <div class="app-root">
    <!-- 1. Cyber Navigation Header -->
    <Navigation @open-agent="isAgentOpen = true" />

    <!-- 2. "The Model Awakens" 6-Stage Narrative Vertical Flow -->
    <main class="model-awakens-flow">
      <!-- Stage 01: Hero — Cold Boot -->
      <HeroBoot />

      <!-- Stage 02: About — Diagnostic Scan -->
      <AboutScan />

      <!-- Stage 03: Skills — Latent Space (Embedding Galaxy) -->
      <LatentSpace />

      <!-- Stage 04: Projects — Inference Reveal -->
      <ProjectsInference />

      <!-- Stage 05: Experience — Training Log -->
      <TrainingLog />

      <!-- Stage 06: Contact / Footer — Call the Model -->
      <CallModel @open-agent="isAgentOpen = true" />
    </main>

    <!-- Grounded AI Assistant Drawer / Modal -->
    <ChatbotModal :is-open="isAgentOpen" @close="isAgentOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Navigation from './components/Navigation.vue';
import HeroBoot from './components/sections/HeroBoot.vue';
import AboutScan from './components/sections/AboutScan.vue';
import LatentSpace from './components/sections/LatentSpace.vue';
import ProjectsInference from './components/sections/ProjectsInference.vue';
import TrainingLog from './components/sections/TrainingLog.vue';
import CallModel from './components/sections/CallModel.vue';
import ChatbotModal from './components/ChatbotModal.vue';

import { scrollEngine } from './animations/scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const isAgentOpen = ref(false);

onMounted(() => {
  // Initialize Lenis smooth scroll engine
  scrollEngine.init();
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

onBeforeUnmount(() => {
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
  overflow-x: hidden;
}

.model-awakens-flow {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
