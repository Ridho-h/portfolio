<template>
  <div v-if="isOpen" class="chatbot-backdrop" data-lenis-prevent @click.self="close" @wheel.stop>
    <div class="glass-panel chatbot-modal" data-lenis-prevent @wheel.stop>
      <!-- Titlebar -->
      <div class="chatbot-titlebar">
        <div class="titlebar-left">
          <span class="pulse-dot"></span>
          <span class="titlebar-title">AGENT ASSISTANT // MRH-V2</span>
          <span class="titlebar-tag" :class="{ 'titlebar-tag--online': isApiConnected }">
            {{ isApiConnected ? 'ONLINE // GEMINI 1.5 FLASH' : 'OFFLINE GROUNDED' }}
          </span>
        </div>
        <button class="close-btn" @click="close" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Quick Prompt Suggestion Chips -->
      <div class="prompt-chips">
        <button
          v-for="chip in promptChips"
          :key="chip"
          class="prompt-chip"
          @click="sendPrompt(chip)"
        >
          {{ chip }}
        </button>
      </div>

      <!-- Conversation Messages -->
      <div class="chatbot-messages" ref="messagesContainer" data-lenis-prevent @wheel.stop>
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message-row"
          :class="`message-row--${msg.sender}`"
        >
          <div class="message-bubble" :class="`message-bubble--${msg.sender}`">
            <div class="message-sender-tag">{{ msg.sender === 'user' ? 'YOU' : 'AGENT' }}</div>
            <div class="message-text" v-html="formatMessage(msg.text)"></div>
          </div>
        </div>

        <div v-if="isTyping" class="message-row message-row--agent">
          <div class="message-bubble message-bubble--agent is-typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="chatbot-input-bar">
        <input
          v-model="userInput"
          @keydown.enter="submitMessage"
          type="text"
          class="chatbot-input"
          placeholder="Ask anything about Ridho's projects, skills, or experience..."
        />
        <button
          class="cyber-btn cyber-btn--emerald send-btn"
          @click="submitMessage"
          :disabled="!userInput.trim() || isTyping"
        >
          <span>SEND</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onBeforeUnmount } from 'vue';
import { knowledge, PORTFOLIO_SYSTEM_PROMPT } from '../data/knowledge';

import { scrollEngine } from '../animations/scroll';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const directGeminiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
const chatApiUrl = (import.meta.env.VITE_CHAT_API_URL as string | undefined)?.trim();
const isApiConnected = ref(Boolean(directGeminiKey || chatApiUrl));

const userInput = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const promptChips = [
  'What is SpotterAI?',
  'SpotterAI benchmarks',
  'Multi-agent coding pipeline',
  'Experience at Bank 9 Jambi',
  'Are you open to work?',
  'Do you use the Gemini API?',
];

// Lock background scroll and Lenis whenever modal is open
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      scrollEngine.lenis?.stop();
      document.body.style.overflow = 'hidden';
      scrollToBottom();
    } else {
      scrollEngine.lenis?.start();
      document.body.style.overflow = '';
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  scrollEngine.lenis?.start();
  document.body.style.overflow = '';
});

interface Message {
  sender: 'user' | 'agent';
  text: string;
}

const messages = ref<Message[]>([
  {
    sender: 'agent',
    text: "Hello! I am Muhammad Ridho Hidayat's portfolio AI agent. I am grounded in his actual projects, evaluation harnesses, and experience. Ask me anything, or tap one of the prompts above.",
  },
]);

function close() {
  
  emit('close');
}

function sendPrompt(text: string) {
  userInput.value = text;
  submitMessage();
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

async function submitMessage() {
  const query = userInput.value.trim();
  if (!query || isTyping.value) return;

  messages.value.push({ sender: 'user', text: query });
  userInput.value = '';
  
  scrollToBottom();

  isTyping.value = true;

  // 1. Direct browser call to Gemini (works without Cloudflare IP geolocation issues)
  if (directGeminiKey) {
    try {
      const candidates = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.5-flash'];
      for (const model of candidates) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${directGeminiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `[SYSTEM INSTRUCTION]\n${PORTFOLIO_SYSTEM_PROMPT}\n\n[USER INQUIRY]\n${query}` }],
              },
            ],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 600,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            messages.value.push({ sender: 'agent', text: reply });
            isTyping.value = false;
            scrollToBottom();
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Direct Gemini API call failed:', err);
    }
  }

  // 2. Cloudflare Worker Proxy
  if (chatApiUrl) {
    try {
      const history = messages.value.slice(0, -1).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          messages.value.push({ sender: 'agent', text: data.reply });
          isTyping.value = false;
          scrollToBottom();
          return;
        }
      } else {
        console.warn('Chat API responded with non-200 status, using fallback.');
      }
    } catch (err) {
      console.warn('Chat API network error, falling back to local grounded knowledge:', err);
    }
  }

  // 2. Seamless local grounded offline fallback
  setTimeout(() => {
    const answer = findAnswer(query);
    messages.value.push({ sender: 'agent', text: answer });
    isTyping.value = false;
    scrollToBottom();
  }, 420);
}

function findAnswer(query: string): string {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  let bestMatch: (typeof knowledge)[0] | null = null;
  let highestScore = 0;

  for (const item of knowledge) {
    let score = 0;
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase().trim();
      // Exact full match
      if (q === lowerKw) {
        score += (item.weight || 2) * 4;
      }
      // Exact single word match
      else if (words.includes(lowerKw)) {
        score += (item.weight || 2) * 2;
      }
      // Substring match for longer keywords (at least 4 chars)
      else if (lowerKw.length >= 4 && q.includes(lowerKw)) {
        score += item.weight || 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return Array.isArray(bestMatch.answer) ? bestMatch.answer.join('\n\n') : String(bestMatch.answer);
  }

  return "I don't have that specific data in my grounded knowledge base yet. Feel free to contact Ridho directly at <a href='mailto:mridhohidayat09@gmail.com' style='color:#00f2fe; text-decoration: underline;'>mridhohidayat09@gmail.com</a> or explore his GitHub at <a href='https://github.com/Ridho-h' target='_blank' style='color:#00f2fe; text-decoration: underline;'>github.com/Ridho-h</a>.";
}

function formatMessage(txt: string): string {
  // Convert markdown bold **text** to strong
  let formatted = txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert markdown italic *text* to em
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Convert inline code `code` to code tag
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
  // Convert markdown links [text](url) to styled anchor
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#00f2fe; text-decoration:underline;">$1</a>');
  // Convert newlines to br
  formatted = formatted.replace(/\n/g, '<br>');
  return formatted;
}
</script>

<style scoped lang="scss">
.chatbot-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overscroll-behavior: contain;
}

.chatbot-modal {
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: rgba(11, 19, 41, 0.95);
  border: 1px solid rgba(0, 242, 254, 0.3);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15);
  overflow: hidden;
  overscroll-behavior: contain;
}

.chatbot-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .titlebar-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .titlebar-title {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .titlebar-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #10b981;
    background: rgba(16, 185, 129, 0.12);
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    transition: all 0.3s ease;

    &--online {
      color: #00f2fe;
      background: rgba(0, 242, 254, 0.15);
      border: 1px solid rgba(0, 242, 254, 0.35);
      box-shadow: 0 0 10px rgba(0, 242, 254, 0.2);
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
      color: #ffffff;
    }
  }
}

.prompt-chips {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  overflow-x: auto;
  background: rgba(3, 7, 18, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.prompt-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 0.35rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #cbd5e1;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 242, 254, 0.15);
    border-color: #00f2fe;
    color: #00f2fe;
  }
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 280px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 254, 0.25);
    border-radius: 3px;
    &:hover {
      background: rgba(0, 242, 254, 0.5);
    }
  }
}

.message-row {
  display: flex;

  &--user {
    justify-content: flex-end;
  }

  &--agent {
    justify-content: flex-start;
  }
}

.message-bubble {
  max-width: 82%;
  padding: 0.85rem 1.15rem;
  border-radius: 12px;
  font-size: 0.92rem;
  line-height: 1.6;

  &--user {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
  }

  &--agent {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    border-bottom-left-radius: 4px;
  }

  .message-sender-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
    opacity: 0.6;
  }

  .message-text {
    word-break: break-word;

    strong {
      color: #f8fafc;
      font-weight: 600;
    }

    em {
      color: #cbd5e1;
      font-style: italic;
    }

    :deep(.chat-inline-code) {
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid rgba(0, 242, 254, 0.2);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.82em;
      color: #38bdf8;
    }
  }
}

.is-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.8rem 1.2rem;

  .typing-dot {
    width: 6px;
    height: 6px;
    background: #00f2fe;
    border-radius: 50%;
    animation: typing-dot 1.2s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing-dot {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 1; }
}

.chatbot-input-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.chatbot-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.65rem 1rem;
  color: #f8fafc;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00f2fe;
  }
}

.send-btn {
  padding: 0.65rem 1rem;
  font-size: 0.78rem;
}
</style>
