export interface ProjectArchitecture {
  id: string;
  name: string;
  codename: string;
  tagline: string;
  accentColor: string;
  hexColor: number;
  category: string;
  status: string;
  repo: string;
  previewImage?: string;
  diffusionPrompt: string;
  denoiseSteps: string[];
  metrics: [string, string][];
  summary: string;
  architectureHighlight: string;
  pipeline: {
    step: string;
    title: string;
    desc: string;
  }[];
  stack: string[];
}

export const projectsData: ProjectArchitecture[] = [
  {
    id: 'spotterai',
    name: 'SpotterAI',
    codename: 'PROJECT // KINEMATICS-01',
    tagline: 'Real-Time Biomechanics & Squat Form Coach',
    accentColor: '#10b981',
    hexColor: 0x10b981,
    category: 'Computer Vision & Biomechanics',
    status: 'PRODUCTION READY',
    repo: 'https://github.com/Ridho-h/SpotterAI',
    diffusionPrompt: 'real-time biomechanics coach, 33 skeletal body landmarks, MediaPipe pose estimation, 60fps HUD overlay, dark obsidian lab',
    denoiseSteps: [
      '> sampling latent prior (seed: 42091)...',
      '> extracting 33 temporal joint coordinates...',
      '> validating Bi-LSTM attention weights across 30 frames...',
      '> denoise complete: 50/50 steps [42ms latency]',
    ],
    metrics: [
      ['100%', 'Rep-Count F1'],
      ['91.7%', 'Form Accuracy'],
      ['42ms', 'Inference Latency'],
      ['60 FPS', 'Real-Time Pose Tracking'],
    ],
    summary: 'Webcam-driven computer vision coach that tracks 33 MediaPipe body landmarks, classifies exercise phases via Bi-LSTM attention over 30-frame temporal windows, and evaluates joint angles against calibrated biomechanical thresholds in real time.',
    architectureHighlight: 'Luong multiplicative attention layer over bidirectional LSTM units with zero-lag SQLite session logging.',
    pipeline: [
      { step: '01', title: 'Video Ingestion', desc: 'Raw webcam frame capture at 60 FPS with circular buffer management.' },
      { step: '02', title: 'Skeletal Extraction', desc: 'MediaPipe extracts 33 (x, y, z, visibility) coordinates per frame.' },
      { step: '03', title: 'Attention Bi-LSTM', desc: 'Bidirectional LSTM (256 units) classifies motion phases across 30-frame sliding windows.' },
      { step: '04', title: 'Form Verification', desc: 'Calculates knee valgus angle (< 0.82× ankle) and hip depth (< 105°) with immediate audio/visual feedback.' },
    ],
    stack: ['Python', 'MediaPipe', 'TensorFlow', 'OpenCV', 'SQLite', 'NumPy'],
  },
  {
    id: 'food-agent',
    name: 'Multimodal Food Agent',
    codename: 'PROJECT // FAST-MCP-02',
    tagline: 'Vision + Nutrition FastMCP System with Calibrated Gating',
    accentColor: '#00f2fe',
    hexColor: 0x00f2fe,
    category: 'Autonomous Agents & Multimodal AI',
    status: 'DEPLOYED & EVALUATED',
    repo: 'https://github.com/Ridho-h/Multimodal-Food-Agent',
    diffusionPrompt: 'multimodal nutritional analysis agent, EfficientNet-B4 Food-101 vision classifier, FastMCP sandboxed protocol, high precision telemetry',
    denoiseSteps: [
      '> sampling multimodal latent embeddings...',
      '> evaluating EfficientNet-B4 confidence threshold (tau = 0.65)...',
      '> dispatching FastMCP tool query to nutrition database...',
      '> denoise complete: 50/50 steps [120ms total pipeline]',
    ],
    metrics: [
      ['90.9%', 'Classification Acc'],
      ['42ms', 'Local Vision Latency'],
      ['100%', 'FastMCP Schema Pass'],
      ['3 Tiers', 'Calibrated Gating'],
    ],
    summary: 'High-speed nutrition intelligence system pairing an on-device EfficientNet-B4 Food-101 classifier with Gemini vision via calibrated confidence gating. Exposes sandboxed tools over the Model Context Protocol (MCP).',
    architectureHighlight: 'Confidence-gated routing: runs local EfficientNet-B4 when confidence >= 0.65 (42ms), falling back to Gemini Vision only for rare/complex dishes.',
    pipeline: [
      { step: '01', title: 'Frame Ingestion', desc: 'Input food imagery preprocessed and normalized to 380x380.' },
      { step: '02', title: 'Local Inference', desc: 'PyTorch EfficientNet-B4 classifies across 101 food classes in 42ms.' },
      { step: '03', title: 'Confidence Gating', desc: 'If top-1 softmax prob < 0.65, triggers Gemini 1.5 multimodal API fallback.' },
      { step: '04', title: 'FastMCP Dispatch', desc: 'Formats USDA nutritional breakdown into standard Model Context Protocol schema.' },
    ],
    stack: ['PyTorch', 'FastMCP', 'Gemini Vision', 'FastAPI', 'EfficientNet', 'Docker'],
  },
  {
    id: 'coding-agent',
    name: 'Multi-Agent Coding Assistant',
    codename: 'PROJECT // MULTI-AGENT-03',
    tagline: 'Autonomous Architecture Planner, Code Gen & Verifier Loop',
    accentColor: '#a855f7',
    hexColor: 0xa855f7,
    category: 'Agentic Workflow & Code Verification',
    status: 'BENCHMARKED (20/20)',
    repo: 'https://github.com/Ridho-h/Multi-Agent-Coding-Assistant',
    diffusionPrompt: 'autonomous multi-agent coding system, planner coder reviewer tester DAG loop, docker execution sandbox, terminal logs',
    denoiseSteps: [
      '> initializing multi-agent DAG orchestrator...',
      '> Planner decomposing requirements into typed tasks...',
      '> Reviewer validating AST & Tester executing in Docker sandbox...',
      '> denoise complete: 50/50 steps [20/20 test cases passing]',
    ],
    metrics: [
      ['20 / 20', 'Benchmark Tests Passed'],
      ['100%', 'Syntactic Validity'],
      ['Bounded', 'Max 3 Auto-Retries'],
      ['Zero', 'Host Pollution (Docker)'],
    ],
    summary: 'Autonomous software engineering agent loop orchestrating Planner, Coder, Reviewer, and Tester subagents. Executes all code inside isolated Docker containers with automated test-driven self-correction.',
    architectureHighlight: 'Strict multi-agent DAG loop where failed unit tests trigger automatic review reflections and targeted patches without polluting the host.',
    pipeline: [
      { step: '01', title: 'Task Planning', desc: 'Planner agent breaks specifications into atomic modular implementation steps.' },
      { step: '02', title: 'Code Synthesis', desc: 'Coder agent writes strict type-annotated code and comprehensive pytest suites.' },
      { step: '03', title: 'Security Review', desc: 'Reviewer agent checks AST syntax and flags unsafe system invocations.' },
      { step: '04', title: 'Docker Execution', desc: 'Ephemeral Docker container runs pytest suite; outputs stack traces for self-repair.' },
    ],
    stack: ['Python', 'Docker SDK', 'LangChain', 'FastAPI', 'Pytest', 'AST Parsing'],
  },
  {
    id: 'shopai',
    name: 'ShopAI',
    codename: 'PROJECT // RAG-CHATBOT-04',
    tagline: 'E-Commerce RAG Chatbot with ReAct Tool Calling',
    accentColor: '#f59e0b',
    hexColor: 0xf59e0b,
    category: 'Conversational Commerce & RAG',
    status: 'PRODUCTION PROTOTYPE',
    repo: 'https://github.com/Ridho-h/Chatbot-RAG-ECommerce',
    diffusionPrompt: 'enterprise conversational e-commerce RAG, Pinecone vector search, Groq LLM, DuckDuckGo web fallback, React frontend',
    denoiseSteps: [
      '> parsing customer intent with query rewrite...',
      '> querying Pinecone vector index for product matches...',
      '> invoking ReAct tools (search_web, check_inventory)...',
      '> denoise complete: 50/50 steps [response generated]',
    ],
    metrics: [
      ['ReAct', 'Agent Tool Calling'],
      ['JWT', 'RBAC Auth (admin/customer)'],
      ['LangSmith', 'LLM-as-Judge Eval'],
      ['100%', 'Free-Tier Stack'],
    ],
    summary: 'Conversational e-commerce chatbot that combines Pinecone vector search over a product catalogue with live DuckDuckGo web search, served by Llama-3.3-70B via Groq. ReAct agent tool calling grounds every response in real inventory and price data, eliminating hallucinated products.',
    architectureHighlight: 'ReAct agent loop over Groq-hosted Llama-3.3 with per-IP rate limiting, TTL session memory, and structured JSON logging. JWT/RBAC with admin and customer roles, plus an admin dashboard for metrics and re-ingestion.',
    pipeline: [
      { step: '01', title: 'Intent Classification', desc: 'ReAct agent interprets the user query and decides which tools to invoke.' },
      { step: '02', title: 'Pinecone Retrieval', desc: 'Dense vector search over the ingested product catalogue returns top-k matches.' },
      { step: '03', title: 'Web Fallback', desc: 'If catalogue coverage is low, the agent calls DuckDuckGo to enrich the answer.' },
      { step: '04', title: 'Grounded Response', desc: 'LLM composes the final answer citing only retrieved products and verified prices.' },
    ],
    stack: ['Python', 'FastAPI', 'Pinecone', 'LangChain', 'Groq (Llama-3.3-70B)', 'React', 'LangSmith', 'Docker'],
  },
];
