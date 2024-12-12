import { create } from 'zustand'

interface State {
  selectedPlanet: string | null
  cameraPosition: [number, number, number]
  setSelectedPlanet: (planet: string | null) => void
  setCameraPosition: (position: [number, number, number]) => void
}

export const useStore = create<State>((set) => ({
  selectedPlanet: null,
  cameraPosition: [0, 20, 100],
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
}))