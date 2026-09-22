# Muhammad Ridho Hidayat — AI & Machine Learning Engineer Portfolio

> **"The Model Awakens"** — An interactive, cybernetic 3D portfolio representing an artificial intelligence system powering on from cold standby to full operational inference.

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-00f2fe)](https://lenis.darkroom.engineering/)

---

## ⚡ Narrative Concept: "The Model Awakens"

Every section corresponds to a discrete stage in an AI model's lifecycle:

| Stage | Section | Concept | Key Interactions & Engineering |
| :--- | :--- | :--- | :--- |
| **01** | **Hero (`#hero`)** | **Cold Boot** | Machine in standby. First scroll or screen click triggers fast-streaming boot logs (`Loading checkpoint...`, `Allocating VRAM...`). Console CRT lights up and text resolves into candidate identity. |
| **02** | **About (`#about`)** | **Diagnostic Scan** | Computer vision inference pass sweeping across the portrait. 4 nested object detection bounding boxes (Person → AI/ML Core → Tech Stack → UNSRI Cum Laude) snap into coordinates with tactical audio feedback. |
| **03** | **Skills (`#skills`)** | **Latent Space** | Interactive 3D manifold (t-SNE / UMAP dimensionality reduction) rendered in Three.js. 18 clustered skill nodes with synapse connections, orbital camera rotation, cluster category filters, and raycasting hover HUD inspection. |
| **04** | **Projects (`#projects`)** | **Inference Reveal** | Diffusion denoising step. Cards start as high-entropy latent noise with terminal sampling logs, resolving into 4 flagship architectures with verified metrics and 4-step data pipeline diagrams. |
| **05** | **Experience (`#journey`)** | **Training Log** | Career milestones framed as optimization epochs along an animated SVG validation loss curve converging from Epoch 01 (`0.082`) down to Epoch 06 (`0.009`). |
| **06** | **Contact (`#contact`)** | **Call the Model** | Minimized dispatch console executing `POST /v1/dispatch-model`, one-click email copy, social relays, and trigger for the Grounded AI Assistant. |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [Vue 3](https://vuejs.org/) with `<script setup lang="ts">` Composition API
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **3D Graphics**: [Three.js](https://threejs.org/) (WebGL scenes, procedural starfields, custom shaders, raycasting)
- **Kinetic Animations**: [GSAP](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Inertial Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) synchronized with GSAP ticker
- **Procedural Audio**: Native Web Audio API synthesizer for tactile acoustic feedback (hover clicks, chime harmonies, audio toggle)
- **Styling**: SCSS with Obsidian Dark & Cybernetic Glass tokens (`cyber.scss`)
- **Bundler & Tooling**: [Vite 6](https://vitejs.dev/) with `vite-plugin-glsl`

---

## 📂 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.svg             # Cybernetic favicon
│   └── photo.jpeg              # Profile portrait
├── src/
│   ├── animations/
│   │   └── scroll.ts           # Lenis scroll engine & GSAP ticker synchronization
│   ├── audio/
│   │   └── soundManager.ts     # Web Audio API sound generator (hover, click, chime)
│   ├── components/
│   │   ├── Navigation.vue      # Cyber nav with real-time focal scroll detection & audio controls
│   │   ├── ChatbotModal.vue    # Grounded AI assistant drawer with local knowledge matching
│   │   └── sections/
│   │       ├── HeroBoot.vue    # Stage 01: Cold boot terminal & workstation rig
│   │       ├── AboutScan.vue   # Stage 02: Computer vision bounding box scan
│   │       ├── LatentSpace.vue # Stage 03: 3D Three.js latent manifold galaxy
│   │       ├── ProjectsInference.vue # Stage 04: Diffusion denoising project showcase
│   │       ├── TrainingLog.vue # Stage 05: Loss curve trajectory & career epochs
│   │       └── CallModel.vue   # Stage 06: Model dispatch console & contact channels
│   ├── data/
│   │   ├── knowledge.js        # Offline knowledge base for AI Assistant
│   │   ├── projects-data.ts    # Project specifications, metrics, and pipeline definitions
│   │   ├── skills-galaxy.ts    # 3D spatial node coordinates and cluster metadata
│   │   └── timeline-epochs.ts  # Career milestone epochs and loss metrics
│   ├── styles/
│   │   └── cyber.scss          # Design system: obsidian surfaces, glowing borders, neon accents
│   ├── App.vue                 # Master vertical narrative stage orchestration
│   ├── env.d.ts                # TypeScript environment declarations
│   └── main.ts                 # Vue application mount & stylesheet initialization
├── index.html                  # HTML entrypoint with metadata & preconnect fonts
├── package.json
├── tsconfig.json
└── vite.config.js              # Vite configuration with relative base and GLSL loader
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm** / **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Ridho-h/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to view the live site with Hot Module Replacement (HMR).

### Production Build

```bash
npm run build
```

Compiles TypeScript and bundles production assets into `dist/`.

### Local Preview

```bash
npm run preview
```

Spins up a lightweight static preview server at `http://localhost:4173` to test the production bundle locally.




