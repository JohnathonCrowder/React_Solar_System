import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/store";

interface Star {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
}

const Stars = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { cameraPosition } = useStore();

  // Generate star data
  const stars = useMemo(() => {
    const temp: Star[] = [];
    for (let i = 0; i < 3000; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      );
      const size = Math.random() * 0.5 + 0.1;
      temp.push({ position, velocity, size });
    }
    return temp;
  }, []);

  // Create geometry
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(stars.length * 3);
    const sizes = new Float32Array(stars.length);

    stars.forEach((star, i) => {
      positions[i * 3] = star.position.x;
      positions[i * 3 + 1] = star.position.y;
      positions[i * 3 + 2] = star.position.z;
      sizes[i] = star.size;
    });

    return [positions, sizes];
  }, [stars]);

  // Animation
  useFrame((state, delta) => {
    if (!starsRef.current) return;

    // Update positions
    const positions = starsRef.current.geometry.attributes.position
      .array as Float32Array;
    stars.forEach((star, i) => {
      star.position.add(star.velocity);

      // Wrap around if star goes too far
      const wrap = (value: number) => {
        const limit = 150;
        if (value > limit) return -limit;
        if (value < -limit) return limit;
        return value;
      };

      star.position.x = wrap(star.position.x);
      star.position.y = wrap(star.position.y);
      star.position.z = wrap(star.position.z);

      positions[i * 3] = star.position.x;
      positions[i * 3 + 1] = star.position.y;
      positions[i * 3 + 2] = star.position.z;
    });

    // Update geometry
    starsRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate stars based on camera movement
    starsRef.current.rotation.x += delta * 0.05;
    starsRef.current.rotation.y += delta * 0.075;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "size"]}
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={true}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = vec3(1.0, 1.0, 1.0);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float r = 0.0;
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            r = dot(cxy, cxy);
            if (r > 1.0) {
                discard;
            }
            gl_FragColor = vec4(vColor, 1.0 - r);
          }
        `}
      />
    </points>
  );
};

export default Stars;
