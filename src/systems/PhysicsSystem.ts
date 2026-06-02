import Phaser from "phaser";

export class PhysicsSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupCollider(
    object1: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    object2: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    callback?: (obj1: unknown, obj2: unknown) => void
  ): void {
    if (callback) {
      this.scene.physics.add.collider(object1, object2, callback);
    } else {
      this.scene.physics.add.collider(object1, object2);
    }
  }

  setupOverlap(
    object1: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    object2: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    callback: (obj1: unknown, obj2: unknown) => void
  ): void {
    this.scene.physics.add.overlap(object1, object2, callback);
  }

  addStaticGroup(): Phaser.Physics.Arcade.StaticGroup {
    return this.scene.physics.add.staticGroup();
  }

  addGroup(): Phaser.Physics.Arcade.Group {
    return this.scene.physics.add.group();
  }
}
