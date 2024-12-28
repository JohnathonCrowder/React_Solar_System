import { useEffect } from "react";
import { useStore } from "../../store/store";

const KeyboardNavigation = () => {
  const { selectNextPlanet, selectPreviousPlanet } = useStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [selectNextPlanet, selectPreviousPlanet]);

  return null;
};

export default KeyboardNavigation;
