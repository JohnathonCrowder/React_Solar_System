import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleSystemProps {
  particleCount?: number;
  minRadius?: number;
  maxRadius?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 20000,
  minRadius = 15,
  maxRadius = 30,
}) => {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return [positions];
  }, [particleCount, minRadius, maxRadius]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance < 3) {
          // Reset particles that get too close to the center
          const newRadius = Math.random() * (maxRadius - minRadius) + minRadius;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[i3] = newRadius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = newRadius * Math.cos(phi);
        } else {
          // Enhanced gravitational pull
          const pullStrength = 0.5 / (distance * 0.5);
          const spin = 0.002;

          // Calculate normalized direction to center
          const dirX = -x / distance;
          const dirY = -y / distance;
          const dirZ = -z / distance;

          // Add spiral motion
          const spiralX = z * spin;
          const spiralZ = -x * spin;

          // Update positions with combined pull and spiral
          positions[i3] += dirX * pullStrength + spiralX;
          positions[i3 + 1] += dirY * pullStrength;
          positions[i3 + 2] += dirZ * pullStrength + spiralZ;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;
