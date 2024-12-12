import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SolarSystem from "./components/canvas/SolarSystem";
import Stars from "./components/canvas/Stars";
import Controls from "./components/ui/Controls";
import InfoPanel from "./components/ui/InfoPanel";

function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [0, 20, 100],
          fov: 45,
        }}
      >
        <Suspense fallback={null}>
          <Stars />
          <SolarSystem />
        </Suspense>
      </Canvas>
      <Controls />
      <InfoPanel />
    </div>
  );
}

export default App;
