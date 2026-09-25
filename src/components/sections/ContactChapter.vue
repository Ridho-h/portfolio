<template>
  <section class="chapter-contact" id="contact">
    <div class="contact-container">
      <!-- Chapter Badge -->
      <div class="chapter-badge">
        <span class="badge-num">04</span>
        <span class="badge-title">COMMUNICATION RELAY</span>
      </div>

      <div class="contact-main">
        <h2 class="contact-headline">
          Let’s engineer intelligent systems together.
        </h2>

        <p class="contact-sub">
          Open for machine learning engineering roles, computer vision pipelines,
          and multimodal agent architectures.
        </p>

        <!-- Minimalist Action Channels -->
        <div class="channels-grid">
          <!-- Copy Email Button -->
          <button class="channel-card glass-panel" @click="copyEmail">
            <span class="channel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <div class="channel-info">
              <span class="channel-label">DIRECT EMAIL</span>
              <span class="channel-val">{{ emailCopied ? 'COPIED TO CLIPBOARD ✓' : emailAddress }}</span>
            </div>
            <span class="copy-hint">{{ emailCopied ? 'DONE' : 'COPY ↗' }}</span>
          </button>

          <!-- GitHub Link -->
          <a
            href="https://github.com/Ridho-h"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card glass-panel"
          >
            <span class="channel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </span>
            <div class="channel-info">
              <span class="channel-label">OPEN SOURCE</span>
              <span class="channel-val">github.com/Ridho-h</span>
            </div>
            <span class="copy-hint">VISIT ↗</span>
          </a>

          <!-- LinkedIn Link -->
          <a
            href="https://linkedin.com/in/muhammad-ridho-hidayat"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card glass-panel"
          >
            <span class="channel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </span>
            <div class="channel-info">
              <span class="channel-label">PROFESSIONAL</span>
              <span class="channel-val">LinkedIn Profile</span>
            </div>
            <span class="copy-hint">CONNECT ↗</span>
          </a>
        </div>
      </div>

      <!-- Footer Minimal Colophon -->
      <footer class="contact-footer">
        <span class="colophon">MUHAMMAD RIDHO HIDAYAT · 2026</span>
        <span class="colophon-stack">VUE 3 · THREE.JS · TYPESCRIPT · LENIS</span>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const emailAddress = 'mridhohidayat09@gmail.com';
const emailCopied = ref(false);

function copyEmail() {
  navigator.clipboard.writeText(emailAddress);
  emailCopied.value = true;
  setTimeout(() => {
    emailCopied.value = false;
  }, 3000);
}
</script>

<style scoped lang="scss">
.chapter-contact {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 4rem;
  box-sizing: border-box;
  z-index: 1;
}

.contact-container {
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.chapter-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Martian Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #f59e0b;
  margin-bottom: 2rem;

  .badge-num {
    padding: 2px 6px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 4px;
  }
}

.contact-main {
  width: 100%;
  margin-bottom: 5rem;

  .contact-headline {
    font-size: clamp(2.2rem, 5vw, 4.2rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #ffffff;
    margin: 0 0 1.25rem;
  }

  .contact-sub {
    font-size: clamp(15px, 1.4vw, 18px);
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto 3.5rem;
    line-height: 1.6;
  }
}

.channels-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 580px;
  margin: 0 auto;

  .channel-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem 1.75rem;
    background: rgba(8, 12, 22, 0.65);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    color: #f8fafc;
    text-decoration: none;
    cursor: pointer;
    text-align: left;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

      .copy-hint {
        color: #00f2fe;
      }
    }

    .channel-icon {
      color: #94a3b8;
      display: flex;
      align-items: center;
    }

    .channel-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;

      .channel-label {
        font-family: 'Martian Mono', monospace;
        font-size: 10px;
        color: #64748b;
        letter-spacing: 0.1em;
      }

      .channel-val {
        font-family: 'Martian Mono', monospace;
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
      }
    }

    .copy-hint {
      font-family: 'Martian Mono', monospace;
      font-size: 11px;
      color: #64748b;
      letter-spacing: 0.05em;
      transition: color 0.2s ease;
    }
  }
}

.contact-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-family: 'Martian Mono', monospace;
  font-size: 11px;
  color: #64748b;
}

@media (max-width: 640px) {
  .contact-footer {
    flex-direction: column;
    text-align: center;
  }
}
</style>
