import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "GAME OVER", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ff4444",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, "Press ENTER to retry", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-ENTER", () => {
      this.scene.start("GameScene");
    });
  }
}
