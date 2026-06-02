import { describe, it, expect, beforeEach, vi } from "vitest";
import { SaveSystem } from "../../../src/systems/SaveSystem";

describe("SaveSystem", () => {
  let saveSystem: SaveSystem;

  beforeEach(() => {
    localStorage.clear();
    saveSystem = new SaveSystem();
    saveSystem.setSlot(0);
  });

  it("should save and load data", () => {
    const ok = saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: null,
      score: 5000,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 10,
      worldHighScores: {},
    });
    expect(ok).toBe(true);

    const loaded = saveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.score).toBe(5000);
    expect(loaded!.remainingLives).toBe(3);
    expect(loaded!.currentWorld).toBe(1);
  });

  it("should return null when no save exists", () => {
    const loaded = saveSystem.load();
    expect(loaded).toBeNull();
  });

  it("should reject corrupted data", () => {
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: null,
      score: 100,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 0,
      worldHighScores: {},
    });

    const storageKey = `super-mario-save-0`;
    const backupKey = `super-mario-save-0-bak`;
    localStorage.setItem(storageKey, '{"corrupted":true}');
    localStorage.setItem(backupKey, '{"also_corrupted":true}');

    const loaded = saveSystem.load();
    expect(loaded).toBeNull();
  });

  it("should fall back to backup when primary is corrupted", () => {
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: null,
      score: 200,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 5,
      worldHighScores: {},
    });

    const storageKey = `super-mario-save-0`;
    const raw = localStorage.getItem(storageKey)!;
    const tampered = raw.replace('"score":200', '"score":1');
    localStorage.setItem(storageKey, tampered);

    const loaded = saveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.score).toBe(200);
  });

  it("should delete a slot", () => {
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: null,
      score: 100,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 0,
      worldHighScores: {},
    });
    saveSystem.deleteSlot(0);
    expect(saveSystem.load()).toBeNull();
  });

  it("should list available slots", () => {
    const slots = saveSystem.getSlots();
    expect(slots.length).toBe(3);
    expect(slots.every((s) => s.hasSave === false)).toBe(true);
  });

  it("should reject invalid slot IDs", () => {
    saveSystem.setSlot(5);
    expect(saveSystem["currentSlot"]).toBe(0);
  });

  it("should reject negative lives in saved data", () => {
    saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: null,
      score: 100,
      remainingLives: -1,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 0,
      worldHighScores: {},
    });
    expect(saveSystem.load()).toBeNull();
  });

  it("should handle localStorage quota error gracefully", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => { throw new Error("QuotaExceededError"); });
    const ok = saveSystem.save({
      currentWorld: 1,
      currentLevel: 1,
      checkpointPosition: null,
      score: 100,
      remainingLives: 3,
      unlockedWorlds: [1],
      unlockedLevels: { "1-1": true },
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: 0,
      worldHighScores: {},
    });
    expect(ok).toBe(false);
    localStorage.setItem = originalSetItem;
  });
});
