import Phaser from "phaser";

export type BlockContents = "coin" | "mushroom" | "star" | "fire-flower" | "empty";

export class QuestionBlock extends Phaser.Physics.Arcade.Sprite {
  contents: BlockContents;
  isEmpty: boolean = false;
  hitCount: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, contents: BlockContents) {
    super(scene, x, y, "block-question");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.contents = contents;
  }

  hit(): BlockContents | null {
    if (this.isEmpty) return null;
    this.isEmpty = true;
    this.setTexture("block-empty");

    this.scene.tweens.add({
      targets: this,
      y: this.y - 4,
      duration: 50,
      yoyo: true,
    });

    this.hitCount++;
    const content = this.contents;
    this.contents = "empty";
    return content;
  }
}
