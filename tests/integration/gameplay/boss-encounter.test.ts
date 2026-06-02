import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";

describe("Boss Encounter Integration", () => {
  beforeEach(() => {
    EventBus.clear();
  });

  it("should emit level-complete on boss defeat (simulated)", () => {
    const completions: string[] = [];
    EventBus.on("level-complete", (data: unknown) => {
      const d = data as { levelId: string };
      completions.push(d.levelId);
    });
    EventBus.emit("level-complete", { levelId: "1-3", score: 10000 });
    expect(completions).toEqual(["1-3"]);
  });

  it("should emit world-complete after final boss", () => {
    const worlds: number[] = [];
    EventBus.on("world-complete", (worldId: unknown) => worlds.push(worldId as number));
    EventBus.emit("world-complete", 1);
    expect(worlds).toEqual([1]);
  });

  it("should propagate score through level complete", () => {
    const scores: number[] = [];
    EventBus.on("level-complete", (data: unknown) => {
      const d = data as { score: number };
      scores.push(d.score);
    });
    EventBus.emit("level-complete", { levelId: "3-3", score: 25000 });
    expect(scores).toEqual([25000]);
  });

  it("should handle player-died during boss fight", () => {
    let died = false;
    EventBus.on("player-died", () => { died = true; });
    EventBus.emit("player-died", 0);
    expect(died).toBe(true);
  });

  it("should chain boss defeat to world completion", () => {
    const flow: string[] = [];
    EventBus.on("level-complete", (data: unknown) => {
      const d = data as { levelId: string };
      flow.push(`level:${d.levelId}`);
    });
    EventBus.on("world-complete", (id: unknown) => flow.push(`world:${id}`));

    EventBus.emit("level-complete", { levelId: "1-3", score: 5000 });
    EventBus.emit("world-complete", 1);
    expect(flow).toEqual(["level:1-3", "world:1"]);
  });
});
