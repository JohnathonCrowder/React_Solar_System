// src/components/canvas/BlackHole.tsx

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Sphere,
  useTexture,
  MeshDistortMaterial,
  Html,
  useDepthBuffer,
} from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";

// Custom shader for gravitational lensing effect
const fragmentShader = `
  uniform float time;
  uniform sampler2D backgroundTexture;
  uniform float hoverState;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from center
    float dist = length(vPosition.xy);
    
    // Gravitational lensing effect
    float bend = 1.0 / (dist * 2.0 + 0.1);
    uv += normalize(vPosition.xy) * bend * (0.1 + hoverState * 0.05);
    
    // Time-based distortion
    uv += sin(uv * 10.0 + time * 0.5) * 0.01;
    
    // Color shift based on distance
    vec3 color = mix(
      vec3(0.0, 0.0, 0.0),
      vec3(1.0, 0.3, 0.0),
      smoothstep(0.5, 2.0, dist)
    );
    
    // Add some blue/purple accents
    color += vec3(0.1, 0.0, 0.2) * sin(time + dist * 5.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Add some vertex displacement
    vec3 newPosition = position;
    newPosition += normal * sin(time * 0.5 + position.y * 4.0) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const BlackHole = () => {
  const groupRef = useRef<THREE.Group>(null);
  const blackHoleRef = useRef<THREE.Mesh>(null);
  const accretionDiskRef = useRef<THREE.Mesh>(null);
  const particleSystemRef = useRef<THREE.Points>(null);
  const depthBuffer = useDepthBuffer({ frames: 1 });

  const [hovered, setHovered] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Audio setup
  useEffect(() => {
    const audio = new Audio("/sounds/blackhole_ambient.mp3");
    audio.loop = true;

    const handleInteraction = () => {
      if (!audioInitialized) {
        audio.play();
        setAudioInitialized(true);
        document.removeEventListener("click", handleInteraction);
      }
    };

    document.addEventListener("click", handleInteraction);

    return () => {
      audio.pause();
      document.removeEventListener("click", handleInteraction);
    };
  }, [audioInitialized]);

  // Load textures
  const [spaceTexture, noiseTexture, distortionTexture, particleTexture] =
    useTexture([
      "/textures/space_background.jpg",
      "/textures/noise.png",
      "/textures/distortion.jpg",
      "/textures/particle.png",
    ]);

  // Animation springs
  const hoverSpring = useSpring({
    scale: hovered ? 1.1 : 1,
    intensity: hovered ? 2 : 1,
  });

  // Custom shader material for the event horizon
  const eventHorizonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        backgroundTexture: { value: spaceTexture },
        hoverState: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
  }, [spaceTexture]);

  // Custom material for the accretion disk
  const accretionDiskMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: noiseTexture,
      emissiveMap: distortionTexture,
      emissive: new THREE.Color(1, 0.3, 0),
      emissiveIntensity: 2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
  }, [noiseTexture, distortionTexture]);

  // Particle system setup
  const particleSystem = useMemo(() => {
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = Math.random() - 0.5;
      velocities[i3 + 1] = Math.random() - 0.5;
      velocities[i3 + 2] = Math.random() - 0.5;
    }

    return {
      positions,
      velocities,
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update event horizon shader
    if (eventHorizonMaterial) {
      eventHorizonMaterial.uniforms.time.value = time;
      eventHorizonMaterial.uniforms.hoverState.value = hovered ? 1 : 0;
    }

    // Rotate accretion disk
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z += 0.001;
    }

    // Update particle system
    if (particleSystemRef.current) {
      const positions = particleSystemRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance < 5) {
          // Reset particle
          const radius = 50;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          positions[i] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = radius * Math.cos(phi);
        } else {
          // Move particle towards black hole
          const factor = 0.01;
          positions[i] -= x * factor;
          positions[i + 1] -= y * factor;
          positions[i + 2] -= z * factor;
        }
      }

      particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <animated.group scale={hoverSpring.scale}>
        {/* Event Horizon */}
        <Sphere
          ref={blackHoleRef}
          args={[5, 64, 64]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <primitive object={eventHorizonMaterial} attach="material" />
        </Sphere>

        {/* Accretion Disk */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          <animated.mesh ref={accretionDiskRef}>
            <torusGeometry args={[8, 3, 64, 100]} />
            <primitive object={accretionDiskMaterial} attach="material" />
          </animated.mesh>
        </group>

        {/* Gravitational Lensing Effect */}
        <Sphere args={[15, 32, 32]}>
          <MeshDistortMaterial
            distort={0.4}
            speed={5}
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </Sphere>
      </animated.group>

      {/* Particle System */}
      <points ref={particleSystemRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleSystem.positions.length / 3}
            array={particleSystem.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          map={particleTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffaa00"
        />
      </points>

      {/* Light Effects */}
      <animated.pointLight
        position={[0, 0, 0]}
        intensity={hoverSpring.intensity.to((i) => i * 5)}
        distance={50}
        decay={2}
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={100}
        decay={2}
        color="#ff4400"
      />

      {/* Interactive Labels */}
      {hovered && (
        <Html center position={[0, 8, 0]}>
          <div className="bg-black/50 text-white p-2 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-1">Event Horizon</h3>
            <p className="text-sm">Point of no return</p>
          </div>
        </Html>
      )}
    </group>
  );
};

export default BlackHole;
