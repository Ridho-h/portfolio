/**
 * Knowledge base for the visitor assistant.
 *
 * Each entry is a topic with weighted keywords and an answer. Matching is
 * keyword-driven and runs entirely in the browser, so the assistant works
 * offline and needs no API key. This ensures sub-millisecond latency, zero
 * token costs, and eliminates the risk of leaking private API keys in client bundles.
 */

export const knowledge = [
  {
    id: 'greetings',
    topic: 'Greetings and pleasantries',
    keywords: ['hi', 'hai', 'hello', 'halo', 'hey', 'hei', 'yo', 'woi', 'oy', 'p', 'tes', 'test', 'siang', 'pagi', 'malam', 'sore', 'assalamualaikum', 'ping', 'greet', 'permisi'],
    weight: 9,
    answer: [
      'Halo! Saya asisten AI portofolio Muhammad Ridho Hidayat.',
      'Ada yang bisa saya bantu tentang proyek flagship Ridho (seperti SpotterAI, Multimodal Food Agent, atau Coding Assistant), keahlian AI/ML, latar belakang pendidikan di UNSRI, atau status ketersediaan kerjanya?',
    ],
    followups: ['Apa itu SpotterAI?', 'Ceritakan tentang Coding Assistant', 'Apakah Ridho open to work?'],
  },
  {
    id: 'identity',
    topic: 'Who is Ridho',
    keywords: ['who', 'ridho', 'name', 'yourself', 'introduce', 'about you', 'bio', 'profile', 'muhammad', 'author'],
    weight: 5,
    answer: [
      "I'm Muhammad Ridho Hidayat — an AI/ML engineer based in Jambi, Indonesia, specializing in autonomous LLM agent systems and real-time computer vision.",
      'I build systems that perceive and act in the physical and digital world: 60 FPS computer vision pipelines with MediaPipe, multi-agent systems communicating via the Model Context Protocol (FastMCP) inside Docker sandboxes, and grounded hybrid RAG architectures.',
      'I hold a B.Sc. in Computer Science / Informatics from Universitas Sriwijaya with a 3.92 / 4.00 GPA (Cum Laude).',
    ],
    followups: ['What are your flagship projects?', 'What is SpotterAI?', 'Are you open to work?'],
  },
  {
    id: 'focus',
    topic: 'What he works on',
    keywords: ['what do you do', 'specialis', 'specialty', 'focus', 'domain', 'expertise', 'field', 'work on', 'interest', 'area', 'capable', 'capability', 'capabilities', 'ability', 'abilities', 'bisa apa', 'kemampuan', 'keahlian'],
    weight: 4,
    answer: [
          'My work centers on three primary pillars:',
          '1. Real-Time Computer Vision & Biomechanics: 60 FPS landmark extraction (MediaPipe) and temporal sequence modeling (Bi-LSTM + Attention) for kinematics analysis.',
          '2. Autonomous Agentic Systems: Multi-agent DAG loops (Planner, Coder, Reviewer, Tester) and FastMCP tool servers running inside isolated Docker sandboxes.',
          '3. Grounded Retrieval (RAG): Production vector search with Pinecone, ReAct agent tool calling for real-time inventory and pricing verification, eliminating hallucinated products.',
          'Verification is my core engineering standard: every system includes automated benchmark harnesses, unit test suites, and quantitative telemetry.',
        ],
        followups: ['Tell me about SpotterAI', 'What is FastMCP?', 'How do you evaluate RAG?'],
      },
      {
        id: 'chatbot-tech',
        topic: 'How this chatbot works & Gemini API',
    keywords: ['gemini', 'gemini api', 'api', 'how do you work', 'are you an llm', 'real llm', 'is this ai', 'use gemini', 'using gemini', 'gpt', 'model', 'offline', 'bot'],
    weight: 7,
    answer: [
      "I run 100% locally in your browser using an offline, deterministic keyword-scoring retrieval engine grounded in Ridho's verified project and career data.",
      "I do NOT make live calls to the Google Gemini API. This is intentional: this portfolio is hosted statically on GitHub Pages. If client-side JavaScript contacted the Gemini API directly, Ridho's secret API key would be exposed to the public in the browser network tab.",
      "Running offline ensures instant zero-latency responses, 100% factual accuracy with zero hallucinations, zero security vulnerability, and zero token costs. Ridho does, however, use Gemini Vision and Gemini 1.5 in his project backends (like the Multimodal Food Agent and Lungify).",
    ],
    followups: ['Tell me about the Multimodal Food Agent', 'What are your flagship projects?', 'Are you open to work?'],
  },
  {
    id: 'spotterai',
    topic: 'SpotterAI',
    keywords: ['spotter', 'spotterai', 'fitness', 'workout', 'pose', 'squat', 'curl', 'gym', 'exercise', 'biomechanic', 'form', 'rep', 'kinematics', 'mediapipe', 'landmark'],
    weight: 6,
    answer: [
      'SpotterAI is a real-time computer vision fitness and squat form coach.',
      'The pipeline captures raw webcam video at 60 FPS, extracts 33 skeletal body landmarks per frame using MediaPipe, and feeds a Bidirectional LSTM with Luong multiplicative attention over 30-frame temporal sliding windows (42ms latency).',
      'A calibrated biomechanics rule engine verifies form against joint angle thresholds — detecting shallow squat depth (< 105°), knee valgus (< 0.82× ankle width), and lockout issues, logging every repetition to SQLite with audio/visual HUD feedback.',
    ],
    followups: ['How accurate is SpotterAI?', 'What model does SpotterAI use?', 'What is the tech stack?'],
  },
  {
    id: 'spotterai-metrics',
    topic: 'SpotterAI accuracy & benchmarks',
    keywords: ['accuracy', 'accurate', 'benchmark', 'metric', 'f1', 'precision', 'recall', 'score', 'performance', 'evaluation', 'result', 'number', '100', '91.7'],
    weight: 5,
    answer: [
      'SpotterAI is evaluated through a dedicated benchmark harness against ground-truth labels:',
      '• Rep counting F1 score: 100.0%\n• Form fault detection accuracy: 91.7%\n• Inference latency: 42ms\n• Tracking throughput: 60 FPS real-time\n• Quality assurance: 62 unit tests across model, pose, tracker, and database modules.',
    ],
    followups: ['What model does SpotterAI use?', 'What is the tech stack?'],
  },
  {
    id: 'spotterai-model',
    topic: 'SpotterAI model architecture',
    keywords: ['model', 'architecture', 'lstm', 'attention', 'luong', 'neural', 'network', 'classifier', 'tensorflow', 'train', 'training', 'bilstm', 'bidirectional'],
    weight: 5,
    answer: [
      'SpotterAI uses a temporal sequence classifier over skeletal landmarks: (batch, 30 frames, 132 keypoint coordinates).',
      'It feeds a Bidirectional LSTM with 256 hidden units (return_sequences=True), followed by a Luong multiplicative attention layer, Flatten → Dense(512, ReLU) → Dropout(0.5) → Dense(3, softmax) for exercise phase classification.',
      'Inference takes only 42ms on standard CPU hardware.',
    ],
    followups: ['How accurate is SpotterAI?', 'What other projects do you have?'],
  },
  {
    id: 'food-agent',
    topic: 'Multimodal Food Agent',
    keywords: ['food', 'nutrition', 'calorie', 'diet', 'recipe', 'dish', 'usda', 'efficientnet', 'gradio', 'eat', 'meal', 'multimodal', 'fastmcp'],
    weight: 6,
    answer: [
      'The Multimodal Food Agent pairs an on-device PyTorch EfficientNet-B4 (Food-101) classifier with Gemini Vision via calibrated confidence gating (tau = 0.65).',
      'When local confidence is >= 0.65, classification completes in 42ms on-device. If confidence drops below threshold, it falls back to Gemini Vision for rare or composite dishes.',
      'Nutritional breakdowns are retrieved across a 3-tier cascade (USDA FoodData Central with 300k+ foods, Open Food Facts with 3M+ items, and offline fallback tables) exposed over FastMCP (Model Context Protocol).',
    ],
    followups: ['What is FastMCP?', 'Tell me about the Multi-Agent Coding Assistant'],
  },
  {
    id: 'coding-agent',
    topic: 'Multi-Agent Coding Assistant',
    keywords: ['coding', 'code', 'agent', 'multi-agent', 'planner', 'coder', 'reviewer', 'tester', 'sandbox', 'generate', 'programming', 'automation', 'write code', 'docker'],
    weight: 6,
    answer: [
      'The Multi-Agent Coding Assistant turns natural language specifications into working, verified Python software.',
      'It orchestrates four cooperating subagents in a DAG loop: Planner (decomposes requirements into atomic tasks), Coder (synthesizes type-annotated code and unit tests), Reviewer (validates AST syntax and safety), and Tester (runs tests in an ephemeral Docker sandbox).',
      'The sandbox runs python:3.12-slim with --network none and strict memory/CPU limits, preventing any host pollution. Tested across a 20-task benchmark with a 20/20 (100%) test pass rate and automated self-correction.',
    ],
    followups: ['What is MCP?', 'What other projects do you have?'],
  },
  {
    id: 'shopai',
    topic: 'ShopAI e-commerce RAG Chatbot',
    keywords: ['shopai', 'rag', 'retrieval', 'ecommerce', 'e-commerce', 'chatbot', 'pinecone', 'react', 'groq', 'shopping', 'product search', 'vector'],
    weight: 6,
    answer: [
      'ShopAI is a production-grade conversational e-commerce RAG chatbot.',
      'It runs a ReAct agent over Pinecone vector search of the product catalogue with DuckDuckGo as a web-search fallback, served by Llama-3.3-70B via the Groq API.',
      'Every response is grounded in real catalogue data — the agent calls tools to verify stock and pricing, eliminating hallucinated products. The stack ships with JWT/RBAC auth (customer/admin roles), LangSmith tracing, LLM-as-a-judge evaluation, per-IP rate limiting, and structured JSON logging.',
    ],
    followups: ['How do you evaluate RAG?', 'What is your tech stack?'],
  },
  {
    id: 'mcp',
    topic: 'Model Context Protocol (MCP)',
    keywords: ['mcp', 'fastmcp', 'model context protocol', 'tool', 'tool calling', 'server', 'protocol', 'interop'],
    weight: 5,
    answer: [
      'Model Context Protocol (MCP) is an open standard that decouples AI models from tool execution environments.',
      'In the Multimodal Food Agent, vision and USDA nutrition services are encapsulated into independent FastMCP servers.',
      'In the Multi-Agent Coding Assistant, the Docker sandbox executor is exposed via MCP, allowing any MCP client (such as Claude Desktop, Cursor, or another agent) to leverage the exact same secure execution sandbox without changes.',
    ],
    followups: ['Tell me about the coding assistant', 'What are your flagship projects?'],
  },
  {
    id: 'skills',
    topic: 'Skills & Latent Space Galaxy',
    keywords: ['skill', 'skills', 'tech', 'stack', 'technology', 'technologies', 'tool', 'tools', 'language', 'framework', 'know', 'proficient', 'competenc', 'galaxy', 'latent'],
    weight: 4,
    answer: [
      'My technical competencies are structured across 6 core neural clusters in the 3D Latent Space Galaxy:',
      '• LLM & Agentic Systems: FastMCP, LangChain, ReAct, RAG, Prompt Engineering, LangSmith.',
      '• Computer Vision & Multimodal: MediaPipe, OpenCV, SegFormer, EfficientNet-B4, Pose Estimation.',
      '• Deep Learning & Frameworks: PyTorch, TensorFlow, Attention Mechanisms, Bi-LSTM, Transfer Learning.',
      '• Production & MLOps: FastAPI, Docker, Async Queues, Pytest, CI/CD, SQLite.',
      '• Languages & Core CS: Python (Primary), SQL, TypeScript/JavaScript, C++, Algorithms & Data Structures.',
      '• Data & Tools: Pandas, NumPy, Pinecone, Power BI, Git.',
    ],
    followups: ['Do you know PyTorch?', 'What about Docker?', 'Tell me about SpotterAI'],
  },
  {
    id: 'python',
    topic: 'Python',
    keywords: ['python', 'py', 'pandas', 'numpy'],
    weight: 3,
    answer: [
      'Python is my primary engineering language. Every flagship system is built in Python (3.10–3.12), leveraging type hints, async/await concurrency, pytest test harnesses, and packaging with pyproject.toml and Ruff.',
    ],
    followups: ['What is your tech stack?', 'Tell me about SpotterAI'],
  },
  {
    id: 'docker',
    topic: 'Docker',
    keywords: ['docker', 'container', 'compose', 'deployment', 'deploy', 'devops', 'production', 'sandbox'],
    weight: 3,
    answer: [
      'Docker is standard across my projects: SpotterAI uses multi-stage production builds, the Food Agent and ShopAI deploy with docker-compose, and the Multi-Agent Coding Assistant executes untrusted code in an ephemeral python:3.12-slim container with --network none and hard CPU/memory limits.',
    ],
    followups: ['Tell me about the coding assistant', 'What is MCP?'],
  },
  {
    id: 'evaluation',
    topic: 'Evaluation philosophy',
    keywords: ['evaluate', 'evaluation', 'how do you test', 'measure', 'quality', 'hallucination', 'grounded', 'reliable', 'trust', 'verify'],
    weight: 4,
    answer: [
      'I treat evaluation as a first-class engineering discipline, not an afterthought.',
      'SpotterAI runs a 60-rep ground-truth benchmark and 62 unit tests. The Coding Assistant evaluates 20 graded coding tasks with automated test execution. ShopAI uses LangSmith LLM-as-a-judge evaluation against a curated Golden Dataset, and the Food Agent uses calibrated confidence gating (tau = 0.65) to avoid guessing on low-confidence inputs.',
    ],
    followups: ['How accurate is SpotterAI?', 'Tell me about ShopAI'],
  },
  {
    id: 'education',
    topic: 'Education',
    keywords: ['education', 'university', 'universitas', 'sriwijaya', 'unsri', 'degree', 'bachelor', 'study', 'studied', 'graduat', 'thesis', 'campus', 'college', 's1', 'sarjana', 'gpa', 'grade', 'distinction', 'cum laude'],
    weight: 5,
    answer: [
      'I graduated with a Bachelor of Computer Science / Informatics from Universitas Sriwijaya (GPA 3.92 / 4.00, Cum Laude).',
      'My undergraduate thesis focused on deep learning for medical imaging: a comparative study evaluating U-Net, U-Net++, and SegFormer-B0 architectures for chest X-ray lung segmentation.',
    ],
    followups: ['What is Bangkit Academy?', 'What about Samsung Innovation Campus?'],
  },
  {
    id: 'bangkit',
    topic: 'Bangkit Academy',
    keywords: ['bangkit', 'academy', 'google', 'goto', 'tokopedia', 'gojek', 'traveloka', 'cohort', 'bootcamp', 'scholarship', 'certificate'],
    weight: 5,
    answer: [
      'I graduated from Bangkit Academy 2024 in the Machine Learning Cohort, led by Google, Tokopedia, Gojek, and Traveloka.',
      'Completed 900+ curriculum hours covering computer vision, cloud engineering, Named Entity Recognition (NER), recommendation systems, and TensorFlow production pipelines.',
    ],
    followups: ['What is your education?', 'What about Samsung Innovation Campus?'],
  },
  {
    id: 'sic',
    topic: 'Samsung Innovation Campus',
    keywords: ['samsung', 'innovation campus', 'sic', 'semi-finalist', 'semifinalist', 'finalist', 'competition', 'award', 'iot'],
    weight: 5,
    answer: [
      'I was an AI & IoT Semi-Finalist in Samsung Innovation Campus Batch 5 (2024).',
      'Engineered an edge-compatible machine learning anomaly detection pipeline for IoT sensor telemetry with strict latency and memory constraints.',
    ],
    followups: ['What is your education?', 'What is Bangkit Academy?'],
  },
  {
    id: 'bank9',
    topic: 'Bank Pembangunan Daerah Jambi internship',
    keywords: ['bank', 'jambi', 'intern', 'internship', 'work experience', 'job', 'worked', 'industry', 'enterprise', 'it support', 'sql'],
    weight: 5,
    answer: [
      'I served as an IT Support Intern at Bank Pembangunan Daerah Jambi (Bank 9 Jambi) from June to July 2024.',
      'My work focused on processing and maintaining operational datasets in Microsoft Excel and supporting the IT department with routine operational and technical tasks.',
    ],
    followups: ['What is your education?', 'Do you have industry experience?'],
  },
  {
    id: 'gdg',
    topic: 'GDG on Campus UNSRI',
    keywords: ['gdg', 'google developer', 'community', 'mentor', 'volunteer', 'workshop', 'speaker', 'leadership'],
    weight: 4,
    answer: [
      'I served as a Machine Learning Member at Google Developer Group on Campus UNSRI (Jan – Dec 2025).',
      'Conducted 4 structured learning sessions on Natural Language Processing, built a Retrieval-Augmented Generation e-commerce demo, and developed a bicycle sales tracking dashboard in Microsoft Power BI.',
    ],
    followups: ['What is your education?', 'Tell me about ShopAI'],
  },
  {
    id: 'apac-challenge',
    topic: 'Google APAC Solution Challenge',
    keywords: ['lungify', 'apac', 'solution challenge', 'google apac', 'respiratory', 'mobile app', 'symptom', 'hackathon'],
    weight: 5,
    answer: [
      'In the Google APAC Solution Challenge 2025, I served as Core ML Lead for project "Lungify" — an AI-powered respiratory diagnosis and multimodal symptom analysis engine powered by Google Gemini 1.5, shipped in a 2-week sprint.',
    ],
    followups: ['Tell me about the Multimodal Food Agent', 'What other projects do you have?'],
  },
  {
    id: 'experience',
    topic: 'Career journey & Training Epochs',
    keywords: ['experience', 'journey', 'career', 'background', 'history', 'timeline', 'years', 'milestone', 'epoch', 'training log'],
    weight: 4,
    answer: [
      'My career progression is documented as a 6-Epoch Training Log in the portfolio:',
      '• Epoch 1 (2021–2025): Universitas Sriwijaya — B.Sc. in CS, GPA 3.92 Cum Laude, medical segmentation thesis.',
      '• Epoch 2 (2024): Samsung Innovation Campus Batch 5 — AI & IoT Semi-Finalist.',
      '• Epoch 3 (2024): Bangkit Academy — Google-led Machine Learning Graduate.',
      '• Epoch 4 (Jun–Jul 2024): Bank Pembangunan Daerah Jambi (Bank 9 Jambi) — IT Support Intern.',
      '• Epoch 5 (Jan–Dec 2025): GDG on Campus UNSRI — Machine Learning Member (4 NLP sessions, RAG demo).',
      '• Epoch 6 (Jul 2025): Google APAC Solution Challenge — Lungify Multimodal Healthcare Lead.',
    ],
    followups: ['What is SpotterAI?', 'What is your education?', 'Are you open to work?'],
  },
  {
    id: 'projects-overview',
    topic: 'Flagship projects',
    keywords: ['project', 'projects', 'portfolio', 'built', 'showcase', 'flagship', 'best work', 'show me'],
    weight: 5,
    answer: [
      'My 4 primary flagship projects featured in this portfolio are:',
      '1. SpotterAI: Real-time computer vision fitness & squat coach (MediaPipe + Bi-LSTM Attention, 42ms, 60 FPS, 100% Rep F1).',
      '2. Multimodal Food Agent: Vision + nutrition intelligence via FastMCP with confidence-gated routing (EfficientNet-B4 + Gemini Vision).',
      '3. Multi-Agent Coding Assistant: Autonomous software engineering loop (Planner/Coder/Reviewer/Tester) inside isolated Docker sandboxes (20/20 tests passed).',
      '4. ShopAI: Conversational e-commerce chatbot with ReAct tool calling over Pinecone + DuckDuckGo, served by Llama-3.3-70B via Groq, with JWT/RBAC and LangSmith tracing.',
    ],
    followups: ['What is SpotterAI?', 'Tell me about the coding assistant', 'Tell me about ShopAI'],
  },
  {
    id: 'hiring',
    topic: 'Availability & hiring',
    keywords: ['hire', 'hiring', 'open to work', 'available', 'availability', 'opportunity', 'job', 'role', 'recruit', 'freelance', 'collaborat', 'work together', 'contract'],
    weight: 5,
    answer: [
      'Yes! I am actively open to full-time AI/ML Engineering roles, research collaborations, and production system development.',
      'I specialize in LLM agent architectures, real-time computer vision, and grounded RAG pipelines.',
      'Reach out directly at mridhohidayat09@gmail.com or via LinkedIn at linkedin.com/in/muhammad-ridho-hidayat.',
    ],
    followups: ['How can I contact you?', 'What are your flagship projects?'],
  },
  {
    id: 'contact',
    topic: 'Contact details',
    keywords: ['contact', 'email', 'mail', 'reach', 'touch', 'linkedin', 'github', 'social', 'connect', 'message', 'phone', 'call', 'whatsapp'],
    weight: 5,
    answer: [
      'Contact channels for Muhammad Ridho Hidayat:',
      '• Email: mridhohidayat09@gmail.com (one-click copy button available in the footer)',
      '• Phone: (+62) 822-7771-1104',
      '• GitHub: github.com/Ridho-h',
      '• LinkedIn: linkedin.com/in/muhammad-ridho-hidayat',
    ],
    followups: ['Are you open to work?', 'What are your flagship projects?'],
  },
  {
    id: 'location',
    topic: 'Location',
    keywords: ['where', 'location', 'based', 'live', 'city', 'country', 'indonesia', 'jambi', 'timezone', 'remote', 'relocate'],
    weight: 3,
    answer: [
      'I am based in Jambi, Indonesia (UTC+7). I am fully equipped for remote roles globally and open to relocation for compelling full-time positions. I work professionally in English and native Indonesian.',
    ],
    followups: ['Are you open to work?', 'How can I contact you?'],
  },
  {
    id: 'website',
    topic: 'This website architecture',
    keywords: ['website', 'site', 'this site', 'design', 'ui', 'how was this', 'built this', 'vite', 'vue', 'theme', 'stack'],
    weight: 4,
    answer: [
      'This portfolio ("The Model Awakens") is built from scratch as an interactive cybernetic neural system:',
      '• Frontend: Vue 3 (Composition API), Vite, TypeScript, and SCSS.',
      '• 3D Visuals: Three.js rendering an interactive 6-cluster Latent Space Embedding Galaxy with PCA projection and orbit controls.',
      '• Motion: GSAP ScrollTrigger paired with Lenis virtual smooth scrolling for cinematic stage pacing.',
      '• Grounded Assistant: 100% client-side offline keyword-retrieval engine ensuring zero API key exposure and sub-millisecond responses.',
    ],
    followups: ['How does this chatbot work?', 'What is your tech stack?'],
  },
];

/** Starter chips shown before the visitor types anything. */
export const suggestions = [
  'What is SpotterAI?',
  'SpotterAI benchmarks',
  'Multi-agent coding pipeline',
  'Experience at Bank 9 Jambi',
  'Are you open to work?',
  'Do you use the Gemini API?',
];

/** Shown once, before the first question. */
export const greeting =
  "Hello! I am Muhammad Ridho Hidayat's portfolio AI agent. I am grounded in his actual projects, evaluation harnesses, and experience. Ask me anything, or tap one of the prompts above.";

/** Returned when nothing scores above the match threshold. */
export const fallback = [
  "I don't have that specific data in my grounded knowledge base yet.",
  'Try asking about SpotterAI, the Multimodal Food Agent, the Multi-Agent Coding Assistant, ShopAI, his skills, his education, or how to get in touch.',
];

export const PORTFOLIO_SYSTEM_PROMPT = `You are the official AI Portfolio Assistant for Muhammad Ridho Hidayat.
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

export default knowledge;
