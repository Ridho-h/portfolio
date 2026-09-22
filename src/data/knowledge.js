/**
 * Knowledge base for the visitor assistant.
 *
 * Each entry is a topic with weighted keywords and an answer. Matching is
 * keyword-driven and runs entirely in the browser, so the assistant works
 * offline and needs no API key. Set VITE_CHAT_API_URL to upgrade it to a real
 * LLM endpoint — see src/modules/chatbot.js.
 */

export const knowledge = [
  {
    id: 'identity',
    topic: 'Who is Ridho',
    keywords: ['who', 'ridho', 'name', 'yourself', 'introduce', 'about you', 'bio', 'profile', 'muhammad'],
    weight: 4,
    answer: [
      "I'm Muhammad Ridho Hidayat — an AI/ML engineer based in Jambi, Indonesia, specialising in LLM agent systems and computer vision.",
      'I build systems that perceive and act in the real world: real-time computer vision, autonomous agents that call tools through the Model Context Protocol, and retrieval pipelines grounded in verifiable data. My day-to-day stack is Python, PyTorch, TensorFlow and MediaPipe, with FastAPI, MCP and Docker around the edges.',
      'I graduated in Informatics Engineering from Universitas Sriwijaya with a 3.92 / 4.00 GPA, with distinction.',
    ],
    followups: ['What are your flagship projects?', 'What is SpotterAI?', 'Are you open to work?'],
  },
  {
    id: 'focus',
    topic: 'What he works on',
    keywords: ['what do you do', 'specialis', 'specialty', 'focus', 'domain', 'expertise', 'field', 'work on', 'interest', 'area'],
    weight: 3,
    answer: [
      'Three areas, mostly. First, real-time computer vision — pose estimation and biomechanics that have to run live on a webcam. Second, agentic AI — multi-agent loops with tools exposed over Model Context Protocol, executed in sandboxes. Third, retrieval-augmented generation, where the hard part is evaluation rather than generation.',
      'The common thread is verification. Every project has a benchmark harness attached to it, because a model without numbers is just a demo.',
    ],
    followups: ['Tell me about SpotterAI', 'What MCP work have you done?', 'How do you evaluate RAG?'],
  },
  {
    id: 'spotterai',
    topic: 'SpotterAI',
    keywords: ['spotter', 'spotterai', 'fitness', 'workout', 'pose', 'squat', 'curl', 'gym', 'exercise', 'biomechanic', 'form', 'rep', 'kinematics', 'mediapipe', 'landmark'],
    weight: 6,
    answer: [
      'SpotterAI is a real-time AI fitness coach — my flagship project. It takes an ordinary webcam feed and turns it into a biomechanics coach.',
      'The pipeline: MediaPipe extracts 33 body landmarks per frame, a Bidirectional LSTM with Luong attention classifies the movement (squat, bicep curl, overhead press) across a 30-frame window, and a rule engine judges form against calibrated joint-angle thresholds — flagging shallow depth, knee valgus, incomplete extension and lumbar hyperextension. The skeleton renders green on good form and red/amber on a fault, with banner cues like "SQUAT DEEPER".',
      'Every rep is written to SQLite with its angles and fault tags. That log feeds a grounded post-session debrief and a chat assistant that answers questions about your own workout history.',
    ],
    followups: ['How accurate is SpotterAI?', 'What model does SpotterAI use?', 'What is the tech stack?'],
  },
  {
    id: 'spotterai-metrics',
    topic: 'SpotterAI accuracy',
    keywords: ['accuracy', 'accurate', 'benchmark', 'metric', 'f1', 'precision', 'recall', 'score', 'performance', 'evaluation', 'result', 'number', '100', '91.7'],
    weight: 5,
    answer: [
      'SpotterAI ships an evaluation harness (spotter/evaluation.py) that runs 60 synthetically calibrated movement cycles against ground-truth labels:',
      '• Rep counting precision — 100.0% (target 90%)\n• Rep counting recall — 100.0% (target 90%)\n• Rep counting F1 — 100.0% (target 90%)\n• Form fault detection accuracy — 91.7% (target 85%)',
      'Per exercise: squat 25/25 reps at 100% form accuracy, overhead press 15/15 at 100%, bicep curl 20/20 reps but 75% form accuracy — curls are the weak spot, mostly on incomplete extension at the bottom of the movement.',
      'Fault sensitivity is 100% across all five rules: incomplete depth, knees caving in, incomplete curl, incomplete extension and incomplete lockout.',
    ],
    followups: ['What is SpotterAI?', 'How is it tested?', 'What model does SpotterAI use?'],
  },
  {
    id: 'spotterai-model',
    topic: 'SpotterAI model architecture',
    keywords: ['model', 'architecture', 'lstm', 'attention', 'luong', 'neural', 'network', 'classifier', 'tensorflow', 'train', 'training', 'bilstm', 'bidirectional'],
    weight: 5,
    answer: [
      'The activity classifier is a temporal sequence model over skeletal landmarks. Input is (batch, 30 frames, 132 keypoint coordinates), feeding a Bidirectional LSTM with 256 hidden units and return_sequences=True, then a Luong multiplicative attention layer, then Flatten → Dense(512, ReLU) → Dropout(0.5) → Dense(3, softmax) for curl / press / squat.',
      'Trained weights live in models/LSTM_Attention.h5 and are downloaded from GitHub Releases rather than committed — the app falls back to mock and random weights so the UI, tests and benchmarks still run without them.',
    ],
    followups: ['How accurate is SpotterAI?', 'What is the tech stack?'],
  },
  {
    id: 'spotterai-testing',
    topic: 'SpotterAI testing',
    keywords: ['test', 'testing', 'pytest', 'unit test', 'ci', 'quality', 'coverage', '62'],
    weight: 4,
    answer: [
      '62 unit tests across model, pose, tracker, database, coach and evaluation — run with pytest, configured in pyproject.toml alongside Ruff for linting. GitHub Actions runs the suite on every push.',
      'There is also a multi-stage Dockerfile and docker-compose.yml, so the Streamlit app comes up on :8501 with one command.',
    ],
    followups: ['How accurate is SpotterAI?', 'What is the tech stack?'],
  },
  {
    id: 'food-agent',
    topic: 'Multimodal Food Agent',
    keywords: ['food', 'nutrition', 'calorie', 'diet', 'recipe', 'dish', 'usda', 'gemini', 'efficientnet', 'gradio', 'eat', 'meal', 'multimodal'],
    weight: 6,
    answer: [
      'The Multimodal Food Agent identifies a dish from a photograph, pulls verified nutrition data, and returns calibrated dietary guidance.',
      'Vision is two-tier: Google Gemini Vision handles classification, and when its confidence drops below 0.65 an on-device PyTorch EfficientNet-B4 (Food-101) takes over. If both fall short, the result is explicitly flagged uncertain rather than guessed.',
      'Nutrition retrieval is three-tier: USDA FoodData Central (300k+ foods) first, Open Food Facts (3M+ products) for international items, then calibrated offline baselines so the system never hard-fails. Vision and nutrition are separate FastMCP tool servers, with a Gradio UI on :7860 and a FastAPI gateway on :8000 exposing /analyze, /chat and /session.',
      'A 7-part pytest suite covers vision gating, both nutrition tiers, orchestrator memory and the REST endpoints, against a 20-food labelled benchmark.',
    ],
    followups: ['What is FastMCP?', 'What other projects do you have?'],
  },
  {
    id: 'coding-agent',
    topic: 'Multi-Agent Coding Assistant',
    keywords: ['coding', 'code', 'agent', 'multi-agent', 'planner', 'coder', 'reviewer', 'tester', 'sandbox', 'generate', 'programming', 'automation', 'write code'],
    weight: 6,
    answer: [
      'The Multi-Agent Coding Assistant turns a plain-English spec into working, tested Python. Four agents cooperate: a Planner decomposes the spec and decides single-file vs multi-file output, a Coder writes the code, a Reviewer checks it against the spec and returns structured issues, and a Tester writes and runs tests — looping back to the Coder up to 4 times until they pass.',
      'The execution sandbox is the interesting part. Rather than a subprocess call, it is an MCP server backed by a python:3.12-slim Docker image running with --network none, --memory 128m and --cpus 0.5. That means generated code cannot reach the network or persist state, and any MCP-compatible client can reuse the same sandbox unchanged.',
      'Benchmarked on 20 graded tasks (5 easy, 8 medium, 7 hard): 100% success rate, 1.6 iterations on average, 434 seconds total.',
    ],
    followups: ['What is MCP?', 'How do you evaluate your systems?'],
  },
  {
    id: 'shopai',
    topic: 'ShopAI e-commerce RAG',
    keywords: ['shopai', 'rag', 'retrieval', 'ecommerce', 'e-commerce', 'chatbot', 'pinecone', 'langsmith', 'react', 'groq', 'shopping', 'product search', 'vector'],
    weight: 6,
    answer: [
      'ShopAI is a production e-commerce RAG assistant. A Groq-hosted ReAct agent (llama-3.3-70b-versatile) chooses between a Pinecone product index and DuckDuckGo web search per turn, behind a FastAPI backend with JWT role-based auth and a React 18 frontend.',
      'What separates it from a prototype is instrumentation: LangSmith traces every query for latency and token cost, and an LLM-as-a-judge pipeline scores responses against a golden dataset. An admin dashboard exposes metrics, evaluation scores and re-ingestion controls; per-session memory has TTL cleanup and the API is rate-limited per IP.',
      'The whole stack runs on free tiers — Groq, Pinecone, DuckDuckGo and LangSmith — and deploys with a single docker-compose up. It was upgraded from a notebook prototype in September 2026.',
    ],
    followups: ['How do you evaluate RAG?', 'What is your tech stack?'],
  },
  {
    id: 'mcp',
    topic: 'Model Context Protocol',
    keywords: ['mcp', 'fastmcp', 'model context protocol', 'tool', 'tool calling', 'server', 'protocol', 'interop'],
    weight: 5,
    answer: [
      'MCP shows up in three of my projects. The Food Agent splits vision and nutrition into independent FastMCP servers so either can be swapped without touching the orchestrator. The Coding Assistant exposes its Docker sandbox as an MCP server, which means Cursor, Claude Desktop or another agent can connect to the exact same sandboxed executor with no code changes.',
      'The reason is separation of concerns: the execution environment can be replaced later — say with Firecracker microVMs — without rewriting any agent logic.',
    ],
    followups: ['Tell me about the coding assistant', 'What makes your agent work different?'],
  },
  {
    id: 'lung-pipeline',
    topic: 'Lung Segmentation Async Pipeline',
    keywords: ['lung', 'segmentation', 'medical', 'x-ray', 'xray', 'segformer', 'celery', 'redis', 'async', 'healthcare', 'radiograph', 'unet'],
    weight: 6,
    answer: [
      'The Lung Segmentation Async ML Pipeline is an asynchronous medical imaging service that isolates lung regions from chest X-rays using SegFormer-B0.',
      'The architecture is split so inference never blocks the API: FastAPI validates the upload and returns a task ID immediately, a Celery worker runs SegFormer-B0 inference off the request thread, and results are cached in Redis for client polling. SciPy handles mask post-processing.',
      'The public SegFormer-B0 model reports roughly 95% mean IoU and 98% pixel accuracy, and the weights are baked into the Docker image at build time so there is no runtime network dependency. It grew out of my thesis work comparing U-Net++ and U-Net on chest X-ray segmentation.',
    ],
    followups: ['What is your education?', 'What are your flagship projects?'],
  },
  {
    id: 'other-repos',
    topic: 'Other repositories',
    keywords: ['other', 'more', 'repository', 'repo', 'github', 'dicoding', 'data analyst', 'analysis', 'food classification'],
    weight: 4,
    answer: [
      'Alongside the five flagships there is more on GitHub. Lung-Segmentation is the earlier precursor to the async pipeline, Food-Classification holds CNN dish-classification experiments, and Submission_Data_Analist is my Dicoding Data Analyst submission with EDA and reporting notebooks.',
      'You can browse all 15 public repositories at github.com/Ridho-h.',
    ],
    followups: ['Tell me about the lung pipeline', 'Where can I find your code?'],
  },
  {
    id: 'skills',
    topic: 'Skills overview',
    keywords: ['skill', 'skills', 'tech', 'stack', 'technology', 'technologies', 'tool', 'tools', 'language', 'framework', 'know', 'proficient', 'competenc'],
    weight: 4,
    answer: [
      'Six branches. Languages and core — Python, SQL, C++, JavaScript, DSA. LLM agents — MCP/FastMCP, multi-agent orchestration, RAG, LangChain and ReAct, LangSmith with LLM-as-judge, Gemini/Groq/OpenAI APIs.',
      'ML and deep learning — PyTorch, TensorFlow and Lite, Hugging Face Transformers, Scikit-Learn, sequence models, GANs. Computer vision — MediaPipe, OpenCV, SegFormer, U-Net/U-Net++, EfficientNet, multimodal vision.',
      'Engineering and MLOps — FastAPI, Docker and Compose, Celery and Redis, async task queues, JWT/RBAC, rate limiting, pytest and CI. Interfaces and data — Streamlit, Gradio, React, Pandas/NumPy/SciPy, Power BI and Excel.',
      'The skills section draws these as a root system rather than a list of bars — follow a branch to see depth and where each technology was used.',
    ],
    followups: ['Do you know PyTorch?', 'What about Docker?', 'How strong is your Python?'],
  },
  {
    id: 'python',
    topic: 'Python',
    keywords: ['python', 'py', 'pandas', 'numpy'],
    weight: 3,
    answer: [
      'Python is my primary language — every flagship project is written in it, from SpotterAI (3.10) to the Food Agent and Coding Assistant (3.11). Comfortable with virtual environments, packaging, type hints, async pipelines and pytest.',
    ],
    followups: ['What is your tech stack?', 'Tell me about SpotterAI'],
  },
  {
    id: 'pytorch-tf',
    topic: 'PyTorch and TensorFlow',
    keywords: ['pytorch', 'tensorflow', 'keras', 'deep learning', 'neural network', 'cnn', 'efficientnet', 'torch'],
    weight: 3,
    answer: [
      'Both, depending on the job. TensorFlow/Keras powers the Bi-LSTM + Luong attention classifier in SpotterAI. PyTorch and TorchVision power the EfficientNet-B4 Food-101 classifier in the Food Agent and the SegFormer fine-tune for lung segmentation.',
    ],
    followups: ['What model does SpotterAI use?', 'Tell me about the food agent'],
  },
  {
    id: 'docker',
    topic: 'Docker',
    keywords: ['docker', 'container', 'compose', 'deployment', 'deploy', 'devops', 'kubernetes', 'production'],
    weight: 3,
    answer: [
      'Docker is standard across the portfolio. SpotterAI uses a multi-stage production container; the Food Agent and ShopAI both ship docker-compose files that bring up every service in one command; the Coding Assistant builds a custom python:3.12-slim sandbox image with pytest baked in, run with --network none and resource caps.',
    ],
    followups: ['Tell me about the coding assistant', 'What is MCP?'],
  },
  {
    id: 'evaluation',
    topic: 'Evaluation philosophy',
    keywords: ['evaluate', 'evaluation', 'how do you test', 'measure', 'quality', 'hallucination', 'grounded', 'reliable', 'trust', 'verify'],
    weight: 4,
    answer: [
      'I treat evaluation as part of the build, not a report written afterwards. SpotterAI has a 60-rep benchmark with ground-truth labels. The Coding Assistant scores 20 graded tasks and writes metrics.json. ShopAI runs LLM-as-a-judge against a golden dataset with full LangSmith tracing. The Food Agent has a 20-food labelled benchmark and a 7-part pytest suite.',
      'On hallucination specifically: the Food Agent gates on confidence and flags uncertainty instead of guessing, SpotterAI debriefs only from logged rows rather than model recall, and ShopAI traces and scores every response. Grounding beats eloquence.',
    ],
    followups: ['How accurate is SpotterAI?', 'Tell me about ShopAI'],
  },
  {
    id: 'education',
    topic: 'Education',
    keywords: ['education', 'university', 'universitas', 'sriwijaya', 'unsri', 'degree', 'bachelor', 'study', 'studied', 'graduat', 'thesis', 'campus', 'college', 's1', 'sarjana', 'gpa', 'grade', 'distinction'],
    weight: 5,
    answer: [
      'I hold a Bachelor of Informatics Engineering from Universitas Sriwijaya (2022–2025), graduating with distinction at a 3.92 / 4.00 GPA.',
      'My thesis was "Comparison of U-Net++ and U-Net Architectures for Segmentation of Chest X-Ray Images" — which is where the later SegFormer lung-segmentation service comes from. I was also active in the informatics student council and the engineering academic society.',
    ],
    followups: ['What is Bangkit Academy?', 'What about Samsung Innovation Campus?'],
  },
  {
    id: 'bangkit',
    topic: 'Bangkit Academy',
    keywords: ['bangkit', 'academy', 'google', 'goto', 'tokopedia', 'gojek', 'traveloka', 'cohort', 'bootcamp', 'scholarship', 'certificate'],
    weight: 5,
    answer: [
      'I graduated from the Bangkit Academy Machine Learning cohort (Sep–Dec 2024) — the programme led by Google, Tokopedia, Gojek and Traveloka.',
      'I built machine-learning pipelines end to end, including a Named Entity Recognition model and a content-filtering recommendation algorithm for the capstone, plus applied work with GANs and predictive modelling. There was also structured professional development in cross-functional communication and problem structuring.',
    ],
    followups: ['What is your education?', 'What about Samsung Innovation Campus?'],
  },
  {
    id: 'sic',
    topic: 'Samsung Innovation Campus',
    keywords: ['samsung', 'innovation campus', 'sic', 'semi-finalist', 'semifinalist', 'finalist', 'competition', 'award', 'iot'],
    weight: 5,
    answer: [
      'I was a Semi-Finalist in Samsung Innovation Campus Batch 5 (Sep 2024).',
      'My project was an end-to-end IoT workflow capturing real-time temperature and humidity data and streaming it to a centralised visualisation dashboard. The programme also covered deep learning fundamentals, computer vision algorithms and practical edge deployment.',
    ],
    followups: ['What is your education?', 'What is Bangkit Academy?'],
  },
  {
    id: 'bank9',
    topic: 'Bank 9 Jambi internship',
    keywords: ['bank', 'jambi', 'intern', 'internship', 'work experience', 'job', 'worked', 'industry', 'enterprise', 'it support', 'excel'],
    weight: 5,
    answer: [
      'I was an IT Support Intern at Bank Pembangunan Daerah Jambi (Jun–Jul 2024) — the regional development bank, also known as Bank 9 Jambi.',
      'I processed and maintained operational datasets in Microsoft Excel, keeping records accurate and well organised, and supported the department with routine operational and technical tasks. Working inside a regulated banking environment is a reliable way to learn that production systems care more about continuity than novelty.',
    ],
    followups: ['What is your education?', 'Do you have industry experience?'],
  },
  {
    id: 'gdg',
    topic: 'GDG on Campus UNSRI',
    keywords: ['gdg', 'google developer', 'community', 'mentor', 'volunteer', 'workshop', 'speaker', 'leadership', 'power bi'],
    weight: 4,
    answer: [
      'I am a Machine Learning member of Google Developer Group on Campus at Universitas Sriwijaya (Jan–Dec 2025).',
      'I engineered a Retrieval-Augmented Generation system for an e-commerce agent combining product-database retrieval with live web search, mentored junior members through four structured sessions on Natural Language Processing, and built a dynamic bicycle sales tracking dashboard in Microsoft Power BI.',
    ],
    followups: ['What is your education?', 'What do you focus on?'],
  },
  {
    id: 'lungify',
    topic: 'Lungify — Google APAC Solution Challenge',
    keywords: ['lungify', 'apac', 'solution challenge', 'google apac', 'respiratory', 'mobile app', 'symptom', 'hackathon'],
    weight: 5,
    answer: [
      'Lungify was my entry for the Google APAC Solution Challenge 2025 (Jul 2025), where I was a participant: an AI-powered mobile application for respiratory health monitoring.',
      'I engineered a real-time multilingual symptom-analysis chatbot using the Google Gemini API and delivered a fully operational prototype within a two-week sprint.',
    ],
    followups: ['Tell me about the lung pipeline', 'What else have you built?'],
  },
  {
    id: 'certifications',
    topic: 'Certifications',
    keywords: ['certification', 'certificate', 'credential', 'myskill', 'excel', 'certified', 'qualification'],
    weight: 4,
    answer: [
      'My credentials: the Bangkit Academy Machine Learning cohort (Google · Tokopedia · Gojek · Traveloka), Semi-Finalist at Samsung Innovation Campus Batch 5, participant in the Google APAC Solution Challenge 2025, and MySkill Fullstack Microsoft Excel Basic to Advanced (Batch 18).',
      'The MySkill programme covered PivotTables, statistical formulas and data validation applied to dynamic decision-support dashboards.',
    ],
    followups: ['What is your education?', 'What is Bangkit Academy?'],
  },
  {
    id: 'experience',
    topic: 'Career journey',
    keywords: ['experience', 'journey', 'career', 'background', 'history', 'timeline', 'years', 'milestone'],
    weight: 4,
    answer: [
      'The short version: Informatics Engineering at Universitas Sriwijaya (2022–2025), an IT systems internship at Bank 9 Jambi (mid-2024), the Bangkit Academy ML cohort (late 2024), Semi-Finalist at Samsung Innovation Campus (2024), and the ML division at GDG on Campus UNSRI (2025).',
      'Alongside that, five flagship systems — SpotterAI, the Multimodal Food Agent, the Multi-Agent Coding Assistant, ShopAI and the Lung Segmentation Pipeline — plus data-analysis work. The Experience section lays all of this out as stops along a river.',
    ],
    followups: ['What is Bangkit Academy?', 'What is your education?', 'What are your flagship projects?'],
  },
  {
    id: 'projects-overview',
    topic: 'Flagship projects',
    keywords: ['project', 'projects', 'portfolio', 'built', 'showcase', 'flagship', 'best work', 'show me'],
    weight: 5,
    answer: [
      'Five flagships. SpotterAI — real-time AI fitness coach with pose tracking, form detection, session logging and a history chat. Multimodal Food Agent — vision classification and verified nutrition retrieval over MCP. Multi-Agent Coding Assistant — four agents producing tested Python inside a Docker sandbox. ShopAI — production e-commerce RAG with LangSmith evaluation and RBAC. Lung Segmentation Pipeline — async medical imaging on Celery and Redis.',
      'All five are on GitHub with real benchmarks attached rather than vibe-based claims.',
    ],
    followups: ['What is SpotterAI?', 'Tell me about the coding assistant', 'Tell me about ShopAI'],
  },
  {
    id: 'hiring',
    topic: 'Availability',
    keywords: ['hire', 'hiring', 'open to work', 'available', 'availability', 'opportunity', 'job', 'role', 'recruit', 'freelance', 'collaborat', 'work together', 'contract'],
    weight: 5,
    answer: [
      'Yes — I am open to full-time AI/ML roles, research collaborations, and production architecture work, particularly anything touching computer vision, agentic systems or retrieval.',
      'The fastest way to reach me is mridhohidayat09@gmail.com. LinkedIn and GitHub are linked in the Contact section.',
    ],
    followups: ['How can I contact you?', 'What do you focus on?'],
  },
  {
    id: 'contact',
    topic: 'Contact details',
    keywords: ['contact', 'email', 'mail', 'reach', 'touch', 'linkedin', 'kaggle', 'github', 'social', 'connect', 'message', 'phone', 'call', 'whatsapp'],
    weight: 5,
    answer: [
      'Email: mridhohidayat09@gmail.com — the Contact section has a copy-to-clipboard button. Phone: (+62) 822-7771-1104.',
      'GitHub: github.com/Ridho-h · LinkedIn: linkedin.com/in/muhammad-ridho-hidayat · Kaggle: kaggle.com/muhammadridhohidayat.',
    ],
    followups: ['Are you open to work?', 'What are your flagship projects?'],
  },
  {
    id: 'location',
    topic: 'Location',
    keywords: ['where', 'location', 'based', 'live', 'city', 'country', 'indonesia', 'jambi', 'timezone', 'remote', 'relocate'],
    weight: 3,
    answer: [
      'I am based in Jambi, Indonesia. I am open to remote work and to relocating for the right role. Indonesian is my native language and I work professionally in English.',
    ],
    followups: ['Are you open to work?', 'How can I contact you?'],
  },
  {
    id: 'website',
    topic: 'This website',
    keywords: ['website', 'site', 'this site', 'design', 'ui', 'how was this', 'built this', 'vite', 'css', 'theme', 'nature'],
    weight: 4,
    answer: [
      'This site is hand-built — Vite plus vanilla ES modules and CSS, no UI framework and no component library. Every illustration is hand-written SVG or canvas; there are no stock assets.',
      'The theme is a nature field guide: each section is a different biome as you descend from canopy to lake, with earthy tones, organic clip-paths and paper textures. Content lives in src/data and renders through small modules, and the assistant you are talking to runs entirely in your browser with no API key.',
    ],
    followups: ['Who built this?', 'What is your tech stack?'],
  },
];

/** Starter chips shown before the visitor types anything. */
export const suggestions = [
  'What is SpotterAI?',
  'How accurate is it?',
  'What is your tech stack?',
  'Are you open to work?',
  'How can I contact you?',
];

/** Shown once, before the first question. */
export const greeting =
  "Hi — I'm Ridho's assistant. Ask me about his projects, skills, experience or availability "
  + 'and I will answer from his actual portfolio data.';

/** Returned when nothing scores above the match threshold. */
export const fallback = [
  "I'm not certain about that one — I only answer from Ridho's portfolio data.",
  'Try asking about SpotterAI, the Multimodal Food Agent, the Multi-Agent Coding Assistant, ShopAI, his skills, his experience, or how to get in touch.',
];

export default knowledge;
