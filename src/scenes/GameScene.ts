import Phaser from "phaser";
import { Player } from "../entities/Player";
import { PatrolEnemy } from "../entities/enemies/PatrolEnemy";
import { Boss } from "../entities/enemies/Boss";
import { Coin } from "../entities/items/Coin";
import { Mushroom } from "../entities/items/Mushroom";
import { Star } from "../entities/items/Star";
import { FireFlower } from "../entities/items/FireFlower";
import { QuestionBlock } from "../entities/blocks/QuestionBlock";
import { MovingPlatform } from "../entities/MovingPlatform";
import { Checkpoint } from "../entities/Checkpoint";
import { InputManager } from "../input/InputManager";
import { MovementSystem } from "../systems/MovementSystem";
import { CameraSystem } from "../systems/CameraSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { EnemySystem } from "../systems/EnemySystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { PowerUpSystem } from "../systems/PowerUpSystem";
import { LevelSystem } from "../systems/LevelSystem";
import { HUD } from "../ui/HUD";
import { EventBus } from "../utils/EventBus";
import { TILE_SIZE } from "../data/constants";

const LEVEL_LAYOUT = [
  "                                                            g",
  "                                                            g",
  "                              c                             g",
  "                    C                                       g",
  "                   ppp ? ? c     c                           g",
  "                                                            g",
  "                                                            g",
  "      e                M              c          ?          g",
  "                   pppppp    ppp                            g",
  "                                                            g",
  "      pppp   c         c          c                         g",
  "                               S                            g",
  "                         !  ppppp    g                       g",
  "ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
];

const TILE_W = TILE_SIZE;
const TILE_H = TILE_SIZE;
const COLS = LEVEL_LAYOUT[0].length;
const ROWS = LEVEL_LAYOUT.length;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputManager!: InputManager;
  private movementSystem!: MovementSystem;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private enemySystem!: EnemySystem;
  private scoreSystem!: ScoreSystem;
  private powerUpSystem!: PowerUpSystem;
  private levelSystem!: LevelSystem;
  private hud!: HUD;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private goalFlag!: Phaser.Physics.Arcade.Sprite;
  private questionBlocks: QuestionBlock[] = [];
  private powerUpItems: (Mushroom | Star | FireFlower)[] = [];
  private movingPlatforms: MovingPlatform[] = [];
  private checkpoints: Checkpoint[] = [];
  private activeCheckpoint: Checkpoint | null = null;
  private boss: Boss | null = null;
  private levelTime: number = 300;
  private levelTimerEvent!: Phaser.Time.TimerEvent;
  private levelId: string = "1-1";
  private levelComplete: boolean = false;
  private playerSpawn: { x: number; y: number };

  constructor() {
    super({ key: "GameScene" });
    this.playerSpawn = { x: 2 * TILE_W, y: (ROWS - 3) * TILE_H };
  }

  init(data?: { checkpoint?: { x: number; y: number }; levelId?: string }): void {
    if (data?.checkpoint) {
      this.playerSpawn = data.checkpoint;
    } else {
      this.playerSpawn = { x: 2 * TILE_W, y: (ROWS - 3) * TILE_H };
    }
    if (data?.levelId) {
      this.levelId = data.levelId;
    }
  }

  create(): void {
    this.levelComplete = false;
    this.questionBlocks = [];
    this.powerUpItems = [];
    this.movingPlatforms = [];
    this.checkpoints = [];
    this.activeCheckpoint = null;
    this.boss = null;
    this.levelTime = 300;

    this.scoreSystem = new ScoreSystem();
    this.powerUpSystem = new PowerUpSystem();
    this.enemySystem = new EnemySystem(this);
    this.levelSystem = new LevelSystem();

    this.createLevel();
    this.spawnEntities();

    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);

    this.inputManager = new InputManager(this);
    this.movementSystem = new MovementSystem(this.player, this.inputManager);
    this.cameraSystem = new CameraSystem(this);
    this.collisionSystem = new CollisionSystem(this);

    this.collisionSystem.setupTileCollision(this.platforms, this.player);
    this.collisionSystem.setupEnemyCollisions(
      this.player,
      this.enemySystem.getEnemies(),
      this.platforms
    );

    const coins = this.getEntitiesByType<Coin>(Coin);
    this.collisionSystem.setupCoinOverlap(this.player, coins, (coin) => this.onCollectCoin(coin));

    this.collisionSystem.setupBlockCollisions(
      this.player,
      this.questionBlocks,
      this.platforms,
      (block) => this.onBlockHit(block)
    );

    this.collisionSystem.setupPowerUpCollision(this.powerUpItems, this.platforms);
    this.collisionSystem.setupPowerUpOverlap(this.player, this.powerUpItems, (item) =>
      this.onCollectPowerUp(item)
    );

    this.collisionSystem.setupGoalOverlap(this.goalFlag, this.player, () => this.onReachGoal());

    for (const cp of this.checkpoints) {
      this.physics.add.overlap(this.player, cp, () => {
        if (!cp.isActivated) {
          cp.activate();
          this.activeCheckpoint = cp;
        }
      });
    }

    if (this.boss) {
      this.physics.add.overlap(this.player, this.boss, () => {
        if (!this.boss!.isDefeated) {
          this.player.takeDamage();
          if (this.player.isDead()) {
            this.scene.start("GameOverScene");
          } else {
            this.player.setPosition(this.playerSpawn.x, this.playerSpawn.y);
            const body = this.player.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(0, 0);
          }
        }
      });
    }

    this.cameraSystem.setBounds(0, 0, COLS * TILE_W, ROWS * TILE_H);
    this.cameraSystem.follow(this.player);

    this.hud = new HUD(this);
    this.hud.updateLives(this.player.remainingLives);
    this.hud.updateScore(this.scoreSystem.getScore());
    this.hud.updateTimer(this.levelTime);

    this.levelTimerEvent = this.time.addEvent({
      delay: 1000,
      repeat: this.levelTime - 1,
      callback: () => {
        this.levelTime--;
        this.hud.updateTimer(this.levelTime);
        if (this.levelTime <= 0) {
          this.player.takeDamage();
          if (this.player.isDead()) {
            this.scene.start("GameOverScene");
          }
        }
      },
    });

    EventBus.on("score-updated", (score: unknown) => {
      this.hud.updateScore(typeof score === "number" ? score : 0);
    });

    EventBus.on("extra-life", () => {
      this.player.remainingLives++;
      this.hud.updateLives(this.player.remainingLives);
    });

    EventBus.on("power-up-collected", () => {
      this.player.setPowerState(this.powerUpSystem.powerState);
    });

    EventBus.on("power-up-expired", () => {
      this.player.setPowerState(this.powerUpSystem.powerState);
    });

    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  update(_time: number, delta: number): void {
    if (this.levelComplete) return;

    this.movementSystem.update();
    this.enemySystem.update();
    this.powerUpSystem.update(delta);

    for (const mp of this.movingPlatforms) {
      mp.update();
    }

    if (this.boss && !this.boss.isDefeated) {
      this.boss.updateAI(this.player.x, this.player.y);
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body.y > ROWS * TILE_H + 64) {
      this.player.takeDamage();
      if (this.player.isDead()) {
        this.scene.start("GameOverScene");
      } else {
        const spawn = this.activeCheckpoint
          ? this.activeCheckpoint.position
          : this.playerSpawn;
        this.player.setPosition(spawn.x, spawn.y);
        body.setVelocity(0, 0);
      }
    }
  }

  private createLevel(): void {
    this.platforms = this.physics.add.staticGroup();

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const ch = LEVEL_LAYOUT[row][col];
        const x = col * TILE_W + TILE_W / 2;
        const y = row * TILE_H + TILE_H / 2;

        if (ch === "g" || ch === "p") {
          const texture = ch === "g" ? "tile-ground" : "tile-platform";
          this.platforms.create(x, y, texture);
        }
      }
    }

    this.goalFlag = this.physics.add.sprite(
      (COLS - 2) * TILE_W,
      (ROWS - 3) * TILE_H + TILE_H / 2,
      "goal-flag"
    );
    const gb = this.goalFlag.body as Phaser.Physics.Arcade.Body;
    gb.allowGravity = false;
  }

  private spawnEntities(): void {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const ch = LEVEL_LAYOUT[row][col];
        const x = col * TILE_W + TILE_W / 2;
        const y = row * TILE_H + TILE_H / 2;

        switch (ch) {
          case "e": {
            const enemy = new PatrolEnemy(this, x, y, x - 2 * TILE_W, x + 2 * TILE_W, 60);
            this.enemySystem.addEnemy(enemy);
            break;
          }
          case "c":
            new Coin(this, x, y);
            break;
          case "?": {
            const block = new QuestionBlock(this, x, y, "coin");
            this.questionBlocks.push(block);
            break;
          }
          case "!": {
            const block = new QuestionBlock(this, x, y, "mushroom");
            this.questionBlocks.push(block);
            break;
          }
          case "M": {
            const mp = new MovingPlatform(this, x, y, x + 6 * TILE_W, 40);
            this.movingPlatforms.push(mp);
            break;
          }
          case "C": {
            const cp = new Checkpoint(this, x, y);
            this.checkpoints.push(cp);
            break;
          }
          case "S": {
            const boss = new Boss(this, x, y, "enemy-patrol", 5, [0.5]);
            this.boss = boss;
            break;
          }
        }
      }
    }
  }

  private getEntitiesByType<T>(type: new (...args: never[]) => T): T[] {
    const result: T[] = [];
    this.children.each((child) => {
      if (child instanceof type) result.push(child as unknown as T);
    });
    return result;
  }

  private onCollectCoin(coin: Coin): void {
    if (coin.isCollected) return;
    coin.collect();
    EventBus.emit("coin-collected", coin.scoreValue);
  }

  private onBlockHit(block: QuestionBlock): void {
    const contents = block.hit();
    if (!contents) return;

    EventBus.emit("coin-collected", 100);

    if (contents !== "coin") {
      this.spawnPowerUpFromBlock(block, contents);
    }
  }

  private spawnPowerUpFromBlock(block: QuestionBlock, type: string): void {
    const x = block.x;
    const y = block.y - TILE_H;

    let item: Mushroom | Star | FireFlower;
    switch (type) {
      case "mushroom":
        item = new Mushroom(this, x, y);
        break;
      case "star":
        item = new Star(this, x, y);
        break;
      case "fire-flower":
        item = new FireFlower(this, x, y);
        break;
      default:
        return;
    }

    this.powerUpItems.push(item);
    this.physics.add.collider(item, this.platforms);
    this.physics.add.overlap(this.player, item, () => this.onCollectPowerUp(item));
  }

  private onCollectPowerUp(item: Mushroom | Star | FireFlower): void {
    if (item.isCollected) return;
    item.collect();

    const type =
      item instanceof Mushroom ? "mushroom" :
      item instanceof Star ? "star" : "fire-flower";

    this.powerUpSystem.collect(type);
  }

  private onReachGoal(): void {
    if (this.levelComplete) return;
    this.levelComplete = true;
    if (this.levelTimerEvent) this.levelTimerEvent.destroy();
    EventBus.emit("level-complete", { levelId: this.levelId, score: this.scoreSystem.getScore() });
    this.scene.start("VictoryScene", { levelId: this.levelId, score: this.scoreSystem.getScore() });
  }
}
