import { create } from 'zustand'

const planetOrder = [
  "Sun",
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto"
];

interface State {
  selectedPlanet: string | null
  cameraPosition: [number, number, number]
  showBlackHole: boolean
  showBlackHoleInfo: boolean
  setSelectedPlanet: (planet: string | null) => void
  setCameraPosition: (position: [number, number, number]) => void
  selectNextPlanet: () => void
  selectPreviousPlanet: () => void
  toggleBlackHole: () => void
  setShowBlackHoleInfo: (show: boolean) => void
}

export const useStore = create<State>((set) => ({
  selectedPlanet: null,
  cameraPosition: [0, 20, 100],
  showBlackHole: false,
  showBlackHoleInfo: false,
  
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  
  setCameraPosition: (position) => set({ cameraPosition: position }),
  
  setShowBlackHoleInfo: (show) => set({ showBlackHoleInfo: show }),
  
  toggleBlackHole: () => set((state) => ({ 
    showBlackHole: !state.showBlackHole,
    showBlackHoleInfo: !state.showBlackHole, // Initialize info panel when toggling black hole
    selectedPlanet: null // Reset selected planet when toggling
  })),
  
  selectNextPlanet: () => set((state) => {
    if (state.showBlackHole) return state; // Don't change planets in black hole view
    const currentIndex = state.selectedPlanet ? planetOrder.indexOf(state.selectedPlanet) : -1;
    const nextIndex = currentIndex === planetOrder.length - 1 ? 0 : currentIndex + 1;
    return { selectedPlanet: planetOrder[nextIndex] };
  }),
  
  selectPreviousPlanet: () => set((state) => {
    if (state.showBlackHole) return state; // Don't change planets in black hole view
    const currentIndex = state.selectedPlanet ? planetOrder.indexOf(state.selectedPlanet) : 0;
    const previousIndex = currentIndex === 0 ? planetOrder.length - 1 : currentIndex - 1;
    return { selectedPlanet: planetOrder[previousIndex] };
  }),
}))