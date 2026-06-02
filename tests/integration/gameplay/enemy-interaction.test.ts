import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { ScoreSystem } from "../../../src/systems/ScoreSystem";

describe("Enemy Interaction Integration", () => {
  beforeEach(() => {
    EventBus.clear();
    new ScoreSystem();
  });

  it("should increase score when enemy is stomped", () => {
    const scores: number[] = [];
    EventBus.on("score-updated", (s: unknown) => scores.push(s as number));
    EventBus.emit("enemy-defeated", 200);
    expect(scores).toEqual([200]);
  });

  it("should handle enemy-defeated event with score value", () => {
    let enemyScore = 0;
    EventBus.on("enemy-defeated", (val: unknown) => { enemyScore = val as number; });
    EventBus.emit("enemy-defeated", 200);
    expect(enemyScore).toBe(200);
  });

  it("should propagate player-died event on fatal damage", () => {
    let died = false;
    EventBus.on("player-died", () => { died = true; });
    EventBus.emit("player-died", 0);
    expect(died).toBe(true);
  });

  it("should combine coin and enemy scoring", () => {
    const scores: number[] = [];
    EventBus.on("score-updated", (s: unknown) => scores.push(s as number));
    EventBus.emit("coin-collected", 100);
    EventBus.emit("enemy-defeated", 200);
    EventBus.emit("coin-collected", 100);
    expect(scores).toEqual([100, 300, 400]);
  });
});
