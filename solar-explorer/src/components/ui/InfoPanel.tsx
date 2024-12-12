import { useStore } from "../../store/store";
import { motion, AnimatePresence } from "framer-motion";

const planetInfo = {
  Mercury: {
    diameter: "4,879 km",
    dayLength: "176 Earth days",
    yearLength: "88 Earth days",
    temperature: "-180°C to 430°C",
  },
  Venus: {
    diameter: "12,104 km",
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    temperature: "462°C",
  },
  Earth: {
    diameter: "12,742 km",
    dayLength: "24 hours",
    yearLength: "365.25 days",
    temperature: "-88°C to 58°C",
  },
  // Add more planets as needed
};

const InfoPanel = () => {
  const { selectedPlanet } = useStore();

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-6 max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4">{selectedPlanet}</h2>
          {planetInfo[selectedPlanet as keyof typeof planetInfo] && (
            <div className="space-y-2">
              {Object.entries(
                planetInfo[selectedPlanet as keyof typeof planetInfo]
              ).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-white/60">{key}:</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors w-full"
            onClick={() => useStore.getState().setSelectedPlanet(null)}
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
