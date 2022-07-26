import Particle from "./particle";
import { random, gravity, randomDecimal, randomUnitVector } from "./utils";
import { canvas } from "./index";
export default class Firework {
	rocket: Particle;
	exploded: boolean;
	particles: Particle[];
	constructor(color: string, x?: number, y?: number) {
		if (x === undefined) {
			this.rocket = new Particle(random(0, canvas.width), canvas.height, color, true);
		} else {
			this.rocket = new Particle(x, y, color, true);
		}
		this.exploded = false;
		this.particles = [];
	}
	update = function (): void {
		if (!this.exploded) {
			this.rocket.applyForce(gravity);
			this.rocket.update();
			if (this.rocket.vy > 0) {
				// EXPLODE
				this.exploded = true;
				this.explode();
			}
		}
		for (let i = this.particles.length - 1; i >= 0; i--) {
			let p = this.particles[i];
			p.applyForce(gravity);
			p.update();
			if (p.lifespan < 0) {
				this.particles.splice(i, 1);
			}
		}
	};

	done = function (): boolean {
		return this.particles.length === 0 && this.exploded;
	};

	explode = function (): void {
		for (var i = 0; i < random(500, 1000); i++) {
			let p = new Particle(this.rocket.x, this.rocket.y, this.rocket.color);
			let force = randomUnitVector();
			force.x *= randomDecimal(-10, 10);
			force.y *= randomDecimal(-10, 10);
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
