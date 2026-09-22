<template>
  <div v-if="isOpen" class="chatbot-backdrop" @click.self="close">
    <div class="glass-panel chatbot-modal">
      <!-- Titlebar -->
      <div class="chatbot-titlebar">
        <div class="titlebar-left">
          <span class="pulse-dot"></span>
          <span class="titlebar-title">AGENT ASSISTANT // MRH-V2</span>
          <span class="titlebar-tag">OFFLINE GROUNDED</span>
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
      <div class="chatbot-messages" ref="messagesContainer">
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
import { ref, nextTick } from 'vue';
import { knowledge } from '../data/knowledge';
import { soundManager } from '../audio/soundManager';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const userInput = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const promptChips = [
  'What is SpotterAI?',
  'SpotterAI accuracy & benchmarks',
  'Multi-agent coding pipeline',
  'Experience at Bank 9 Jambi',
  'Are you open to work?',
];

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
  soundManager.playClick();
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

function submitMessage() {
  const query = userInput.value.trim();
  if (!query || isTyping.value) return;

  messages.value.push({ sender: 'user', text: query });
  userInput.value = '';
  soundManager.playTerminalBeep();
  scrollToBottom();

  isTyping.value = true;

  setTimeout(() => {
    const answer = findAnswer(query);
    messages.value.push({ sender: 'agent', text: answer });
    isTyping.value = false;
    soundManager.playChime(620);
    scrollToBottom();
  }, 450);
}

function findAnswer(query: string): string {
  const q = query.toLowerCase();

  let bestMatch: (typeof knowledge)[0] | null = null;
  let highestScore = 0;

  for (const item of knowledge) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) {
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
  return txt.replace(/\n/g, '<br>');
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
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 280px;
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
