import * as THREE from 'three';
import { waypoints } from './waypoints-data';

/**
 * Calculates the weighted average of multiple 3D vectors.
 * As weights shift smoothly via GSAP, the camera position and target
 * glide along a continuous curved path without discontinuities.
 */
export function weightedAverage(points: THREE.Vector3[], weights: number[]): THREE.Vector3 {
  const result = new THREE.Vector3(0, 0, 0);
  let totalWeight = 0;

  for (let i = 0; i < points.length; i++) {
    const w = Math.max(0, weights[i] || 0);
    if (w > 0.0001) {
      result.addScaledVector(points[i], w);
      totalWeight += w;
    }
  }

  if (totalWeight > 0.00001) {
    result.divideScalar(totalWeight);
  } else if (points.length > 0) {
    result.copy(points[0]);
  }

  return result;
}

export class CameraWaypointManager {
  private camera: THREE.PerspectiveCamera;
  private cameraPositions: THREE.Vector3[];
  private targetPositions: THREE.Vector3[];
  
  // Current interpolated state
  public currentPosition: THREE.Vector3 = new THREE.Vector3();
  public currentTarget: THREE.Vector3 = new THREE.Vector3();

  // Parallax offset from mouse
  public mouseOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  public smoothMouse: THREE.Vector2 = new THREE.Vector2(0, 0);

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.cameraPositions = waypoints.map((w) => w.cameraPosition);
    this.targetPositions = waypoints.map((w) => w.target);

    // Initial position
    if (waypoints.length > 0) {
      this.currentPosition.copy(waypoints[0].cameraPosition);
      this.currentTarget.copy(waypoints[0].target);
      this.camera.position.copy(this.currentPosition);
      this.camera.lookAt(this.currentTarget);
    }

    this.initMouseListeners();
  }

  private initMouseListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('pointermove', (e) => {
      // Normalize to [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouseOffset.set(nx, ny);
    }, { passive: true });
  }

  /**
   * Update camera position and lookAt based on scene weights and mouse parallax.
   * Call inside requestAnimationFrame.
   */
  public update(weights: number[], delta: number = 0.016) {
    // 1. Calculate base waypoint target
    const targetPos = weightedAverage(this.cameraPositions, weights);
    const targetLookAt = weightedAverage(this.targetPositions, weights);

    // 2. Smoothly damp mouse parallax
    this.smoothMouse.x += (this.mouseOffset.x - this.smoothMouse.x) * 0.05;
    this.smoothMouse.y += (this.mouseOffset.y - this.smoothMouse.y) * 0.05;

    // Apply mouse parallax to camera position (subtle, non-disorienting)
    const parallaxX = this.smoothMouse.x * 0.35;
    const parallaxY = this.smoothMouse.y * 0.25;

    // 3. Smoothly damp current camera position towards target
    const lerpFactor = Math.min(1, delta * 6.0);
    this.currentPosition.lerp(targetPos, lerpFactor);
    this.currentTarget.lerp(targetLookAt, lerpFactor);

    // 4. Update Three.js camera
    this.camera.position.set(
      this.currentPosition.x + parallaxX,
      this.currentPosition.y + parallaxY,
      this.currentPosition.z
    );

    this.camera.lookAt(
      this.currentTarget.x + parallaxX * 0.2,
      this.currentTarget.y + parallaxY * 0.2,
      this.currentTarget.z
    );
  }
}
