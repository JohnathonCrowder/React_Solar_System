import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EventHorizonProps {
  radius?: number;
}

const EventHorizon: React.FC<EventHorizonProps> = ({ radius = 1.0 }) => {
  const horizonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (horizonRef.current) {
      horizonRef.current.rotation.x = clock.getElapsedTime() * 0.05;
      horizonRef.current.rotation.y = clock.getElapsedTime() * 0.075;
    }
  });

  return (
    <mesh ref={horizonRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            // Fresnel effect for edge glow
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
            
            // Deep, absolute black
            vec3 blackColor = vec3(0.0);
            
            // Very slight blue tint for the edge glow
            vec3 edgeColor = vec3(0.0, 0.02, 0.05);
            
            // Combine black with slight edge glow
            vec3 finalColor = mix(blackColor, edgeColor, fresnel * 0.3);
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

export default EventHorizon;
