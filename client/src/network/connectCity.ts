import * as Colyseus from "colyseus.js";
import { useGameState } from "../state/store";

export async function connectToCity() {
  const wsUrl = import.meta.env.VITE_WS_URL;
  const client = new Colyseus.Client(wsUrl);
  
  const room = await client.joinOrCreate("city");

  // сохраняем комнату в Zustand
  useGameState.getState().setCityRoom(room);

  console.log("Connected to CityRoom", room.sessionId);

  return room;
}
