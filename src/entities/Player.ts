import Phaser from "phaser";
import { StateMachine } from "../utils/StateMachine";
import { EventBus } from "../utils/EventBus";
import {
  PLAYER_WALK_SPEED,
  PLAYER_RUN_SPEED,
  PLAYER_JUMP_VELOCITY,
  PLAYER_BOUNCE_VELOCITY,
  POST_DAMAGE_INVULNERABILITY,
} from "../data/constants";
import type { PowerState } from "../systems/PowerUpSystem";

type MovementState = "idle" | "walking" | "running" | "jumping" | "falling";
type MoveEvent = "move-left" | "move-right" | "release" | "run" | "release-run" | "jump" | "land" | "fall";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private stateMachine: StateMachine<MovementState, MoveEvent>;
  private facingRight: boolean = true;
  private isInvulnerable: boolean = false;
  private currentPowerState: PowerState = "normal";

  remainingLives: number = 3;
  currentScore: number = 0;
  coinsCollected: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player-idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);
    body.setSize(16, 24);

    this.stateMachine = new StateMachine<MovementState, MoveEvent>("idle", [
      { from: "idle", event: "move-left", to: "walking" },
      { from: "idle", event: "move-right", to: "walking" },
      { from: "idle", event: "jump", to: "jumping" },
      { from: "walking", event: "release", to: "idle" },
      { from: "walking", event: "run", to: "running" },
      { from: "walking", event: "jump", to: "jumping" },
      { from: "walking", event: "fall", to: "falling" },
      { from: "running", event: "release-run", to: "walking" },
      { from: "running", event: "jump", to: "jumping" },
      { from: "running", event: "fall", to: "falling" },
      { from: "jumping", event: "land", to: "idle" },
      { from: "jumping", event: "fall", to: "falling" },
      { from: "falling", event: "land", to: "walking" },
      { from: "falling", event: "land", to: "idle" },
    ]);

    EventBus.on("power-up-collected", (type: unknown) => {
      this.applyPowerUpVisual(type as string);
    });

    EventBus.on("power-up-expired", () => {
      this.applyPowerUpVisual("none");
    });
  }

  get movementState(): string {
    return this.stateMachine.state;
  }

  setPowerState(state: PowerState): void {
    this.currentPowerState = state;
  }

  private applyPowerUpVisual(type: string): void {
    switch (type) {
      case "mushroom":
      case "fire-flower":
        this.setTexture("player-large");
        (this.body as Phaser.Physics.Arcade.Body).setSize(16, 36);
        break;
      case "star":
        this.setTexture("player-idle");
        this.scene.tweens.add({
          targets: this,
          alpha: { from: 0.3, to: 1 },
          duration: 150,
          repeat: -1,
          yoyo: true,
        });
        break;
      case "none":
        this.scene.tweens.killTweensOf(this);
        this.alpha = 1;
        this.setTexture("player-idle");
        (this.body as Phaser.Physics.Arcade.Body).setSize(16, 24);
        break;
    }
  }

  handleInput(input: {
    left: boolean;
    right: boolean;
    run: boolean;
    jump: boolean;
  }): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    if (onGround) {
      this.stateMachine.dispatch("land");
    } else if (body.velocity.y > 0 && this.stateMachine.state !== "falling") {
      this.stateMachine.dispatch("fall");
    }

    if (input.left) {
      this.facingRight = false;
      this.setFlipX(true);
      this.stateMachine.dispatch("move-left");
      body.setVelocityX(input.run ? -PLAYER_RUN_SPEED : -PLAYER_WALK_SPEED);
    } else if (input.right) {
      this.facingRight = true;
      this.setFlipX(false);
      this.stateMachine.dispatch("move-right");
      body.setVelocityX(input.run ? PLAYER_RUN_SPEED : PLAYER_WALK_SPEED);
    } else {
      body.setVelocityX(0);
      if (onGround) {
        this.stateMachine.dispatch("release");
      }
    }

    if (input.run && (input.left || input.right)) {
      this.stateMachine.dispatch("run");
    } else {
      this.stateMachine.dispatch("release-run");
    }

    if (input.jump && onGround) {
      body.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.stateMachine.dispatch("jump");
    }
  }

  bounce(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(PLAYER_BOUNCE_VELOCITY);
  }

  takeDamage(): void {
    if (this.isInvulnerable) return;
    if (this.currentPowerState === "invincible") return;

    this.isInvulnerable = true;
    this.remainingLives--;

    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0.3, to: 1 },
      duration: 100,
      repeat: Math.floor(POST_DAMAGE_INVULNERABILITY / 200),
      yoyo: true,
      onComplete: () => {
        this.isInvulnerable = false;
        this.alpha = 1;
      },
    });
  }

  isDead(): boolean {
    return this.remainingLives <= 0;
  }
}
