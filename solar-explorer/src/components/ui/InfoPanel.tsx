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
  Type: "Supermassive Black Hole",
  Mass: "Millions to billions of solar masses",
  "Event Horizon Radius":
    "Varies with mass, can be larger than our solar system",
  "Gravitational Pull": "So strong that not even light can escape",
  Singularity: "Point of infinite density at the center",
  "Accretion Disk": "Superheated matter spiraling into the black hole",
  "Time Effect": "Time slows down near the event horizon",
  "Hawking Radiation":
    "Theoretical quantum effect that causes black holes to slowly evaporate",
  "Fun Fact":
    "If our Sun was replaced by a black hole of the same mass, Earth's orbit wouldn't change",
};

const InfoPanel = () => {
  const {
    selectedPlanet,
    showBlackHole,
    showBlackHoleInfo,
    setSelectedPlanet,
    setShowBlackHoleInfo,
  } = useStore();

  const handleClose = () => {
    if (showBlackHole) {
      setShowBlackHoleInfo(false);
    } else {
      setSelectedPlanet(null);
    }
  };

  const shouldShowInfo =
    (selectedPlanet && !showBlackHole) || (showBlackHole && showBlackHoleInfo);
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
          transition={{ duration: 0.3 }}
          className="absolute top-6 left-6 w-80 bg-black/40 backdrop-blur-md rounded-2xl 
                         border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 py-4 border-b border-white/10">
            <h2 className="text-xl text-white/90 font-light">{title}</h2>
            <button
              onClick={handleClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                             text-white/40 hover:text-white/90 hover:bg-white/10 transition-all duration-300"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content - Added custom scrollbar styling */}
          <div
            className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto
                              scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/20
                              hover:scrollbar-thumb-white/30"
          >
            {Object.entries(info).map(([key, value]) => (
              <div key={key}>
                <div className="text-white/50 text-sm mb-1">{key}</div>
                <div className="text-white/90">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
