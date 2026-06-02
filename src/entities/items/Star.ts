import Phaser from "phaser";

export class Star extends Phaser.Physics.Arcade.Sprite {
  isCollected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "powerup-star");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setBounce(1);
    body.setVelocity(100, -300);
    body.setCollideWorldBounds(false);
  }

  collect(): void {
    if (this.isCollected) return;
    this.isCollected = true;
    this.destroy();
  }
}
