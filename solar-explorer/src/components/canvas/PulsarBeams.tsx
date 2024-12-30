import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PulsarBeams: React.FC = () => {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      const time = clock.getElapsedTime();

      // Pulsating effect
      const scale = 1 + Math.sin(time * 10) * 0.2;
      beamRef.current.scale.set(scale, 1, scale);

      // Rotation effect
      beamRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh ref={beamRef}>
        <cylinderGeometry args={[0.2, 0.2, 100, 32, 1, true]} />
        <shaderMaterial
          transparent
          uniforms={{
            time: { value: 0 },
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;
            varying vec2 vUv;
            void main() {
              float intensity = sin(vUv.y * 20.0 - time * 10.0) * 0.5 + 0.5;
              vec3 color = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 1.0, 1.0), intensity);
              gl_FragColor = vec4(color, intensity * (1.0 - vUv.y));
            }
          `}
        />
      </mesh>
    </group>
  );
};

export default PulsarBeams;
