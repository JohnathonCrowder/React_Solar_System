import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  useTexture,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// Advanced shader for extreme gravitational lensing
const eventHorizonShader = {
  uniforms: {
    time: { value: 0 },
    backgroundTexture: { value: null },
    resolution: { value: new THREE.Vector2() },
    cameraPosition: { value: new THREE.Vector3() },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform sampler2D backgroundTexture;
    uniform vec2 resolution;
    uniform vec3 cameraPosition;
    
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    #define PI 3.14159265359
    
    float schwarzschildRadius = 1.0;
    
    vec2 raytrace(vec3 ro, vec3 rd) {
      float r = length(ro);
      float b = dot(ro, rd);
      float det = b * b - r * r + schwarzschildRadius * schwarzschildRadius;
      
      if (det < 0.0) return vec2(-1.0);
      
      float t1 = -b - sqrt(det);
      float t2 = -b + sqrt(det);
      
      return vec2(t1, t2);
    }
    
    void main() {
      vec3 worldPos = normalize(vWorldPosition);
      vec3 viewDir = normalize(worldPos - cameraPosition);
      
      vec2 intersection = raytrace(cameraPosition, viewDir);
      
      if (intersection.x < 0.0) {
        vec3 color = vec3(0.0);
        float edge = pow(1.0 - abs(dot(viewDir, vec3(0.0, 1.0, 0.0))), 5.0);
        color += vec3(0.0, 0.02, 0.05) * edge;
        
        gl_FragColor = vec4(color, 1.0);
      } else {
        float bendStrength = schwarzschildRadius / length(cameraPosition);
        vec3 bentDir = normalize(mix(viewDir, normalize(-cameraPosition), bendStrength));
        
        vec2 bentUv = bentDir.xy * 0.5 + 0.5;
        vec3 color = texture2D(backgroundTexture, bentUv).rgb;
        
        float redshift = 1.0 - (bendStrength * 0.5);
        color *= redshift;
        
        float horizonGlow = pow(bendStrength, 4.0);
        color += vec3(0.1, 0.0, 0.2) * horizonGlow;
        
        gl_FragColor = vec4(color, 1.0);
      }
    }
  `,
};

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

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance < 6) {
          const radius = Math.random() * 30 + 15;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);
        } else {
          const acceleration = 0.1 / (distance * distance);
          const dirX = -x / distance;
          const dirY = -y / distance;
          const dirZ = -z / distance;

          positions[i3] += dirX * acceleration;
          positions[i3 + 1] += dirY * acceleration;
          positions[i3 + 2] += dirZ * acceleration;
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

const BlackHole = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, size } = useThree();

  const spaceTexture = useTexture("/textures/deep_space_hd.jpg");

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.backgroundTexture.value = spaceTexture;
      materialRef.current.uniforms.resolution.value = new THREE.Vector2(
        size.width,
        size.height
      );
    }

    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load("/sounds/black_hole_ambient.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [camera, spaceTexture, size]);

  useFrame(({ clock, camera }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.cameraPosition.value = camera.position;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Event Horizon */}
      <Sphere args={[5, 128, 128]}>
        <shaderMaterial ref={materialRef} args={[eventHorizonShader]} />
      </Sphere>

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
