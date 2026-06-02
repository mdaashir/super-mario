import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";

describe("EventBus", () => {
  beforeEach(() => {
    EventBus.clear();
  });

  it("should emit and receive events", () => {
    const results: number[] = [];
    EventBus.on("test-event", (val: unknown) => results.push(val as number));
    EventBus.emit("test-event", 42);
    expect(results).toEqual([42]);
  });

  it("should support multiple listeners", () => {
    let count = 0;
    EventBus.on("increment", () => count++);
    EventBus.on("increment", () => count++);
    EventBus.emit("increment");
    expect(count).toBe(2);
  });

  it("should remove listeners via off()", () => {
    let count = 0;
    const fn = () => count++;
    EventBus.on("test", fn);
    EventBus.emit("test");
    expect(count).toBe(1);
    EventBus.off("test", fn);
    EventBus.emit("test");
    expect(count).toBe(1);
  });

  it("should not throw on emit with no listeners", () => {
    expect(() => EventBus.emit("nonexistent")).not.toThrow();
  });

  it("should clear all listeners", () => {
    let count = 0;
    EventBus.on("a", () => count++);
    EventBus.on("b", () => count++);
    EventBus.clear();
    EventBus.emit("a");
    EventBus.emit("b");
    expect(count).toBe(0);
  });

  it("should pass multiple arguments", () => {
    const results: unknown[] = [];
    EventBus.on("multi", (a: unknown, b: unknown) => results.push(a, b));
    EventBus.emit("multi", "hello", 123);
    expect(results).toEqual(["hello", 123]);
  });
});
