import * as THREE from "three";
export function colorWithVariation(baseColor: THREE.Color) {
	return new THREE.Color().setRGB(baseColor.r + Math.random() * 0.2, baseColor.g + Math.random() * 0.2, baseColor.b + Math.random() * 0.2);
}

export function randomRange(min: number, max: number, wholeNumbers = false) {
	const range = max - min;
	const randomNumber = Math.random() * range + min;
	return wholeNumbers ? Math.round(randomNumber) : randomNumber;
}