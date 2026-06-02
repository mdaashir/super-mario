import Phaser from "phaser";
import { EventBus } from "../utils/EventBus";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/enemies/Enemy";
import { Coin } from "../entities/items/Coin";
import { Mushroom } from "../entities/items/Mushroom";
import { Star } from "../entities/items/Star";
import { FireFlower } from "../entities/items/FireFlower";
import { QuestionBlock } from "../entities/blocks/QuestionBlock";
import { ENEMY_SCORE_VALUE } from "../data/constants";

export class CollisionSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupTileCollision(
    platforms: Phaser.Physics.Arcade.StaticGroup,
    player: Player
  ): void {
    this.scene.physics.add.collider(player, platforms);
  }

  setupEnemyCollisions(
    player: Player,
    enemies: Enemy[],
    platforms: Phaser.Physics.Arcade.StaticGroup
  ): void {
    for (const enemy of enemies) {
      this.scene.physics.add.collider(enemy, platforms);
      this.scene.physics.add.overlap(player, enemy, () => {
        this.handlePlayerEnemyCollision(player, enemy);
      });
    }
  }

  setupCoinOverlap(
    player: Player,
    coins: Coin[],
    callback: (coin: Coin, player: Player) => void
  ): void {
    for (const coin of coins) {
      this.scene.physics.add.overlap(player, coin, () => {
        callback(coin, player);
      });
    }
  }

  setupGoalOverlap(
    goal: Phaser.Physics.Arcade.Sprite,
    player: Player,
    onReach: () => void
  ): void {
    this.scene.physics.add.overlap(player, goal, () => {
      onReach();
    });
  }

  setupBlockCollisions(
    player: Player,
    blocks: QuestionBlock[],
    platforms: Phaser.Physics.Arcade.StaticGroup,
    onBlockHit: (block: QuestionBlock) => void
  ): void {
    for (const block of blocks) {
      this.scene.physics.add.collider(player, block, (_player, _block) => {
        const pb = player.body as Phaser.Physics.Arcade.Body;
        const bb = (_block as QuestionBlock).body as Phaser.Physics.Arcade.Body;
        if (pb.velocity.y < 0 && pb.y > bb.y + bb.height / 2) {
          onBlockHit(_block as QuestionBlock);
        }
      });
    }
  }

  setupPowerUpOverlap(
    player: Player,
    powerUps: (Mushroom | Star | FireFlower)[],
    callback: (item: Mushroom | Star | FireFlower) => void
  ): void {
    for (const item of powerUps) {
      this.scene.physics.add.overlap(player, item, () => {
        callback(item);
      });
    }
  }

  setupPowerUpCollision(
    powerUps: (Mushroom | Star | FireFlower)[],
    platforms: Phaser.Physics.Arcade.StaticGroup
  ): void {
    for (const item of powerUps) {
      if (item instanceof Mushroom || item instanceof Star) {
        this.scene.physics.add.collider(item, platforms);
      }
    }
  }

  private handlePlayerEnemyCollision(player: Player, enemy: Enemy): void {
    if (!enemy.isAlive) return;

    const playerBody = player.body as Phaser.Physics.Arcade.Body;
    const playerBottom = playerBody.y + playerBody.height;
    const enemyTop = (enemy.body as Phaser.Physics.Arcade.Body).y;

    if (playerBottom <= enemyTop + 8 && playerBody.velocity.y > 0) {
      enemy.stomp();
      player.bounce();
      EventBus.emit("enemy-defeated", ENEMY_SCORE_VALUE);
    } else {
      player.takeDamage();
      if (player.isDead()) {
        EventBus.emit("player-died", 0);
      }
    }
  }
}
