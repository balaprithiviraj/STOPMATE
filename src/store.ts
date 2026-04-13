import { create } from 'zustand';

interface Location {
  lat: number;
  lng: number;
}

interface AppState {
  currentLocation: Location | null;
  destination: Location | null;
  alarmDistance: number; // in meters
  transportMode: 'bus' | 'train' | 'bike' | null;
  isTracking: boolean;
  setCurrentLocation: (loc: Location) => void;
  setDestination: (loc: Location | null) => void;
  setAlarmDistance: (dist: number) => void;
  setTransportMode: (mode: 'bus' | 'train' | 'bike' | null) => void;
  setIsTracking: (tracking: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentLocation: null,
  destination: null,
  alarmDistance: 1000, // Default 1km
  transportMode: null,
  isTracking: false,
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
  setDestination: (loc) => set({ destination: loc }),
  setAlarmDistance: (dist) => set({ alarmDistance: dist }),
  setTransportMode: (mode) => set({ transportMode: mode }),
  setIsTracking: (tracking) => set({ isTracking: tracking }),
}));
