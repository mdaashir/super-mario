import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { SettingsScene } from "./scenes/SettingsScene";
import { WorldMapScene } from "./scenes/WorldMapScene";
import { GameScene } from "./scenes/GameScene";
import { PauseScene } from "./scenes/PauseScene";
import { VictoryScene } from "./scenes/VictoryScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from "./data/constants";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#5c94fc",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: GRAVITY },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, SettingsScene, WorldMapScene, GameScene, PauseScene, VictoryScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
};

new Phaser.Game(config);
