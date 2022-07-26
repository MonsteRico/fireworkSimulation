import { random } from "./utils";
export default class Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	ax: number;
	ay: number;
	size: number;
	color: string;
	rocket: boolean;
	lifespan: number;
	previousPostitions: { x: number; y: number }[] = [];
	constructor(x: number, y: number, color: string, rocket?: boolean) {
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.rocket = rocket;
		this.lifespan = 255;
		if (rocket) {
			this.vy = random(-15, -7);
			this.size = 5;
		} else {
			this.vy = 0;
			this.size = random(1, 3);
		}
		this.ax = 0;
		this.ay = 0;
		this.color = color;
	}
	applyForce(force: { x: number; y: number }): void {
		this.ax += force.x;
		this.ay += force.y;
	}

	update = function (): void {
		if (!this.rocket) {
			this.vy *= 0.95;
			this.vx *= 0.95;
			this.lifespan -= 3;
		}
		if (this.lifespan < 0) {
			this.lifespan = 0;
		}
		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
		this.ax = 0;
		this.ay = 0;
		this.previousPostitions.push({ x: this.x, y: this.y });
		if (this.previousPostitions.length > 6) {
			this.previousPostitions.shift();
		}
	};

	draw = function (ctx: CanvasRenderingContext2D): void {
		ctx.shadowColor = this.color;
		ctx.shadowBlur = this.size * 1.5;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		for (let i = 0; i < this.previousPostitions.length; i++) {
			ctx.globalAlpha = ((i / this.previousPostitions.length) * this.lifespan) / 255;
			let p = this.previousPostitions[i];
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(p.x, p.y, this.size, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.closePath();
		}
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.globalAlpha = 1;
	};
}
