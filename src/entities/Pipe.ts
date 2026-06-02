import Phaser from "phaser";

export class Pipe extends Phaser.Physics.Arcade.Image {
  pipeHeight: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    height: number
  ) {
    super(scene, x, y, "pipe-top");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.pipeHeight = height;
    this.setOrigin(0.5, 0);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(this.width, this.height);
    body.setOffset(0, 0);
  }
}
