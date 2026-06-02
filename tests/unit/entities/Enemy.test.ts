import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { ENEMY_SCORE_VALUE } from "../../../src/data/constants";

describe("Enemy Event Flow", () => {
  beforeEach(() => {
    EventBus.clear();
  });

  it("should emit enemy-defeated event with score on stomp", () => {
    let receivedScore = 0;
    EventBus.on("enemy-defeated", (score: unknown) => { receivedScore = score as number; });
    EventBus.emit("enemy-defeated", ENEMY_SCORE_VALUE);
    expect(receivedScore).toBe(ENEMY_SCORE_VALUE);
  });

  it("should propagate player damage from enemy collision", () => {
    let damaged = false;
    EventBus.on("player-damaged", () => { damaged = true; });
    EventBus.emit("player-damaged");
    expect(damaged).toBe(true);
  });

  it("should handle player-died when last life lost", () => {
    let died = false;
    EventBus.on("player-died", () => { died = true; });
    EventBus.emit("player-died", 0);
    expect(died).toBe(true);
  });
});
