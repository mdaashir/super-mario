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
import { Pipe } from "../entities/Pipe";
import { InputManager } from "../input/InputManager";
import { MovementSystem } from "../systems/MovementSystem";
import { CameraSystem } from "../systems/CameraSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { EnemySystem } from "../systems/EnemySystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { PowerUpSystem } from "../systems/PowerUpSystem";
import { LevelSystem, DifficultyFactors } from "../systems/LevelSystem";
import { HUD } from "../ui/HUD";
import { EventBus } from "../utils/EventBus";
import { ObjectPool } from "../utils/ObjectPool";
import { SaveSystem } from "../systems/SaveSystem";
import { TILE_SIZE } from "../data/constants";

const LEVEL_LAYOUT = [
  "                                                            g",
  "                                                            g",
  "                              c                             g",
  "                    C                                       g",
  "                   ppp ? ? c     c                           g",
  "     H                                                      g",
  "     I                                                      g",
  "     I  e              M              c          ?          g",
  "     I             pppppp    ppp                            g",
  "     I                                                      g",
  "  pppppp   c         c          c                           g",
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
  private difficultyFactors!: DifficultyFactors;
  private levelTimerEvent!: Phaser.Time.TimerEvent;
  private levelId: string = "1-1";
  private levelComplete: boolean = false;
  private playerSpawn: { x: number; y: number };
  private saveSystem!: SaveSystem;
  private coinPool!: ObjectPool<Coin>;

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

    this.scoreSystem = new ScoreSystem();
    this.powerUpSystem = new PowerUpSystem();
    this.enemySystem = new EnemySystem(this);
    this.levelSystem = new LevelSystem();
    this.saveSystem = new SaveSystem();

    const [worldStr, levelStrNum] = this.levelId.split("-");
    this.difficultyFactors = this.levelSystem.getDifficultyFactors(
      parseInt(worldStr, 10),
      parseInt(levelStrNum, 10)
    );
    this.levelTime = this.difficultyFactors.timeLimit;

    this.coinPool = new ObjectPool<Coin>(
      () => new Coin(this, 0, 0),
      (coin) => {
        coin.isCollected = false;
        coin.onRelease = () => this.coinPool.release(coin);
        coin.setAlpha(1);
        coin.setActive(true).setVisible(true);
        const body = coin.body as Phaser.Physics.Arcade.Body;
        body.enable = true;
      },
      5
    );

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
          this.saveSystem.save(this.buildSaveData({ x: cp.position.x, y: cp.position.y }, this.scoreSystem.getScore()));
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
      loop: true,
      callback: () => {
        if (this.levelComplete) return;
        this.levelTime--;
        this.hud.updateTimer(this.levelTime);
        if (this.levelTime <= 0) {
          this.levelTimerEvent.destroy();
          this.player.takeDamage();
          if (this.player.isDead()) {
            this.scene.start("GameOverScene");
          }
        }
      },
    });

    EventBus.on("score-updated", this.onScoreUpdated);
    EventBus.on("extra-life", this.onExtraLife);
    EventBus.on("power-up-collected", this.onPowerUpChanged);
    EventBus.on("power-up-expired", this.onPowerUpChanged);

    this.input.keyboard?.on("keydown-ESC", this.onPause);

    this.events.on("shutdown", this.cleanup, this);
  }

  private onPause = (): void => {
    this.scene.pause();
    this.scene.launch("PauseScene");
  };

  private cleanup(): void {
    EventBus.off("score-updated", this.onScoreUpdated);
    EventBus.off("extra-life", this.onExtraLife);
    EventBus.off("power-up-collected", this.onPowerUpChanged);
    EventBus.off("power-up-expired", this.onPowerUpChanged);
    EventBus.off("coin-collected");
    EventBus.off("enemy-defeated");
    EventBus.off("level-complete");
    EventBus.off("world-complete");
    EventBus.off("bonus-points");
    EventBus.off("player-died");
  }

  private onScoreUpdated = (score: unknown): void => {
    this.hud.updateScore(typeof score === "number" ? score : 0);
  };

  private onExtraLife = (): void => {
    this.player.remainingLives++;
    this.hud.updateLives(this.player.remainingLives);
  };

  private onPowerUpChanged = (): void => {
    this.player.setPowerState(this.powerUpSystem.powerState);
  };

  update(_time: number, delta: number): void {
    if (this.levelComplete) return;

    this.inputManager.update();
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

        if (ch === "g" || ch === "p" || ch === "I") {
          const texture =
            ch === "g" ? "tile-ground" :
            ch === "I" ? "pipe-body" : "tile-platform";
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
            const speed = Math.round(60 * this.difficultyFactors.enemySpeedMultiplier);
            const patrolRange = Math.round(2 * TILE_W * this.difficultyFactors.enemySpeedMultiplier);
            const enemy = new PatrolEnemy(this, x, y, x - patrolRange, x + patrolRange, speed);
            this.enemySystem.addEnemy(enemy);
            break;
          }
          case "c": {
            const coin = this.coinPool.get();
            coin.setPosition(x, y);
            coin.onRelease = () => this.coinPool.release(coin);
            coin.setActive(true).setVisible(true);
            const coinBody = coin.body as Phaser.Physics.Arcade.Body;
            coinBody.enable = true;
            coinBody.setAllowGravity(false);
            coinBody.setImmovable(true);
            break;
          }
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
            const bossHealth = Math.round(5 * this.difficultyFactors.bossHealthMultiplier);
            const boss = new Boss(this, x, y, "enemy-patrol", bossHealth, [0.5]);
            this.boss = boss;
            break;
          }
          case "H": {
            new Pipe(this, x, y, 2);
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

    const score = this.scoreSystem.getScore();
    EventBus.emit("level-complete", { levelId: this.levelId, score });

    const checkpointPos = this.activeCheckpoint ? { x: this.activeCheckpoint.position.x, y: this.activeCheckpoint.position.y } : null;
    this.saveSystem.save(this.buildSaveData(checkpointPos, score));

    this.scene.start("VictoryScene", { levelId: this.levelId, score });
  }

  private buildSaveData(
    checkpointPosition: { x: number; y: number } | null,
    score: number
  ): Parameters<SaveSystem["save"]>[0] {
    return {
      currentWorld: parseInt(this.levelId.split("-")[0], 10),
      currentLevel: parseInt(this.levelId.split("-")[1], 10),
      checkpointPosition,
      score,
      remainingLives: this.player.remainingLives,
      unlockedWorlds: this.levelSystem.getProgress().unlockedWorlds,
      unlockedLevels: this.levelSystem.getProgress().unlockedLevels,
      audioSettings: { musicVolume: 50, sfxVolume: 50 },
      controlBindings: {},
      totalCoinsCollected: this.scoreSystem.getCoinsCollected(),
      worldHighScores: this.levelSystem.getProgress().highScores,
    };
  }
}
