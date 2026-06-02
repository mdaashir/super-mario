import Phaser from "phaser";
import { ENEMY_PATROL_SPEED } from "../../data/constants";

export class Mushroom extends Phaser.Physics.Arcade.Sprite {
  isCollected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "powerup-mushroom");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(ENEMY_PATROL_SPEED);
    body.setBounce(0);
  }

  collect(): void {
    if (this.isCollected) return;
    this.isCollected = true;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 20,
      alpha: 0,
      duration: 200,
      onComplete: () => this.destroy(),
    });
  }
}
