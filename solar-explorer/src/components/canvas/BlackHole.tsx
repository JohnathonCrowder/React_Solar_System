import { useRef } from "react";
import * as THREE from "three";
import EventHorizon from "./BlackHole/EventHorizon";
import Singularity from "./BlackHole/Singularity";
import AccretionDisk from "./BlackHole/AccretionDisk";
import ParticleSystem from "./BlackHole/ParticleSystem";
import PulsarBeams from "./BlackHole/PulsarBeams";
import GravitationalLens from "./BlackHole/GravitationalLens";

const BlackHole = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Increased event horizon radius to 4.0 */}
      <EventHorizon radius={4.0} />

      {/* Keep singularity smaller than event horizon */}
      <Singularity size={2.0} />

      {/* Adjust AccretionDisk to be proportional to larger event horizon */}
      <AccretionDisk particlesCount={100000} />

      {/* Adjust ParticleSystem ranges for larger scale */}
      <ParticleSystem particleCount={20000} minRadius={20} maxRadius={40} />

      {/* Increase GravitationalLens radius to match new scale */}
      <GravitationalLens radius={30} thickness={4} distortion={0.6} />

      <group>
        <PulsarBeams
          jetLength={180}
          jetRadius={2.5} // Increased to match new scale
          particleCount={8000}
          rotationSpeed={0.05}
          startColor="#00ffff"
          endColor="#4169E1"
        />
        <PulsarBeams
          jetLength={180}
          jetRadius={2.5} // Increased to match new scale
          particleCount={8000}
          rotationSpeed={1}
          startColor="#00ffff"
          endColor="#4169E1"
        />
      </group>

      {/* Adjusted light distances for larger scale */}
      <pointLight position={[0, 0, 0]} intensity={2} distance={150} decay={2} />
      <pointLight
        position={[0, 0, 0]}
        intensity={5}
        distance={75}
        decay={2}
        color="#ff4400"
      />
    </group>
  );
};

export default BlackHole;
