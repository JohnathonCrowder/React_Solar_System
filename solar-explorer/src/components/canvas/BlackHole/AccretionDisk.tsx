import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AccretionDiskProps {
  particlesCount?: number;
}

const AccretionDisk: React.FC<AccretionDiskProps> = ({
  particlesCount = 100000,
}) => {
  const diskRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const radius = Math.random() * 5 + 8;
      const theta = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.5 * Math.exp(-radius * 0.1);

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      const temp = Math.exp(-radius * 0.1);
      colors[i * 3] = Math.min(1, temp * 2);
      colors[i * 3 + 1] = temp * 0.5;
      colors[i * 3 + 2] = temp;
    }

    return [positions, colors];
  }, [particlesCount]);

  useFrame(() => {
    if (diskRef.current) {
      const positions = diskRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];

        const radius = Math.sqrt(x * x + z * z);

        if (radius < 6) {
          const newRadius = Math.random() * 5 + 13;
          const theta = Math.random() * Math.PI * 2;
          const height =
            (Math.random() - 0.5) * 0.5 * Math.exp(-newRadius * 0.1);

          positions[i3] = Math.cos(theta) * newRadius;
          positions[i3 + 1] = height;
          positions[i3 + 2] = Math.sin(theta) * newRadius;
        } else {
          const theta = Math.atan2(z, x);
          const speed = Math.sqrt(1 / radius) * 0.3;

          const newRadius = radius - 0.01;
          const newTheta = theta + speed;

          positions[i3] = Math.cos(newTheta) * newRadius;
          positions[i3 + 2] = Math.sin(newTheta) * newRadius;

          positions[i3 + 1] *= 0.99;
        }
      }

      diskRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={diskRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default AccretionDisk;
