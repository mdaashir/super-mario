import { EventBus } from "../utils/EventBus";

export interface LevelProgress {
  unlockedWorlds: number[];
  unlockedLevels: Record<string, boolean>;
  highScores: Record<string, number>;
}

export interface DifficultyFactors {
  enemySpeedMultiplier: number;
  bossHealthMultiplier: number;
  timeLimit: number;
}

export class LevelSystem {
  private progress: LevelProgress = {
    unlockedWorlds: [1],
    unlockedLevels: { "1-1": true },
    highScores: {},
  };

  private worldLevels: Record<number, number> = {
    1: 3,
    2: 3,
    3: 3,
  };

  constructor() {
    EventBus.on("level-complete", (data: unknown) => {
      const { levelId, score } = data as { levelId: string; score: number };
      this.completeLevel(levelId, score);
    });

    EventBus.on("world-complete", (worldId: unknown) => {
      this.completeWorld(worldId as number);
    });
  }

  getProgress(): LevelProgress {
    return { ...this.progress };
  }

  isLevelUnlocked(levelId: string): boolean {
    return !!this.progress.unlockedLevels[levelId];
  }

  isWorldUnlocked(worldId: number): boolean {
    return this.progress.unlockedWorlds.includes(worldId);
  }

  getLevelsInWorld(worldId: number): number {
    return this.worldLevels[worldId] ?? 3;
  }

  getDifficultyFactors(worldId: number, levelNum: number): DifficultyFactors {
    const worldMultiplier = 1 + (worldId - 1) * 0.15;
    const levelBonus = (levelNum - 1) * 0.05;
    const combined = worldMultiplier + levelBonus;
    return {
      enemySpeedMultiplier: Math.min(combined, 2.0),
      bossHealthMultiplier: Math.min(worldMultiplier, 2.5),
      timeLimit: Math.max(300 - (worldId - 1) * 30 - (levelNum - 1) * 10, 100),
    };
  }

  getHighScore(levelId: string): number {
    return this.progress.highScores[levelId] ?? 0;
  }

  setProgress(progress: LevelProgress): void {
    this.progress = progress;
  }

  reset(): void {
    this.progress = {
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      highScores: {},
    };
  }

  private completeLevel(levelId: string, score: number): void {
    const [worldStr, levelStr] = levelId.split("-");
    const worldId = parseInt(worldStr, 10);
    const levelNum = parseInt(levelStr, 10);
    const totalLevels = this.worldLevels[worldId] ?? 3;

    if (score > (this.progress.highScores[levelId] ?? 0)) {
      this.progress.highScores[levelId] = score;
    }

    if (levelNum < totalLevels) {
      const nextLevel = `${worldId}-${levelNum + 1}`;
      this.progress.unlockedLevels[nextLevel] = true;
    }
  }

  private completeWorld(worldId: number): void {
    const nextWorld = worldId + 1;
    if (!this.progress.unlockedWorlds.includes(nextWorld)) {
      this.progress.unlockedWorlds.push(nextWorld);
    }
    const firstLevel = `${nextWorld}-1`;
    this.progress.unlockedLevels[firstLevel] = true;
  }
}
