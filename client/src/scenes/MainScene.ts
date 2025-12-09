import { connectToCity } from "../network/connectCity";

export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  async create() {
    try {
      const room = await connectToCity();

      this.add.text(50, 50, "Connected to City!", {
        color: "#0f0",
        fontSize: "28px",
      });

      this.add.text(50, 100, `Session: ${room.sessionId}`, {
        color: "#fff",
        fontSize: "18px",
      });

      // слушаем изменения state комнаты
      room.state.players.onAdd = (player, key) => {
        console.log("Player joined city:", key);
      };

      room.state.players.onRemove = (player, key) => {
        console.log("Player left city:", key);
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      this.add.text(50, 50, "Connection Failed!", {
        color: "#f00",
        fontSize: "28px",
      });
      this.add.text(50, 100, `Error: ${error.message}`, {
        color: "#f00",
        fontSize: "18px",
      });
    }
  }
}
