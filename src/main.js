/* ═══════════════════════════════════════════════════════
 *  MAIN.JS — Portfolio Logic
 *  Three.js Neural Network + Firebase Data + Interactions
 * ═══════════════════════════════════════════════════════ */

import '../src/style.css';
import * as THREE from 'three';
import { db, firebaseReady } from './firebase-config.js';
import { formatImageUrl } from './utils.js';

let collection, getDocs, query, orderBy;

async function initFirestore() {
  if (firebaseReady && !collection) {
    const mod = await import('firebase/firestore');
    collection = mod.collection;
    getDocs = mod.getDocs;
    query = mod.query;
    orderBy = mod.orderBy;
  }
}

/* ──────────────────────────────────
 *  FALLBACK DATA (when Firebase not configured)
 * ────────────────────────────────── */
const FALLBACK_PROJECTS = [
  {
    title: 'Lung Segmentation Async ML Pipeline',
    description: 'End-to-end asynchronous medical image segmentation system that automatically identifies and isolates lung regions from chest X-rays using a fine-tuned SegFormer deep learning model. Features async task queue, real-time progress tracking, and REST API.',
    tags: ['SegFormer', 'Computer Vision', 'FastAPI', 'Async', 'Medical AI'],
    url: 'https://github.com/Ridho-h/Lung-Segmentation-Async-ML-Pipeline',
    featured: true,
    order: 1
  },
  {
    title: 'Chatbot RAG E-Commerce',
    description: 'Intelligent e-commerce chatbot powered by Retrieval-Augmented Generation (RAG), combining product database search with real-time internet search capabilities for accurate, contextual responses.',
    tags: ['RAG', 'LangChain', 'NLP', 'Vector DB', 'LLM'],
    url: 'https://github.com/Ridho-h/Chatbot-RAG-ECommerce',
    featured: false,
    order: 2
  },
  {
    title: 'Food Classification',
    description: 'Deep learning model for multi-class food image classification. Trained on large-scale food dataset using transfer learning and fine-tuning techniques with TensorFlow.',
    tags: ['CNN', 'Transfer Learning', 'TensorFlow', 'Image Classification'],
    url: 'https://github.com/Ridho-h/Food-Classification',
    featured: false,
    order: 3
  },
  {
    title: 'AI Personal Trainer',
    description: 'Computer vision-based fitness trainer that uses Human Pose Estimation to track body movements, count exercise repetitions, and provide real-time form feedback.',
    tags: ['Pose Estimation', 'OpenCV', 'MediaPipe', 'Real-time'],
    url: 'https://github.com/Ridho-h/AITrainer',
    featured: false,
    order: 4
  },
  {
    title: 'Lung Segmentation (Research)',
    description: 'Research-focused lung segmentation model using U-Net+ architecture. Trained on medical chest X-ray datasets for precise lung boundary detection.',
    tags: ['U-Net+', 'Segmentation', 'PyTorch', 'Medical Imaging'],
    url: 'https://github.com/Ridho-h/Lung-Segmentation',
    featured: false,
    order: 5
  },
  {
    title: 'Data Analysis Dashboard',
    description: 'Interactive data analysis project submission for Dicoding. Features comprehensive EDA, statistical analysis, and Streamlit dashboard for data visualization.',
    tags: ['Pandas', 'Streamlit', 'EDA', 'Data Viz'],
    url: 'https://github.com/Ridho-h/Submission_Data_Analist',
    featured: false,
    order: 6
  }
];

const FALLBACK_CERTIFICATES = [
  { name: 'Machine Learning Specialization', issuer: 'DeepLearning.AI / Stanford — Coursera', url: '' },
  { name: 'Natural Language Processing in TensorFlow', issuer: 'DeepLearning.AI — Coursera', url: '' },
  { name: 'Convolutional Neural Networks in TensorFlow', issuer: 'DeepLearning.AI — Coursera', url: '' },
  { name: 'Custom and Distributed Training with TensorFlow', issuer: 'DeepLearning.AI — Coursera', url: '' },
  { name: 'Device-based Models with TensorFlow Lite', issuer: 'DeepLearning.AI — Coursera', url: '' },
];


/* ──────────────────────────────────
 *  THREE.JS — Neural Network Visualization
 * ────────────────────────────────── */
function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // — Particle system (nodes) —
  const PARTICLE_COUNT = 180;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];
  const SPREAD = 22;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Distribute in a spherical cluster
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = SPREAD * (0.3 + Math.random() * 0.7);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.008,
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf0ece4,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // — Connection lines (pre-allocated single buffer) —
  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0xd4a843,
    transparent: true,
    opacity: 0.06,
  });

  const CONNECTION_DIST_SQ = 49; // 7 * 7 (avoids Math.sqrt in hot loop)
  const MAX_LINES = 2500;
  const linePositions = new Float32Array(MAX_LINES * 6);
  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  linesGeometry.setDrawRange(0, 0);

  const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(lines);

  function updateConnections() {
    const pos = particleGeometry.attributes.position.array;
    let lineIdx = 0;
    const maxFloats = MAX_LINES * 6;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x1 = pos[i3];
      const y1 = pos[i3 + 1];
      const z1 = pos[i3 + 2];

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const j3 = j * 3;
        const dx = x1 - pos[j3];
        const dy = y1 - pos[j3 + 1];
        const dz = z1 - pos[j3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < CONNECTION_DIST_SQ) {
          if (lineIdx + 6 <= maxFloats) {
            linePositions[lineIdx++] = x1;
            linePositions[lineIdx++] = y1;
            linePositions[lineIdx++] = z1;
            linePositions[lineIdx++] = pos[j3];
            linePositions[lineIdx++] = pos[j3 + 1];
            linePositions[lineIdx++] = pos[j3 + 2];
          }
        }
      }
    }
    linesGeometry.setDrawRange(0, lineIdx / 3);
    linesGeometry.attributes.position.needsUpdate = true;
  }

  // — Hero section visibility tracking (pauses render loop when scrolled past) —
  let isHeroVisible = true;
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    heroObserver.observe(heroEl);
  }

  // — Mouse interaction —
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // — Animation loop —
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);

    // Skip render calculations when hero is scrolled out of viewport
    if (!isHeroVisible) return;

    frame++;

    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Keep within bounds
      const distSq = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
      if (distSq > SPREAD * SPREAD) {
        velocities[i].x *= -1;
        velocities[i].y *= -1;
        velocities[i].z *= -1;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Rotate whole system slowly
    particles.rotation.y += 0.0008;
    particles.rotation.x = mouse.y * 0.15;
    particles.rotation.z = mouse.x * 0.05;

    // Update connections every 3 frames for optimal performance
    if (frame % 3 === 0) updateConnections();
    lines.rotation.copy(particles.rotation);

    renderer.render(scene, camera);
  }

  animate();
  updateConnections();

  // — Resize handler —
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ──────────────────────────────────
 *  DATA LOADING (Firebase or Fallback)
 * ────────────────────────────────── */
async function loadProjects() {
  let projects = FALLBACK_PROJECTS;

  if (firebaseReady) {
    try {
      await initFirestore();
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('[Projects] Firebase read failed, using fallback.', e);
    }
  }

  renderProjects(projects);
}

async function loadCertificates() {
  let certs = FALLBACK_CERTIFICATES;

  if (firebaseReady) {
    try {
      await initFirestore();
      const snap = await getDocs(collection(db, 'certificates'));
      if (!snap.empty) {
        certs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('[Certificates] Firebase read failed, using fallback.', e);
    }
  }

  renderCertificates(certs);
}

/* ──────────────────────────────────
 *  RENDER FUNCTIONS
 * ────────────────────────────────── */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map((p, i) => {
    const tags = (p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');
    const num = String(i + 1).padStart(2, '0');
    const featuredClass = p.featured ? 'featured' : '';

    return `
      <article class="project-card ${featuredClass} reveal">
        <div>
          <span class="project-number">PROJECT ${num}</span>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">${tags}</div>
        </div>
        <div style="display:flex;align-items:flex-end;">
          ${p.url ? `
            <a href="${p.url}" target="_blank" rel="noopener" class="project-link">
              View Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');

  // Re-observe new elements
  observeReveals();
}

function renderCertificates(certs) {
  const grid = document.getElementById('certificates-grid');
  if (!grid) return;

  grid.innerHTML = certs.map(c => {
    let iconHTML = '';
    const displayImgUrl = formatImageUrl(c.imageUrl);
    
    if (c.fileType === 'pdf' && c.imageUrl) {
      iconHTML = `
        <div class="cert-icon">
          <a href="${c.imageUrl}" target="_blank" rel="noopener" aria-label="View PDF">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </a>
        </div>
      `;
    } else if (displayImgUrl) {
      const directViewLink = c.imageUrl || displayImgUrl;
      iconHTML = `
        <div class="cert-image">
          <a href="${directViewLink}" target="_blank" rel="noopener" title="Lihat Sertifikat">
            <img src="${displayImgUrl}" alt="${c.name}" loading="lazy" onerror="this.onerror=null; this.closest('.cert-image').innerHTML='<div class=\\'cert-icon\\'><svg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><path d=\\'M12 15l-3 3 1.5 1.5L12 18l1.5 1.5L15 18l-3-3z\\'/><circle cx=\\'12\\' cy=\\'9\\' r=\\'5\\'/><path d=\\'M12 14v4\\'/></svg></div>';" />
          </a>
        </div>
      `;
    } else {
      iconHTML = `
        <div class="cert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15l-3 3 1.5 1.5L12 18l1.5 1.5L15 18l-3-3z"/><circle cx="12" cy="9" r="5"/><path d="M12 14v4"/></svg>
        </div>
      `;
    }

    const actionLink = c.url 
      ? `<a href="${c.url}" target="_blank" rel="noopener" class="cert-link">View Credential →</a>`
      : (c.imageUrl ? `<a href="${c.imageUrl}" target="_blank" rel="noopener" class="cert-link">View Certificate →</a>` : '');

    return `
      <div class="cert-card reveal">
        ${iconHTML}
        <div class="cert-info">
          <h4 class="cert-name">${c.name}</h4>
          <span class="cert-issuer">${c.issuer || ''}</span>
          ${actionLink}
        </div>
      </div>
    `;
  }).join('');

  observeReveals();
}

/* ──────────────────────────────────
 *  SCROLL REVEAL (IntersectionObserver)
 * ────────────────────────────────── */
let revealObserver = null;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
  }

  document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
    el.dataset.delay = (i % 6) * 80; // stagger within viewport
    revealObserver.observe(el);
  });
}

/* ──────────────────────────────────
 *  NAVIGATION
 * ────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // Scrollspy for active nav link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // Scroll detection
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile menu on link click
  document.querySelectorAll('[data-mobile-nav]').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  updateActiveNav();
}

/* ──────────────────────────────────
 *  SMOOTH SCROLL for nav links
 * ────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ──────────────────────────────────
 *  INIT
 * ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initNav();
  initSmoothScroll();
  observeReveals();
  loadProjects();
  loadCertificates();
});
