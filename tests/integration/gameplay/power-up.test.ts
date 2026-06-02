import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "../../../src/utils/EventBus";
import { PowerUpSystem } from "../../../src/systems/PowerUpSystem";
import { STAR_INVINCIBILITY_DURATION, FIRE_FLOWER_DURATION } from "../../../src/data/constants";

describe("Power-up Mechanics Integration", () => {
  let powerUpSystem: PowerUpSystem;

  beforeEach(() => {
    EventBus.clear();
    powerUpSystem = new PowerUpSystem();
  });

  it("should collect mushroom, take damage, and revert to normal", () => {
    const states: string[] = [];
    EventBus.on("power-up-collected", () => states.push(`collected:${powerUpSystem.powerState}`));
    EventBus.on("power-up-expired", () => states.push(`expired:${powerUpSystem.powerState}`));

    powerUpSystem.collect("mushroom");
    expect(powerUpSystem.powerState).toBe("large");

    powerUpSystem.takeDamage();
    expect(powerUpSystem.powerState).toBe("normal");
  });

  it("should stack star over mushroom and revert to large after expiry", () => {
    powerUpSystem.collect("mushroom");
    powerUpSystem.collect("star");
    expect(powerUpSystem.powerState).toBe("invincible");

    powerUpSystem.update(STAR_INVINCIBILITY_DURATION + 1000);
    expect(powerUpSystem.powerState).toBe("large");
  });

  it("should not demote from invincible on damage", () => {
    powerUpSystem.collect("star");
    powerUpSystem.takeDamage();
    expect(powerUpSystem.powerState).toBe("invincible");
  });

  it("should expire fire flower and revert to normal", () => {
    powerUpSystem.collect("fire-flower");
    powerUpSystem.update(FIRE_FLOWER_DURATION + 1000);
    expect(powerUpSystem.powerState).toBe("normal");
  });

  it("should fire events on collection and expiry", () => {
    const events: string[] = [];
    EventBus.on("power-up-collected", (type: unknown) => events.push(`+${type}`));
    EventBus.on("power-up-expired", (type: unknown) => events.push(`-${type}`));

    powerUpSystem.collect("mushroom");
    powerUpSystem.collect("star");
    powerUpSystem.update(STAR_INVINCIBILITY_DURATION + 1000);

    expect(events).toContain("+mushroom");
    expect(events).toContain("+star");
    expect(events).toContain("-star");
  });
});
