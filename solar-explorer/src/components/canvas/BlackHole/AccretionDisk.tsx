import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AccretionDiskProps {
  innerRadius?: number;
  outerRadius?: number;
  particleCount?: number;
  thickness?: number;
  rotationSpeed?: number;
  temperature?: number;
}

const AccretionDisk: React.FC<AccretionDiskProps> = ({
  innerRadius = 5,
  outerRadius = 20,
  particleCount = 200000,
  thickness = 0.5,
  rotationSpeed = 1,
  temperature = 1.0,
}) => {
  const diskRef = useRef<THREE.Points>(null);

  // Enhanced temperature-based color calculation
  const getTemperatureColor = (radius: number) => {
    const normalizedRadius =
      (radius - innerRadius) / (outerRadius - innerRadius);
    const temp = (1 - normalizedRadius) * temperature;

    const color = new THREE.Color();

    if (temp > 0.9) {
      // Extremely hot - blue-white (closest to black hole)
      color.setRGB(0.95, 0.95, 1);
    } else if (temp > 0.7) {
      // Very hot - intense blue
      color.setRGB(0.6, 0.7, 1);
    } else if (temp > 0.5) {
      // Hot - violet-blue
      color.setRGB(0.4, 0.4, 0.95);
    } else if (temp > 0.3) {
      // Medium hot - deep purple
      color.setRGB(0.5, 0.2, 0.9);
    } else if (temp > 0.2) {
      // Warm - magenta
      color.setRGB(0.8, 0.2, 0.6);
    } else {
      // Cooler - deep red (outer edges)
      color.setRGB(0.8, 0.1, 0.2);
    }

    // Apply intensity falloff based on radius
    const intensity = Math.pow(1 - normalizedRadius, 2);
    color.multiplyScalar(intensity);

    return color;
  };

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Enhanced particle distribution
      const radiusFactor = Math.pow(Math.random(), 0.3); // More particles towards center
      const radius = radiusFactor * (outerRadius - innerRadius) + innerRadius;
      const theta = Math.random() * Math.PI * 2;

      // Variable thickness based on radius and random distribution
      const heightFactor = Math.pow(Math.random(), 2); // More particles near disk plane
      const maxHeight =
        thickness * (radius / outerRadius) * Math.exp(-radius / outerRadius);
      const height = (heightFactor - 0.5) * maxHeight;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Keplerian orbital velocity
      const speed = rotationSpeed * Math.sqrt(innerRadius / radius);
      velocities[i * 3] = -Math.sin(theta) * speed;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = Math.cos(theta) * speed;

      // Enhanced temperature-based coloring
      const color = getTemperatureColor(radius);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Variable particle size
      const sizeFactor = 1 - Math.pow(radiusFactor, 0.5);
      sizes[i] = 0.05 + sizeFactor * 0.15;
    }

    return [positions, velocities, colors, sizes];
  }, [innerRadius, outerRadius, particleCount, thickness, temperature]);

  useFrame(() => {
    if (diskRef.current) {
      const positions = diskRef.current.geometry.attributes.position
        .array as Float32Array;
      const colors = diskRef.current.geometry.attributes.color
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];

        const radius = Math.sqrt(x * x + z * z);
        const theta = Math.atan2(z, x);

        if (radius < innerRadius) {
          // Enhanced respawn logic
          const newRadius = outerRadius;
          const newTheta = Math.random() * Math.PI * 2;
          const newHeight =
            (Math.random() - 0.5) *
            thickness *
            Math.exp(-newRadius / outerRadius);

          positions[i3] = Math.cos(newTheta) * newRadius;
          positions[i3 + 1] = newHeight;
          positions[i3 + 2] = Math.sin(newTheta) * newRadius;

          // Update color for respawned particle
          const color = getTemperatureColor(newRadius);
          colors[i3] = color.r;
          colors[i3 + 1] = color.g;
          colors[i3 + 2] = color.b;
        } else {
          // Enhanced orbital motion
          const speed = rotationSpeed * Math.sqrt(innerRadius / radius);
          const newTheta = theta + speed * 0.01;

          // Improved infall mechanics
          const infallSpeed = 0.01 * Math.pow(innerRadius / radius, 2);
          const newRadius = radius - infallSpeed;

          positions[i3] = Math.cos(newTheta) * newRadius;
          positions[i3 + 2] = Math.sin(newTheta) * newRadius;

          // Gradual flattening
          positions[i3 + 1] *= 0.998;

          // Update color based on new radius
          const color = getTemperatureColor(newRadius);
          colors[i3] = color.r;
          colors[i3 + 1] = color.g;
          colors[i3 + 2] = color.b;
        }
      }

      diskRef.current.geometry.attributes.position.needsUpdate = true;
      diskRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={diskRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

export default AccretionDisk;
