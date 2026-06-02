import Phaser from "phaser";
import { LevelData, LevelMetadata } from "./LevelData";

export class LevelLoader {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadLevel(key: string): void {
    this.scene.load.tilemapTiledJSON(key, `src/data/levels/${key}.json`);
  }

  createLevel(key: string): Phaser.Tilemaps.Tilemap | null {
    const map = this.scene.make.tilemap({ key });
    if (!map) return null;
    return map;
  }

  getMetadata(key: string): LevelMetadata | null {
    const map = this.scene.cache.tilemap.get(key);
    if (!map) return null;
    const props = map.properties;
    return {
      levelId: props.levelId ?? key,
      worldId: props.worldId ?? 1,
      levelNumber: props.levelNumber ?? 1,
      levelName: props.levelName ?? "Level",
      timeLimit: props.timeLimit ?? 300,
      parTime: props.parTime ?? 120,
    };
  }
}
