<template>
  <transition name="chat-fade">
    <div v-if="isOpen" class="chat-overlay" @click.self="$emit('close')">
      <div class="chat-terminal glass-panel">
        <!-- Terminal Header -->
        <header class="chat-header">
          <div class="header-robot">
            <div class="robot-avatar">
              <span class="avatar-eye"></span>
            </div>
            <div class="header-identity">
              <span class="identity-tag">UNIT_01 // RIDHO_AI</span>
              <span class="identity-status">
                <span class="status-dot" :class="{ 'status-dot--offline': !isApiConnected }"></span>
                {{ isApiConnected ? 'ONLINE // GEMINI 1.5 FLASH' : 'OFFLINE GROUNDED' }}
              </span>
            </div>
          </div>

          <div class="header-actions">
            <button class="close-btn" @click="$emit('close')" title="Close Chatbot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Message Stream Area -->
        <main ref="messagesRef" class="chat-messages">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="message-row"
            :class="[msg.role === 'agent' ? 'message--agent' : 'message--user']"
          >
            <div class="message-bubble">
              <div class="bubble-meta">
                <span class="bubble-sender">{{ msg.role === 'agent' ? 'RIDHO_AI' : 'YOU' }}</span>
                <span class="bubble-time">{{ msg.timestamp }}</span>
              </div>
              <p class="bubble-text" v-html="formatMessage(msg.text)"></p>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message-row message--agent">
            <div class="message-bubble typing-bubble">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </main>

        <!-- Pre-Prompt Quick Chips -->
        <div class="quick-chips-rail">
          <span class="chips-label">SUGGESTED PROMPTS:</span>
          <div class="chips-scroll">
            <button
              v-for="chip in quickChips"
              :key="chip.label"
              class="quick-chip"
              @click="handleSendQuickChip(chip.prompt)"
            >
              <span>✦</span> {{ chip.label }}
            </button>
          </div>
        </div>

        <!-- Terminal Input Bar -->
        <footer class="chat-input-bar">
          <input
            ref="inputRef"
            v-model="inputQuery"
            type="text"
            placeholder="Ask about Ridho's skills, thesis, SpotterAI, ShopAI..."
            class="chat-input"
            @keydown.enter="handleSend"
          />
          <button
            class="send-btn"
            :disabled="!inputQuery.trim() || isTyping"
            @click="handleSend"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';


const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

interface Message {
  role: 'agent' | 'user';
  text: string;
  timestamp: string;
}

const inputQuery = ref('');
const isTyping = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
const isApiConnected = ref(false);

// API Configuration
const directGeminiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
const chatApiUrl = (import.meta.env.VITE_CHAT_API_URL as string | undefined)?.trim();
isApiConnected.value = Boolean(directGeminiKey || chatApiUrl);

const quickChips = [
  { label: 'Key Skills & Stack', prompt: 'What are your core AI/ML skills and technical stack?' },
  { label: 'UNSRI Thesis (3.92)', prompt: 'Tell me about your undergraduate thesis and GPA.' },
  { label: 'SpotterAI (60 FPS)', prompt: 'Explain the architecture and tech behind SpotterAI.' },
  { label: 'ShopAI Agent', prompt: 'How did you build the ShopAI autonomous agent and FastMCP?' },
  { label: 'Hire Ridho', prompt: 'Why should we hire Ridho and how can we contact him?' },
];

function getCurrentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const messages = ref<Message[]>([
  {
    role: 'agent',
    text: `Greetings! I am **Unit 01**, Muhammad Ridho Hidayat's autonomous AI agent companion.

I have direct access to Ridho's architectural telemetry, thesis benchmarks, and production project repositories. Feel free to ask me anything about his technical competencies, real-time vision pipelines, or career background!`,
    timestamp: getCurrentTime(),
  },
]);

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
}

function formatMessage(text: string): string {
  // Simple markdown-style bold and code formatter
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

// Calibrated Knowledge Engine for Ridho
function generateAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('thesis') || q.includes('gpa') || q.includes('unsri') || q.includes('cum laude') || q.includes('university') || q.includes('segformer')) {
    return `🎓 **Academic Rigor & UNSRI Thesis**:
Ridho graduated with **3.92 / 4.00 GPA (Cum Laude)** in Informatics from **Universitas Sriwijaya**.

His undergraduate thesis investigated:
• **Topic**: *Comparative Analysis of SegFormer-B0 vs U-Net++ for Lung Lesion Segmentation in Chest X-rays*.
• **Findings**: SegFormer-B0 achieved an outstanding **0.8847 Dice Similarity Coefficient** with an **81% parameter reduction** compared to traditional CNN architectures.
• **Significance**: Demonstrates his ability to conduct rigorous mathematical model evaluation and optimize Vision Transformers for high-precision medical imaging.`;
  }

  if (q.includes('spotter') || q.includes('pose') || q.includes('vision') || q.includes('bilstm') || q.includes('exercise')) {
    return `🏋️ **SpotterAI // Real-Time Biomechanics & Vision**:
SpotterAI is a production-grade fitness form correction system:
• **Pipeline**: Ingests video streams at **60 FPS**, extracting 33 3D skeletal body landmarks using **MediaPipe**.
• **Temporal Modeling**: Evaluates 30-frame temporal landmark sequences using a **Bi-LSTM network with Luong multiplicative attention**.
• **Latency**: Achieves **sub-18ms inference latency** with zero perceptible jitter, giving gym users real-time biomechanical posture warnings and automatic repetition counting.
• **Stack**: PyTorch, MediaPipe, OpenCV, FastAPI.`;
  }

  if (q.includes('shop') || q.includes('agent') || q.includes('fastmcp') || q.includes('mcp') || q.includes('gemini') || q.includes('langchain')) {
    return `🤖 **ShopAI // Autonomous Multi-Agent Concierge**:
ShopAI is an agentic e-commerce architecture:
• **Architecture**: Implements a **ReAct reasoning loop** (Planner → Tool Caller → Reviewer) orchestrating multi-step catalog search, price verification, and cart actions.
• **FastMCP**: Exposes custom **Model Context Protocol (MCP)** tool servers that connect the LLM securely to image classifiers and database APIs.
• **Security**: Executes dynamic agent-generated code inside **ephemeral Docker container sandboxes** with strict timeouts and memory boundaries.
• **Stack**: Gemini 1.5 Pro, LangChain, FastMCP, Docker Sandboxing, FastAPI.`;
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('tools') || q.includes('language')) {
    return `⚡ **Core Technical Competencies**:
Ridho specializes across 4 cohesive domains:
1. **Computer Vision & Biomechanics**: PyTorch, MediaPipe, OpenCV, SegFormer-B0, Bi-LSTM + Attention, torchvision.
2. **Autonomous Agents & LLMs**: Model Context Protocol (FastMCP), Multi-Agent DAG orchestration, Gemini 1.5, LangChain ReAct loops, Docker Sandboxing.
3. **RAG & Vector Retrieval**: Pinecone vector search, LangChain retrieval chains, ReAct agent tool calling, LangSmith tracing and LLM-as-a-judge evaluation.
4. **MLOps & Backend Engineering**: FastAPI (async REST), Docker containerization, automated CI/CD test runners, Celery/Redis async pipelines.`;
  }

  if (q.includes('hire') || q.includes('contact') || q.includes('email') || q.includes('job') || q.includes('work') || q.includes('available')) {
    return `💼 **Career & Availability**:
Ridho is currently open for:
• **Machine Learning Engineer**
• **Computer Vision Engineer**
• **AI Systems / Agentic Systems Engineer**

**Why hire Ridho?**
He doesn't just train models in Jupyter notebooks — he engineers robust, sub-millisecond production APIs, multi-agent tool loops, and edge vision systems with mathematical verification.

📬 **Reach out directly**:
• **Email**: \`mridhohidayat09@gmail.com\`
• **LinkedIn**: [linkedin.com/in/muhammad-ridho-hidayat](https://linkedin.com/in/muhammad-ridho-hidayat)
• **GitHub**: [github.com/Ridho-h](https://github.com/Ridho-h)`;
  }

  if (q.includes('bangkit') || q.includes('samsung') || q.includes('pedigree') || q.includes('award')) {
    return `🏆 **Industry Accreditations**:
• **Bangkit Academy (Google · GoTo · Traveloka)**: Top Machine Learning Path Graduate, completing rigorous training in scalable deep learning pipelines.
• **Samsung Innovation Campus (SIC)**: National Semi-Finalist for Edge IoT Intelligent Pipeline Architecture.
• **3.92 Cum Laude**: Graduated at top of cohort from Universitas Sriwijaya.`;
  }

  // Fallback intelligent agent response
  return `I understand you're inquiring about **"${query}"**.

Ridho's core expertise lies at the intersection of **deep learning research and production engineering**:
• **Computer Vision**: 60 FPS real-time pose tracking (MediaPipe) & medical ViT segmentation (SegFormer).
• **Agentic AI**: FastMCP tool servers, ReAct multi-agent loops, and ephemeral Docker isolation.
• **MLOps**: High-throughput async FastAPI backends on GCP.

Feel free to ask about **SpotterAI**, his **UNSRI thesis (3.92 Cum Laude)**, or click any of the suggested prompt chips below!`;
}

async function handleSend() {
  const text = inputQuery.value.trim();
  if (!text || isTyping.value) return;

  // Add user message
  messages.value.push({
    role: 'user',
    text,
    timestamp: getCurrentTime(),
  });

  inputQuery.value = '';
  isTyping.value = true;
  scrollToBottom();

  // 1. Try direct Gemini API call (if key configured)
  if (directGeminiKey) {
    try {
      const candidates = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
      for (const model of candidates) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${directGeminiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 1200 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            messages.value.push({ role: 'agent', text: reply, timestamp: getCurrentTime() });
            isTyping.value = false;
            scrollToBottom();
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Direct Gemini API failed:', err);
    }
  }

  // 2. Try Cloudflare Worker proxy (if URL configured)
  if (chatApiUrl) {
    try {
      const history = messages.value.slice(0, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          messages.value.push({ role: 'agent', text: data.reply, timestamp: getCurrentTime() });
          isTyping.value = false;
          scrollToBottom();
          return;
        }
      }
    } catch (err) {
      console.warn('Chat API proxy failed:', err);
    }
  }

  // 3. Fallback to local grounded knowledge engine
  setTimeout(() => {
    const reply = generateAnswer(text);
    messages.value.push({ role: 'agent', text: reply, timestamp: getCurrentTime() });
    isTyping.value = false;
    scrollToBottom();
  }, 420);
}

function handleSendQuickChip(prompt: string) {
  inputQuery.value = prompt;
  handleSend();
}

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      scrollToBottom();
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
);
</script>

<style scoped lang="scss">
.chat-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(3, 7, 18, 0.72);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
}

.chat-terminal {
  width: 100%;
  max-width: 620px;
  height: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: rgba(10, 16, 30, 0.92);
  border: 1px solid rgba(0, 242, 254, 0.25);
  border-radius: 18px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.12);
  overflow: hidden;
}

// Header
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .header-robot {
    display: flex;
    align-items: center;
    gap: 12px;

    .robot-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0, 242, 254, 0.12);
      border: 1.5px solid #00f2fe;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 12px rgba(0, 242, 254, 0.3);

      .avatar-eye {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #00f2fe;
        box-shadow: 0 0 8px #00f2fe;
        animation: pulse-eye 2s infinite ease-in-out;
      }
    }

    .header-identity {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .identity-tag {
        font-family: 'Martian Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #ffffff;
      }

      .identity-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: 'Martian Mono', monospace;
        font-size: 9px;
        color: #10b981;
        letter-spacing: 0.05em;

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;

          &--offline {
            background: #94a3b8;
            box-shadow: none;
          }
        }
      }
    }
  }

  .close-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.4);
      color: #ef4444;
    }
  }
}

// Messages
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
}

.message-row {
  display: flex;
  flex-direction: column;

  &.message--agent {
    align-items: flex-start;

    .message-bubble {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(0, 242, 254, 0.15);
      border-top-left-radius: 4px;
    }
  }

  &.message--user {
    align-items: flex-end;

    .message-bubble {
      background: rgba(0, 242, 254, 0.12);
      border: 1px solid rgba(0, 242, 254, 0.3);
      border-top-right-radius: 4px;
      color: #ffffff;
    }
  }
}

.message-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  .bubble-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 5px;
    font-family: 'Martian Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.06em;

    .bubble-sender {
      color: #00f2fe;
      font-weight: 700;
    }
    .bubble-time {
      color: #64748b;
    }
  }

  .bubble-text {
    font-size: 13.5px;
    line-height: 1.55;
    color: #e2e8f0;
    margin: 0;

    :deep(strong) {
      color: #ffffff;
    }
    :deep(code) {
      font-family: 'Martian Mono', monospace;
      font-size: 12px;
      padding: 1px 5px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
      color: #38bdf8;
    }
  }
}

// Typing bubble
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;

  .typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00f2fe;
    animation: bounce 1.2s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

// Quick chips rail
.quick-chips-rail {
  padding: 8px 1.25rem;
  background: rgba(10, 16, 28, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 6px;

  .chips-label {
    font-family: 'Martian Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    color: #64748b;
  }

  .chips-scroll {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;

    &::-webkit-scrollbar {
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    .quick-chip {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      font-size: 11.5px;
      color: #cbd5e1;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;

      span {
        color: #00f2fe;
        font-size: 10px;
      }

      &:hover {
        background: rgba(0, 242, 254, 0.12);
        border-color: #00f2fe;
        color: #ffffff;
      }
    }
  }
}

// Input bar
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 1.25rem 1rem;
  background: rgba(15, 23, 42, 0.85);
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  .chat-input {
    flex: 1;
    height: 40px;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0 12px;
    color: #ffffff;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #00f2fe;
      box-shadow: 0 0 10px rgba(0, 242, 254, 0.2);
    }

    &::placeholder {
      color: #64748b;
      font-size: 12px;
    }
  }

  .send-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #00f2fe;
    border: none;
    color: #030712;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #38bdf8;
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(0, 242, 254, 0.4);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }
}

// Animations
@keyframes pulse-eye {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: opacity 0.25s ease;
  .chat-terminal {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.chat-fade-enter-from,
.chat-fade-leave-to {
  opacity: 0;
  .chat-terminal {
    transform: scale(0.94) translateY(12px);
  }
}
</style>
