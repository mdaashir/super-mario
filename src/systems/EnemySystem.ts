import Phaser from "phaser";
import { Enemy } from "../entities/enemies/Enemy";
import { TILE_SIZE } from "../data/constants";

const CULL_MARGIN = TILE_SIZE * 8;

export class EnemySystem {
  private scene: Phaser.Scene;
  private enemies: Enemy[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addEnemy(enemy: Enemy): void {
    this.enemies.push(enemy);
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  update(): void {
    const camera = this.scene.cameras.main;
    const viewLeft = camera.scrollX - CULL_MARGIN;
    const viewRight = camera.scrollX + camera.width + CULL_MARGIN;
    const viewTop = camera.scrollY - CULL_MARGIN;
    const viewBottom = camera.scrollY + camera.height + CULL_MARGIN;

    for (const enemy of this.enemies) {
      if (!enemy.active) continue;

      const onScreen =
        enemy.x >= viewLeft &&
        enemy.x <= viewRight &&
        enemy.y >= viewTop &&
        enemy.y <= viewBottom;

      const body = enemy.body as Phaser.Physics.Arcade.Body | null;
      if (onScreen) {
        if (body) body.enable = true;
        enemy.update();
      } else {
        if (body) body.enable = false;
      }
    }
  }

  removeEnemy(enemy: Enemy): void {
    const idx = this.enemies.indexOf(enemy);
    if (idx >= 0) {
      this.enemies.splice(idx, 1);
    }
  }

  clear(): void {
    for (const enemy of this.enemies) {
      if (enemy.active) enemy.destroy();
    }
    this.enemies = [];
  }
}
