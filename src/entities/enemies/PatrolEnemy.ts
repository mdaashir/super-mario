import { Enemy } from "./Enemy";

export class PatrolEnemy extends Enemy {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrolLeft: number,
    patrolRight: number,
    speed: number
  ) {
    super(scene, x, y, patrolLeft, patrolRight, speed);
  }
}
