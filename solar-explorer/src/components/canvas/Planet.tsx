import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "../../store/store";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
  name: string;
  radius: number;
  distance: number;
  color: string;
  orbitSpeed: number;
  orbitTilt: number;
  rotationSpeed: number;
  atmosphereColor: string;
  hasRings?: boolean;
  initialAngle: number;
}

const Planet = ({
  name,
  radius,
  distance,
  color,
  orbitSpeed,
  orbitTilt,
  rotationSpeed,
  atmosphereColor,
  hasRings = false,
  initialAngle,
}: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const { setSelectedPlanet } = useStore();

  // Create orbit path
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * 2 * Math.PI;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      )
    );
  }
  points.push(points[0]);

  useFrame((state) => {
    if (meshRef.current) {
      // Planet orbit
      const time = state.clock.getElapsedTime();
      const angle = initialAngle + time * orbitSpeed;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // Update planet position
      meshRef.current.position.x = x;
      meshRef.current.position.z = z;

      // Planet rotation
      meshRef.current.rotation.y += rotationSpeed;

      // Update rings position and rotation
      if (ringsRef.current) {
        ringsRef.current.position.x = x;
        ringsRef.current.position.z = z;
        // Keep rings parallel to the orbital plane
        ringsRef.current.rotation.x = Math.PI / 2;
      }
    }
  });

  return (
    <>
      {/* Orbit Path */}
      <Line
        points={points}
        color="white"
        opacity={0.2}
        transparent
        lineWidth={1}
      />

      {/* Planet with orbit tilt */}
      <group rotation={[orbitTilt * (Math.PI / 180), 0, 0]}>
        <mesh
          ref={meshRef}
          onClick={() => setSelectedPlanet(name)}
          onPointerEnter={() => (document.body.style.cursor = "pointer")}
          onPointerLeave={() => (document.body.style.cursor = "default")}
        >
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.7} />

          {/* Planet Atmosphere */}
          <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshPhongMaterial
              color={atmosphereColor}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        </mesh>
      </group>

      {/* Saturn's Rings System - Separate from planet tilt */}
      {hasRings && (
        <group
          ref={ringsRef}
          rotation={[Math.PI / 2, 0, Math.PI / 6]} // Adjusted ring tilt
        >
          {/* Main Ring (B Ring) */}
          <mesh>
            <ringGeometry args={[radius * 1.4, radius * 2.0, 128]} />
            <meshStandardMaterial
              color="#c7a67c"
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Inner Ring (C Ring) */}
          <mesh>
            <ringGeometry args={[radius * 1.2, radius * 1.4, 128]} />
            <meshStandardMaterial
              color="#ad8c5e"
              side={THREE.DoubleSide}
              transparent
              opacity={0.4}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Outer Ring (A Ring) */}
          <mesh>
            <ringGeometry args={[radius * 2.0, radius * 2.3, 128]} />
            <meshStandardMaterial
              color="#d4b57d"
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Cassini Division */}
          <mesh>
            <ringGeometry args={[radius * 1.95, radius * 2.0, 128]} />
            <meshBasicMaterial
              color="black"
              side={THREE.DoubleSide}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      )}
    </>
  );
};

export default Planet;
