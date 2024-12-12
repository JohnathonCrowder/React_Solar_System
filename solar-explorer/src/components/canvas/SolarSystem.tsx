import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
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
        <meshStandardMaterial
          emissive="#FDB813"
          emissiveIntensity={2}
          color="#FDB813"
        />
        <pointLight intensity={5} distance={200} decay={2} />
      </mesh>

      {/* Planets */}
      <Planet
        name="Mercury"
        radius={1}
        distance={10}
        color="#787878"
        orbitSpeed={0.004}
        showOrbit={true}
      />
      <Planet
        name="Venus"
        radius={1.8}
        distance={18}
        color="#e39e1c"
        orbitSpeed={0.003}
        showOrbit={true}
      />
      <Planet
        name="Earth"
        radius={2}
        distance={26}
        color="#2b82c9"
        orbitSpeed={0.002}
        showOrbit={true}
      />
      <Planet
        name="Mars"
        radius={1.5}
        distance={34}
        color="#c1440e"
        orbitSpeed={0.0015}
        showOrbit={true}
      />
    </group>
  );
};

export default SolarSystem;
