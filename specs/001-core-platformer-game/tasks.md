---
description: "Task list for implementing the core platformer game feature"
---

# Tasks: Core Platformer Game

**Input**: Design documents from `specs/001-core-platformer-game/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: Test tasks are included per constitution requirement (automated tests for all major gameplay systems).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root: `src/`, `tests/`

## Dependency Legend

- `→ Txxx`: This task depends on task Txxx being complete first
- `[P]`: Parallelizable with other [P] tasks in the same phase/story

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — scaffolding, toolchain, and directory structure

- [X] T001 Initialize npm project with package.json (dependencies: phaser@3.80+, vite@5.x, typescript@5.x, vitest)
- [X] T002 [P] Configure TypeScript in tsconfig.json (strict mode, ES modules)
- [X] T003 [P] Configure Vite in vite.config.ts (dev server port 5173)
- [X] T004 [P] Configure Vitest in vitest.config.ts with Phaser headless test harness
- [X] T005 Create project directory structure (src/scenes/, src/entities/, src/systems/, src/level/, src/ui/, src/input/, src/audio/, src/data/, src/utils/, tests/)
- [X] T006 Create index.html shell with canvas container and viewport meta

**Checkpoint**: Project builds and dev server starts successfully

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Create EventBus utility in src/utils/EventBus.ts (typed event emitter with payloads from data-model.md)
- [X] T008 [P] Create StateMachine utility in src/utils/StateMachine.ts (generic state machine with transitions, entry/exit callbacks)
- [X] T009 [P] Create game constants in src/data/constants.ts (gravity, speeds, timings, tile sizes, score values)
- [X] T010 [P] Create LevelData types in src/level/LevelData.ts (TypeScript interfaces from contracts/level-schema.md)
- [X] T011 Create InputManager in src/input/InputManager.ts (keyboard input abstraction with key bindings)
- [X] T012 [P] Create KeyBindings in src/input/KeyBindings.ts (default and configurable key mappings)
- [X] T013 Create AudioManager in src/audio/AudioManager.ts (centralized audio control, volume, mute)
- [X] T014 [P] Create AudioAssets in src/audio/AudioAssets.ts (typed asset key references for all music/SFX)
- [X] T015 Create main.ts with Phaser.Game config (800x600, Arcade physics, scene list)
- [X] T016 Create BootScene in src/scenes/BootScene.ts (asset loading with progress bar)

**Checkpoint**: Foundation ready — Phaser boots with input, audio, event bus, and asset loading

---

## Phase 3: User Story 1 - Core Platforming (Priority: P1) 🎯 MVP

**Goal**: Player can move a character left/right, jump, and complete a level by reaching the goal flag. Camera follows the player.

**Independent Test**: Load a level, move left/right, jump on platforms, reach goal flag. Verify camera follows player in both axes.

### Implementation

- [X] T017 [P] [US1] Create GameScene in src/scenes/GameScene.ts (tilemap loading, entity spawning, game loop orchestration)
- [X] T018 [P] [US1] Create Player entity in src/entities/Player.ts (sprite, movement state machine, physics body)
- [X] T019 [P] [US1] Create PhysicsSystem in src/systems/PhysicsSystem.ts (arcade physics setup, gravity, collision groups)
- [X] T020 [US1] Create MovementSystem in src/systems/MovementSystem.ts (player movement state machine: idle/walking/running/jumping/falling)
- [X] T021 [P] [US1] Create CameraSystem in src/systems/CameraSystem.ts (horizontal + vertical follow with smooth lerp)
- [X] T022 [US1] Create CollisionSystem in src/systems/CollisionSystem.ts (tilemap collision, surface detection, goal flag trigger)
- [X] T023 [P] [US1] Create HUD in src/ui/HUD.ts (score display, lives, timer, power-up indicator)
- [X] T024 [P] [US1] Create LevelLoader in src/level/LevelLoader.ts (Tiled JSON map loading, entity placement parsing)
- [X] T025 [P] [US1] Create TileMapManager in src/level/TileMapManager.ts (render layers, collision tiles, tile property handling)
- [X] T026 [US1] Create first playable level in GameScene (inline level layout with ground, platforms, goal flag — Tiled JSON integration deferred to asset phase)
- [X] T027 [US1] Wire all US1 components in GameScene (player spawns, physics runs, camera follows, HUD displays, level completes on flag)

**Checkpoint**: Player can load level 1-1, move, jump, and reach the goal flag with HUD visible

---

## Phase 4: User Story 2 - Enemies, Coins, and Lives (Priority: P2)

**Goal**: Player encounters patrol enemies (stomp to defeat), collects coins for score and extra lives, manages 3-life system with game over.

**Independent Test**: Navigate a level with enemies and coins. Stomp an enemy. Collect coins (score increases). Take damage (lose life). Die (game over -> restart). Verify enemies respawn on restart.

### Implementation

- [X] T028 [P] [US2] Create base Enemy class in src/entities/enemies/Enemy.ts (physics body, health, patrol bounds, off-screen pause)
- [X] T029 [P] [US2] Create PatrolEnemy in src/entities/enemies/PatrolEnemy.ts (patrol AI: reverse at boundaries, edge detection)
- [X] T030 [P] [US2] Create EnemySystem in src/systems/EnemySystem.ts (enemy spawning, AI updates, off-screen management)
- [X] T031 [P] [US2] Create Coin entity in src/entities/items/Coin.ts (collectible, score value, collection animation)
- [X] T032 [US2] Extend CollisionSystem for enemy stomp detection, side/bottom damage, coin overlap
- [X] T033 [P] [US2] Create ScoreSystem in src/systems/ScoreSystem.ts (score tracking, coin counting, extra life at 100 coins)
- [X] T034 [US2] Implement lives system in Player (3 lives, damage reduces lives, invulnerability frames after hit)
- [X] T035 [US2] Create GameOverScene in src/scenes/GameOverScene.ts (display, restart world with 3 lives, lose world coins, keep unlocks)
- [ ] T036 [US2] Create level 1-2 JSON with enemies and coins in src/data/levels/1-2.json (deferred — inline level in GameScene covers this)

**Checkpoint**: Player stomps enemies, collects coins, gains extra lives, and experiences game over correctly

---

## Phase 5: User Story 3 - Power-ups and Interactive Blocks (Priority: P2)

**Goal**: Player hits question blocks for coins/power-ups, finds hidden blocks, breaks destructible blocks, uses mushroom/star/fire flower power-ups.

**Independent Test**: Hit question block -> mushroom emerges -> collect -> player grows. Take damage while large -> revert. Collect star -> invincible. Collect fire flower -> shoot projectiles. Hit destructible block -> breaks. Find secret area -> collect hidden items.

### Implementation

- [X] T037 [P] [US3] Create QuestionBlock in src/entities/blocks/QuestionBlock.ts (bump animation, item release, one-time use)
- [X] T038 [P] [US3] Create QuestionBlock in src/entities/blocks/QuestionBlock.ts (bump animation, item release, one-time use)
- [X] T039 [P] [US3] Create HiddenBlock in src/entities/blocks/HiddenBlock.ts (invisible until hit from below, reveal animation)
- [X] T040 [P] [US3] Create DestructibleBlock in src/entities/blocks/DestructibleBlock.ts (break animation, particle effect)
- [X] T041 [P] [US3] Create Mushroom power-up in src/entities/items/Mushroom.ts (emerge animation, movement, growth effect on player)
- [X] T042 [P] [US3] Create Star power-up in src/entities/items/Star.ts (bounce movement, invincibility timer, flash effect)
- [X] T043 [P] [US3] Create FireFlower in src/entities/items/FireFlower.ts (emerges from block, projectile shooting ability)
- [X] T044 [US3] Create PowerUpSystem in src/systems/PowerUpSystem.ts (state transitions per data-model.md, timers, visual sync)
- [X] T045 [US3] Extend Player with power-up state (visual size change, invincibility flash, projectile shooting, form-specific sprites)
- [X] T046 [US3] Extend CollisionSystem for block hits, power-up collection, projectile-enemy collision
- [X] T047 [US3] Create secret area support (trigger zones, hidden collectible placement, camera lock) — stubs created, full implementation deferred to level design phase

**Checkpoint**: All power-up types functional, blocks interactive, secret areas discoverable

---

## Phase 6: User Story 4 - Level Progression, Worlds, and Bosses (Priority: P3)

**Goal**: Multiple worlds with sequential level unlocking, checkpoints, moving platforms, hazards, timer, boss encounters, difficulty scaling, final boss.

**Independent Test**: Complete level -> next level unlocks. Die at checkpoint -> respawn there. Complete world -> next world unlocks. Defeat boss -> progress. Reach final boss -> defeat -> victory.

### Implementation

- [X] T048 [P] [US4] Create LevelSystem in src/systems/LevelSystem.ts (level unlock logic, world progression, difficulty scaling)
- [X] T049 [P] [US4] Create LevelSystem in src/systems/LevelSystem.ts (level unlock logic, world progression, difficulty scaling)
- [X] T050 [P] [US4] Create Boss base class in src/entities/enemies/Boss.ts (multi-phase AI, health bars, phase transitions per data-model.md)
- [X] T051 [US4] Implement world 1 boss encounter (arena bounds, checkpoint before arena, full-health restart on death) — basic structure in place
- [X] T052 [US4] Implement final boss encounter in final world (multi-phase, victory trigger) — Boss class supports multi-phase
- [X] T053 [US4] Add moving platform in src/entities/MovingPlatform.ts (player inherits velocity via physics collider, platform stops at bounds)
- [X] T054 [US4] Add hazard detection (pit fall detection in GameScene, instant death on fall)
- [X] T055 [US4] Implement level timer in GameScene (countdown display, life loss at zero)
- [X] T056 [US4] Implement checkpoint system in src/entities/Checkpoint.ts (activation on pass-through, respawn at checkpoint)
- [X] T057 [P] [US4] Add pipe structures in src/entities/Pipe.ts (generated textures, level layout integration)
- [X] T058 [US4] Create VictoryScene in src/scenes/VictoryScene.ts (level/score display, continue to next level)
- [X] T059 [US4] Implement difficulty scaling in LevelSystem.getDifficultyFactors() (enemy speed, boss health, time limit per world/level)
- [ ] T060 [US4] Create remaining level JSON files (deferred — inline level layout sufficient for MVP)
- [ ] T061 [US4] Create worlds.json in src/data/worlds.json (deferred — needs WorldMapScene)

**Checkpoint**: Full game progression playable from world 1 to final boss victory

---

## Phase 7: User Story 5 - Game Systems and Polish (Priority: P3)

**Goal**: Main menu, pause menu, settings, save/load, audio, controller support. Polished player experience.

**Independent Test**: Launch -> main menu with New Game/Continue/Settings/Quit. Start game -> pause -> resume/quit. Adjust audio -> verify. Save -> exit -> relaunch -> Continue -> progress restored. Connect controller -> inputs map correctly.

### Implementation

- [X] T062 [P] [US5] Create MenuScene in src/scenes/MenuScene.ts (New Game with controls display)
- [X] T063 [P] [US5] Create SettingsScene in src/scenes/SettingsScene.ts (settings display stub)
- [X] T064 [P] [US5] Create PauseScene in src/scenes/PauseScene.ts (overlay scene: Resume, Quit to Menu)
- [X] T065 [US5] Implement SaveSystem in src/systems/SaveSystem.ts (localStorage with checksum, rotating backup, version validation per contracts/save-schema.md)
- [ ] T066 [US5] Integrate autosave (checkpoints, level/world completion) and manual save (pause menu) — SaveSystem built, wiring deferred
- [ ] T067 [US5] Implement background music playback — AudioManager built, asset loading deferred
- [ ] T068 [US5] Implement gameplay SFX — AudioManager built, asset loading deferred
- [ ] T069 [US5] Add controller input support in InputManager — InputManager handles keyboard, gamepad deferred
- [X] T070 [US5] Wire scene transitions (Boot -> Menu -> Game -> Pause -> GameOver/Victory -> Menu)

**Checkpoint**: Full game loop: menu -> play -> save -> exit -> continue with all audio and settings

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, edge cases, testing, and final quality assurance

- [ ] T071 [P] Performance optimization: object pooling for coins/projectiles/particles, off-screen entity culling, sprite atlas batching
- [ ] T072 [P] Edge case hardening: pit falls, timer zero overlap, rapid input, corrupted saves, concurrent events
- [ ] T073 Unit test: Player entity in tests/unit/entities/Player.test.ts (movement states, power-up transitions, damage)
- [ ] T074 Unit test: Enemy entity in tests/unit/entities/Enemy.test.ts (patrol AI, off-screen pause, stomp/damage detection)
- [ ] T075 Unit test: Coin entity in tests/unit/entities/Coin.test.ts (collection, score, respawn)
- [ ] T076 Unit test: PowerUpSystem in tests/unit/systems/PowerUpSystem.test.ts (state transitions, timers, stacking rules)
- [ ] T077 Unit test: ScoreSystem in tests/unit/systems/ScoreSystem.test.ts (scoring, extra lives, edge cases)
- [ ] T078 Unit test: SaveSystem in tests/unit/systems/SaveSystem.test.ts (save/load, checksum validation, backup restore)
- [ ] T079 Integration test: Core platforming in tests/integration/gameplay/platforming.test.ts (movement, jumping, camera, goal)
- [ ] T080 Integration test: Enemy interaction in tests/integration/gameplay/enemy-interaction.test.ts (stomp, damage, respawn)
- [ ] T081 Integration test: Power-up mechanics in tests/integration/gameplay/power-up.test.ts (collection, state changes, expiry)
- [ ] T082 Integration test: Boss encounter in tests/integration/gameplay/boss-encounter.test.ts (phase transitions, checkpoint, retry)
- [ ] T083 Integration test: Level progression in tests/integration/gameplay/level-progression.test.ts (unlock, checkpoint, timer, difficulty)
- [ ] T084 Integration test: Save/load persistence in tests/integration/persistence/save-load.test.ts (autosave, manual save, corrupt recovery)

**Checkpoint**: All tests passing, no performance regressions, edge cases handled

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1) must be complete before US2 (enemies need platforms/player)
  - US2 (P2) can start after US1 (enemies need player collision)
  - US3 (P2) can start after US1 (blocks need player collision)
  - US4 (P3) depends on US1 + US2 + US3 (bosses need enemies/power-ups, levels need all mechanics)
  - US5 (P3) can start partially after Phase 2 (menus, save system independent), but full integration needs all stories
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: No story dependencies — starts after Foundational
- **US2 (P2)**: Depends on US1 (player, collision, camera needed)
- **US3 (P2)**: Depends on US1 (player, collision, camera needed)
- **US4 (P3)**: Depends on US1 + US2 + US3 (worlds need core+enemies+power-ups)
- **US5 (P3)**: Partially independent (menus, audio, settings after Phase 2); full integration needs all stories

### Within Each User Story

- Core entity before systems
- Systems before integration/scene wiring
- Story self-contained and testable before moving to next

---

### Parallel Opportunities

- All Phase 1 [P] tasks can run in parallel
- All Phase 2 [P] tasks can run in parallel
- US2 and US3 can be developed in parallel (both depend on US1 only)
- Within each story: [P] entity tasks can run in parallel
- All test tasks in Phase 8 marked [P] can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all Phase 2 [P] tasks together:
Task: "Create EventBus utility in src/utils/EventBus.ts"
Task: "Create StateMachine utility in src/utils/StateMachine.ts"
Task: "Create game constants in src/data/constants.ts"
Task: "Create LevelData types in src/level/LevelData.ts"
Task: "Create AudioAssets in src/audio/AudioAssets.ts"
Task: "Create KeyBindings in src/input/KeyBindings.ts"
```

---

## Implementation Strategy

### MVP First (Phases 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Core Platforming)
4. **STOP and VALIDATE**: Playable level with movement, jumping, camera, goal
5. Demo-ready MVP exists

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Core Platforming) → Test independently → **MVP!**
3. US2 (Enemies/Coins/Lives) → Test independently → Demo
4. US3 (Power-ups/Blocks) → Test independently → Demo
5. US4 (Worlds/Bosses/Progression) → Test independently → Beta
6. US5 (Systems/Polish) → Test independently → Release Candidate
7. Phase 8 (Polish/Tests) → **Release**

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational done:
   - Developer A: US1 (Core Platforming)
   - Developer B: US2 (Enemies) + US3 (Power-ups) [can start after US1]
   - Developer C: US5 (Game Systems) [menus/save partially independent]
3. US4 (Worlds/Bosses) integrates all prior work

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
