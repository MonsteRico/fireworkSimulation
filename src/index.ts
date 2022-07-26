// Based on https://youtu.be/CKeyIbT3vXI
export const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
//Create output text to display the frame rate
const output: HTMLParagraphElement = document.createElement("p");
document.body.appendChild(output);
const debug: boolean = true;

//Set the frame rate
const fps: number = 60;
//Get the start time
let start: number = Date.now();
//Set the frame duration in milliseconds
const frameDuration: number = 1000 / fps;
//Initialize the lag offset
let lag: number = 0;
var keys: boolean[] = [];
var animFrame: number;
var actualFps: number;
import Firework from "./firework";
import Particle from "./particle";
import { random } from "./utils";
let fireworks: Firework[] = [];

function setup() {
	canvas.width = window.innerWidth - 100;
	canvas.height = window.innerHeight - 100;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	gameLoop();
}

function gameLoop(): void {
	animFrame = requestAnimationFrame(gameLoop);

	//Calcuate the time that has elapsed since the last frame
	var current = Date.now(),
		elapsed = current - start;
	start = current;
	//Add the elapsed time to the lag counter
	lag += elapsed;

	processInput();
	//Update the frame if the lag counter is greater than or
	//equal to the frame duration
	while (lag >= frameDuration) {
		//Update the logic
		update();
		//Reduce the lag counter by the frame duration
		lag -= frameDuration;
	}
	//Calculate the lag offset and use it to render the objects
	render();

	//Frame data output:
	actualFps = Math.floor(1000 / elapsed);
	if (debug) {
		output.innerHTML = "ms: " + elapsed + " fps: " + actualFps;
		output.innerHTML += " lag: " + Math.floor(lag);
	}
}

function processInput(): void {}

//The game logic
function update(): void {
	if (Math.random() < 0.01) {
		fireworks.push(
			new Firework(`rgb(
        ${Math.floor(255 * Math.random())},
        ${Math.floor(255 * Math.random())},
        0)`)
		);
	}
	for (let i = fireworks.length - 1; i >= 0; i--) {
		fireworks[i].update();
		if (fireworks[i].done()) {
			fireworks.splice(i, 1);
		}
	}
}

//The renderer
function render(): void {
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (let i = fireworks.length - 1; i >= 0; i--) {
		fireworks[i].draw(ctx);
	}
}

setup();

function getMousePosition(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	return { x: x, y: y };
}

canvas.addEventListener("mousedown", function (e) {
	let mousePos = getMousePosition(canvas, e);
	fireworks.push(
		new Firework(
			`rgb(${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())},${Math.floor(
				255 * Math.random()
			)})`,
			mousePos.x,
			mousePos.y
		)
	);
});
