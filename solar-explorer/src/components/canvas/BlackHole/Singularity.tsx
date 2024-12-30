import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SingularityProps {
  size?: number;
}

const Singularity: React.FC<SingularityProps> = ({ size = 0.5 }) => {
  const singularityRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (singularityRef.current) {
      const time = clock.getElapsedTime();

      // Subtle scale pulsing to give it some dynamism while staying black
      const scale = size + Math.sin(time * 2) * 0.02;
      singularityRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={singularityRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Pure black with full opacity
          }
        `}
        transparent={false}
        depthWrite={true}
      />
    </mesh>
  );
};

export default Singularity;
