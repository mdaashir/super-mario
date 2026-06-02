import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { PowerUpSystem } from "../../../src/systems/PowerUpSystem";
import { STAR_INVINCIBILITY_DURATION, FIRE_FLOWER_DURATION } from "../../../src/data/constants";

describe("PowerUpSystem", () => {
  let powerUpSystem: PowerUpSystem;

  beforeEach(() => {
    EventBus.clear();
    powerUpSystem = new PowerUpSystem();
  });

  it("should start in normal state", () => {
    expect(powerUpSystem.powerState).toBe("normal");
    expect(powerUpSystem.activePowerUp).toBe("none");
  });

  it("should transition to large on mushroom collect", () => {
    const events: string[] = [];
    EventBus.on("power-up-collected", (type: unknown) => events.push(type as string));
    powerUpSystem.collect("mushroom");
    expect(powerUpSystem.powerState).toBe("large");
    expect(powerUpSystem.activePowerUp).toBe("mushroom");
    expect(events).toEqual(["mushroom"]);
  });

  it("should return bonus points when already large collecting mushroom", () => {
    powerUpSystem.collect("mushroom");
    let bonusPoints = 0;
    EventBus.on("bonus-points", (val: unknown) => bonusPoints = val as number);
    powerUpSystem.collect("mushroom");
    expect(bonusPoints).toBeGreaterThan(0);
    expect(powerUpSystem.powerState).toBe("large");
  });

  it("should transition to invincible on star collect", () => {
    powerUpSystem.collect("star");
    expect(powerUpSystem.powerState).toBe("invincible");
    expect(powerUpSystem.activePowerUp).toBe("star");
  });

  it("should transition to firing on fire-flower collect", () => {
    powerUpSystem.collect("fire-flower");
    expect(powerUpSystem.powerState).toBe("firing");
    expect(powerUpSystem.activePowerUp).toBe("fire-flower");
  });

  it("should demote from large to normal on damage", () => {
    powerUpSystem.collect("mushroom");
    powerUpSystem.takeDamage();
    expect(powerUpSystem.powerState).toBe("normal");
  });

  it("should not demote from invincible on damage", () => {
    powerUpSystem.collect("star");
    powerUpSystem.takeDamage();
    expect(powerUpSystem.powerState).toBe("invincible");
  });

  it("should expire star after duration", () => {
    powerUpSystem.collect("star");
    powerUpSystem.update(STAR_INVINCIBILITY_DURATION + 1000);
    expect(powerUpSystem.powerState).toBe("normal");
  });

  it("should expire fire-flower after duration", () => {
    powerUpSystem.collect("fire-flower");
    powerUpSystem.update(FIRE_FLOWER_DURATION + 1000);
    expect(powerUpSystem.powerState).toBe("normal");
  });

  it("should reset to normal", () => {
    powerUpSystem.collect("mushroom");
    powerUpSystem.reset();
    expect(powerUpSystem.powerState).toBe("normal");
    expect(powerUpSystem.activePowerUp).toBe("none");
  });

  it("should save base state when star overwrites", () => {
    powerUpSystem.collect("mushroom");
    powerUpSystem.collect("star");
    expect(powerUpSystem.powerState).toBe("invincible");
    powerUpSystem.update(STAR_INVINCIBILITY_DURATION + 1000);
    expect(powerUpSystem.powerState).toBe("large");
  });
});
