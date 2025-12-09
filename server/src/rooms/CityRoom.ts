import { Room } from "@colyseus/core";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { serverStore } from "../store/serverStore";

class Player extends Schema {
  @type("string") id!: string;
  @type("number") x = 0;
  @type("number") y = 0;
}

class CityState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class CityRoom extends Room<CityState> {

  onCreate() {
    this.setState(new CityState());
    console.log("CityRoom created");

    // Команда для входа в бой
    this.onMessage("enterBattle", (client) => {
      this.transferToBattle(client);
    });
  }

  onJoin(client) {
    const p = new Player();
    p.id = client.sessionId;

    this.state.players.set(client.sessionId, p);
    serverStore.getState().increment();
  }

  onLeave(client) {
    this.state.players.delete(client.sessionId);
    serverStore.getState().decrement();
  }

  async transferToBattle(client) {
    console.log("Transferring player to battle:", client.sessionId);
    
    // Send message to client to join battle room
    client.send("joinBattle", { roomName: "battle" });
  }
}
