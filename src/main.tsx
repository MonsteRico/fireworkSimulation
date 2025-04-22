import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Stars from "./Stars";
import { FireworkType } from "./types";
import FireworkRenderer from "./Firework";
import { colorWithVariation, randomRange } from "./utils";
import FireworksSpawner from "./FireworksSpawner";
import { BallFirework, BlueFirework, GreenFirework, RedFirework, UserFirework } from "./fireworks";
import "./index.css";
createRoot(document.getElementById("root")!).render(
	<div style={{ height: "100vh", background: "black" }}>
		<Canvas style={{ background: "black" }}>
			{" "}
			{/* Set canvas background color */}
			<Scene />
		</Canvas>
	</div>
);

function Scene() {
	const [fireworks, setFireworks] = useState<FireworkType[]>([]);
	const { camera, gl, viewport } = useThree(); // Get viewport
	const canvasRef = useRef<HTMLCanvasElement>(gl.domElement);

const handleCanvasClick = useCallback(
	(event: MouseEvent) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;

		const vector = new THREE.Vector3(x, y, 0.5);
		vector.unproject(camera);
		const dir = vector.sub(camera.position).normalize();
		const distance = -camera.position.z / dir.z;
		const pos = camera.position.clone().add(dir.multiplyScalar(distance));

		if (pos) {
			// Set a random z coordinate between -15 and 5
			const z =0;
			pos.z = z;

			setFireworks((fireworks) => [
				...fireworks,
				UserFirework({ position: pos, id: Math.random() }),
			]);
		}
	},
	[camera, viewport]
);


	useEffect(() => {
		const canvas = canvasRef.current;
		canvas?.addEventListener("click", handleCanvasClick);
		return () => {
			canvas?.removeEventListener("click", handleCanvasClick);
		};
	}, [handleCanvasClick]);

	const handleExplosion = useCallback((id: number) => {
		setFireworks((prevFireworks) => prevFireworks.map((fw) => (fw.id === id ? { ...fw, exploded: true } : fw)));
	}, []);

	camera.position.set(0, 0, 25);

	
	const FireworkOptions = [BallFirework, GreenFirework, RedFirework, BlueFirework];

	return (
		<>
			<ambientLight intensity={0.1} />
			<pointLight position={[10, 10, 10]} />
			<Stars count={250} /> {/* Add twinkling stars */}
			{fireworks.map((firework) => (
				<FireworkRenderer key={firework.id} firework={firework} onExplode={() => handleExplosion(firework.id)} />
			))}
			<FireworksSpawner
				spawnFireworkAt={(position: THREE.Vector3) => {
					setFireworks((fireworks) => [
						...fireworks,
						FireworkOptions[randomRange(0, FireworkOptions.length - 1, true)]({ position, id: Math.random() }),
					]);
				}}
			/>
		</>
	);
}
