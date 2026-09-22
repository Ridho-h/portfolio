import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundManager } from '../audio/soundManager';

gsap.registerPlugin(ScrollTrigger);

export interface SceneState {
  weights: number[];
  activeIndex: number;
  progress: number;
}

export const sceneState: SceneState = {
  weights: [1, 0, 0, 0, 0],
  activeIndex: 0,
  progress: 0,
};

type SceneChangeCallback = (index: number) => void;
type ProgressCallback = (progress: number) => void;

const changeListeners: SceneChangeCallback[] = [];
const progressListeners: ProgressCallback[] = [];

export function onSceneChange(cb: SceneChangeCallback) {
  changeListeners.push(cb);
  return () => {
    const idx = changeListeners.indexOf(cb);
    if (idx !== -1) changeListeners.splice(idx, 1);
  };
}

export function onScrollProgress(cb: ProgressCallback) {
  progressListeners.push(cb);
  return () => {
    const idx = progressListeners.indexOf(cb);
    if (idx !== -1) progressListeners.splice(idx, 1);
  };
}

let masterTimeline: gsap.core.Timeline | null = null;

// Center fraction for each station plateau along the runway (5 stations)
export const stationFractions = [0.05, 0.28, 0.50, 0.72, 0.95];

export function getStationScrollFraction(index: number): number {
  const safeIdx = Math.max(0, Math.min(4, index));
  return stationFractions[safeIdx];
}

export function setupSceneTriggers(triggerElement: HTMLElement) {
  if (masterTimeline) {
    masterTimeline.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }

  // Reset initial state
  sceneState.weights = [1, 0, 0, 0, 0];
  sceneState.activeIndex = 0;
  sceneState.progress = 0;

  // Master timeline scrubbed to the flight runway with generous rest plateaus
  masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        sceneState.progress = self.progress;
        progressListeners.forEach((cb) => cb(self.progress));

        // Find dominant scene index
        let maxWeight = -1;
        let maxIdx = 0;
        for (let i = 0; i < sceneState.weights.length; i++) {
          if (sceneState.weights[i] > maxWeight) {
            maxWeight = sceneState.weights[i];
            maxIdx = i;
          }
        }

        if (maxIdx !== sceneState.activeIndex) {
          sceneState.activeIndex = maxIdx;
          soundManager.playSwoosh();
          changeListeners.forEach((cb) => cb(maxIdx));
        }
      },
    },
  });

  // Total duration: 8.2 units across 5 stations
  // Station 0 (Hero): Workstation Left Screen (t = 0 to 1.0)
  // Leg 0 -> 1: Glide from Left Monitor to Right Monitor (t = 1.0 to 1.8)
  masterTimeline.to(
    sceneState.weights,
    { 0: 0, 1: 1, ease: 'power2.inOut', duration: 0.8 },
    1.0
  );

  // Station 1 (About): Workstation Right Screen (t = 1.8 to 2.8)
  // Leg 1 -> 2: Takeoff from Workstation to 3D Flying Project Cards (t = 2.8 to 3.6)
  masterTimeline.to(
    sceneState.weights,
    { 1: 0, 2: 1, ease: 'power2.inOut', duration: 0.8 },
    2.8
  );

  // Station 2 (Projects): 3D Flying Holograms (t = 3.6 to 4.6)
  // Leg 2 -> 3: Flight along Runway to Data River (t = 4.6 to 5.4)
  masterTimeline.to(
    sceneState.weights,
    { 2: 0, 3: 1, ease: 'power2.inOut', duration: 0.8 },
    4.6
  );

  // Station 3 (Timeline): Data Stream River (t = 5.4 to 6.4)
  // Leg 3 -> 4: Flight to Command Terminal Beacon (t = 6.4 to 7.2)
  masterTimeline.to(
    sceneState.weights,
    { 3: 0, 4: 1, ease: 'power2.inOut', duration: 0.8 },
    6.4
  );

  // Station 4 (Contact): Command Terminal Beacon holds until end (t = 7.2 to 8.2)
  masterTimeline.to(
    {},
    { duration: 1.0 },
    7.2
  );

  return masterTimeline;
}
