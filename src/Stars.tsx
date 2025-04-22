import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FireworkType } from "./types";
import FireworkRenderer from "./Firework";
interface StarsProps {
	count: number;
}

function Stars({ count }: StarsProps) {
	const cameraZ = 10; // how far back the stars are (lower number == further away)
	const numberOfStars = count;
	const starGeometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
	const starMaterial = useRef<THREE.PointsMaterial>(
		new THREE.PointsMaterial({
			size: 0.05, // Size of the stars
			color: 0xffffff, // White color for the stars
			transparent: true, // Make the stars transparent
			opacity: 0.8, // Base opacity of the stars
			sizeAttenuation: true, // Enable size attenuation for distant stars
			depthWrite: false, // Prevents stars from occluding objects
		})
	);
	const starRef = useRef<THREE.Points>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);

	useFrame(() => {
		if (cameraRef.current) {
			starRef.current.position.x = cameraRef.current.position.x; // = camera.position.x;
			starRef.current.position.y = cameraRef.current.position.y; // = camera.position.y;
		}
	});

	useMemo(() => {
		// const starMaterial = new THREE.PointsMaterial({
		// 	size: 0.05, // Size of the stars
		// 	color: 0xffffff, // White color for the stars
		// 	transparent: true, // Make the stars transparent
		// 	opacity: 0.8, // Base opacity of the stars
		// 	sizeAttenuation: true, // Enable size attenuation for distant stars
		// 	depthWrite: false, // Prevents stars from occluding objects
		// });
		// create sphere geometry
		const positions = new Float32Array(numberOfStars * 3);
		for (let i = 0; i < numberOfStars; i++) {
			const i3 = i * 3;
			positions[i3 + 0] = (Math.random() - 0.5) * 2 * (-50 / 2);
			positions[i3 + 1] = (Math.random() - 0.5) * 2 * (50 / 2);
			positions[i3 + 2] = (Math.random() - 0.5) * cameraZ;
		}

		starGeometry.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		// // create the particle system
	}, []);
	return (
		<group ref={starRef}>
			<perspectiveCamera ref={cameraRef} position={[0, 0, cameraZ]} />
			<points geometry={starGeometry.current} material={starMaterial.current} />
		</group>
	);
}

export default Stars;
