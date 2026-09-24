import * as THREE from 'three';
import type { SkillNode } from '../data/skills-galaxy';

/**
 * Creates high-resolution 512x512 circular billboard glass badges with authentic logos
 * for all 18 machine learning competencies.
 * 
 * Razor-sharp, high-contrast vector rendering with ZERO bottom text (logo only)
 * and maximum anisotropic filtering.
 */
export function createSkillBadgeTexture(node: SkillNode): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = 216;

  // 1. Crisp Outer Glow Ring
  const glow = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.08);
  glow.addColorStop(0, hexToRgba(node.color, 0.45));
  glow.addColorStop(0.7, hexToRgba(node.color, 0.2));
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.save();
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. High-Contrast Glass Coin Body
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  const bgGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  bgGrad.addColorStop(0, 'rgba(18, 28, 48, 0.96)');
  bgGrad.addColorStop(0.6, 'rgba(10, 16, 30, 0.97)');
  bgGrad.addColorStop(1, 'rgba(6, 10, 20, 0.99)');
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // 3. Bold Outer Cluster-Colored Border
  ctx.lineWidth = 7;
  ctx.strokeStyle = node.color;
  ctx.stroke();

  // 4. Subtle Inner Accent Ring
  ctx.beginPath();
  ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.stroke();

  // 5. Specular Top Glass Arc
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.35, r * 0.58, Math.PI * 1.15, Math.PI * 1.85);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.stroke();
  ctx.restore();

  // 6. Draw Specific Authentic Logo (Centered, enlarged, NO text)
  ctx.save();
  drawLogo(ctx, node.id, cx, cy, node.color);
  ctx.restore();

  // Three.js Texture Configuration for Maximum Sharpness
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawLogo(ctx: CanvasRenderingContext2D, id: string, x: number, y: number, color: string) {
  ctx.translate(x, y);

  switch (id) {
    // ----------------------------------------------------
    // PyTorch: Official Torch Flame + Satellite Tensor Dot
    // ----------------------------------------------------
    case 'pytorch': {
      ctx.scale(1.9, 1.9);
      // Outer flame
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.bezierCurveTo(22, -28, 38, 4, 30, 32);
      ctx.bezierCurveTo(24, 58, -2, 62, 0, 62);
      ctx.bezierCurveTo(2, 62, -24, 58, -30, 32);
      ctx.bezierCurveTo(-38, 4, -22, -28, 0, -48);
      ctx.fillStyle = '#ee4c2c';
      ctx.fill();

      // Inner flame cutout
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(10, 22, 12, 40, 0, 52);
      ctx.bezierCurveTo(-12, 40, -10, 22, 0, 10);
      ctx.fillStyle = '#0a101e';
      ctx.fill();

      // Satellite tensor spark
      ctx.beginPath();
      ctx.arc(28, -28, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ee4c2c';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // Docker: Container Whale carrying modular stacks
    // ----------------------------------------------------
    case 'docker': {
      ctx.scale(2.0, 2.0);
      ctx.fillStyle = '#2496ed';

      // Container boxes on back
      const bw = 10;
      const bh = 8;
      const startX = -24;
      const startY = -22;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
          if (row === 0 && col === 0) continue; // classic docker indent
          ctx.fillRect(startX + col * 12, startY + row * 10, bw, bh);
        }
      }

      // Whale body
      ctx.beginPath();
      ctx.moveTo(-36, 6);
      ctx.bezierCurveTo(-36, -4, -25, 0, 15, 0);
      ctx.bezierCurveTo(32, 0, 38, -6, 44, -12);
      ctx.bezierCurveTo(46, 16, 25, 26, 5, 26);
      ctx.bezierCurveTo(-18, 26, -32, 22, -36, 6);
      ctx.fill();

      // Whale tail fin
      ctx.beginPath();
      ctx.moveTo(44, -12);
      ctx.lineTo(48, -22);
      ctx.lineTo(40, -16);
      ctx.lineTo(44, -12);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#0a101e';
      ctx.beginPath();
      ctx.arc(-22, 10, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // FastAPI: Electric Lightning Bolt
    // ----------------------------------------------------
    case 'fastapi': {
      ctx.scale(2.1, 2.1);
      ctx.beginPath();
      ctx.moveTo(12, -48);
      ctx.lineTo(-28, 0);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-14, 48);
      ctx.lineTo(28, -5);
      ctx.lineTo(5, -5);
      ctx.closePath();
      ctx.fillStyle = '#009688';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      break;
    }

    // ----------------------------------------------------
    // Google Gemini: 4-Point Radiant Spark Star
    // ----------------------------------------------------
    case 'gemini': {
      ctx.scale(2.1, 2.1);
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.bezierCurveTo(7, -14, 14, -7, 50, 0);
      ctx.bezierCurveTo(14, 7, 7, 14, 0, 50);
      ctx.bezierCurveTo(-7, 14, -14, 7, -50, 0);
      ctx.bezierCurveTo(-14, -7, -7, -14, 0, -50);
      ctx.closePath();

      const grad = ctx.createLinearGradient(-40, -40, 40, 40);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.fill();

      // Bright center core
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // OpenCV: Tri-Color Vision Aperture Rings
    // ----------------------------------------------------
    case 'opencv': {
      ctx.scale(2.0, 2.0);
      const ring = (rx: number, ry: number, c: string) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 16, 0, Math.PI * 2);
        ctx.lineWidth = 7.5;
        ctx.strokeStyle = c;
        ctx.stroke();
      };
      ring(0, -20, '#ef4444');    // Top Red
      ring(-20, 16, '#10b981');   // Left Green
      ring(20, 16, '#38bdf8');    // Right Blue

      // White center overlap point
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // MediaPipe: Skeletal Landmark Pose Tracking
    // ----------------------------------------------------
    case 'mediapipe': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Head
      ctx.beginPath();
      ctx.arc(0, -34, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Skeletal spine & limbs
      ctx.beginPath();
      ctx.moveTo(0, -27);
      ctx.lineTo(0, 6); // spine to pelvis

      // Shoulders & arms
      ctx.moveTo(-24, -14);
      ctx.lineTo(0, -16);
      ctx.lineTo(24, -14);
      ctx.moveTo(-24, -14);
      ctx.lineTo(-30, 10);
      ctx.moveTo(24, -14);
      ctx.lineTo(30, 10);

      // Pelvis & legs
      ctx.moveTo(0, 6);
      ctx.lineTo(-18, 38);
      ctx.moveTo(0, 6);
      ctx.lineTo(18, 38);
      ctx.stroke();

      // Landmarks dots
      const dots = [
        [0, -16], [-24, -14], [24, -14], [-30, 10], [30, 10],
        [0, 6], [-18, 38], [18, 38],
      ];
      for (const [dx, dy] of dots) {
        ctx.beginPath();
        ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      break;
    }

    // ----------------------------------------------------
    // Model Context Protocol (FastMCP): Tool Socket Bridge
    // ----------------------------------------------------
    case 'fastmcp': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Left socket box
      ctx.strokeRect(-28, -26, 22, 26);
      // Right socket box
      ctx.strokeRect(6, 0, 22, 26);

      // Connecting bus
      ctx.beginPath();
      ctx.moveTo(-6, -13);
      ctx.lineTo(6, -13);
      ctx.lineTo(6, 13);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Pin contacts
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(-17, -13, 4.5, 0, Math.PI * 2);
      ctx.arc(17, 13, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // Multi-Agent: Autonomous Orchestration Graph
    // ----------------------------------------------------
    case 'multiagent': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 4;

      // Triangle connections
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(-30, 22);
      ctx.lineTo(30, 22);
      ctx.closePath();
      ctx.stroke();

      // Central supervisor coordinator
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Outer agent nodes
      const agents = [[0, -30], [-30, 22], [30, 22]];
      for (const [ax, ay] of agents) {
        ctx.beginPath();
        ctx.arc(ax, ay, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      break;
    }

    // ----------------------------------------------------
    // LangChain: Interlocking Pill Links
    // ----------------------------------------------------
    case 'langchain': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      // Left link
      ctx.beginPath();
      ctx.arc(-12, 0, 18, Math.PI * 0.55, Math.PI * 1.85);
      ctx.stroke();

      // Right link
      ctx.beginPath();
      ctx.arc(12, 0, 18, Math.PI * 1.55, Math.PI * 2.85);
      ctx.stroke();

      // Interlocking bridge clasp
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();
      break;
    }

    // ----------------------------------------------------
    // Docker Sandboxing: Secure Execution Cube
    // ----------------------------------------------------
    case 'sandboxing': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';

      // Isometric cube box
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(30, -17);
      ctx.lineTo(30, 17);
      ctx.lineTo(0, 34);
      ctx.lineTo(-30, 17);
      ctx.lineTo(-30, -17);
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 34);
      ctx.moveTo(0, 0);
      ctx.lineTo(30, -17);
      ctx.moveTo(0, 0);
      ctx.lineTo(-30, -17);
      ctx.stroke();

      // Core lock indicator
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // Pinecone: Vector Coordinate Cluster
    // ----------------------------------------------------
    case 'faiss': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;

      // Cross axes
      ctx.beginPath();
      ctx.moveTo(-34, 0); ctx.lineTo(34, 0);
      ctx.moveTo(0, -34); ctx.lineTo(0, 34);
      ctx.stroke();

      // Proximity dashed circle around target
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dense neighbor points
      ctx.fillStyle = '#ffffff';
      const pts = [[-18, -12], [14, -20], [22, 14], [-12, 20]];
      for (const [px, py] of pts) {
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Query vector point
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // LangChain Retrieval Chain: Two-stream RAG Funnel
    // ----------------------------------------------------
    case 'hybrid_rag': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';

      // Two beams funneling into merged target
      ctx.beginPath();
      ctx.moveTo(-26, -26);
      ctx.lineTo(0, 18);
      ctx.lineTo(26, -26);
      ctx.stroke();

      // Vector index source disk
      ctx.beginPath();
      ctx.arc(-26, -26, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.fill();

      // Web search source disk
      ctx.beginPath();
      ctx.arc(26, -26, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.fill();

      // Merged ranking target
      ctx.beginPath();
      ctx.arc(0, 20, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 20, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // LangSmith: Observability Step Gauge
    // ----------------------------------------------------
    case 'langsmith': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 6;

      // Speedometer gauge arc
      ctx.beginPath();
      ctx.arc(0, 8, 30, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();

      // Needle pointer
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(18, -16);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Pivot dot
      ctx.beginPath();
      ctx.arc(0, 8, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      break;
    }

    // ----------------------------------------------------
    // Sentence Transformers: Tensor Brackets
    // ----------------------------------------------------
    case 'embeddings': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 6;
      ctx.lineCap = 'square';

      // Left bracket
      ctx.beginPath();
      ctx.moveTo(-18, -30);
      ctx.lineTo(-28, -30);
      ctx.lineTo(-28, 30);
      ctx.lineTo(-18, 30);
      ctx.stroke();

      // Right bracket
      ctx.beginPath();
      ctx.moveTo(18, -30);
      ctx.lineTo(28, -30);
      ctx.lineTo(28, 30);
      ctx.lineTo(18, 30);
      ctx.stroke();

      // Embedding vector bars
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -18, 32, 6);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-16, -3, 24, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-16, 12, 28, 6);
      break;
    }

    // ----------------------------------------------------
    // Google Cloud Platform: Multi-Arch Cloud
    // ----------------------------------------------------
    case 'gcp': {
      ctx.scale(2.0, 2.0);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';

      // Cloud silhouette
      ctx.beginPath();
      ctx.arc(-12, 0, 18, Math.PI * 0.6, Math.PI * 1.6);
      ctx.arc(8, -12, 16, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(20, 6, 14, Math.PI * 1.6, Math.PI * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Internal node dots
      ctx.fillStyle = '#ffffff';
      const dots = [[-8, 2], [6, -2], [16, 8]];
      for (const [dx, dy] of dots) {
        ctx.beginPath();
        ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // ----------------------------------------------------
    // CI/CD: Automated Git Pipeline Loop
    // ----------------------------------------------------
    case 'cicd': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';

      // Main trunk line
      ctx.beginPath();
      ctx.moveTo(-24, -20);
      ctx.lineTo(-24, 20);
      ctx.stroke();

      // Branch curve
      ctx.beginPath();
      ctx.moveTo(-24, -4);
      ctx.bezierCurveTo(-10, -4, 4, 10, 20, 10);
      ctx.lineTo(20, 20);
      ctx.stroke();

      // Git commit nodes
      ctx.fillStyle = '#ffffff';
      const commits = [[-24, -20], [-24, 20], [20, 20]];
      for (const [cx, cy] of commits) {
        ctx.beginPath();
        ctx.arc(cx, cy, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
      }
      break;
    }

    // ----------------------------------------------------
    // Bi-LSTM: Dual Temporal Waves
    // ----------------------------------------------------
    case 'bilstm': {
      ctx.scale(2.0, 2.0);
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';

      // Forward wave
      ctx.strokeStyle = '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(-32, -10);
      ctx.bezierCurveTo(-16, -32, 16, 12, 32, -10);
      ctx.stroke();

      // Backward wave
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(32, 10);
      ctx.bezierCurveTo(16, 32, -16, -12, -32, 10);
      ctx.stroke();

      // Time ticks
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
      ctx.lineWidth = 3;
      const ticks = [-20, 0, 20];
      for (const tx of ticks) {
        ctx.beginPath();
        ctx.moveTo(tx, -14);
        ctx.lineTo(tx, 14);
        ctx.stroke();
      }
      break;
    }

    // ----------------------------------------------------
    // SegFormer: Vision Transformer Segmentation Grid
    // ----------------------------------------------------
    case 'segformer': {
      ctx.scale(2.0, 2.0);
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 4;

      // 3x3 patch grid
      for (let i = 0; i <= 3; i++) {
        const p = -27 + i * 18;
        ctx.beginPath();
        ctx.moveTo(p, -27); ctx.lineTo(p, 27);
        ctx.moveTo(-27, p); ctx.lineTo(27, p);
        ctx.stroke();
      }

      // Masked lesion patches
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(-9, -9, 18, 18);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(9, -9, 18, 18);
      break;
    }

    default: {
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    }
  }
}
