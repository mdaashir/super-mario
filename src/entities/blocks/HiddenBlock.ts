import Phaser from "phaser";
import { BlockContents } from "./QuestionBlock";

export class HiddenBlock extends Phaser.Physics.Arcade.Sprite {
  contents: BlockContents;
  isRevealed: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, contents: BlockContents) {
    super(scene, x, y, "block-hidden");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.contents = contents;
    this.setVisible(false);
  }

  hit(): BlockContents | null {
    if (this.isRevealed) return null;
    this.isRevealed = true;
    this.setVisible(true);
    this.setTexture("block-question");

    const content = this.contents;
    this.contents = "empty";
    return content;
  }
}
