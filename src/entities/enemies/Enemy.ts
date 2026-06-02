import Phaser from "phaser";
import { ENEMY_SCORE_VALUE } from "../../data/constants";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  patrolLeft: number;
  patrolRight: number;
  patrolSpeed: number;
  scoreValue: number = ENEMY_SCORE_VALUE;
  isAlive: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrolLeft: number,
    patrolRight: number,
    speed: number
  ) {
    super(scene, x, y, "enemy-patrol");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.patrolSpeed = speed;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(-this.patrolSpeed);
  }

  update(): void {
    if (!this.isAlive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left) {
      body.setVelocityX(this.patrolSpeed);
      this.setFlipX(true);
    } else if (body.blocked.right) {
      body.setVelocityX(-this.patrolSpeed);
      this.setFlipX(false);
    } else if (this.x <= this.patrolLeft) {
      body.setVelocityX(this.patrolSpeed);
      this.setFlipX(true);
    } else if (this.x >= this.patrolRight) {
      body.setVelocityX(-this.patrolSpeed);
      this.setFlipX(false);
    }
  }

  stomp(): void {
    this.isAlive = false;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    this.setAlpha(0.5);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 300,
      onComplete: () => this.destroy(),
    });
  }
}
