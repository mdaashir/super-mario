# Level Data Contract

## Format
Tiled Map Editor JSON export, with additional custom properties for game
metadata. Loaded via Phaser's tilemap system using `this.load.tilemapTiledJSON()`.

## Custom Properties (per Tiled object layer)

### World Definition (`worlds.json`)
```typescript
interface WorldDefinition {
  id: number;
  name: string;
  theme: string;
  levelCount: number;
  hasBoss: boolean;
  backgroundMusic: string;
  difficultyMultiplier: number;
}
```

### Level Metadata (Tilemap custom properties)
| Property | Type | Description |
|----------|------|-------------|
| levelId | string | e.g., "1-3" |
| worldId | number | e.g., 1 |
| levelNumber | number | e.g., 3 |
| levelName | string | Display name |
| timeLimit | number | Seconds |
| parTime | number | Target seconds for bonus |

### Object Layer: Entity Placements

Each entity placed in Tiled uses an object with type and custom properties:

```typescript
// Enemy spawn
interface EnemyObject {
  type: "patrol-enemy" | "chase-enemy" | "flying-enemy";
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

// Coin
interface CoinObject {
  type: "coin";
  x: number;
  y: number;
  properties: {
    scoreValue: number;  // default 100
  };
}

// Power-up spawn (from question block or placed in level)
interface PowerUpObject {
  type: "mushroom" | "star" | "fire-flower";
  x: number;
  y: number;
  properties: {
    spawnFromBlock: boolean;  // true if emerges from question block
    blockId?: string;         // reference to parent block
  };
}

// Block
interface BlockObject {
  type: "question-block" | "hidden-block" | "destructible-block";
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    contents: "coin" | "mushroom" | "star" | "fire-flower" | "empty";
    hitCount?: number;  // default 1
    isHidden?: boolean;  // for hidden blocks
  };
}

// Checkpoint
interface CheckpointObject {
  type: "checkpoint";
  x: number;
  y: number;
}

// Goal Flag
interface GoalFlagObject {
  type: "goal-flag";
  x: number;
  y: number;
}

// Secret Area Trigger
interface SecretAreaObject {
  type: "secret-area";
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    secretType: "hidden-block" | "invisible-path" | "pipe-warp";
    destinationLevel?: string;  // for warp pipes
  };
}
```

## Layer Convention
| Layer Name | Type | Purpose |
|------------|------|---------|
| background | tilelayer | Sky, decorations |
| ground | tilelayer | Solid terrain tiles |
| platforms | tilelayer | Breakable, moving platforms |
| decorations | tilelayer | Non-interactive visual tiles |
| entities | objectgroup | Enemy, coin, item placements |
| blocks | objectgroup | Interactive blocks |
| triggers | objectgroup | Checkpoints, goal, secrets |
| collision | objectgroup | Invisible collision rectangles |

## Tilemap Property Conventions
- Tile index 0 = empty/transparent
- Tile GID range 1-255 for interactive tiles
- Custom tile properties on collidable tiles: `{ collides: true }`
