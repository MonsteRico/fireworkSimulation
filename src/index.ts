// Based on https://youtu.be/CKeyIbT3vXI
export const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false });
//Create output text to display the frame rate
const output: HTMLParagraphElement = document.createElement("p");
document.body.appendChild(output);
const settingsDiv = document.getElementById("settings");
const debug: boolean = true;

//Set the frame rate
const fps: number = 60;
//Get the start time
let start: number = Date.now();
//Set the frame duration in milliseconds
const frameDuration: number = 1000 / fps;
//Initialize the lag offset
let lag: number = 0;
var animFrame: number;
var actualFps: number;
import Firework from "./firework";
import { ExplosionType } from "./types";
import { gravity, random, wind } from "./utils";
let fireworks: Firework[] = [];
let skyColor: string;
let clickColor: string = "#00ff00";
let clickType: ExplosionType = ExplosionType.Burst;
function setup() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	// set the sky color to a night blue or sky blue color depending on the time of day
	skyColor = "#0f0f1f";
	// set the canvas background color to the sky color
	ctx.fillStyle = skyColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// set canvas position to be absolute top left corner
	canvas.style.position = "absolute";
	canvas.style.top = "-1px";
	canvas.style.left = "-1px";
	// position the output in the top left corner and make it white
	output.style.position = "absolute";
	output.style.top = "-5px";
	output.style.left = "5px";
	output.style.color = "white";
	// position settings div at the bottom of the canvas, centered, white text, and z-index of 100
	settingsDiv.style.position = "absolute";
	settingsDiv.style.bottom = "0px";
	settingsDiv.style.left = `${canvas.width / 2 - settingsDiv.offsetWidth / 2}px`;
	settingsDiv.style.textAlign = "center";
	settingsDiv.style.color = "white";
	settingsDiv.style.zIndex = "100";
	gameLoop();
}

function gameLoop(): void {
	//Calcuate the time that has elapsed since the last frame
	var current = Date.now(),
		elapsed = current - start;
	start = current;
	//Add the elapsed time to the lag counter
	lag += elapsed;

	//	processInput();
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
		output.innerHTML = "ms: " + elapsed + " actual fps: " + actualFps;
		output.innerHTML += " lag: " + Math.floor(lag);
	}
	animFrame = requestAnimationFrame(gameLoop);
}

let autoCheckbox = document.getElementById("autoCheckbox") as HTMLInputElement;

//The game logic
function update(): void {
	if (Math.random() < 0.01 && autoCheckbox.checked && fireworks.length < 10) {
		// pick a random bright color
		let fireworkColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
		// pick a random type of firework from the enum
		let fireworkNum = random(0, Object.keys(ExplosionType).length - 1);
		let fireworkType: ExplosionType;
		switch (fireworkNum) {
			case 0:
				fireworkType = ExplosionType.Burst;
				break;
			case 1:
				fireworkType = ExplosionType.Sparkle;
				break;
			case 2:
				fireworkType = ExplosionType.Heart;
				break;
			case 3:
				fireworkType = ExplosionType.FilledInHeart;
				break;
			case 4:
				fireworkType = ExplosionType.Fountain;
				break;
			default:
				fireworkType = ExplosionType.Burst;
				break;
		}
		fireworks.push(new Firework(fireworkColor, random(0, canvas.width), canvas.height, fireworkType));
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
	ctx.fillStyle = skyColor;
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (let i = fireworks.length - 1; i >= 0; i--) {
		fireworks[i].draw(ctx);
	}
}

setup();

function getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	return { x: x, y: y };
}

canvas.addEventListener("mousedown", function (e) {
	if (fireworks.length < 10) {
		let mousePos = getMousePosition(canvas, e);
		if (clickColor == "random") {
			let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
			fireworks.push(new Firework(randomColor, mousePos.x, mousePos.y, clickType));
		} else {
			fireworks.push(new Firework(clickColor, mousePos.x, mousePos.y, clickType));
		}
	}
});

const resize = () => {
	cancelAnimationFrame(animFrame);
	setup();
};

window.addEventListener("resize", resize);

// add an onchange to the colorDropdown to change the color of the fireworks
const colorDropdown = document.getElementById("colorDropdown") as HTMLSelectElement;
colorDropdown.onchange = function () {
	clickColor = colorDropdown.value.toLowerCase();
};

// add an onchange to the typeDropdown to change the type of the fireworks
const typeDropdown = document.getElementById("typeDropdown") as HTMLSelectElement;
typeDropdown.onchange = function () {
	switch (typeDropdown.value) {
		case "Burst":
			clickType = ExplosionType.Burst;
			break;
		case "Heart":
			clickType = ExplosionType.Heart;
			break;
		case "Filled Heart":
			clickType = ExplosionType.FilledInHeart;
			break;
		case "Fountain":
			clickType = ExplosionType.Fountain;
			break;
		case "Sparkle":
			clickType = ExplosionType.Sparkle;
			break;
		default:
			clickType = ExplosionType.Burst;
			break;
	}
};

// add onclick to gravity range to change the gravity
const gravityRange = document.getElementById("gravityRange") as HTMLInputElement;
gravityRange.onchange = function () {
	document.getElementById("gravityLabel").innerHTML = "Gravity: " + -1 * gravityRange.valueAsNumber;
	gravity.y = gravityRange.valueAsNumber;
};

// add onclick to wind range to change the wind
const windRange = document.getElementById("windRange") as HTMLInputElement;
windRange.onchange = function () {
	document.getElementById("windLabel").innerHTML = "Wind: " + windRange.valueAsNumber;
	wind.x = windRange.valueAsNumber;
};
