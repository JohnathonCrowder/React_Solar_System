import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { useSpring } from "@react-spring/three";
import * as THREE from "three";
import SolarSystem from "./components/canvas/SolarSystem";
import BlackHole from "./components/canvas/BlackHole";
import Stars from "./components/canvas/Stars";
import Controls from "./components/ui/Controls";
import InfoPanel from "./components/ui/InfoPanel";
import { useStore } from "./store/store";

function Camera({ position }: { position: [number, number, number] }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
  }, [camera, position]);

  return null;
}

function App() {
  const { showBlackHole } = useStore();

  const { position } = useSpring({
    position: showBlackHole
      ? ([0, 0, 50] as [number, number, number])
      : ([0, 20, 400] as [number, number, number]),
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useEffect(() => {
    const handleResize = () => {
      // Update any size-dependent state here
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen">
      <Canvas camera={{ fov: 45, near: 0.1, far: 2000 }}>
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 30, 1000]} />
        <Suspense fallback={null}>
          <Camera position={position.get()} />
          <Stars />
          {showBlackHole ? <BlackHole /> : <SolarSystem />}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={showBlackHole ? 1 : 50}
            maxDistance={showBlackHole ? 500 : 1000}
            zoomSpeed={showBlackHole ? 0.3 : 0.5}
            panSpeed={0.5}
            rotateSpeed={showBlackHole ? 0.3 : 0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
          />
          <ambientLight intensity={0.1} />

          {/* Post-processing effects */}
          {showBlackHole ? (
            <EffectComposer>
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
              />
              <ChromaticAberration
                offset={new THREE.Vector2(0.002, 0.002)}
                radialModulation={false}
                modulationOffset={1.0}
              />
              <Noise opacity={0.02} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
      <Controls />
      <InfoPanel />

      {/* Optional loading indicator */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
        <Suspense
          fallback={<div className="text-white text-2xl">Loading...</div>}
        >
          <></>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
