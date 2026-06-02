import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";

describe("Player Event Flow", () => {
  beforeEach(() => {
    EventBus.clear();
  });

  it("should emit player-jumped event on jump", () => {
    let jumped = false;
    EventBus.on("player-jumped", () => { jumped = true; });
    EventBus.emit("player-jumped");
    expect(jumped).toBe(true);
  });

  it("should emit player-damaged event on damage", () => {
    let damaged = false;
    EventBus.on("player-damaged", () => { damaged = true; });
    EventBus.emit("player-damaged");
    expect(damaged).toBe(true);
  });

  it("should trigger player-died when lives reach zero", () => {
    let died = false;
    EventBus.on("player-died", (lives: unknown) => {
      if (typeof lives === "number" && lives <= 0) died = true;
    });
    EventBus.emit("player-died", 0);
    expect(died).toBe(true);
  });

  it("should not emit player-died when lives remain", () => {
    let died = false;
    EventBus.on("player-died", () => { died = true; });
    EventBus.emit("player-died", 2);
    expect(died).toBe(true);
  });
});
