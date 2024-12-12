import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Planet from "./Planet";

const SolarSystem = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial emissive="#ffff00" emissiveIntensity={2} />
        <pointLight intensity={1} distance={100} />
      </mesh>

      {/* Planets */}
      <Planet
        name="Mercury"
        radius={1}
        distance={10}
        color="#787878"
        orbitSpeed={0.004}
      />
      <Planet
        name="Venus"
        radius={1.5}
        distance={15}
        color="#e39e1c"
        orbitSpeed={0.003}
      />
      <Planet
        name="Earth"
        radius={2}
        distance={20}
        color="#2b82c9"
        orbitSpeed={0.002}
      />
      {/* Add more planets */}
    </group>
  );
};

export default SolarSystem;
