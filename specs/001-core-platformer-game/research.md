# Research: Core Platformer Game

## Technology Decisions

### Game Framework: Phaser 3

**Decision**: Phaser 3.80+

**Rationale**: Phaser 3 provides a mature 2D game engine with built-in
WebGL rendering, arcade physics, tilemap support, audio management, and
sprite atlas handling. It has strong TypeScript support and an active
ecosystem.

**Alternatives considered**:
- **PixiJS + custom engine**: More flexible but requires building physics,
  scene management, and audio from scratch — significantly more effort.
- **Godot / Unity via Web export**: Heavier toolchain, harder to integrate
  with web build pipeline (Vite), and overkill for a 2D platformer.
- **Raw Canvas API**: Complete control but no physics, scene management,
  or asset pipeline — too much boilerplate.

### Build Tool: Vite

**Decision**: Vite 5.x

**Rationale**: Fast HMR, native TypeScript and TypeScript support, clean
production bundling with code splitting, and static deployment output.

**Alternatives considered**:
- **Webpack**: Slower dev server, more configuration for the same result.
- **Parcel**: Simpler but less control over the bundling process.

### Language: TypeScript

**Decision**: TypeScript 5.x

**Rationale**: Type safety for a complex codebase with 50+ entity types and
systems. Interface contracts between systems benefit from static typing.

### Physics: Phaser Arcade Physics

**Decision**: Phaser Arcade Physics

**Rationale**: Sufficient for a 2D platformer — handles gravity, velocity,
acceleration, collision detection, and overlap checks. Deterministic enough
for consistent gameplay across frames. No need for Matter.js (overkill) or
custom physics (too much effort).

**Alternatives considered**:
- **Matter.js**: Full physics engine, supports complex shapes and joints
  but unnecessary complexity for a platformer.
- **Custom physics**: Too much implementation risk for no tangible benefit.

### Level Format: Tiled + JSON

**Decision**: Tiled Map Editor with JSON export

**Rationale**: Tiled provides a visual editor for tilemaps, object
placement (enemies, items, spawn points), and multiple layer support. JSON
export is lightweight and directly parseable by Phaser's tilemap system.

### Persistence: localStorage

**Decision**: localStorage with JSON serialization

**Rationale**: Simple, synchronous, sufficient for save data (~10KB per
slot). Supports multiple save slots via key namespacing.

**Alternatives considered**:
- **IndexedDB**: More complex API, asynchronous, overkill for save data size.
- **File download/upload**: Better for player data portability but more
  complex UX and no autosave support.

### Testing: Vitest

**Decision**: Vitest

**Rationale**: Native Vite integration, fast, supports TypeScript,
compatible with Phaser's headless mode for gameplay testing.

### Asset Pipeline

**Decision**: TexturePacker for sprite atlases, Audacity/original for audio

**Rationale**: TexturePacker produces Phaser-compatible atlas JSON and
PNG. Audio assets as OGG + MP3 for broad browser compatibility. All assets
loaded via Phaser's loader in BootScene.

## Architecture Decisions

### Entity-Component-Style Organization

**Decision**: Entity classes with delegated system logic

**Rationale**: Full ECS (entities as pure data, systems as pure logic) adds
complexity without clear benefit for a game of this scope. Instead,
entities own their data and systems operate on entity collections. This
provides clean separation without ECS framework overhead.

### Event-Driven Communication

**Decision**: Centralized EventBus for cross-system communication

**Rationale**: Systems should not directly reference each other. Events
(e.g., "coin-collected", "player-damaged", "boss-defeated") allow loose
coupling. Systems subscribe to relevant events and respond.

### State Machine Pattern

**Decision**: Generic state machine for player and boss AI

**Rationale**: Player has states (idle, walking, running, jumping, falling,
powered-up). Bosses have phases. A reusable StateMachine utility prevents
duplication.

## Performance Considerations

- **Object pooling**: Coins, enemy projectiles, and particles should use
  object pools to avoid GC pressure during gameplay loops.
- **Sprite atlas batching**: All sprites in atlas = single draw call.
- **Off-screen culling**: Entities off-screen pause physics updates
  (clarified in spec).
- **Tilemap chunking**: Large levels split into camera-visible chunks.
