import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { useStore } from "../../store/store";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";

interface PlanetProps {
  name: string;
  radius: number;
  distance: number;
  color: string;
  orbitSpeed: number;
  orbitInclination: number;
  orbitRotation: number;
  rotationSpeed: number;
  atmosphereColor: string;
  hasRings?: boolean;
  initialAngle: number;
  isSelected?: boolean;
}

const Planet = ({
  name,
  radius,
  distance,
  color,
  orbitSpeed,
  orbitInclination,
  orbitRotation,
  rotationSpeed,
  atmosphereColor,
  hasRings = false,
  initialAngle,
  isSelected = false,
}: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { setSelectedPlanet } = useStore();

  // Glow animation spring
  const glowSpring = useSpring({
    opacity: isSelected ? 0.3 : 0,
    scale: isSelected ? 1.2 : 1.15,
    config: { tension: 120, friction: 14 },
  });

  // Exaggerate inclination for better visualization
  const exaggeratedInclination = orbitInclination * 3;

  // Create realistic orbit path
  const points = useMemo(() => {
    const tempPoints = [];
    const inclinationRad = exaggeratedInclination * (Math.PI / 180);
    const rotationRad = orbitRotation * (Math.PI / 180);

    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * Math.sin(inclinationRad);
      const z = Math.sin(angle) * distance * Math.cos(inclinationRad);

      const position = new THREE.Vector3(x, y, z);
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(rotationRad);
      position.applyMatrix4(rotationMatrix);

      tempPoints.push(position);
    }
    tempPoints.push(tempPoints[0]); // Close the loop
    return tempPoints;
  }, [distance, exaggeratedInclination, orbitRotation]);

  useFrame(() => {
    if (meshRef.current) {
      const time = Date.now() * 0.001; // Convert to seconds
      const angle = initialAngle + time * orbitSpeed;
      const inclinationRad = exaggeratedInclination * (Math.PI / 180);
      const rotationRad = orbitRotation * (Math.PI / 180);

      // Calculate position on inclined orbit
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * Math.sin(inclinationRad);
      const z = Math.sin(angle) * distance * Math.cos(inclinationRad);

      const position = new THREE.Vector3(x, y, z);
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(rotationRad);
      position.applyMatrix4(rotationMatrix);

      // Update planet position
      meshRef.current.position.copy(position);

      // Planet rotation
      meshRef.current.rotation.y += rotationSpeed;

      // Update rings and glow position
      if (ringsRef.current) {
        ringsRef.current.position.copy(position);
        ringsRef.current.rotation.x = Math.PI / 2;
      }
      if (glowRef.current) {
        glowRef.current.position.copy(position);
      }
    }
  });

  return (
    <>
      {/* Realistic Orbit Path */}
      <Line
        points={points}
        color="white"
        opacity={0.2}
        transparent
        lineWidth={1}
      />

      <group>
        {/* Glow Effect */}
        <animated.mesh
          ref={glowRef}
          scale={glowSpring.scale.to((s) => [s, s, s])}
        >
          <sphereGeometry args={[radius, 32, 32]} />
          <animated.meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={glowSpring.opacity}
            side={THREE.BackSide}
          />
        </animated.mesh>

        {/* Planet */}
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

        {/* Saturn's Rings System */}
        {hasRings && (
          <group ref={ringsRef} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
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
      </group>
    </>
  );
};

export default Planet;
