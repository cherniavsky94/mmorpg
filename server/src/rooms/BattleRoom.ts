import { Room } from "@colyseus/core";
import { Schema, type, MapSchema } from "@colyseus/schema";

class Fighter extends Schema {
  @type("string") id!: string;
  @type("number") hp = 100;
}

class BattleState extends Schema {
  @type({ map: Fighter }) fighters = new MapSchema<Fighter>();
}

export class BattleRoom extends Room<BattleState> {

  onCreate() {
    this.setState(new BattleState());
    console.log("BattleRoom created");
  }

  onJoin(client) {
    const f = new Fighter();
    f.id = client.sessionId;

    this.state.fighters.set(client.sessionId, f);
  }

  onLeave(client) {
    this.state.fighters.delete(client.sessionId);
  }
}
