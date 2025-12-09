import { createStore } from "zustand/vanilla";

export const createRoomStore = () =>
  createStore(() => ({
    tick: 0,
    started: false,
    start: () => ({ started: true }),
    nextTick: () => (state: any) => ({ tick: state.tick + 1 }),
  }));
