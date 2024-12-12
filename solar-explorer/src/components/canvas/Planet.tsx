import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "../../store/store";

interface PlanetProps {
  name: string;
  radius: number;
  distance: number;
  color: string;
  orbitSpeed: number;
}

const Planet = ({ name, radius, distance, color, orbitSpeed }: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setSelectedPlanet } = useStore();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x =
        Math.cos(state.clock.elapsedTime * orbitSpeed) * distance;
      meshRef.current.position.z =
        Math.sin(state.clock.elapsedTime * orbitSpeed) * distance;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={() => setSelectedPlanet(name)}
      onPointerEnter={() => (document.body.style.cursor = "pointer")}
      onPointerLeave={() => (document.body.style.cursor = "default")}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Planet;
