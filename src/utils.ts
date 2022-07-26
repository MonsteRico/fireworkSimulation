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

export const gravity = { x: 0, y: 0.2 };
