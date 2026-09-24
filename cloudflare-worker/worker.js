/**
 * Cloudflare Worker: Portfolio AI Assistant Proxy for Muhammad Ridho Hidayat
 *
 * Securely proxies chat requests to Google Gemini 1.5 Flash API without exposing
 * your GEMINI_API_KEY to the public frontend.
 *
 * Setup:
 * 1. Create a Worker at https://dash.cloudflare.com/
 * 2. Paste this code into the Worker editor.
 * 3. In Worker Settings -> Variables -> Environment Variables:
 *    Add "GEMINI_API_KEY" as an Encrypted / Secret variable.
 * 4. Deploy and copy your worker URL (e.g. https://mrh-portfolio-agent.workers.dev)
 * 5. Put VITE_CHAT_API_URL=https://mrh-portfolio-agent.workers.dev in your .env
 */

const SYSTEM_PROMPT = `You are the official AI Portfolio Assistant for Muhammad Ridho Hidayat.
Your job is to answer questions from recruiters, fellow engineers, and visitors in a friendly, concise, highly articulate, and technically accurate manner.

LANGUAGE & TONE:
- Adapt dynamically to the user's language: If asked in Indonesian, answer in natural, fluent, professional yet approachable Indonesian. If asked in English, answer in polished, professional English.
- Keep answers concise and readable: 2 to 4 sentences or punchy bullet points. Do not write overwhelming walls of text unless the user specifically asks for deep technical details.
- Be humble, truthful, and grounded. NEVER hallucinate awards, metrics, or experiences that are not listed below.

GROUNDED KNOWLEDGE BASE ABOUT RIDHO:
- Identity: Muhammad Ridho Hidayat, AI/ML Engineer based in Jambi, Indonesia (open to global remote work & relocation).
- Education: Bachelor of Computer Science / Informatics from Universitas Sriwijaya (UNSRI), graduated with a 3.92 / 4.00 GPA (Cum Laude). Thesis compared U-Net, U-Net++, and SegFormer-B0 architectures for chest X-ray lung segmentation.
- Flagship Projects:
  1. SpotterAI: Real-time computer vision fitness & squat coach. Tracks 33 MediaPipe body landmarks at 60 FPS, uses Bi-LSTM with Luong multiplicative attention over 30-frame temporal windows (42ms latency). Calibrated biomechanics rules detect depth (< 105°) and knee valgus (< 0.82x ankle width). Rep-count F1: 100%, form accuracy: 91.7%, with 62 unit tests and zero-lag SQLite logging.
  2. Multimodal Food Agent: Vision + nutrition intelligence system. Pairs local PyTorch EfficientNet-B4 (Food-101, 42ms) with Gemini Vision fallback via calibrated confidence gating (tau = 0.65). Exposes sandboxed tools over FastMCP (Model Context Protocol) with a 3-tier nutrition cascade (USDA FoodData Central, Open Food Facts, offline baseline).
  3. Multi-Agent Coding Assistant: Autonomous software engineering loop (Planner, Coder, Reviewer, Tester) in an isolated Docker sandbox (python:3.12-slim, --network none, memory/CPU caps). Evaluated on 20 graded tasks with 20/20 test cases passed and automated self-repair.
  4. ShopAI: Conversational e-commerce chatbot. ReAct agent over Pinecone vector search with DuckDuckGo web-search fallback, served by Llama-3.3-70B via Groq. Ships with JWT/RBAC auth (admin/customer), LangSmith tracing, LLM-as-a-judge evaluation against a Golden Dataset, per-IP rate limiting, and structured JSON logging.
- Career Milestones (6-Epoch Training Log):
  - Epoch 1 (2021-2025): Universitas Sriwijaya — CS Degree, GPA 3.92 Cum Laude, medical segmentation thesis.
  - Epoch 2 (2024): Samsung Innovation Campus Batch 5 — AI & IoT Semi-Finalist (edge anomaly detection for telemetry).
  - Epoch 3 (2024): Bangkit Academy — Google-led Machine Learning Graduate (900+ hours, NER, GANs, recommendation systems).
  - Epoch 4 (Jun-Jul 2024): Bank Pembangunan Daerah Jambi (Bank 9 Jambi) — IT Support Intern (Excel-based data handling and operational support).
  - Epoch 5 (Jan-Dec 2025): GDG on Campus UNSRI — Machine Learning Member (conducted 4 NLP sessions, built RAG e-commerce demo, Power BI dashboard).
  - Epoch 6 (Jul 2025): Google APAC Solution Challenge — Project "Lungify" Core ML Lead (multimodal respiratory symptom triaging with Gemini 1.5).
- Core Stack:
  - Python (Primary), PyTorch, TensorFlow, MediaPipe, OpenCV, FastMCP, Docker, FastAPI, Pinecone, LangChain, Three.js, Vue 3, TypeScript, SQL.
- Contact Details:
  - Email: mridhohidayat09@gmail.com
  - Phone / WhatsApp: (+62) 822-7771-1104
  - GitHub: github.com/Ridho-h
  - LinkedIn: linkedin.com/in/muhammad-ridho-hidayat
- Hiring Status: Actively open to full-time AI/ML roles, research collaborations, and production engineering contracts.

If asked about something outside Ridho's portfolio or personal life, politely suggest contacting Ridho directly via email at mridhohidayat09@gmail.com.`;

export default {
  async fetch(request, env) {
    // 1. Handle CORS Preflight
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    if (request.method === 'GET') {
      try {
        if (!env.GEMINI_API_KEY) {
          return new Response(JSON.stringify({ status: 'Worker is running, but GEMINI_API_KEY is not set.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
        const listData = await listRes.json();
        return new Response(JSON.stringify({ status: 'ok', models: listData.models?.map(m => m.name) || listData }, null, 2), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Validate API Key
    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Cloudflare Worker environment variables.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body = await request.json();
      const message = body.message?.trim();
      const history = Array.isArray(body.history) ? body.history : [];

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message cannot be empty.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Truncate to avoid malicious token exhaustion
      if (message.length > 2000) {
        return new Response(JSON.stringify({ error: 'Message exceeds character limit (2000).' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Build Gemini conversation contents
      const contents = [];

      for (const item of history.slice(-8)) {
        if (item.role && item.parts && Array.isArray(item.parts)) {
          contents.push({
            role: item.role === 'agent' || item.role === 'model' ? 'model' : 'user',
            parts: item.parts.map((p) => ({ text: String(p.text || '') })),
          });
        }
      }

      // Add current user prompt
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Candidate models based on live Google model catalog
      const candidates = [
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
        'gemini-2.5-pro',
        'gemini-3.5-flash',
      ];

      let reply = null;
      const attemptErrors = [];

      const callModel = async (modelName) => {
        const cleanName = modelName.replace(/^models\//, '');
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanName}:generateContent?key=${env.GEMINI_API_KEY}`;

        // Attempt 1: Standard systemInstruction payload
        try {
          const res1 = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents,
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 600,
              },
            }),
          });

          if (res1.ok) {
            const data = await res1.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
          } else {
            const err1 = await res1.text();
            attemptErrors.push({ model: cleanName, mode: 'systemInstruction', status: res1.status, error: err1 });
          }
        } catch (e) {
          attemptErrors.push({ model: cleanName, mode: 'systemInstruction', error: e.message });
        }

        // Attempt 2: Universal preamble inside user content (100% API schema compatible)
        try {
          const preambleContents = [
            {
              role: 'user',
              parts: [{ text: `[SYSTEM INSTRUCTION]\n${SYSTEM_PROMPT}\n\n[USER INQUIRY]\n${message}` }],
            },
          ];

          const res2 = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: preambleContents,
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 600,
              },
            }),
          });

          if (res2.ok) {
            const data = await res2.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
          } else {
            const err2 = await res2.text();
            attemptErrors.push({ model: cleanName, mode: 'preamble', status: res2.status, error: err2 });
          }
        } catch (e) {
          attemptErrors.push({ model: cleanName, mode: 'preamble', error: e.message });
        }

        return null;
      };

      // 1. Try static candidates in order
      for (const model of candidates) {
        reply = await callModel(model);
        if (reply) break;
      }

      // 2. If candidates fail, query Google dynamically for all models supporting generateContent
      if (!reply) {
        try {
          const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
          if (listRes.ok) {
            const listData = await listRes.json();
            const availableModels = (listData.models || [])
              .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
              .map((m) => m.name);

            for (const m of availableModels) {
              reply = await callModel(m);
              if (reply) break;
            }
          }
        } catch (e) {
          attemptErrors.push({ action: 'listModels', error: e.message });
        }
      }

      if (!reply) {
        return new Response(
          JSON.stringify({
            error: 'All Gemini model candidates failed',
            details: attemptErrors,
          }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || 'Internal Worker Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
