import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: "SettingsScene" });
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, "SETTINGS", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, "Music: 50%", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15, "SFX: 50%", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, "Press ENTER to return", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-ENTER", () => {
      this.scene.start("MenuScene");
    });
  }
}
