# Implementation Plan: Core Platformer Game

**Branch**: `001-core-platformer-game` | **Date**: 2026-06-02 | **Spec**: specs/001-core-platformer-game/spec.md

**Input**: Feature specification from `specs/001-core-platformer-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a complete 2D side-scrolling platformer game with multiple worlds,
enemies, power-ups, boss encounters, and full game systems. The game uses
Phaser 3 with TypeScript, arcade physics, an ECS-style architecture,
JSON-based level definitions from Tiled, and a local multi-slot save system.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Phaser 3.80+, Vite 5.x

**Storage**: Local file system via localStorage or IndexedDB (multi-slot
save)

**Testing**: Vitest (unit + integration), Phaser-specific gameplay
validation via headless test harness

**Target Platform**: Desktop web browsers (Chrome, Firefox, Edge, Safari)

**Project Type**: Single-page web application (HTML5 Canvas game)

**Performance Goals**: 60 fps consistent during gameplay; <100ms input
latency; <50MB total asset size

**Constraints**: Offline-capable after initial load; hardware-accelerated
rendering via WebGL; deterministic collision for consistent gameplay

**Scale/Scope**: 3-6 worlds, 3-5 levels per world, ~50 entity types,
single-player

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates are determined based on `.specify/memory/constitution.md`. All plans
MUST verify compliance with:

- **Product Quality**: No placeholder or mock implementations permitted
- **Clean Architecture**: Modular, loosely coupled system design required
- **Code Quality**: Single responsibilities, no dead code or unused assets
- **Gameplay Quality**: Edge cases tested, visual/audio feedback, balanced difficulty
- **Performance**: Optimized rendering, physics, collision, audio loops
- **Security & Data Integrity**: Save data validation, fault-tolerant persistence
- **Testing**: Automated tests for all major gameplay systems required
- **Completion Criteria**: All 6 criteria met before feature is complete

## Project Structure

### Documentation (this feature)

```text
specs/001-core-platformer-game/
├── spec.md               # Feature specification
├── plan.md               # This file (/speckit.plan command output)
├── research.md           # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output (/speckit.plan command)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
├── contracts/            # Phase 1 output (/speckit.plan command)
├── tasks.md              # Phase 2 output (/speckit.tasks command)
└── checklists/
    ├── requirements.md   # Spec quality checklist
    └── gameplay.md       # Gameplay requirements checklist
```

### Source Code (repository root)

```text
src/
├── main.ts                   # Game entry point, Phaser config
├── index.html                # HTML shell
├── scenes/
│   ├── BootScene.ts          # Asset preloading
│   ├── MenuScene.ts          # Main menu
│   ├── SettingsScene.ts      # Settings menu
│   ├── WorldMapScene.ts      # World/level selection
│   ├── GameScene.ts          # Core gameplay scene
│   ├── PauseScene.ts         # Pause overlay
│   ├── GameOverScene.ts      # Game over screen
│   └── VictoryScene.ts       # Victory screen
├── entities/
│   ├── Player.ts             # Player character
│   ├── enemies/
│   │   ├── Enemy.ts          # Base enemy class
│   │   ├── PatrolEnemy.ts    # Ground patroller
│   │   └── Boss.ts           # Boss base class
│   ├── items/
│   │   ├── Coin.ts
│   │   ├── Mushroom.ts
│   │   ├── Star.ts
│   │   └── FireFlower.ts
│   └── blocks/
│       ├── QuestionBlock.ts
│       ├── HiddenBlock.ts
│       └── DestructibleBlock.ts
├── systems/
│   ├── PhysicsSystem.ts      # Arcade physics, collision handling
│   ├── MovementSystem.ts     # Player movement state machine
│   ├── CameraSystem.ts       # Horizontal + vertical camera follow
│   ├── PowerUpSystem.ts      # Power-up state transitions
│   ├── EnemySystem.ts        # Enemy AI, patrol, spawning
│   ├── CollisionSystem.ts    # Collision response logic
│   ├── ScoreSystem.ts        # Score, lives, coins tracking
│   ├── LevelSystem.ts        # Level progression, world unlock
│   ├── SaveSystem.ts         # Save/load, validation, backup
│   └── AudioSystem.ts        # Music, SFX management
├── level/
│   ├── LevelLoader.ts        # JSON/Tiled map loader
│   ├── TileMapManager.ts     # Tilemap rendering and layer handling
│   └── LevelData.ts          # Level definition types
├── ui/
│   ├── HUD.ts                # In-game HUD (score, lives, timer)
│   ├── MenuManager.ts        # Menu navigation
│   └── UIComponents.ts       # Reusable UI elements
├── input/
│   ├── InputManager.ts       # Keyboard + controller abstraction
│   └── KeyBindings.ts        # Configurable key mappings
├── audio/
│   ├── AudioManager.ts       # Centralized audio control
│   └── AudioAssets.ts        # Audio asset references
├── assets/
│   ├── sprites/              # Sprite atlases
│   ├── tilemaps/             # JSON tilemap data
│   ├── audio/                # Music and SFX
│   └── fonts/                # Bitmap fonts
├── data/
│   ├── levels/               # Level JSON files
│   ├── worlds.json           # World definitions
│   └── constants.ts          # Game constants
└── utils/
    ├── StateMachine.ts       # Generic state machine
    └── EventBus.ts           # Event-driven communication

tests/
├── unit/
│   ├── systems/
│   │   ├── PhysicsSystem.test.ts
│   │   ├── PowerUpSystem.test.ts
│   │   ├── ScoreSystem.test.ts
│   │   └── SaveSystem.test.ts
│   └── entities/
│       ├── Player.test.ts
│       ├── Enemy.test.ts
│       └── Coin.test.ts
├── integration/
│   ├── gameplay/
│   │   ├── platforming.test.ts
│   │   ├── enemy-interaction.test.ts
│   │   ├── power-up.test.ts
│   │   ├── boss-encounter.test.ts
│   │   └── level-progression.test.ts
│   └── persistence/
│       └── save-load.test.ts
└── setup.ts                   # Test harness configuration
```

**Structure Decision**: Single project (Option 1) using a game-oriented
module layout. Systems are separated by responsibility (physics, movement,
collision, etc.) matching the Clean Architecture principle. Entities are
organized by type. Tests mirror the source structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations — the architecture is modular, single-project,
and follows clean separation of concerns per constitutional requirements.
