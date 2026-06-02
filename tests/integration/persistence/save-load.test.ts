import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { SaveSystem } from "../../../src/systems/SaveSystem";

describe("Save/Load Persistence Integration", () => {
  let saveSystem: SaveSystem;

  beforeEach(() => {
    localStorage.clear();
    EventBus.clear();
    saveSystem = new SaveSystem();
    saveSystem.setSlot(0);
  });

  it("should save checkpoint progress and restore it", () => {
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: { x: 320, y: 480 },
      score: 5000,
      remainingLives: 2,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true, "1-2": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 25,
      worldHighScores: { "1-1": 5000 },
    });

    const loaded = saveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.checkpointPosition).toEqual({ x: 320, y: 480 });
    expect(loaded!.remainingLives).toBe(2);
    expect(loaded!.totalCoinsCollected).toBe(25);
  });

  it("should save after level completion", () => {
    const score = 8000;
    EventBus.emit("level-complete", { levelId: "1-1", score });

    saveSystem.save({
      currentWorld: 1,
      currentLevel: 2,
      checkpointPosition: null,
      score,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true, "1-2": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 40,
      worldHighScores: { "1-1": score },
    });

    const loaded = saveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.currentLevel).toBe(2);
    expect(loaded!.score).toBe(8000);
  });

  it("should recover from corrupted primary using backup", () => {
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: { x: 160, y: 400 },
      score: 3000,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 15,
      worldHighScores: {},
    });

    const storageKey = `super-mario-save-0`;
    localStorage.setItem(storageKey, "{corrupted json data}}");

    const loaded = saveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.score).toBe(3000);
  });

  it("should handle multiple save slots independently", () => {
    saveSystem.setSlot(0);
    saveSystem.save({
      currentWorld: 1, currentLevel: 1, checkpointPosition: null,
      score: 100, remainingLives: 3, unlockedWorlds: [1],
      unlockedLevels: { "1-1": true }, audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {}, totalCoinsCollected: 0, worldHighScores: {},
    });

    saveSystem.setSlot(1);
    saveSystem.save({
      currentWorld: 2, currentLevel: 1, checkpointPosition: null,
      score: 500, remainingLives: 5, unlockedWorlds: [1, 2],
      unlockedLevels: { "1-1": true, "2-1": true }, audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {}, totalCoinsCollected: 10, worldHighScores: {},
    });

    saveSystem.setSlot(0);
    const slot0 = saveSystem.load();
    expect(slot0!.currentWorld).toBe(1);
    expect(slot0!.score).toBe(100);

    saveSystem.setSlot(1);
    const slot1 = saveSystem.load();
    expect(slot1!.currentWorld).toBe(2);
    expect(slot1!.score).toBe(500);
  });

  it("should return null when no save exists", () => {
    expect(saveSystem.load()).toBeNull();
  });

  it("should persist level unlock progress through save/load cycle", () => {
    saveSystem.save({
      currentWorld: 1, currentLevel: 2, checkpointPosition: null,
      score: 2000, remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true, "1-2": true },
      audioSettings: { musicVolume: 75, sfxVolume: 50 },
      controlBindings: {}, totalCoinsCollected: 10, worldHighScores: { "1-1": 2000 },
    });

    const loaded = saveSystem.load();
    expect(loaded!.unlockedLevels["1-2"]).toBe(true);
    expect(loaded!.unlockedWorlds).toEqual([1]);
  });
});
