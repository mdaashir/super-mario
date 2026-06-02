import Phaser from "phaser";
import { TILE_SIZE } from "../data/constants";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const barW = 320;
    const barH = 24;

    const bg = this.add.rectangle(w / 2, h / 2, barW, barH, 0x333333);
    const bar = this.add.rectangle(w / 2 - barW / 2, h / 2, 0, barH, 0xffffff);
    bar.setOrigin(0, 0.5);

    this.load.on("progress", (value: number) => {
      bar.width = barW * value;
    });

    this.load.on("complete", () => {
      bg.destroy();
      bar.destroy();
    });
  }

  create(): void {
    this.generatePlaceholderTextures();
    this.scene.start("MenuScene");
  }

  private generatePlaceholderTextures(): void {
    const s = TILE_SIZE;

    const rect = (key: string, color: number, w = s, h = s) => {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(color);
      g.fillRect(0, 0, w, h);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    rect("tile-ground", 0x8b4513);
    rect("tile-platform", 0xc8a87c);
    rect("tile-bg", 0x5c94fc);
    rect("block-question", 0xffaa00);
    rect("block-empty", 0x886644);
    rect("block-hidden", 0x000000);
    rect("block-destructible", 0xaa6633);
    rect("powerup-mushroom", 0xff6600, 14, 14);
    rect("powerup-star", 0xffff00, 14, 14);
    rect("powerup-fireflower", 0xff4444, 14, 14);
    rect("goal-flag", 0x00cc00, 8, 48);

    const pipeTopGfx = this.make.graphics({ x: 0, y: 0 });
    pipeTopGfx.fillStyle(0x00aa00);
    pipeTopGfx.fillRect(0, 0, s, s);
    pipeTopGfx.fillStyle(0x00dd00);
    pipeTopGfx.fillRect(1, 1, s - 2, s / 2);
    pipeTopGfx.lineStyle(2, 0x006600);
    pipeTopGfx.strokeRect(0, 0, s, s);
    pipeTopGfx.generateTexture("pipe-top", s, s);
    pipeTopGfx.destroy();

    rect("pipe-body", 0x00aa00);

    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    playerGfx.fillStyle(0xe00000);
    playerGfx.fillRect(0, 4, 14, 20);
    playerGfx.fillStyle(0xffcc00);
    playerGfx.fillRect(3, 2, 8, 4);
    playerGfx.generateTexture("player-idle", 16, 24);
    playerGfx.destroy();

    const playerLargeGfx = this.make.graphics({ x: 0, y: 0 });
    playerLargeGfx.fillStyle(0xe00000);
    playerLargeGfx.fillRect(0, 8, 14, 28);
    playerLargeGfx.fillStyle(0xffcc00);
    playerLargeGfx.fillRect(3, 2, 8, 8);
    playerLargeGfx.generateTexture("player-large", 16, 36);
    playerLargeGfx.destroy();

    const enemyGfx = this.make.graphics({ x: 0, y: 0 });
    enemyGfx.fillStyle(0x8b0000);
    enemyGfx.fillRect(1, 4, 14, 12);
    enemyGfx.fillStyle(0xcc0000);
    enemyGfx.fillCircle(8, 6, 6);
    enemyGfx.fillStyle(0xffffff);
    enemyGfx.fillCircle(6, 5, 2);
    enemyGfx.fillCircle(10, 5, 2);
    enemyGfx.generateTexture("enemy-patrol", 16, 16);
    enemyGfx.destroy();

    rect("checkpoint", 0xff8800, 12, 24);

    const coinGfx = this.make.graphics({ x: 0, y: 0 });
    coinGfx.fillStyle(0xffcc00);
    coinGfx.fillCircle(8, 8, 6);
    coinGfx.fillStyle(0xffaa00);
    coinGfx.fillCircle(8, 8, 4);
    coinGfx.generateTexture("coin", 16, 16);
    coinGfx.destroy();
  }
}
