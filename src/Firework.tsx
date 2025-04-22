import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GRAVITY } from "./constants";
import { FireworkType, Particle } from "./types";
import { randomRange } from "./utils";

function FireworkRenderer({ firework, onExplode }: { firework: FireworkType; onExplode: () => void }) {
	const [particles, setParticles] = useState<Particle[]>([]);
	const particlesRef = useRef<Particle[]>([]);
	const geometryRef = useRef<THREE.BufferGeometry>(null);
	const launchHeight = useRef(0);
	const [isLaunched, setIsLaunched] = useState(false);
	const [currentPosition, setCurrentPosition] = useState(firework.position);
	const [hasExploded, setHasExploded] = useState(false);
	const [rocketVisible, setRocketVisible] = useState(true);

	const numberOfParticles = firework.numberOfParticles;
	const explosionRadius = firework.explosionRadius;
	const particleSize = firework.baseParticleSize;
	const fadeDuration = firework.fadeDuration;
	const launchSpeed = firework.explosionHeightOffset; // Adjusted launch speed
	const explosionHeightOffset = firework.explosionHeightOffset; // Increased height offset
	const initialPosition = firework.position;

	useEffect(() => {
		if (!isLaunched) {
			setIsLaunched(true);
			launchHeight.current = initialPosition.y;
			setCurrentPosition(initialPosition); // Initialize currentPosition
		}
	}, [isLaunched, initialPosition]);

	useFrame((state, delta) => {
		if (isLaunched && !hasExploded) {
			// Adjust the condition to launch higher
			if (currentPosition.y < launchHeight.current + explosionHeightOffset) {
				const newY = currentPosition.y + launchSpeed * delta;
				setCurrentPosition(new THREE.Vector3(currentPosition.x, newY, currentPosition.z));
			} else {
				// Explode
				setHasExploded(true);
				setRocketVisible(false);
				onExplode(); // Notify the parent component

				const initialParticles = Array.from({ length: numberOfParticles }, () => {
					const position = new THREE.Vector3().randomDirection().multiplyScalar(explosionRadius);
					const velocity = position
						.clone()
						.normalize()
						.multiplyScalar(Math.random() * 2 + 1);
					const age = 0; // Initialize age
					return {
						position: position.add(currentPosition),
						velocity,
						color: firework.colorFunction ? firework.colorFunction() : new THREE.Color().setHSL(Math.random(), 1, 0.5),
						age,
						initialAge: age,
					};
				});
				setParticles(initialParticles);
				particlesRef.current = initialParticles;
			}
		}

		if (hasExploded && particles.length > 0) {
			const updatedParticles = particlesRef.current.map((particle) => {
				const newPosition = particle.position.clone().add(particle.velocity.clone().multiplyScalar(delta));
				const newAge = particle.age + delta;
				particle.velocity.y -= GRAVITY * delta; // Apply gravity

				return {
					...particle,
					position: newPosition,
					age: newAge,
				};
			});

			particlesRef.current = updatedParticles; // Update the ref

			if (geometryRef.current) {
				const positions = new Float32Array(updatedParticles.length * 3);
				const colors = new Float32Array(updatedParticles.length * 3);
				let allParticlesFaded = true; // Assume all are faded initially

				updatedParticles.forEach((particle, index) => {
					positions[index * 3] = particle.position.x;
					positions[index * 3 + 1] = particle.position.y;
					positions[index * 3 + 2] = particle.position.z;

					// Calculate fade factor
					const fadeFactor = Math.max(0, 1 - particle.age / fadeDuration);

					// Apply fade to color
					const fadedColor = new THREE.Color().copy(particle.color).multiplyScalar(fadeFactor);

					colors[index * 3] = fadedColor.r;
					colors[index * 3 + 1] = fadedColor.g;
					colors[index * 3 + 2] = fadedColor.b;

					if (fadeFactor > 0) {
						allParticlesFaded = false; // At least one particle is not faded
					}
				});

				geometryRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
				geometryRef.current.setAttribute("color", new THREE.BufferAttribute(colors, 3));
				geometryRef.current.attributes.position.needsUpdate = true;
				geometryRef.current.attributes.color.needsUpdate = true;

				// If all particles are faded, remove them
				if (allParticlesFaded) {
					setParticles([]);
				}
			}
		}
	});

	useEffect(() => {
		if (particles.length > 0) {
			const geometry = new THREE.BufferGeometry();
			geometryRef.current = geometry;

			const positions = new Float32Array(particles.length * 3);
			const colors = new Float32Array(particles.length * 3);

			particles.forEach((particle, index) => {
				positions[index * 3] = particle.position.x;
				positions[index * 3 + 1] = particle.position.y;
				positions[index * 3 + 2] = particle.position.z;

				colors[index * 3] = particle.color.r;
				colors[index * 3 + 1] = particle.color.g;
				colors[index * 3 + 2] = particle.color.b;
			});

			geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
			geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

			const material = new THREE.PointsMaterial({
				size: particleSize + randomRange(0, firework.particleSizeVariation),
				vertexColors: true,
				transparent: true,
				opacity: 1,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
			});

			setGeometry(geometry);
			setMaterial(material);
		}
	}, [particles, particleSize]);

	const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
	const [material, setMaterial] = useState<THREE.PointsMaterial | null>(null);

	return (
		<>
			{rocketVisible && (
				<mesh position={currentPosition}>
					<sphereGeometry args={[0.2, 32, 32]} />
					<meshBasicMaterial color={firework.colorFunction ? firework.colorFunction() : new THREE.Color("white")} />
				</mesh>
			)}
			{particles.length > 0 && geometry && material && (
				<points
					geometry={geometry}
					material={material}
					position={undefined} // Removed position prop here
				/>
			)}
		</>
	);
}

export default FireworkRenderer;
