import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PulsarBeamsProps {
  jetLength?: number;
  jetRadius?: number;
  particleCount?: number;
  rotationSpeed?: number;
  startColor?: string;
  endColor?: string;
}

const PulsarBeams: React.FC<PulsarBeamsProps> = ({
  jetLength = 150,
  jetRadius = 2,
  particleCount = 5000,
  rotationSpeed = 0.001,
  startColor = "#4444ff",
  endColor = "#ffffff",
}) => {
  const jetRef = useRef<THREE.Points>(null);

  const [positions, velocities, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const startColorObj = new THREE.Color(startColor);
    const endColorObj = new THREE.Color(endColor);

    for (let i = 0; i < particleCount; i++) {
      // Initialize two jets (one up, one down)
      const isUpwardJet = i < particleCount / 2;
      const y = isUpwardJet
        ? Math.random() * jetLength
        : -Math.random() * jetLength;

      // Particle spread increases with distance from center
      const spread = (Math.abs(y) / jetLength) * jetRadius;
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 2) * spread; // Squared for denser core

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      // Velocities for particle movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = isUpwardJet
        ? Math.random() * 0.5 + 0.5
        : -(Math.random() * 0.5 + 0.5);
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // Color gradient based on distance from center
      const intensity = 1 - Math.abs(y) / jetLength;
      const color = new THREE.Color().lerpColors(
        startColorObj,
        endColorObj,
        intensity
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Varied particle sizes
      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    return [positions, velocities, colors, sizes];
  }, [jetLength, jetRadius, particleCount, startColor, endColor]);

  useFrame(({ clock }) => {
    if (jetRef.current) {
      const time = clock.getElapsedTime();
      const positions = jetRef.current.geometry.attributes.position
        .array as Float32Array;
      const colors = jetRef.current.geometry.attributes.color
        .array as Float32Array;
      const startColorObj = new THREE.Color(startColor);
      const endColorObj = new THREE.Color(endColor);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Update positions based on velocities
        positions[i3] += velocities[i3] * (1 + Math.sin(time * 2) * 0.2);
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] +=
          velocities[i3 + 2] * (1 + Math.sin(time * 2) * 0.2);

        // Reset particles that go too far
        if (Math.abs(positions[i3 + 1]) > jetLength) {
          const isUpwardJet = velocities[i3 + 1] > 0;
          positions[i3] = 0;
          positions[i3 + 1] = isUpwardJet ? 0 : 0;
          positions[i3 + 2] = 0;
        }

        // Update colors for pulsing effect
        const intensity = 1 - Math.abs(positions[i3 + 1]) / jetLength;
        const pulse = Math.sin(time * 5) * 0.1 + 0.9;
        const color = new THREE.Color().lerpColors(
          startColorObj,
          endColorObj,
          intensity * pulse
        );
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      jetRef.current.geometry.attributes.position.needsUpdate = true;
      jetRef.current.geometry.attributes.color.needsUpdate = true;

      // Rotate the entire jet system
      jetRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <points ref={jetRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

export default PulsarBeams;
