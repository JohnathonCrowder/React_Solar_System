import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "../../store/store";

interface PlanetProps {
  name: string;
  radius: number;
  distance: number;
  color: string;
  orbitSpeed: number;
  showOrbit?: boolean;
}

const Planet = ({
  name,
  radius,
  distance,
  color,
  orbitSpeed,
  showOrbit = true,
}: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setSelectedPlanet } = useStore();

  // Create orbit line
  const orbitLine = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [distance]);

  useFrame((state) => {
    if (meshRef.current) {
      // Update planet position
      meshRef.current.position.x =
        Math.cos(state.clock.elapsedTime * orbitSpeed) * distance;
      meshRef.current.position.z =
        Math.sin(state.clock.elapsedTime * orbitSpeed) * distance;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Orbit Line */}
      {showOrbit && (
        <line>
          <bufferGeometry attach="geometry" {...orbitLine} />
          <lineBasicMaterial
            attach="material"
            color="#ffffff"
            opacity={0.2}
            transparent={true}
          />
        </line>
      )}

      {/* Planet */}
      <mesh
        ref={meshRef}
        onClick={() => setSelectedPlanet(name)}
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.7} />
      </mesh>
    </group>
  );
};

export default Planet;
