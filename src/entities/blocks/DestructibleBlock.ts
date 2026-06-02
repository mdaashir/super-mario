import Phaser from "phaser";

export class DestructibleBlock extends Phaser.Physics.Arcade.Sprite {
  isBroken: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "block-destructible");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  hit(): void {
    if (this.isBroken) return;
    this.isBroken = true;

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 150,
      onComplete: () => this.destroy(),
    });
  }
}
