import { useStore } from "../../store/store";
import { motion, AnimatePresence } from "framer-motion";

const celestialInfo = {
  Sun: {
    type: "Star",
    diameter: "1.392 million km",
    surfaceTemp: "5,500°C",
    mass: "1.989 × 10^30 kg",
    age: "4.6 billion years",
    composition: "Hydrogen (73%), Helium (25%)",
    funFact: "The Sun contains 99.86% of the mass in the Solar System",
  },
  Mercury: {
    type: "Terrestrial Planet",
    diameter: "4,879 km",
    dayLength: "176 Earth days",
    yearLength: "88 Earth days",
    temperature: "-180°C to 430°C",
    atmosphere: "Minimal - Exosphere",
    moons: "0",
    funFact:
      "Despite being closest to the Sun, Venus is actually hotter than Mercury",
  },
  Venus: {
    type: "Terrestrial Planet",
    diameter: "12,104 km",
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    temperature: "462°C (average)",
    atmosphere: "Thick - CO2, Nitrogen",
    moons: "0",
    funFact: "Venus rotates backwards compared to most other planets",
  },
  Earth: {
    type: "Terrestrial Planet",
    diameter: "12,742 km",
    dayLength: "24 hours",
    yearLength: "365.25 days",
    temperature: "-88°C to 58°C",
    atmosphere: "Nitrogen, Oxygen",
    moons: "1",
    funFact: "Earth is the only known planet with liquid water on its surface",
  },
  Mars: {
    type: "Terrestrial Planet",
    diameter: "6,779 km",
    dayLength: "24 hours 37 minutes",
    yearLength: "687 Earth days",
    temperature: "-140°C to 20°C",
    atmosphere: "Thin - CO2",
    moons: "2",
    funFact: "Mars has the largest volcano in the solar system, Olympus Mons",
  },
  Jupiter: {
    type: "Gas Giant",
    diameter: "139,820 km",
    dayLength: "10 hours",
    yearLength: "11.9 Earth years",
    temperature: "-110°C (cloud top)",
    atmosphere: "Hydrogen, Helium",
    moons: "79 known",
    funFact:
      "The Great Red Spot is a storm that has been raging for at least 400 years",
  },
  Saturn: {
    type: "Gas Giant",
    diameter: "116,460 km",
    dayLength: "10.7 hours",
    yearLength: "29.5 Earth years",
    temperature: "-140°C (cloud top)",
    atmosphere: "Hydrogen, Helium",
    moons: "82 known",
    funFact:
      "Saturn's rings are mostly made of ice and rock, some as small as a grain of sand",
  },
  Uranus: {
    type: "Ice Giant",
    diameter: "50,724 km",
    dayLength: "17 hours",
    yearLength: "84 Earth years",
    temperature: "-195°C (cloud top)",
    atmosphere: "Hydrogen, Helium, Methane",
    moons: "27",
    funFact:
      "Uranus rotates on its side, likely due to a massive impact early in its history",
  },
  Neptune: {
    type: "Ice Giant",
    diameter: "49,244 km",
    dayLength: "16 hours",
    yearLength: "165 Earth years",
    temperature: "-200°C (cloud top)",
    atmosphere: "Hydrogen, Helium, Methane",
    moons: "14",
    funFact:
      "Neptune has the strongest winds in the solar system, reaching 2,100 km/h",
  },
  Pluto: {
    type: "Dwarf Planet",
    diameter: "2,377 km",
    dayLength: "6.4 Earth days",
    yearLength: "248 Earth years",
    temperature: "-230°C (average)",
    atmosphere: "Thin - Nitrogen, Methane",
    moons: "5",
    funFact:
      "Pluto's largest moon, Charon, is so big that both orbit a point above Pluto's surface",
  },
};

const blackHoleInfo = {
  type: "Supermassive Black Hole",
  mass: "Millions to billions of solar masses",
  eventHorizonRadius: "Varies with mass, can be larger than our solar system",
  gravitationalPull: "So strong that not even light can escape",
  singularity: "Point of infinite density at the center",
  accretionDisk: "Superheated matter spiraling into the black hole",
  timeEffect: "Time slows down near the event horizon",
  hawkingRadiation:
    "Theoretical quantum effect that causes black holes to slowly evaporate",
  funFact:
    "If our Sun was replaced by a black hole of the same mass, Earth's orbit wouldn't change",
};

const InfoPanel = () => {
  const { selectedPlanet, showBlackHole } = useStore();

  const shouldShowInfo = selectedPlanet || showBlackHole;
  const title = showBlackHole ? "Black Hole" : selectedPlanet;
  const info = showBlackHole
    ? blackHoleInfo
    : selectedPlanet &&
      celestialInfo[selectedPlanet as keyof typeof celestialInfo];

  return (
    <AnimatePresence>
      {shouldShowInfo && info && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-6 max-w-md"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
            <button
              className="text-white/60 hover:text-white"
              onClick={() => useStore.getState().setSelectedPlanet(null)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(info).map(([key, value]) => (
              <div key={key} className="border-b border-white/10 pb-2">
                <span className="text-white/60 text-sm uppercase tracking-wider">
                  {key}
                </span>
                <div className="text-white mt-1">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              onClick={() => useStore.getState().setSelectedPlanet(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
