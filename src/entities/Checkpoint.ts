import Phaser from "phaser";

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  isActivated: boolean = false;
  position: { x: number; y: number };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "checkpoint");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.position = { x, y };
  }

  activate(): void {
    if (this.isActivated) return;
    this.isActivated = true;
    this.setTint(0x00ff00);
  }
}
