# Data Model: Core Platformer Game

## Player Character

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| position | Vector2 | Current x, y position |
| velocity | Vector2 | Current x, y velocity |
| facingDirection | Direction | LEFT or RIGHT |
| movementState | MovementState | idle, walking, running, jumping, falling |
| powerState | PowerState | normal, large, invincible, firing |
| remainingLives | number | Lives remaining (starts at 3) |
| currentScore | number | Cumulative score |
| coinsCollected | number | Coins in current world |
| activePowerUp | PowerUpType | mushroom, star, fire_flower, none |
| invincibilityTimer | number | Remaining invincibility frames (star) |
| powerUpTimer | number | Remaining power-up duration (fire flower) |
| isInvulnerable | boolean | Post-damage invincibility frames |
| invulnerabilityTimer | number | Remaining invulnerability frames |
| hasDoubleJump | boolean | Unlocked via power-up |

### State Transitions: PowerState

```
normal ──collect mushroom──→ large
normal ──collect star───────→ invincible  (timer-based)
normal ──collect fire_flower→ firing     (if current large)
large  ──take damage────────→ normal
large  ──collect mushroom───→ normal + bonus points
large  ──collect star───────→ invincible  (overwrites large state)
large  ──collect fire_flower→ firing
invincible ──timer expires──→ pre-star state (normal or large)
invincible ──take damage────→ invincible (no damage while invincible)
firing ──timer expires──────→ normal
firing ──take damage────────→ normal
```

### Movement State Machine

```
idle ──left/right────→ walking
walking ──release────→ idle
walking ──run button─→ running
walking ──jump───────→ jumping
running ──release run─→ walking
running ──jump────────→ jumping
jumping ──land────────→ idle/walking
jumping ──no input────→ falling
falling ──land────────→ idle/walking
```

## World

| Field | Type | Description |
|-------|------|-------------|
| id | number | World number (1-based) |
| name | string | World display name |
| theme | WorldTheme | Theme identifier (grass, desert, ice, etc.) |
| levelCount | number | Number of levels in world |
| bossEncounter | boolean | Whether world has a boss |
| isUnlocked | boolean | Whether world is accessible |
| backgroundMusic | string | Audio key for world music |
| difficultyMultiplier | number | Difficulty scaling factor |

## Level

| Field | Type | Description |
|-------|------|-------------|
| id | string | Level identifier (world-level, e.g., "1-3") |
| worldId | number | Parent world |
| levelNumber | number | Level index within world |
| name | string | Level display name |
| tileMapKey | string | Reference to loaded tilemap |
| timeLimit | number | Level time limit in seconds |
| hasCheckpoint | boolean | Whether level has checkpoint(s) |
| checkpointPositions | Vector2[] | Checkpoint positions |
| enemySpawns | SpawnEntry[] | Enemy type and position definitions |
| itemSpawns | SpawnEntry[] | Coin and power-up placements |
| blockData | BlockEntry[] | Interactive block placements |
| secretAreaEntrances | Vector2[] | Secret area trigger positions |
| goalFlagPosition | Vector2 | Goal flag location |
| backgroundTileIndex | number | Background layer tile index |
| parTime | number | Target completion time for bonus |
| isUnlocked | boolean | Whether level is playable |
| highScore | number | Best score achieved |

### Validation Rules
- timeLimit > 30 and < 600 seconds
- At least one enemy spawn per 1000px of level width after first 500px
- Coin count >= 10 per level

## Enemy

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique enemy instance ID |
| type | EnemyType | patrol, chase, jump, flying |
| position | Vector2 | Spawn/current position |
| patrolLeft | number | Left patrol boundary |
| patrolRight | number | Right patrol boundary |
| speed | number | Movement speed (pixels/sec) |
| health | number | Hit points (1 for standard, 3+ for bosses) |
| scoreValue | number | Points awarded on defeat |
| isAlive | boolean | Whether enemy is active |
| isOffScreen | boolean | Whether enemy is outside camera view |

### Behavior Rules
- Patrol enemy reverses direction at patrol boundaries
- Enemies pause physics when off-screen, resume on re-entry
- Enemies take damage when stomped from above (player velocity downward)
- Player takes damage on side/bottom contact with alive enemy
- Enemies respawn at spawn positions when level restarts

## Boss Enemy

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique boss ID |
| worldId | number | Associated world |
| name | string | Boss display name |
| position | Vector2 | Arena position |
| maxHealth | number | Total hit points |
| currentHealth | number | Current hit points |
| phase | number | Current phase (1-based) |
| phaseThresholds | number[] | Health % thresholds for phase transitions |
| attackPatterns | AttackPattern[] | Pattern definitions per phase |
| currentPattern | AttackPattern | Currently executing pattern |
| isDefeated | boolean | Whether boss is vanquished |
| arenaBounds | Rect | Boss arena boundaries |

### State Transitions
```
spawning ──intro complete──→ phase_1
phase_1  ──health < threshold→ phase_2
phase_2  ──health < threshold→ phase_3 (if applicable)
phase_N  ──health <= 0─────→ defeated
defeated ──animation done──→ world_clear
```

### Boss Rules
- Checkpoint activates before boss arena entrance
- Dying mid-boss restarts boss at full health
- Player retains remaining lives on boss retry
- Boss arena locks camera to arena bounds
- Phase transitions include visual change + behavior change

## Coin

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique coin ID |
| position | Vector2 | World position |
| scoreValue | number | Points per coin |
| isCollected | boolean | Whether coin has been taken |
| respawnsOnRestart | boolean | Whether coin reappears on level restart |

## Power-up Item

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique item ID |
| type | PowerUpType | mushroom, star, fire_flower |
| position | Vector2 | World position (or spawn trajectory) |
| isCollected | boolean | Whether item has been taken |
| movementPath | Vector2[] | Spawn animation path (emerges from block) |

## Block

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique block ID |
| type | BlockType | question, hidden, destructible, solid |
| position | Vector2 | Grid position |
| contents | BlockContents | coin, mushroom, star, fire_flower, empty |
| state | BlockState | full, empty, hidden, revealed, broken |
| hitCount | number | Times hit (for multi-hit blocks) |

## Checkpoint

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique checkpoint ID |
| position | Vector2 | World position |
| isActivated | boolean | Whether player has passed this checkpoint |
| activationTime | number | Game time when checkpoint was reached |

## Save Data

| Field | Type | Description |
|-------|------|-------------|
| slotId | number | Save slot index (0-2) |
| version | number | Save format version |
| timestamp | number | Unix timestamp of last save |
| checksum | string | Integrity hash of save data |
| playerName | string | (Reserved for future use) |
| currentWorld | number | Current world number |
| currentLevel | number | Current level number |
| checkpointPosition | Vector2 | Last checkpoint position (nullable) |
| score | number | Total player score |
| remainingLives | number | Lives remaining |
| unlockedWorlds | number[] | Array of unlocked world IDs |
| unlockedLevels | Record<string, boolean> | Per-level unlock state |
| audioSettings | AudioSettings | Music/SFX volume levels |
| controlBindings | Record<string, string> | Key/button remapping |
| totalCoinsCollected | number | Lifetime coins |
| worldHighScores | Record<string, number> | Best score per level |

### Validation Rules
- checksum MUST match SHA-256 of serialized data fields
- version MUST match current game version
- All numeric fields MUST be within expected ranges
- If validation fails, attempt backup save restore

## Secret Area

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique secret area ID |
| entrancePosition | Vector2 | Trigger position |
| type | SecretType | hidden_block, invisible_path, pipe_warp |
| containsCollectibles | boolean | Whether area has hidden items |
| collectiblePositions | Vector2[] | Hidden item positions |
| isDiscovered | boolean | Whether player has found this area |

## Event Types (EventBus)

| Event | Payload | Emitter | Consumers |
|-------|---------|---------|-----------|
| coin-collected | { coinId, score, position } | Coin | ScoreSystem, AudioSystem, HUD |
| enemy-defeated | { enemyId, position } | CollisionSystem | ScoreSystem, AudioSystem |
| player-damaged | { damageSource } | CollisionSystem | PowerUpSystem, ScoreSystem, AudioSystem, HUD |
| player-died | { livesRemaining } | Player | GameScene, AudioSystem |
| game-over | {} | GameScene | GameOverScene |
| power-up-collected | { powerUpType } | CollisionSystem | PowerUpSystem, AudioSystem, HUD |
| power-up-expired | { powerUpType } | PowerUpSystem | Player, HUD |
| boss-defeated | { worldId } | Boss | LevelSystem, AudioSystem |
| boss-phase-change | { bossId, phase } | Boss | AudioSystem, HUD |
| checkpoint-reached | { checkpointId, position } | Player | SaveSystem, HUD |
| level-complete | { levelId, score } | GoalFlag | LevelSystem, SaveSystem, VictoryScene |
| world-complete | { worldId } | Boss | LevelSystem, SaveSystem |
| save-completed | { slotId } | SaveSystem | HUD |
| settings-changed | { setting, value } | SettingsScene | AudioSystem, InputManager |
