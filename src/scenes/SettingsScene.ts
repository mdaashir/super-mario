import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";
import { AudioManager } from "../audio/AudioManager";

export class SettingsScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private musicVol: number = 0.5;
  private sfxVol: number = 0.5;
  private musicText!: Phaser.GameObjects.Text;
  private sfxText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "SettingsScene" });
  }

  create(): void {
    this.audioManager = new AudioManager(this);
    this.audioManager.playMusic("music-menu");

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, "SETTINGS", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "Left/Right: Adjust  |  ENTER: Back", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#888888",
      })
      .setOrigin(0.5);

    this.musicText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, `Music: ${Math.round(this.musicVol * 100)}%`, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.sfxText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15, `SFX: ${Math.round(this.sfxVol * 100)}%`, {
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

    this.input.keyboard?.on("keydown-LEFT", () => {
      this.adjustMusic(-0.1);
    });

    this.input.keyboard?.on("keydown-RIGHT", () => {
      this.adjustMusic(0.1);
    });

    this.input.keyboard?.on("keydown-A", () => {
      this.adjustSfx(-0.1);
    });

    this.input.keyboard?.on("keydown-D", () => {
      this.adjustSfx(0.1);
    });
  }

  private adjustMusic(delta: number): void {
    this.musicVol = Math.max(0, Math.min(1, this.musicVol + delta));
    this.audioManager.setMusicVolume(this.musicVol);
    this.musicText.setText(`Music: ${Math.round(this.musicVol * 100)}%`);
  }

  private adjustSfx(delta: number): void {
    this.sfxVol = Math.max(0, Math.min(1, this.sfxVol + delta));
    this.audioManager.setSfxVolume(this.sfxVol);
    this.sfxText.setText(`SFX: ${Math.round(this.sfxVol * 100)}%`);
  }
}
