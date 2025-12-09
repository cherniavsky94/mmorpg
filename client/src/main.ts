import Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#000",
  parent: "app",
  scene: [MainScene],
});
