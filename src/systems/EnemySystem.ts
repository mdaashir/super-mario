import Phaser from "phaser";
import { Enemy } from "../entities/enemies/Enemy";

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
    for (const enemy of this.enemies) {
      if (enemy.active) {
        enemy.update();
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
