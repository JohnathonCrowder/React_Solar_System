// src/App.tsx

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { useSpring, animated } from "@react-spring/three";
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
    position: showBlackHole ? [0, 0, 50] : [0, 20, 100],
    config: { mass: 1, tension: 280, friction: 60 },
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
        <fog attach="fog" args={["#000", 30, 500]} />
        <Suspense fallback={null}>
          <animated.perspectiveCamera
            position={cameraSpring.position}
            fov={45}
            near={0.1}
            far={1000}
          />
          <Stars />
          {showBlackHole ? <BlackHole /> : <SolarSystem />}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={500}
          />
          <ambientLight intensity={0.1} />
        </Suspense>
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
      <Controls />
      <InfoPanel />
      <NavigationArrows />
      <KeyboardNavigation />
    </div>
  );
}

export default App;
