<template>
  <section class="chapter-hero" id="hero">
    <div class="hero-inner">
      <!-- Minimalist Status Telemetry Tag -->
      <div class="hero-tag">
        <span class="status-pulse"></span>
        <span class="mono-label">MODEL V2 // COLD STANDBY AWAKENED</span>
      </div>

      <!-- Confident Monumental Typography -->
      <h1 class="hero-title">
        <span class="word-lead">MUHAMMAD RIDHO</span>
        <span class="word-sub">HIDAYAT</span>
      </h1>

      <div class="hero-subtitle">
        <span class="role-badge">AI & MACHINE LEARNING ENGINEER</span>
      </div>

      <!-- Single Crisp Thesis Statement -->
      <p class="hero-statement">
        Engineering production machine learning systems, real-time computer vision,
        and autonomous agentic loops with verified mathematical rigor.
      </p>

      <!-- Subtle Scroll Cue -->
      <div class="scroll-cue">
        <span class="cue-line"></span>
        <span class="cue-text">SCROLL TO INSPECT</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Minimalist, purely driven by scroll and stage
</script>

<style scoped lang="scss">
.chapter-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 4rem;
  box-sizing: border-box;
  z-index: 1;
  pointer-events: none; // let 3D canvas receive pointer events where needed
}

.hero-inner {
  max-width: 1080px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: auto;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(8, 12, 22, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  margin-bottom: 2rem;

  .status-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
    box-shadow: 0 0 8px #10b981;
    animation: pulse 2s infinite;
  }

  .mono-label {
    font-family: 'Martian Mono', monospace, Consolas;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: #94a3b8;
    text-transform: uppercase;
  }
}

.hero-title {
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.9);

  .word-lead {
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    color: #e2e8f0;
  }

  .word-sub {
    font-size: clamp(3rem, 8.5vw, 6.8rem);
    background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero-subtitle {
  margin-bottom: 1.8rem;

  .role-badge {
    font-family: 'Martian Mono', monospace;
    font-size: clamp(12px, 1.6vw, 15px);
    letter-spacing: 0.18em;
    color: #00f2fe;
    text-transform: uppercase;
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.9);
  }
}

.hero-statement {
  max-width: 640px;
  font-size: clamp(15px, 1.4vw, 18px);
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 4rem;
  font-weight: 400;
}

.scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
  animation: floatCue 2.4s ease-in-out infinite;

  .cue-line {
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, #00f2fe, transparent);
  }

  .cue-text {
    font-family: 'Martian Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: #94a3b8;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes floatCue {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
</style>
