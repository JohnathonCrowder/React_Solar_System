import { useStore } from "../../store/store";

const NavigationArrows = () => {
  const { selectPreviousPlanet, selectNextPlanet } = useStore();

  return (
    <div className="absolute left-1/2 bottom-24 transform -translate-x-1/2 flex items-center gap-8">
      <button
        onClick={selectPreviousPlanet}
        className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
        aria-label="Previous Planet"
      >
        <svg
          className="w-8 h-8 text-white/80 group-hover:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={selectNextPlanet}
        className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
        aria-label="Next Planet"
      >
        <svg
          className="w-8 h-8 text-white/80 group-hover:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default NavigationArrows;
