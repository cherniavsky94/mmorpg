import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { useGameState } from "../state/store";

export class MainScene extends Phaser.Scene {
  client!: Colyseus.Client;

  constructor() {
    super("MainScene");
  }

  async create() {
    const wsUrl = import.meta.env.VITE_WS_URL;

    this.client = new Colyseus.Client(wsUrl);

    try {
      const room = await this.client.joinOrCreate("base");

      useGameState.getState().setConnected(true);
      useGameState.getState().setPlayerId(room.sessionId);

      this.add.text(100, 100, "Connected to BaseRoom!", {
        color: "#fff",
        fontSize: "28px",
      });

      this.add.text(100, 150, `Session ID: ${room.sessionId}`, {
        color: "#0f0",
        fontSize: "18px",
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      this.add.text(100, 100, "Failed to connect to server", {
        color: "#f00",
        fontSize: "28px",
      });
    }
  }
}
