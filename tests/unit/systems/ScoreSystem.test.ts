import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { ScoreSystem } from "../../../src/systems/ScoreSystem";
import { EXTRA_LIVE_THRESHOLD } from "../../../src/data/constants";

describe("ScoreSystem", () => {
  let scoreSystem: ScoreSystem;

  beforeEach(() => {
    EventBus.clear();
    scoreSystem = new ScoreSystem();
  });

  it("should start at zero", () => {
    expect(scoreSystem.getScore()).toBe(0);
    expect(scoreSystem.getCoinsCollected()).toBe(0);
  });

  it("should increase score on coin collected event", () => {
    EventBus.emit("coin-collected", 100);
    expect(scoreSystem.getScore()).toBe(100);
    expect(scoreSystem.getCoinsCollected()).toBe(1);
  });

  it("should increase score on enemy defeated event", () => {
    EventBus.emit("enemy-defeated", 200);
    expect(scoreSystem.getScore()).toBe(200);
  });

  it("should grant extra life at threshold", () => {
    let extraLifeCount = 0;
    EventBus.on("extra-life", () => extraLifeCount++);
    for (let i = 0; i < EXTRA_LIVE_THRESHOLD; i++) {
      EventBus.emit("coin-collected", 100);
    }
    expect(extraLifeCount).toBe(1);
    expect(scoreSystem.getExtraLivesEarned()).toBe(1);
  });

  it("should grant multiple extra lives", () => {
    let extraLifeCount = 0;
    EventBus.on("extra-life", () => extraLifeCount++);
    for (let i = 0; i < EXTRA_LIVE_THRESHOLD * 3; i++) {
      EventBus.emit("coin-collected", 100);
    }
    expect(extraLifeCount).toBe(3);
  });

  it("should emit score-updated events", () => {
    const scores: number[] = [];
    EventBus.on("score-updated", (s: unknown) => scores.push(s as number));
    EventBus.emit("coin-collected", 50);
    expect(scores).toEqual([50]);
  });

  it("should reset to zero", () => {
    EventBus.emit("coin-collected", 500);
    scoreSystem.reset();
    expect(scoreSystem.getScore()).toBe(0);
    expect(scoreSystem.getCoinsCollected()).toBe(0);
  });

  it("should handle zero score events", () => {
    EventBus.emit("coin-collected", 0);
    expect(scoreSystem.getScore()).toBe(0);
  });
});
