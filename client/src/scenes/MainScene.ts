import { connectToCity } from "../network/connectCity";

export class MainScene extends Phaser.Scene {
  async create() {
    const room = await connectToCity();

    this.add.text(50, 50, "Connected to City!", {
      color: "#fff",
      fontSize: "28px",
    });

    // слушаем изменения state комнаты
    room.state.players.onAdd = (player, key) => {
      console.log("Player joined city:", key);
    };

    room.state.players.onRemove = (player, key) => {
      console.log("Player left city:", key);
    };
  }
}
