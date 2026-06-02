import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../data/constants";
import { WORLDS } from "../data/worlds";
import { SaveSystem, SaveData } from "../systems/SaveSystem";
import { AudioManager } from "../audio/AudioManager";
import { AudioAssets } from "../audio/AudioAssets";
import { allLevels } from "../data/levels/AllLevels";
import type { LevelLayout } from "../data/levels/LevelRegistry";

const TAB_Y = 90;
const TAB_SPACING = 160;
const TAB_START_X = GAME_WIDTH / 2 - TAB_SPACING;
const LEVEL_START_Y = 160;
const LEVEL_SPACING = 44;

export class WorldMapScene extends Phaser.Scene {
  private selectedWorldIdx: number = 0;
  private selectedLevelIdx: number = 0;
  private saveData: SaveData | null = null;
  private audioManager!: AudioManager;
  private worldTabs: Phaser.GameObjects.Text[] = [];
  private levelRows: Phaser.GameObjects.Text[] = [];
  private levelData: LevelLayout[] = [];
  private unlockedLevels: Record<string, boolean> = {};
  private unlockedWorlds: number[] = [1];
  private highScores: Record<string, number> = {};
  private worldTitle!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "WorldMapScene" });
  }

  create(): void {
    this.audioManager = new AudioManager(this);
    this.audioManager.playMusic(AudioAssets.music.menu);

    const saveSystem = new SaveSystem();
    this.saveData = saveSystem.load();

    if (this.saveData) {
      this.unlockedWorlds = this.saveData.unlockedWorlds;
      this.unlockedLevels = this.saveData.unlockedLevels;
      this.highScores = this.saveData.worldHighScores;
    } else {
      this.unlockedWorlds = [1];
      this.unlockedLevels = { "1-1": true };
      this.highScores = {};
    }

    this.selectedWorldIdx = 0;
    this.selectedLevelIdx = 0;

    this.cameras.main.setBackgroundColor("#5c94fc");

    this.add
      .text(GAME_WIDTH / 2, 35, "WORLD MAP", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.worldTitle = this.add
      .text(GAME_WIDTH / 2, 130, "", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.drawWorldTabs();
    this.refreshLevelList();

    this.hintText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 30, "\u2190\u2192 Switch World  |  \u2191\u2193 Select Level  |  ENTER Play  |  ESC Menu", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#888888",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-LEFT", () => this.navigateWorlds(-1));
    this.input.keyboard?.on("keydown-RIGHT", () => this.navigateWorlds(1));
    this.input.keyboard?.on("keydown-UP", () => this.navigateLevels(-1));
    this.input.keyboard?.on("keydown-DOWN", () => this.navigateLevels(1));
    this.input.keyboard?.on("keydown-ENTER", () => this.selectLevel());
    this.input.keyboard?.on("keydown-ESC", () => this.scene.start("MenuScene"));
  }

  private navigateWorlds(dir: number): void {
    const target = this.selectedWorldIdx + dir;
    const worldId = WORLDS[target]?.id;
    if (target < 0 || target >= WORLDS.length) return;
    if (worldId !== undefined && !this.unlockedWorlds.includes(worldId)) return;

    this.selectedWorldIdx = target;
    this.selectedLevelIdx = 0;
    this.refreshLevelList();
  }

  private navigateLevels(dir: number): void {
    const target = this.selectedLevelIdx + dir;
    if (target < 0 || target >= this.levelData.length) return;
    this.selectedLevelIdx = target;
    this.highlightLevels();
  }

  private drawWorldTabs(): void {
    this.worldTabs = [];
    for (let i = 0; i < WORLDS.length; i++) {
      const world = WORLDS[i];
      const x = TAB_START_X + i * TAB_SPACING;
      const unlocked = this.unlockedWorlds.includes(world.id);

      const tab = this.add
        .text(x, TAB_Y, `${world.name}  ${unlocked ? "" : "\u{1F512}"}`, {
          fontFamily: "monospace",
          fontSize: "16px",
          color: unlocked ? "#ffffff" : "#555555",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      const desc = this.add
        .text(x, TAB_Y + 20, world.description, {
          fontFamily: "monospace",
          fontSize: "10px",
          color: unlocked ? "#aaaaaa" : "#444444",
        })
        .setOrigin(0.5);

      this.worldTabs.push(tab);
    }

    this.highlightWorldTab();
  }

  private highlightWorldTab(): void {
    for (let i = 0; i < this.worldTabs.length; i++) {
      const tab = this.worldTabs[i];
      if (i === this.selectedWorldIdx) {
        tab.setColor("#ffcc00");
        tab.setFontSize(18);
      } else {
        const world = WORLDS[i];
        const unlocked = this.unlockedWorlds.includes(world.id);
        tab.setColor(unlocked ? "#ffffff" : "#555555");
        tab.setFontSize(16);
      }
    }

    const currentWorld = WORLDS[this.selectedWorldIdx];
    const unlocked = this.unlockedWorlds.includes(currentWorld.id);
    this.worldTitle.setText(currentWorld.theme + (unlocked ? "" : " (LOCKED)"));
  }

  private refreshLevelList(): void {
    const world = WORLDS[this.selectedWorldIdx];
    this.levelData = Object.values(allLevels)
      .filter((l) => l.worldId === world.id)
      .sort((a, b) => a.levelNumber - b.levelNumber);

    for (const row of this.levelRows) {
      row.destroy();
    }
    this.levelRows = [];

    const startY = LEVEL_START_Y;

    for (let i = 0; i < this.levelData.length; i++) {
      const level = this.levelData[i];
      const y = startY + i * LEVEL_SPACING;
      const unlocked = !!this.unlockedLevels[level.levelId];
      const highScore = this.highScores[level.levelId];

      const label = unlocked
        ? `${level.levelId}  ${level.levelName}${highScore ? `  (Score: ${highScore})` : ""}`
        : `${level.levelId}  ??? (LOCKED)`;

      const row = this.add
        .text(GAME_WIDTH / 2, y, label, {
          fontFamily: "monospace",
          fontSize: "13px",
          color: unlocked ? "#cccccc" : "#444444",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5);

      this.levelRows.push(row);
    }

    this.selectedLevelIdx = 0;
    this.highlightLevels();
  }

  private highlightLevels(): void {
    for (let i = 0; i < this.levelRows.length; i++) {
      const row = this.levelRows[i];
      const level = this.levelData[i];
      const unlocked = !!this.unlockedLevels[level.levelId];

      if (i === this.selectedLevelIdx) {
        row.setColor(unlocked ? "#ffcc00" : "#664400");
        row.setFontSize(14);
      } else {
        row.setColor(unlocked ? "#cccccc" : "#444444");
        row.setFontSize(13);
      }
    }
  }

  private selectLevel(): void {
    const level = this.levelData[this.selectedLevelIdx];
    if (!level) return;
    if (!this.unlockedLevels[level.levelId]) return;

    this.scene.start("GameScene", { levelId: level.levelId });
  }
}
