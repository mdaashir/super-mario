import Phaser from "phaser";
import { COIN_SCORE_VALUE } from "../../data/constants";

export class Coin extends Phaser.Physics.Arcade.Sprite {
  scoreValue: number = COIN_SCORE_VALUE;
  isCollected: boolean = false;
  onRelease: (() => void) | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "coin");
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
      y: this.y - 40,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (this.onRelease) {
          this.onRelease();
        } else {
          this.destroy();
        }
      },
    });
  }
}
