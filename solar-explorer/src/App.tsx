import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { useSpring, animated, config } from "@react-spring/three";
import SolarSystem from "./components/canvas/SolarSystem";
import BlackHole from "./components/canvas/BlackHole";
import Stars from "./components/canvas/Stars";
import Controls from "./components/ui/Controls";
import InfoPanel from "./components/ui/InfoPanel";
import NavigationArrows from "./components/ui/NavigationArrows";
import KeyboardNavigation from "./components/ui/KeyboardNavigation";
import { useStore } from "./store/store";

function App() {
  const { showBlackHole } = useStore();

  const cameraSpring = useSpring({
    position: showBlackHole ? [0, 0, 200] : [0, 20, 400],
    config: config.molasses,
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
      <Canvas>
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 30, 1000]} />
        <Suspense fallback={null}>
          <animated.perspectiveCamera
            makeDefault
            position={cameraSpring.position}
            fov={45}
            near={0.1}
            far={2000}
          />
          <Stars />
          {showBlackHole ? <BlackHole /> : <SolarSystem />}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={1000}
            zoomSpeed={0.5}
            panSpeed={0.5}
            rotateSpeed={0.5}
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
              <ChromaticAberration offset={[0.002, 0.002]} />
              <Noise opacity={0.02} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
      <Controls />
      <InfoPanel />
      <NavigationArrows />
      <KeyboardNavigation />

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
