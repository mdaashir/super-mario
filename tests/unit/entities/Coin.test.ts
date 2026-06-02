import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { COIN_SCORE_VALUE } from "../../../src/data/constants";

describe("Coin Event Flow", () => {
  beforeEach(() => {
    EventBus.clear();
  });

  it("should emit coin-collected event with score on collection", () => {
    let receivedScore = 0;
    EventBus.on("coin-collected", (score: unknown) => { receivedScore = score as number; });
    EventBus.emit("coin-collected", COIN_SCORE_VALUE);
    expect(receivedScore).toBe(COIN_SCORE_VALUE);
  });

  it("should track consecutive coin collection events", () => {
    let count = 0;
    EventBus.on("coin-collected", () => count++);
    EventBus.emit("coin-collected", COIN_SCORE_VALUE);
    EventBus.emit("coin-collected", COIN_SCORE_VALUE);
    EventBus.emit("coin-collected", COIN_SCORE_VALUE);
    expect(count).toBe(3);
  });

  it("should handle coin-collected events with zero score", () => {
    let receivedScore = -1;
    EventBus.on("coin-collected", (score: unknown) => { receivedScore = score as number; });
    EventBus.emit("coin-collected", 0);
    expect(receivedScore).toBe(0);
  });
});
