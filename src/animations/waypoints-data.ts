import * as THREE from 'three';

export interface Waypoint {
  id: string;
  name: string;
  cameraPosition: THREE.Vector3;
  target: THREE.Vector3;
  fov?: number;
}

export const waypoints: Waypoint[] = [
  {
    id: 'hero',
    name: 'Command Workstation // Hero',
    cameraPosition: new THREE.Vector3(-0.65, 1.02, 1.35),
    target: new THREE.Vector3(-0.78, 0.97, -0.1),
    fov: 45,
  },
  {
    id: 'about',
    name: 'Cognitive Profile // About',
    cameraPosition: new THREE.Vector3(0.65, 1.02, 1.35),
    target: new THREE.Vector3(0.78, 0.97, -0.1),
    fov: 45,
  },
  {
    id: 'projects',
    name: 'AI Hologram Carousel // Projects',
    cameraPosition: new THREE.Vector3(0, 1.45, -10.2),
    target: new THREE.Vector3(0, 1.42, -13.9),
    fov: 46,
  },
  {
    id: 'journey',
    name: 'Data River Monoliths // Timeline',
    cameraPosition: new THREE.Vector3(-0.4, 1.85, -31.5),
    target: new THREE.Vector3(0, 1.15, -39.0),
    fov: 46,
  },
  {
    id: 'contact',
    name: 'Command Terminal Screen // Contact',
    cameraPosition: new THREE.Vector3(0, 1.55, -57.5),
    target: new THREE.Vector3(0, 1.35, -60.0),
    fov: 45,
  },
];
