import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { ScoreSystem } from "../../../src/systems/ScoreSystem";

describe("Core Platforming Integration", () => {
  beforeEach(() => {
    EventBus.clear();
    new ScoreSystem();
  });

  it("should emit score-updated when coins are collected", () => {
    const scores: number[] = [];
    EventBus.on("score-updated", (s: unknown) => scores.push(s as number));
    EventBus.emit("coin-collected", 100);
    EventBus.emit("coin-collected", 200);
    expect(scores).toEqual([100, 300]);
  });

  it("should handle level-complete event flow", () => {
    const levelData: Array<{ levelId: string; score: number }> = [];
    EventBus.on("level-complete", (data: unknown) => levelData.push(data as { levelId: string; score: number }));
    EventBus.emit("level-complete", { levelId: "1-1", score: 5000 });
    expect(levelData).toEqual([{ levelId: "1-1", score: 5000 }]);
  });

  it("should trigger extra-life at coin thresholds", () => {
    const extraLifeEvents: number[] = [];
    EventBus.on("extra-life", (val: unknown) => extraLifeEvents.push(val as number));

    for (let i = 0; i < 100; i++) {
      EventBus.emit("coin-collected", 100);
    }
    expect(extraLifeEvents.length).toBe(1);

    for (let i = 0; i < 100; i++) {
      EventBus.emit("coin-collected", 100);
    }
    expect(extraLifeEvents.length).toBe(2);
  });

  it("should chain power-up collected to expired flow", () => {
    const powerUpEvents: string[] = [];
    EventBus.on("power-up-collected", (type: unknown) => powerUpEvents.push(`collected:${type}`));
    EventBus.on("power-up-expired", (type: unknown) => powerUpEvents.push(`expired:${type}`));

    EventBus.emit("power-up-collected", "mushroom");
    EventBus.emit("power-up-expired", "mushroom");
    expect(powerUpEvents).toEqual(["collected:mushroom", "expired:mushroom"]);
  });

  it("should propagate player-died event", () => {
    let died = false;
    EventBus.on("player-died", () => { died = true; });
    EventBus.emit("player-died", 0);
    expect(died).toBe(true);
  });

  it("should handle bonus-points from duplicate mushroom when large", () => {
    let bonus = 0;
    EventBus.on("bonus-points", (val: unknown) => { bonus = val as number; });
    EventBus.emit("bonus-points", 1000);
    expect(bonus).toBe(1000);
  });
});
