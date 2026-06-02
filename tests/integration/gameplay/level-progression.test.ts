import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { LevelSystem } from "../../../src/systems/LevelSystem";
import { SaveSystem } from "../../../src/systems/SaveSystem";

describe("Level Progression Integration", () => {
  let levelSystem: LevelSystem;
  let saveSystem: SaveSystem;

  beforeEach(() => {
    EventBus.clear();
    localStorage.clear();
    levelSystem = new LevelSystem();
    saveSystem = new SaveSystem();
    saveSystem.setSlot(0);
  });

  it("should start with only world 1 level 1-1 unlocked", () => {
    expect(levelSystem.isWorldUnlocked(1)).toBe(true);
    expect(levelSystem.isLevelUnlocked("1-1")).toBe(true);
    expect(levelSystem.isWorldUnlocked(2)).toBe(false);
    expect(levelSystem.isLevelUnlocked("1-2")).toBe(false);
  });

  it("should unlock next level in same world after level completion", () => {
    EventBus.emit("level-complete", { levelId: "1-1", score: 1000 });

    expect(levelSystem.isLevelUnlocked("1-2")).toBe(true);
    expect(levelSystem.isLevelUnlocked("1-3")).toBe(false);
    expect(levelSystem.isWorldUnlocked(2)).toBe(false);
  });

  it("should unlock next world after world completion", () => {
    EventBus.emit("world-complete", 1);

    expect(levelSystem.isWorldUnlocked(2)).toBe(true);
    expect(levelSystem.isLevelUnlocked("2-1")).toBe(true);
  });

  it("should complete a full level run through all worlds", () => {
    EventBus.emit("level-complete", { levelId: "1-1", score: 5000 });
    EventBus.emit("level-complete", { levelId: "1-2", score: 6000 });
    EventBus.emit("world-complete", 1);

    expect(levelSystem.isWorldUnlocked(2)).toBe(true);
    expect(levelSystem.isLevelUnlocked("2-1")).toBe(true);
    expect(levelSystem.getHighScore("1-1")).toBe(5000);
    expect(levelSystem.getHighScore("1-2")).toBe(6000);
  });

  it("should persist high scores across level unlocks", () => {
    EventBus.emit("level-complete", { levelId: "1-1", score: 5000 });
    EventBus.emit("level-complete", { levelId: "1-1", score: 3000 });
    EventBus.emit("level-complete", { levelId: "1-1", score: 8000 });

    expect(levelSystem.getHighScore("1-1")).toBe(8000);
  });

  it("should scale difficulty across worlds", () => {
    const w1 = levelSystem.getDifficultyFactors(1, 1);
    const w2 = levelSystem.getDifficultyFactors(2, 1);
    const w3 = levelSystem.getDifficultyFactors(3, 1);

    expect(w1.enemySpeedMultiplier).toBeLessThan(w2.enemySpeedMultiplier);
    expect(w2.enemySpeedMultiplier).toBeLessThan(w3.enemySpeedMultiplier);
    expect(w1.timeLimit).toBeGreaterThan(w2.timeLimit);
    expect(w2.timeLimit).toBeGreaterThan(w3.timeLimit);
  });

  it("should scale difficulty within worlds by level number", () => {
    const l1 = levelSystem.getDifficultyFactors(1, 1);
    const l2 = levelSystem.getDifficultyFactors(1, 2);
    const l3 = levelSystem.getDifficultyFactors(1, 3);

    expect(l1.enemySpeedMultiplier).toBeLessThanOrEqual(l2.enemySpeedMultiplier);
    expect(l2.enemySpeedMultiplier).toBeLessThanOrEqual(l3.enemySpeedMultiplier);
    expect(l1.timeLimit).toBeGreaterThanOrEqual(l2.timeLimit);
    expect(l2.timeLimit).toBeGreaterThanOrEqual(l3.timeLimit);
  });

  it("should persist unlock state through save and load", () => {
    EventBus.emit("level-complete", { levelId: "1-1", score: 1000 });

    const progress = levelSystem.getProgress();
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 2,
      checkpointPosition: null,
      score: 1000,
      remainingLives: 3,
      unlockedWorlds: progress.unlockedWorlds,
      unlockedLevels: progress.unlockedLevels,
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 0,
      worldHighScores: progress.highScores,
    });

    const loaded = saveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.unlockedLevels["1-2"]).toBe(true);
  });

  it("should handle concurrent level and world completion events", () => {
    EventBus.emit("level-complete", { levelId: "1-3", score: 9999 });
    EventBus.emit("world-complete", 1);

    expect(levelSystem.isLevelUnlocked("2-1")).toBe(true);
    expect(levelSystem.getHighScore("1-3")).toBe(9999);
  });
});
