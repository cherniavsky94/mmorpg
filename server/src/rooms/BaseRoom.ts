import { Room } from "@colyseus/core";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { serverStore } from "../store/serverStore.js";
import { createRoomStore } from "../store/roomStore.js";

class Player extends Schema {
  @type("string") id!: string;
  @type("number") x = 0;
  @type("number") y = 0;
}

class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class BaseRoom extends Room<State> {
  roomStore = createRoomStore();

  onCreate() {
    this.setState(new State());
    console.log("BaseRoom created");
  }

  onJoin(client: any) {
    const p = new Player();
    p.id = client.sessionId;
    this.state.players.set(client.sessionId, p);
    serverStore.getState().increment();
  }

  onLeave(client: any) {
    this.state.players.delete(client.sessionId);
    serverStore.getState().decrement();
  }

  update(delta: number) {
    const store = this.roomStore.getState();
    store.nextTick();
  }
}
