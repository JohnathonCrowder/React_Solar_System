import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import SolarSystem from "./components/canvas/SolarSystem";
import Stars from "./components/canvas/Stars";
import Controls from "./components/ui/Controls";
import InfoPanel from "./components/ui/InfoPanel";
import NavigationArrows from "./components/ui/NavigationArrows";
import KeyboardNavigation from "./components/ui/KeyboardNavigation";

function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [0, 20, 100],
          fov: 45,
        }}
      >
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={null}>
          <Stars />
          <SolarSystem />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Suspense>
      </Canvas>
      <Controls />
      <InfoPanel />
      <NavigationArrows />
      <KeyboardNavigation />
    </div>
  );
}

export default App;
