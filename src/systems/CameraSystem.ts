import Phaser from "phaser";
import { CAMERA_LERP_X, CAMERA_LERP_Y, CAMERA_OFFSET_Y } from "../data/constants";

export class CameraSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  follow(target: Phaser.GameObjects.Sprite): void {
    const camera = this.scene.cameras.main;
    camera.startFollow(target, true, CAMERA_LERP_X, CAMERA_LERP_Y);
    camera.setFollowOffset(0, -CAMERA_OFFSET_Y);
  }

  setBounds(x: number, y: number, width: number, height: number): void {
    this.scene.cameras.main.setBounds(x, y, width, height);
  }

  lockToBounds(): void {
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height
    );
  }
}
