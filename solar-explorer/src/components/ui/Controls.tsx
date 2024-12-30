import { useStore } from "../../store/store";
import { useEffect } from "react";

const Controls = () => {
  const {
    selectedPlanet,
    showBlackHole,
    showBlackHoleInfo,
    toggleBlackHole,
    setShowBlackHoleInfo,
    selectPreviousPlanet,
    selectNextPlanet,
  } = useStore();

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showBlackHole) return; // Disable keyboard navigation in black hole view

      switch (event.key) {
        case "ArrowRight":
          selectNextPlanet();
          break;
        case "ArrowLeft":
          selectPreviousPlanet();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showBlackHole, selectNextPlanet, selectPreviousPlanet]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-white/90 font-light tracking-wider">
                {selectedPlanet && !showBlackHole
                  ? selectedPlanet
                  : showBlackHole
                  ? "Black Hole"
                  : "Select a celestial body"}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3">
              {/* Navigation Arrows - Only show when not in black hole view */}
              {!showBlackHole && (
                <div className="flex items-center gap-2 mr-2">
                  <button
                    onClick={selectPreviousPlanet}
                    className="p-2 bg-white/5 border border-white/20 rounded-lg 
                               hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    aria-label="Previous Planet"
                  >
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={selectNextPlanet}
                    className="p-2 bg-white/5 border border-white/20 rounded-lg 
                               hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    aria-label="Next Planet"
                  >
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {showBlackHole && !showBlackHoleInfo && (
                <button
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg 
                             hover:bg-white/10 hover:border-white/40 transition-all duration-300 
                             text-white/70 hover:text-white/90"
                  onClick={() => setShowBlackHoleInfo(true)}
                >
                  Analyze
                </button>
              )}
              <button
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg 
                           hover:bg-white/10 hover:border-white/40 transition-all duration-300 
                           text-white/70 hover:text-white/90"
                onClick={toggleBlackHole}
              >
                {showBlackHole ? "Solar System" : "Black Hole"}
              </button>
              <button
                className="p-2 bg-white/5 border border-white/20 rounded-lg 
                           hover:bg-white/10 hover:border-white/40 transition-all duration-300 
                           text-white/70 hover:text-white/90"
                onClick={() => document.documentElement.requestFullscreen()}
                title="Fullscreen"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7V5a2 2 0 012-2h2m14 14v2a2 2 0 01-2 2h-2M3 17v2a2 2 0 002 2h2M21 7V5a2 2 0 00-2-2h-2"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
