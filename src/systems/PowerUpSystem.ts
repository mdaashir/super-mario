import {
  STAR_INVINCIBILITY_DURATION,
  FIRE_FLOWER_DURATION,
  MUSHROOM_SCORE_VALUE,
} from "../data/constants";
import { EventBus } from "../utils/EventBus";

export type PowerUpType = "mushroom" | "star" | "fire-flower" | "none";
export type PowerState = "normal" | "large" | "invincible" | "firing";

interface PowerUpStackState {
  powerState: PowerState;
  baseState: PowerState;
  activePowerUp: PowerUpType;
  invincibilityTimer: number;
  powerUpTimer: number;
}

export class PowerUpSystem {
  private state: PowerUpStackState = {
    powerState: "normal",
    baseState: "normal",
    activePowerUp: "none",
    invincibilityTimer: 0,
    powerUpTimer: 0,
  };

  get powerState(): PowerState {
    return this.state.powerState;
  }

  get activePowerUp(): PowerUpType {
    return this.state.activePowerUp;
  }

  collect(powerUp: PowerUpType): void {
    switch (powerUp) {
      case "mushroom":
        this.collectMushroom();
        break;
      case "star":
        this.collectStar();
        break;
      case "fire-flower":
        this.collectFireFlower();
        break;
    }
  }

  takeDamage(): void {
    if (this.state.powerState === "invincible") return;

    if (this.state.powerState === "large" || this.state.powerState === "firing") {
      this.state.powerState = "normal";
      this.state.activePowerUp = "none";
      this.state.powerUpTimer = 0;
      EventBus.emit("power-up-expired", this.state.activePowerUp);
    }
  }

  update(delta: number): void {
    const dt = delta / 1000;

    if (this.state.powerState === "invincible") {
      this.state.invincibilityTimer -= dt;
      if (this.state.invincibilityTimer <= 0) {
        this.state.powerState = this.state.baseState === "large" ? "large" : "normal";
        this.state.activePowerUp = this.state.baseState === "large" ? "mushroom" : "none";
        EventBus.emit("power-up-expired", "star");
      }
    }

    if (this.state.powerState === "firing") {
      this.state.powerUpTimer -= dt;
      if (this.state.powerUpTimer <= 0) {
        this.state.powerState = "normal";
        this.state.activePowerUp = "none";
        EventBus.emit("power-up-expired", "fire-flower");
      }
    }
  }

  private collectMushroom(): void {
    if (this.state.powerState === "large") {
      EventBus.emit("bonus-points", MUSHROOM_SCORE_VALUE);
      return;
    }

    this.state.powerState = "large";
    this.state.baseState = "large";
    this.state.activePowerUp = "mushroom";
    EventBus.emit("power-up-collected", "mushroom");
  }

  private collectStar(): void {
    if (this.state.powerState !== "invincible") {
      this.state.baseState = this.state.powerState;
    }
    this.state.powerState = "invincible";
    this.state.activePowerUp = "star";
    this.state.invincibilityTimer = STAR_INVINCIBILITY_DURATION / 1000;
    EventBus.emit("power-up-collected", "star");
  }

  private collectFireFlower(): void {
    this.state.powerState = "firing";
    this.state.activePowerUp = "fire-flower";
    this.state.powerUpTimer = FIRE_FLOWER_DURATION / 1000;
    EventBus.emit("power-up-collected", "fire-flower");
  }

  reset(): void {
    this.state = {
      powerState: "normal",
      baseState: "normal",
      activePowerUp: "none",
      invincibilityTimer: 0,
      powerUpTimer: 0,
    };
  }
}
