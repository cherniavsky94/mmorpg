import { create } from "zustand";

interface GameState {
  connected: boolean;
  playerId: string;
  setConnected: (v: boolean) => void;
  setPlayerId: (id: string) => void;
}

export const useGameState = create<GameState>((set) => ({
  connected: false,
  playerId: "",
  setConnected: (v) => set({ connected: v }),
  setPlayerId: (id) => set({ playerId: id }),
}));
