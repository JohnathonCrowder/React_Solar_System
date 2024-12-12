import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Planet from "./Planet";
import * as THREE from "three";
import { useStore } from "../../store/store";

const SolarSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const sunGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0001;
    }

    if (sunGroupRef.current) {
      // Rotate the volumetric light rays
      sunGroupRef.current.children.forEach((child, i) => {
        if (child.type === "Group") {
          child.rotation.z += 0.0003;
          child.rotation.x += 0.0002;
          child.rotation.y += 0.0001;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sun with advanced glow effects */}
      <group ref={sunGroupRef}>
        {/* Core sun sphere - Clickable */}
        <mesh
          position={[0, 0, 0]}
          onClick={() => useStore.getState().setSelectedPlanet("Sun")}
          onPointerEnter={() => (document.body.style.cursor = "pointer")}
          onPointerLeave={() => (document.body.style.cursor = "default")}
        >
          <sphereGeometry args={[8, 64, 64]} />
          <meshStandardMaterial
            color="#FDB813"
            emissive="#FDB813"
            emissiveIntensity={2}
          />
          <pointLight intensity={2} distance={200} decay={2} />
        </mesh>

        {/* Inner glow layer */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[8, 64, 64]} />
          <meshBasicMaterial
            color="#FDB813"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Middle glow layer */}
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[8, 64, 64]} />
          <meshBasicMaterial
            color="#FDB813"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer glow layer */}
        <mesh scale={[1.6, 1.6, 1.6]}>
          <sphereGeometry args={[8, 64, 64]} />
          <meshBasicMaterial
            color="#FDA813"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Corona effect */}
        <mesh scale={[2, 2, 2]}>
          <sphereGeometry args={[8, 64, 64]} />
          <meshBasicMaterial
            color="#FF8F00"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Volumetric light effect */}
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
                color="#FDB813"
                transparent
                opacity={0.03}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>

        {/* Light sources for better scene illumination */}
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          distance={200}
          decay={2}
        />
        <pointLight
          position={[0, 0, 0]}
          intensity={1}
          distance={300}
          decay={2}
          color="#FF8F00"
        />
      </group>

      {/* Planets */}
      <Planet
        name="Mercury"
        radius={1.5}
        distance={20}
        color="#787878"
        orbitSpeed={0.004}
        orbitTilt={7}
        rotationSpeed={0.01}
        atmosphereColor="#787878"
      />

      <Planet
        name="Venus"
        radius={3.8}
        distance={30}
        color="#e39e1c"
        orbitSpeed={0.0035}
        orbitTilt={3.4}
        rotationSpeed={0.008}
        atmosphereColor="#e39e1c"
      />

      <Planet
        name="Earth"
        radius={4}
        distance={45}
        color="#2b82c9"
        orbitSpeed={0.003}
        orbitTilt={0}
        rotationSpeed={0.01}
        atmosphereColor="#6ab7ff"
      />

      <Planet
        name="Mars"
        radius={2.1}
        distance={60}
        color="#c1440e"
        orbitSpeed={0.0024}
        orbitTilt={1.9}
        rotationSpeed={0.009}
        atmosphereColor="#c1440e"
      />

      <Planet
        name="Jupiter"
        radius={12}
        distance={85} // Adjusted
        color="#e3ddd1"
        orbitSpeed={0.0013}
        orbitTilt={1.3}
        rotationSpeed={0.004}
        atmosphereColor="#e3ddd1"
      />

      <Planet
        name="Saturn"
        radius={10}
        distance={130} // Increased distance
        color="#ead6b8"
        orbitSpeed={0.0009}
        orbitTilt={2.5}
        rotationSpeed={0.0038}
        hasRings={true}
        atmosphereColor="#ead6b8"
      />

      <Planet
        name="Uranus"
        radius={7}
        distance={175} // Adjusted
        color="#d1e7e7"
        orbitSpeed={0.0006}
        orbitTilt={0.8}
        rotationSpeed={0.003}
        atmosphereColor="#d1e7e7"
      />

      <Planet
        name="Neptune"
        radius={6.8}
        distance={200}
        color="#445bad"
        orbitSpeed={0.0005}
        orbitTilt={1.8}
        rotationSpeed={0.0032}
        atmosphereColor="#445bad"
      />

      <Planet
        name="Pluto"
        radius={0.8}
        distance={215}
        color="#968570"
        orbitSpeed={0.0004}
        orbitTilt={17.2}
        rotationSpeed={0.0022}
        atmosphereColor="#968570"
      />

      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.1} />

      {/* Additional scene lighting */}
      <pointLight
        position={[100, 100, 100]}
        intensity={0.5}
        distance={300}
        decay={2}
      />

      {/* Background stars lighting */}
      <pointLight
        position={[-100, -100, -100]}
        intensity={0.2}
        distance={300}
        decay={2}
        color="#blue"
      />
    </group>
  );
};

export default SolarSystem;
