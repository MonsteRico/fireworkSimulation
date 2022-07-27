import Particle from "./particle";
import { random, gravity, randomDecimal, randomUnitVector, randomVectorOnHeart, wind, sleep } from "./utils";
import { canvas } from "./index";
import { ExplosionType } from "./types";

export default class Firework {
	rocket: Particle;
	exploded: boolean;
	particles: Particle[];
	explosionType: ExplosionType;
	constructor(color: string, x: number, y: number, type?: ExplosionType) {
		if (x === undefined) {
			this.rocket = new Particle(random(0, canvas.width), canvas.height, color, true, -1, -1);
		} else {
			this.rocket = new Particle(x, y, color, true, -1, -1);
		}
		this.explosionType = type || ExplosionType.Burst;
		this.exploded = false;
		this.particles = [];
	}

	update = function (): void {
		if (!this.exploded) {
			this.rocket.applyForce(gravity);
			this.rocket.applyForce(wind);
			this.rocket.update();
			if (this.rocket.vy > 0) {
				// EXPLODE
				this.explode(this.explosionType);
			}
		}
		for (let i = this.particles.length - 1; i >= 0; i--) {
			let p: Particle = this.particles[i];
			p.applyForce(gravity);
			p.applyForce(wind);
			p.update();
			if (p.lifespan < 0) {
				this.particles.splice(i, 1);
			}
		}
	};

	done = function (): boolean {
		return this.exploded && this.particles.length === 0;
	};

	explode = function (type?: ExplosionType): void {
		this.exploded = true;
		switch (type) {
			case ExplosionType.Burst:
				this.explodeBurst();
				break;
			case ExplosionType.Heart:
				this.explodeHeart();
				break;
			case ExplosionType.FilledInHeart:
				this.explodeHeart(true);
				break;
			case ExplosionType.Star:
				this.explodeStar();
				break;
			case ExplosionType.Fountain:
				this.explodeFountain();
				break;
			case ExplosionType.Smile:
				this.explodeSmile();
				break;
			case ExplosionType.Sparkle:
				this.explodeSparkle();
				break;
			default:
				this.explodeBurst();
				break;
		}
	};

	explodeStar = function (): void {};

	explodeFountain = function (): void {
		for (var i = 0; i < random(200, 300); i++) {
			let p = new Particle(this.rocket.x, this.rocket.y, this.rocket.color, false, 100, 100);
			let force = randomUnitVector();
			force.x *= random(-10, 10);
			force.y *= random(-10, 10);
			p.applyForce(force);
			this.particles.push(p);
		}
	};

	explodeSmile = function (): void {};

	explodeSparkle = function (): void {
		for (var i = 0; i < random(200, 400); i++) {
			let lifespan = random(0, 100);
			if (Math.random() < 0.5) {
				lifespan = 0;
			}
			let p = new Particle(this.rocket.x, this.rocket.y, this.rocket.color, false, 0, lifespan);
			let force = randomUnitVector();
			force.x *= random(-10, 10);
			force.y *= random(-10, 10);
			p.applyForce(force);
			this.particles.push(p);
		}
	};

	explodeBurst = function (): void {
		for (var i = 0; i < random(300, 500); i++) {
			let p = new Particle(this.rocket.x, this.rocket.y, this.rocket.color, false, -1, -1);
			let force = randomUnitVector();
			force.x *= random(-10, 10);
			force.y *= random(-10, 10);
			p.applyForce(force);
			this.particles.push(p);
		}
	};

	explodeHeart = function (filled?: boolean): void {
		let heartSize;
		if (filled) {
			heartSize = randomDecimal(0.01, 0.05);
		} else {
			heartSize = randomDecimal(0.1, 0.3);
		}
		for (var i = 0; i < random(300, 500); i++) {
			let p = new Particle(this.rocket.x, this.rocket.y, this.rocket.color, false, -1, -1);
			let force;
			if (!filled) {
				// heart
				force = randomVectorOnHeart(heartSize);
			} else {
				// filled in heart
				force = randomVectorOnHeart(heartSize);
				let size = randomDecimal(0.05, 0.1);
				force.x *= size;
				force.y *= size;
			}
			p.applyForce(force);
			this.particles.push(p);
		}
	};

	draw = function (ctx: CanvasRenderingContext2D): void {
		if (!this.exploded) {
			this.rocket.draw(ctx);
		}
		for (let p of this.particles) {
			p.draw(ctx);
		}
	};
}
