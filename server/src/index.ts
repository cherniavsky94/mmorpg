import express from "express";
import cors from "cors";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import http from "http";

import { CityRoom } from "./rooms/CityRoom.js";
import { BattleRoom } from "./rooms/BattleRoom.js";

const PORT = Number(process.env.PORT) || 2567;

const app = express();

// Enable CORS for all origins (Gitpod URLs)
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
});

// Define rooms BEFORE calling listen()
gameServer.define("city", CityRoom);
gameServer.define("battle", BattleRoom);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Colyseus server running",
    rooms: ["city", "battle"]
  });
});

// Start Colyseus server - this registers matchmaking routes
gameServer.listen(PORT);

console.log(`✅ Colyseus server listening on port ${PORT}`);
console.log(`📍 Matchmaking: http://localhost:${PORT}/matchmake/joinOrCreate/city`);
