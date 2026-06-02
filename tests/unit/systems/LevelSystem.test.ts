import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { LevelSystem } from "../../../src/systems/LevelSystem";

describe("LevelSystem", () => {
  let levelSystem: LevelSystem;

  beforeEach(() => {
    EventBus.clear();
    levelSystem = new LevelSystem();
  });

  it("should start with world 1 level 1-1 unlocked", () => {
    expect(levelSystem.isWorldUnlocked(1)).toBe(true);
    expect(levelSystem.isLevelUnlocked("1-1")).toBe(true);
    expect(levelSystem.isWorldUnlocked(2)).toBe(false);
  });

  it("should unlock next level on completion", () => {
    EventBus.emit("level-complete", { levelId: "1-1", score: 1000 });
    expect(levelSystem.isLevelUnlocked("1-2")).toBe(true);
  });

  it("should unlock next world on world completion", () => {
    EventBus.emit("world-complete", 1);
    expect(levelSystem.isWorldUnlocked(2)).toBe(true);
    expect(levelSystem.isLevelUnlocked("2-1")).toBe(true);
  });

  it("should track high scores", () => {
    EventBus.emit("level-complete", { levelId: "1-1", score: 5000 });
    expect(levelSystem.getHighScore("1-1")).toBe(5000);

    EventBus.emit("level-complete", { levelId: "1-1", score: 3000 });
    expect(levelSystem.getHighScore("1-1")).toBe(5000);

    EventBus.emit("level-complete", { levelId: "1-1", score: 8000 });
    expect(levelSystem.getHighScore("1-1")).toBe(8000);
  });

  it("should return 0 for missing high scores", () => {
    expect(levelSystem.getHighScore("nonexistent")).toBe(0);
  });

  it("should return default levels per world", () => {
    expect(levelSystem.getLevelsInWorld(1)).toBe(3);
    expect(levelSystem.getLevelsInWorld(999)).toBe(3);
  });

  it("should return difficulty factors with scaling", () => {
    const w1l1 = levelSystem.getDifficultyFactors(1, 1);
    expect(w1l1.enemySpeedMultiplier).toBe(1.0);
    expect(w1l1.bossHealthMultiplier).toBe(1.0);
    expect(w1l1.timeLimit).toBe(300);

    const w2l1 = levelSystem.getDifficultyFactors(2, 1);
    expect(w2l1.enemySpeedMultiplier).toBeGreaterThan(1.0);
    expect(w2l1.bossHealthMultiplier).toBeGreaterThan(1.0);
    expect(w2l1.timeLimit).toBeLessThan(300);
  });

  it("should cap difficulty factors", () => {
    const extreme = levelSystem.getDifficultyFactors(20, 10);
    expect(extreme.enemySpeedMultiplier).toBe(2.0);
    expect(extreme.bossHealthMultiplier).toBe(2.5);
    expect(extreme.timeLimit).toBe(100);
  });

  it("should set progress externally", () => {
    levelSystem.setProgress({
      unlockedWorlds: [1, 2, 3],
      unlockedLevels: { "1-1": true, "2-1": true, "3-1": true },
      highScores: { "1-1": 9999 },
    });
    expect(levelSystem.isWorldUnlocked(3)).toBe(true);
    expect(levelSystem.getHighScore("1-1")).toBe(9999);
  });

  it("should reset progress", () => {
    EventBus.emit("world-complete", 1);
    levelSystem.reset();
    expect(levelSystem.isWorldUnlocked(2)).toBe(false);
    expect(levelSystem.isLevelUnlocked("1-2")).toBe(false);
  });
});
