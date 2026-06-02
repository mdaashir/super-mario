# Save Data Contract

## Format
JSON object, serialized via `JSON.stringify()` and stored in localStorage
under key `super-mario-save-{slotId}`.

## Schema

```typescript
interface SaveData {
  slotId: number;          // 0-2
  version: number;         // Current format version (incremented on breaking changes)
  timestamp: number;       // Date.now() at save time
  checksum: string;        // SHA-256 hex digest of JSON.stringify({ ...fields without checksum })
  currentWorld: number;    // 1-based
  currentLevel: number;    // 1-based within world
  checkpointPosition: { x: number; y: number } | null;
  score: number;
  remainingLives: number;  // 0-99
  unlockedWorlds: number[];
  unlockedLevels: Record<string, boolean>; // "1-1": true
  audioSettings: {
    musicVolume: number;   // 0.0-1.0
    sfxVolume: number;     // 0.0-1.0
  };
  controlBindings: Record<string, string>;
  totalCoinsCollected: number;
  worldHighScores: Record<string, number>;
}
```

## Validation
1. Parse JSON — fail if parse error
2. Verify `version` matches current game version
3. Verify `slotId` is 0-2
4. Recompute checksum of `{ ...data, checksum: undefined }` and compare
5. Verify numeric ranges (score >= 0, lives 0-99, volumes 0.0-1.0)
6. On any failure: attempt backup save at key `super-mario-save-{slotId}-bak`

## Storage Keys
- `super-mario-save-0`, `super-mario-save-1`, `super-mario-save-2`
- `super-mario-save-0-bak`, `super-mario-save-1-bak`, `super-mario-save-2-bak`
- `super-mario-settings` (settings-only, no checksum)
