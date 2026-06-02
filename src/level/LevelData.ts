export interface WorldDefinition {
  id: number;
  name: string;
  theme: string;
  levelCount: number;
  hasBoss: boolean;
  backgroundMusic: string;
  difficultyMultiplier: number;
}

export interface LevelMetadata {
  levelId: string;
  worldId: number;
  levelNumber: number;
  levelName: string;
  timeLimit: number;
  parTime: number;
}

export interface EnemyObject {
  type: "patrol-enemy";
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    patrolLeft: number;
    patrolRight: number;
    speed: number;
  };
}

export interface CoinObject {
  type: "coin";
  x: number;
  y: number;
  properties: {
    scoreValue: number;
  };
}

export interface PowerUpObject {
  type: "mushroom" | "star" | "fire-flower";
  x: number;
  y: number;
  properties: {
    spawnFromBlock: boolean;
    blockId?: string;
  };
}

export interface BlockObject {
  type: "question-block" | "hidden-block" | "destructible-block";
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    contents: "coin" | "mushroom" | "star" | "fire-flower" | "empty";
    hitCount?: number;
    isHidden?: boolean;
  };
}

export interface CheckpointObject {
  type: "checkpoint";
  x: number;
  y: number;
}

export interface GoalFlagObject {
  type: "goal-flag";
  x: number;
  y: number;
}

export interface SecretAreaObject {
  type: "secret-area";
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    secretType: "hidden-block" | "invisible-path" | "pipe-warp";
    destinationLevel?: string;
  };
}

export type EntityObject =
  | EnemyObject
  | CoinObject
  | PowerUpObject
  | BlockObject
  | CheckpointObject
  | GoalFlagObject
  | SecretAreaObject;

export interface LevelData {
  metadata: LevelMetadata;
  tilemapKey: string;
  entities: EntityObject[];
}
