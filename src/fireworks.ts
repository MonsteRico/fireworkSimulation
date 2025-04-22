import { FireworkType } from "./types";
import * as THREE from "three";
import { colorWithVariation, randomRange } from "./utils";

function BallFirework({ id, position }: { id: number; position: THREE.Vector3 }) :
FireworkType {
	return {
		id,
		position,
		explosionRadius: randomRange(1, 3),
		numberOfParticles: randomRange(200, 400),
		explosionHeightOffset: randomRange(25, 40),
		baseParticleSize: 0.1,
		particleSizeVariation: 0.2,
		fadeDuration: randomRange(1, 2),
        exploded: false,
	};
}

function GreenFirework({ id, position }: { id: number; position: THREE.Vector3 }) {
	return {
		...BallFirework({ id, position }),
		colorFunction: () => colorWithVariation(new THREE.Color("green")),
	};
}

function RedFirework({ id, position }: { id: number; position: THREE.Vector3 }) {
	return {
		...BallFirework({ id, position }),
		colorFunction: () => colorWithVariation(new THREE.Color("red")),
	};
}

function BlueFirework({ id, position }: { id: number; position: THREE.Vector3 }) {
	return {
		...BallFirework({ id, position }),
		colorFunction: () => colorWithVariation(new THREE.Color("blue")),
	};
}

function UserFirework({ id, position }: { id: number; position: THREE.Vector3 }) {
	return {
		id,
		position,
		explosionRadius: randomRange(1, 3),
		numberOfParticles: randomRange(200, 400),
		explosionHeightOffset: randomRange(15, 30),
		baseParticleSize: 0.1,
		particleSizeVariation: 0.2,
		fadeDuration: randomRange(1, 2),
		exploded: false,
		isUserSpawned: true,
        trail:true
	};
}

export { BallFirework, GreenFirework, RedFirework, BlueFirework, UserFirework };