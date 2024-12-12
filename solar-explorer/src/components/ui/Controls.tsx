import React from "react";
import { useStore } from "../../store/store";

const Controls = () => {
  const { selectedPlanet } = useStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="text-white/80">
          {selectedPlanet
            ? `Selected: ${selectedPlanet}`
            : "No planet selected"}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            onClick={() => document.exitFullscreen()}
          >
            Exit Fullscreen
          </button>
          <button
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            onClick={() => document.documentElement.requestFullscreen()}
          >
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
