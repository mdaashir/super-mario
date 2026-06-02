import Phaser from "phaser";

export class MovingPlatform extends Phaser.Physics.Arcade.Image {
  private startX: number;
  private endX: number;
  private speed: number;
  private movingRight: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    endX: number,
    speed: number,
    width: number = 64
  ) {
    super(scene, x, y, "tile-platform");
    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.startX = x;
    this.endX = endX;
    this.speed = speed;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.setVelocityX(this.speed);
    this.setDisplaySize(width, 16);
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.movingRight && this.x >= this.endX) {
      this.movingRight = false;
      body.setVelocityX(-this.speed);
    } else if (!this.movingRight && this.x <= this.startX) {
      this.movingRight = true;
      body.setVelocityX(this.speed);
    }
  }
}
