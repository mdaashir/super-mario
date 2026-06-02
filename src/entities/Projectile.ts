import Phaser from "phaser";

const PROJECTILE_SPEED = 400;
const PROJECTILE_LIFESPAN = 2000;

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private spawnTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "powerup-fireflower");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setSize(8, 8);
    this.setActive(false).setVisible(false);
  }

  fire(x: number, y: number, facingRight: boolean): void {
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    this.spawnTime = this.scene.time.now;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED);
    body.setAllowGravity(false);
    body.enable = true;
  }

  update(): void {
    if (!this.active) return;
    if (this.scene.time.now - this.spawnTime > PROJECTILE_LIFESPAN) {
      this.deactivate();
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.blocked.right) {
      this.deactivate();
    }
  }

  private deactivate(): void {
    this.setActive(false).setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.enable = false;
  }
}
