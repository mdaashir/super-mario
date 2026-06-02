# Quickstart: Core Platformer Game

## Prerequisites

- Node.js 18+
- npm 9+
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Setup

```bash
# Clone the repository
git checkout 001-core-platformer-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests (Vitest) |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run lint` | Run TypeScript type checking |
| `npm run format` | Format source code |

## Project Structure

```
src/
├── main.ts              # Game entry point
├── index.html           # HTML shell
├── scenes/              # Phaser scenes (Boot, Menu, Game, etc.)
├── entities/            # Game entities (Player, Enemy, Coin, etc.)
├── systems/             # Game systems (Physics, Score, Save, etc.)
├── level/               # Level loading and tilemap management
├── ui/                  # HUD and menu components
├── input/               # Input abstraction (keyboard + controller)
├── audio/               # Audio management
├── data/                # Level JSON files and constants
└── utils/               # State machine, event bus, helpers
```

## Building Levels

1. Open Tiled Map Editor
2. Create new tilemap with `specs/001-core-platformer-game/contracts/level-schema.md` conventions
3. Export as JSON
4. Place in `src/data/levels/`
5. Register in `worlds.json`

## Adding Assets

1. Place sprite atlas PNG + JSON in `src/assets/sprites/`
2. Place tilemap PNG in `src/assets/tilemaps/`
3. Place audio files (OGG + MP3) in `src/assets/audio/`
4. Register in `BootScene.ts` preload

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

Tests are in `tests/` mirroring the `src/` structure. Gameplay integration
tests use Phaser's headless mode for deterministic simulation.
