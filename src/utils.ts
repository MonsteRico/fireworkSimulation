//A `random` helper function
export function random(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDecimal(min: number, max: number): number {
	return Math.random() * (max - min + 1) + min;
}

export function randomUnitVector(): { x: number; y: number } {
	let angle = randomDecimal(0, Math.PI * 2);
	return {
		x: Math.cos(angle),
		y: Math.sin(angle),
	};
}

export function randomVectorOnHeart(size: number): { x: number; y: number } {
	let theta = randomDecimal(0, Math.PI * 2);
	let x = 16 * Math.pow(Math.sin(theta), 3);
	let y = -1 * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));
	return {
		x: x * size,
		y: y * size,
	};
}

export const gravity = { x: 0, y: 0.2 };
export const wind = { x: -0.01, y: 0 };
