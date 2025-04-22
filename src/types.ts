import * as THREE from "three";
export type FireworkType = {
	position: THREE.Vector3;
	id: number;
	isUserSpawned?: boolean;
	exploded: boolean;
	explosionRadius: number;
	numberOfParticles: number;
	explosionHeightOffset: number;
	baseParticleSize: number;
	particleSizeVariation: number;
	fadeDuration: number;
	colorFunction?: () => THREE.Color;
    trail?: boolean;
};

export type Particle = {
	position: THREE.Vector3;
	velocity: THREE.Vector3;
	color: THREE.Color;
	age: number;
	initialAge: number;
};
