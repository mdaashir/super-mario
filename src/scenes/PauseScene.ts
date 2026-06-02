import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "PAUSED", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, "Press ESC to Resume", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35, "Press Q to Quit to Menu", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });

    this.input.keyboard?.on("keydown-Q", () => {
      this.scene.stop("GameScene");
      this.scene.start("MenuScene");
    });
  }
}
