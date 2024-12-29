import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  useTexture,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// New Black Hole Core Component
const BlackHoleCore = () => {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coreRef.current) {
      const time = clock.getElapsedTime();
      coreRef.current.rotation.x = time * 0.2;
      coreRef.current.rotation.y = time * 0.3;

      // Create a subtle pulsing effect
      const scale = 0.5 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <shaderMaterial
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          uniform float time;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            
            // Create a swirling energy pattern
            float angle = atan(vUv.y - center.y, vUv.x - center.x);
            float swirl = sin(dist * 20.0 + time * 2.0) * 0.5 + 0.5;
            
            vec3 color = mix(
              vec3(1.0, 0.0, 0.0),  // Deep red
              vec3(0.0, 0.0, 0.0),  // Black
              swirl
            );
            
            // Add a glowing effect
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            color += vec3(0.2, 0.0, 0.0) * glow;
            
            gl_FragColor = vec4(color, glow);
          }
        `}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Existing Accretion Disk Component
const AccretionDisk = () => {
  const diskRef = useRef<THREE.Points>(null);
  const particlesCount = 100000;

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
  }, []);

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

// Existing Particle System Component
const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 20000;

  const [positions] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 30 + 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return [positions];
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance < 3) {
          // Reset particles that get too close to the center
          const newRadius = Math.random() * 30 + 25; // Spawn further out
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[i3] = newRadius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = newRadius * Math.cos(phi);
        } else {
          // Enhanced gravitational pull
          const pullStrength = 0.5 / (distance * 0.5); // Adjusted pull strength
          const spin = 0.002; // Add slight spin effect

          // Calculate normalized direction to center
          const dirX = -x / distance;
          const dirY = -y / distance;
          const dirZ = -z / distance;

          // Add spiral motion
          const spiralX = z * spin;
          const spiralZ = -x * spin;

          // Update positions with combined pull and spiral
          positions[i3] += dirX * pullStrength + spiralX;
          positions[i3 + 1] += dirY * pullStrength;
          positions[i3 + 2] += dirZ * pullStrength + spiralZ;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Existing Space Distortion Component
const SpaceDistortion = () => {
  return (
    <Sphere args={[20, 64, 64]}>
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={3}
        chromaticAberration={1}
        anisotropy={0.3}
        distortion={0.5}
        distortionScale={0.3}
        temporalDistortion={0.5}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
      />
    </Sphere>
  );
};

// Main Black Hole Component
const BlackHole = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Black Hole Core */}
      <BlackHoleCore />

      {/* Accretion Disk */}
      <AccretionDisk />

      {/* Particle System */}
      <ParticleSystem />

      {/* Space Distortion Effect */}
      <SpaceDistortion />

      {/* Light Effects */}
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} decay={2} />
      <pointLight
        position={[0, 0, 0]}
        intensity={5}
        distance={50}
        decay={2}
        color="#ff4400"
      />
    </group>
  );
};

export default BlackHole;
