import { create } from "zustand";

interface GameState {
  cityRoom: any | null;
  setCityRoom: (room: any) => void;
}

export const useGameState = create<GameState>((set) => ({
  cityRoom: null,
  setCityRoom: (room) => set({ cityRoom: room }),
}));
