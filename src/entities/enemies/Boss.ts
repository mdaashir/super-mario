import Phaser from "phaser";
import { StateMachine } from "../../utils/StateMachine";

type BossPhase = "spawning" | "phase_1" | "phase_2" | "phase_3" | "defeated";
type BossEvent = "intro-complete" | "health-threshold" | "damaged" | "defeated";

export class Boss extends Phaser.Physics.Arcade.Sprite {
  bossHealth: number;
  maxHealth: number;
  currentPhase: number = 1;
  phaseThresholds: number[];
  isDefeated: boolean = false;
  private stateMachine: StateMachine<BossPhase, BossEvent>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    maxHealth: number,
    phaseThresholds: number[]
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHealth = maxHealth;
    this.bossHealth = maxHealth;
    this.phaseThresholds = phaseThresholds;

    this.stateMachine = new StateMachine<BossPhase, BossEvent>("spawning", [
      { from: "spawning", event: "intro-complete", to: "phase_1" },
      { from: "phase_1", event: "health-threshold", to: "phase_2" },
      { from: "phase_2", event: "health-threshold", to: "phase_3" },
      { from: "phase_3", event: "defeated", to: "defeated" },
    ]);

    this.stateMachine.onEnterState("phase_2", () => {
      this.currentPhase = 2;
    });

    this.stateMachine.onEnterState("phase_3", () => {
      this.currentPhase = 3;
    });

    this.stateMachine.onEnterState("defeated", () => {
      this.isDefeated = true;
    });

    this.stateMachine.dispatch("intro-complete");
  }

  takeDamage(amount: number): void {
    if (this.isDefeated) return;
    this.bossHealth = Math.max(0, this.bossHealth - amount);

    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });

    const healthPercent = this.bossHealth / this.maxHealth;
    const nextThreshold = this.phaseThresholds[this.currentPhase - 1];

    if (this.bossHealth <= 0) {
      this.stateMachine.dispatch("defeated");
    } else if (nextThreshold !== undefined && healthPercent <= nextThreshold) {
      this.stateMachine.dispatch("health-threshold");
    }
  }

  updateAI(_playerX: number, _playerY: number): void {
    if (this.isDefeated || !this.active) return;
  }
}
