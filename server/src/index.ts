import http from "http";
import express from "express";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { BaseRoom } from "./rooms/BaseRoom.js";

const PORT = Number(process.env.PORT) || 2567;

const app = express();
const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server }),
});

gameServer.define("base", BaseRoom);

server.listen(PORT, "0.0.0.0", () => {
  console.log("Colyseus server running on port", PORT);
});
