import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { randomRange } from "./utils";

function FireworksSpawner({ spawnFireworkAt }: { spawnFireworkAt: (position: THREE.Vector3) => void }) {
	const launchInterval = useRef<number | null>(null);
	const { camera, viewport } = useThree();
	useEffect(() => {
		launchInterval.current = setInterval(() => {
			// Calculate the desired Y position (bottom of the screen)
			const y = -25; // Add a small offset

			// Generate random X and Z within the viewport
			const x = randomRange(-25, 25);
			const z = randomRange(-15, 0); // Ensure the firework is in front of the camera

			const position = new THREE.Vector3(x, y, z);
			spawnFireworkAt(position);
		}, 500);

		return () => {
			if (launchInterval.current) {
				clearInterval(launchInterval.current);
			}
		};
	}, [spawnFireworkAt, camera, viewport]);

	return null;
}

export default FireworksSpawner;
