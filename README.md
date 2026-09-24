# Muhammad Ridho Hidayat — AI & Machine Learning Engineer Portfolio v3.0

>  An interactive portfolio. Built with Vue 3, Three.js, GSAP, and TypeScript.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Portfolio-00f2fe?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ridho-h.github.io/portfolio/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-00f2fe?style=for-the-badge)](https://lenis.darkroom.engineering/)

---

## ⚡ Architectural Highlights (Portfolio v3.0)

### 1. Unified Continuous WebGL 3D Stage (`Stage3D.vue`)
- **Single Persistent WebGL Canvas**: Replaces disconnected canvas instances with one unified, global Three.js scene running smoothly at 60 FPS across all chapters.
- **Inertial Camera Waypoints**: The camera smoothly interpolates position and look-at targets per chapter without jarring perspective jumps.
- **Dynamic Resize & Aspect Handling**: Preserves field-of-view and spatial anchors on ultrawide monitors, laptops, and mobile viewports.

### 2. Autonomous 3D AI Robot Companion (`UNIT_01`)
- **Procedural Character Geometry**: Stylized aerodynamic white ceramic helmet shell with squircle extrusion, curved obsidian OLED visor frame, and dual blue accent ear pods.
- **Expressive Facial Engine**: Glowing cyan arched LED eyes and cheerful open smile with natural, randomized blinking cycles (single and double blinks).
- **True 3D Cursor Sightline Raycasting**: Projects mouse coordinates against a virtual camera-facing focal plane in real time; the robot's head and digital pupils track the cursor across the screen with natural clamped range of motion and banked flight roll.
- **Interactive Speech Badge & Collision Mesh**: Screen-projected HUD badge (`UNIT_01 // AI COMPANION`) paired with an invisible raycast hit sphere that launches the interactive AI Chatbot drawer on click.
- **Dynamic Flight Navigation**: Automatically navigates between strategic chapter waypoints (hovering in Hero, open negative space in About, observation vantage in Projects, and communication relay in Contact).

### 3. Iron Man Neural Core Shockwave & Persistent Background Galaxy
- **Hero Neural Core**: Interlocking icosahedron wireframe cage with an interior glowing aura mesh and 600 procedural particle points.
- **Cinematic Radial Burst**: Scrolling down from Hero into About triggers an Iron Man-inspired radial shockwave explosion (`burstEase = 1 - (1 - ep)^3`). The wireframe cage and aura shatter and dissolve cleanly.
- **Persistent Ambient Galaxy**: The exploded white dots do not vanish—they disperse into a slow-rotating 3D celestial starfield that forms the ambient background for all subsequent chapters (About, Projects, Contact), unaffected by cursor shake.

### 4. Cybernetic Projector Drone & 60 FPS Dynamic Hologram HUD (`ProjectsChapter.vue`)
- **Lateral Flight Deployment & Dismissal**:
  - **Fly-In**: When scrolling into Projects, the projector drone swoops in laterally from off-screen right with aerodynamic bank roll (`flightBankZ`) and accelerated rotor rotation, glides to a stop at `X = 2.15`, ignites its volumetric light beam, and blooms the HUD screen into full clarity.
  - **Fly-Out**: When scrolling away from Projects (to Contact or back to About), the hologram collapses within ~120ms while the drone banks right and accelerates off-screen to the right side before the next section appears.
- **60 FPS Live Inference HTML5 Canvas HUD (1024×680)**:
  - **SpotterAI**: Real-time MediaPipe BlazePose 33-landmark athletic squat kinematics analysis with forward arm counterbalance, joint angle depth measurement, and form validation.
  - **NutriAgent / Multimodal Food Agent**: Real-time VLM food detection, bounding box targeting, calibrated confidence gating ($\tau = 0.85$), and nutrition telemetry.
  - **Autonomous Coding Assistant**: Multi-agent DAG workflow execution displaying node states (Architect, Planner, Coder, Critic, Sandbox).
  - **ShopAI**: Hybrid semantic vector + BM25 Reciprocal Rank Fusion (RRF) search ranking with sub-10ms latency metrics.
- **GSAP Pinned Scroll Runway**: A 2400px pinned viewport runway allows smooth scrubbed transitions through all 4 flagship systems without page jitter.

### 5. Autonomous Grounded AI Chatbot (`AgentChatbot.vue`)
- **Deterministic Offline Knowledge Engine**: Built-in vector-like keyword matching system (`knowledge.js`) covering Ridho's thesis (UNSRI 3.92 Cum Laude), flagship architectures, benchmarks, stack, and contact availability.
- **Cloudflare Worker Integration**: Optional edge worker proxy (`cloudflare-worker/worker.js`) for streaming live LLM inference when configured.
- **Interactive UI**: Tactical sound effects, quick suggestion chips, live typing effect, copy response, and markdown rendering.

---

## 🗺️ Narrative Chapters

| Chapter | Identifier | Concept | Key Components & Visual Systems |
| :--- | :--- | :--- | :--- |
| **01** | `#hero` | **Neural Boot** | Standby machine, terminal telemetry, pulsating icosahedron neural core, and companion robot hover. |
| **02** | `#about` | **Diagnostic Scan** | Computer vision scan pass over portrait, Iron Man core explosion transition, and competency matrix. |
| **03** | `#projects` | **Inference Stage** | Lateral drone flight deployment, 2400px pinned runway, 4 live 60 FPS holographic project architectures. |
| **04** | `#contact` | **Model Relay** | Direct dispatch console (`POST /v1/dispatch-model`), one-click relays, and assistant launcher. |

---

## 🏆 Featured Flagship Projects

1. **SpotterAI // Real-Time Biomechanics & Squat Coach**
   - *Stack*: Python, OpenCV, MediaPipe, PyTorch (Bi-LSTM + Attention), SQLite, FastAPI
   - *Highlights*: 33 body landmarks tracked at 60 FPS (42ms latency), Bi-LSTM motion phase classification, depth & knee valgus detection, 100% Rep-count F1, 91.7% form accuracy.
   - [GitHub Repository](https://github.com/Ridho-h/SpotterAI)

2. **Multimodal Food Nutrition Agent**
   - *Stack*: Python, PyTorch, CLIP, YOLOv8, FastAPI, Docker
   - *Highlights*: Real-time object detection + vision-language nutrient estimation, calibrated confidence gating ($\tau = 0.85$), 48ms inference latency.

3. **Autonomous Multi-Agent Coding Assistant**
   - *Stack*: Python, LangGraph, Ollama, Docker Sandbox, FastAPI
   - *Highlights*: Directed Acyclic Graph (DAG) multi-agent code generation, critique loop, ephemeral isolated Docker sandbox execution (`--network none`).

4. **ShopAI // Hybrid Reciprocal Rank Fusion Search**
   - *Stack*: Python, Qdrant, BM25, Sentence-Transformers, FastAPI
   - *Highlights*: Hybrid vector embeddings + lexical BM25 retrieval merged via Reciprocal Rank Fusion (RRF), sub-10ms search latency across 100k+ SKUs.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | [Vue 3.5](https://vuejs.org/) (Composition API, `<script setup lang="ts">`) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) (Strict type checking) |
| **3D Graphics & Shaders** | [Three.js 0.174](https://threejs.org/) (WebGL, BufferGeometry, Raycasting, Dynamic Canvas Textures) |
| **Animation Engine** | [GSAP 3.15](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/) |
| **Smooth Scroll** | [Lenis 1.3](https://lenis.darkroom.engineering/) (Coupled to GSAP ticker) |
| **Audio Synthesizer** | Native Web Audio API + [Howler.js](https://howlerjs.com/) |
| **Styling** | SCSS with Obsidian & Cyberpunk Neon tokens (`cyber.scss`) |
| **Build Tooling** | [Vite 6.1](https://vitejs.dev/) with `vite-plugin-glsl` |

---

## 📂 Project Directory Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── cloudflare-worker/
│   ├── README.md                   # Cloudflare Worker deployment guide
│   └── worker.js                   # Serverless AI proxy for live LLM chat
├── public/
│   ├── favicon.svg                 # Cybernetic emblem favicon
│   └── photo.jpeg                  # Profile portrait asset
├── src/
│   ├── animations/
│   │   ├── scenes.ts               # Three.js scene helpers
│   │   ├── scroll.ts               # Lenis scroll conductor & GSAP sync
│   │   ├── waypoints.ts            # Spatial camera & waypoint math
│   │   └── waypoints-data.ts       # Spatial coordinate markers
│   ├── audio/
│   │   └── soundManager.ts         # Procedural Web Audio API synthesizer
│   ├── components/
│   │   ├── canvas/
│   │   │   └── Stage3D.vue         # 🌟 Continuous 3D WebGL stage, robot, & projector drone
│   │   ├── chat/
│   │   │   └── AgentChatbot.vue    # Grounded interactive AI chat assistant modal
│   │   ├── sections/
│   │   │   ├── HeroChapter.vue     # Chapter 01: Hero neural boot
│   │   │   ├── AboutChapter.vue    # Chapter 02: CV diagnostic scan & capabilities
│   │   │   ├── ProjectsChapter.vue # Chapter 03: Pinned 2400px multi-project runway
│   │   │   ├── ContactChapter.vue  # Chapter 04: Communication relay & dispatch
│   │   │   ├── AboutScan.vue       # Computer vision target reticle scanner
│   │   │   ├── CallModel.vue       # Model dispatch console
│   │   │   ├── HeroBoot.vue        # Boot telemetry logs
│   │   │   ├── LatentSpace.vue     # 3D latent manifold module
│   │   │   ├── ProjectsInference.vue # Project card diffusion reveal
│   │   │   ├── SkillsChapter.vue   # Skills matrix view
│   │   │   └── TrainingLog.vue     # Career milestones training curve
│   │   ├── ChatbotModal.vue        # Chatbot drawer wrapper
│   │   └── Navigation.vue          # Top floating HUD pill with sound toggle & section spy
│   ├── data/
│   │   ├── knowledge.js            # Deterministic knowledge base for offline AI chat
│   │   ├── projects-data.ts        # Flagship project specs, telemetry, and repo links
│   │   ├── skills-galaxy.ts        # Technical skill taxonomy & metadata
│   │   └── timeline-epochs.ts      # Career milestone epochs & convergence loss
│   ├── styles/
│   │   └── cyber.scss              # Global design system & obsidian glass tokens
│   ├── utils/
│   │   └── skill-badge-textures.ts # Canvas texture rendering utilities
│   ├── App.vue                     # Master layout & chapter boundary evaluator
│   ├── env.d.ts                    # TypeScript ambient declarations
│   └── main.ts                     # Vue application bootstrap
├── index.html                      # HTML entrypoint with preconnect fonts
├── package.json
├── tsconfig.json
└── vite.config.js                  # Vite configuration with GLSL loader
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**, **pnpm**, or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ridho-h/portfolio.git
cd portfolio

# 2. Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Hot Module Replacement (HMR) is active.

### Production Build & Verification

```bash
# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

