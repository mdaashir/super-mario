import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";

export class VictoryScene extends Phaser.Scene {
  private levelId: string = "";
  private score: number = 0;

  constructor() {
    super({ key: "VictoryScene" });
  }

  init(data?: { levelId?: string; score?: number }): void {
    this.levelId = data?.levelId ?? "1-1";
    this.score = data?.score ?? 0;
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, "LEVEL COMPLETE!", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `Level: ${this.levelId}`, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, `Score: ${this.score}`, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffcc00",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, "Press ENTER to continue", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-ENTER", () => {
      this.scene.start("GameScene", { levelId: this.levelId });
    });
  }
}
