import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

const BlackHole = () => {
  const blackHoleRef = useRef<THREE.Group>(null);
  const accretionDiskRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={blackHoleRef}>
      {/* Event Horizon */}
      <Sphere args={[5, 32, 32]}>
        <meshBasicMaterial color="black" />
      </Sphere>

      {/* Accretion Disk */}
      <mesh ref={accretionDiskRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 20, 64]} />
        <meshBasicMaterial
          color="#ff3300"
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Gravitational Lensing Effect (simplified) */}
      <group>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI,
            ]}
          >
            <planeGeometry args={[40, 40]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Light effects */}
      <pointLight position={[0, 0, 0]} intensity={2} distance={50} decay={2} />
    </group>
  );
};

export default BlackHole;
