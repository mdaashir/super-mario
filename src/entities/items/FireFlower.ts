import Phaser from "phaser";

export class FireFlower extends Phaser.Physics.Arcade.Sprite {
  isCollected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "powerup-fireflower");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  collect(): void {
    if (this.isCollected) return;
    this.isCollected = true;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      onComplete: () => this.destroy(),
    });
  }
}
