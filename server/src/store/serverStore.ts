import { createStore } from "zustand/vanilla";

interface ServerState {
  onlinePlayers: number;
  increment: () => void;
  decrement: () => void;
}

export const serverStore = createStore<ServerState>((set) => ({
  onlinePlayers: 0,
  increment: () => set((s) => ({ onlinePlayers: s.onlinePlayers + 1 })),
  decrement: () => set((s) => ({ onlinePlayers: s.onlinePlayers - 1 })),
}));
