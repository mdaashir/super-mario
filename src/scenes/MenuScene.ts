import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";
import { AudioManager } from "../audio/AudioManager";
import { AudioAssets } from "../audio/AudioAssets";

export class MenuScene extends Phaser.Scene {
  private audioManager!: AudioManager;

  constructor() {
    super({ key: "MenuScene" });
  }

  create(): void {
    this.audioManager = new AudioManager(this);
    this.audioManager.playMusic(AudioAssets.music.menu);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, "SUPER MARIO", {
        fontFamily: "monospace",
        fontSize: "36px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Press ENTER to Start", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffcc00",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, "Arrow Keys: Move  |  Up: Jump  |  Shift: Run", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, "ESC: Pause  |  Z: Fire", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 85, "Press S for Settings", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#888888",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-ENTER", () => {
      this.scene.start("WorldMapScene");
    });

    this.input.keyboard?.on("keydown-S", () => {
      this.scene.start("SettingsScene");
    });
  }
}
