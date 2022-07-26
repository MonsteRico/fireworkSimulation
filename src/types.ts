export interface ParticleType {
	x: number;
	y: number;
	vx: number;
	vy: number;
	ax: number;
	ay: number;
	size: number;
	color: string;
	update(): void;
	draw(ctx: CanvasRenderingContext2D): void;
}

export enum ExplosionType {
	Burst = "burst",
	Heart = "heart",
	FilledInHeart = "filledInHeart",
}
