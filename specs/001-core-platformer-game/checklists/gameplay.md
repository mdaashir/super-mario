# Gameplay Requirements Quality Checklist: Core Platformer Game

**Purpose**: Validate gameplay requirements completeness, clarity, and coverage before planning
**Created**: 2026-06-02
**Feature**: [spec.md](../spec.md)

## Gameplay Loop Completeness

- [ ] CHK001 - Is the full gameplay loop documented (enter level → navigate → collect/defeat → reach goal → next level)? [Completeness, Spec §US1-US4]
- [ ] CHK002 - Are requirements defined for how score affects gameplay beyond display (extra lives at threshold)? [Completeness, Spec §US2-AC7]
- [ ] CHK003 - Are game-over-to-continue state transition requirements fully specified? [Completeness, Spec §US2-AC5, FR-033]
- [ ] CHK004 - Are requirements defined for mid-level death respawn flow (position, state, timer reset)? [Clarity, Spec §US2-AC4]
- [ ] CHK005 - Are requirements specified for what happens to power-up state on death? [Gap]
- [ ] CHK006 - Are requirements specified for what happens to collected coins on death (retained or lost)? [Gap]
- [ ] CHK007 - Is the end-of-level transition (goal flag → score tally → next level) specified? [Gap]
- [ ] CHK008 - Are requirements defined for world completion flow (boss defeated → transition → next world selection)? [Completeness, Spec §US4-AC10]

## Player Action Requirements

- [ ] CHK009 - Are requirements for running speed boost differentiated from walking clearly specified? [Clarity, Spec §FR-002]
- [ ] CHK010 - Are variable jump height parameters quantified (press duration vs height relationship)? [Clarity, Spec §FR-003]
- [ ] CHK011 - Are requirements defined for whether the player can change direction mid-air? [Gap]
- [ ] CHK012 - Are requirements specified for wall collision response (slide, stop, bounce)? [Gap]
- [ ] CHK013 - Are requirements defined for edge-of-level boundaries (invisible walls or death zones)? [Gap]
- [ ] CHK014 - Are requirements specified for player state persistence across level transitions (lives, score, power-ups)? [Clarity, Spec §US5-AC6]
- [ ] CHK015 - Are invincibility frame requirements defined after taking damage (duration, visual feedback)? [Gap]

## Enemy Requirements Completeness

- [ ] CHK016 - Are requirements for different enemy behaviors beyond patrol defined (chase, jump, projectile)? [Gap]
- [ ] CHK017 - Are enemy-world interaction requirements specified (enemies walk off edges, enemies interact with hazards)? [Gap, Spec §FR-008]
- [ ] CHK018 - Are requirements defined for enemy health/durability (one-hit vs multi-hit enemies)? [Gap]
- [ ] CHK019 - Are requirements specified for how enemies interact with each other (stack, ignore, damage)? [Gap]
- [ ] CHK020 - Are requirements defined for enemy spawning (trigger-based, timer-based, fixed at level start)? [Gap]
- [ ] CHK021 - Are enemy scoring point values specified in requirements? [Gap]
- [ ] CHK022 - Are requirements for enemy visual feedback on defeat (animation, particles, sound) defined? [Clarity, Spec §FR-037]

## Boss Requirements Completeness

- [ ] CHK023 - Are boss attack pattern requirements defined for each world boss? [Clarity, Spec §FR-041]
- [ ] CHK024 - Are requirements specified for boss health and hit-count per world? [Gap]
- [ ] CHK025 - Are boss arena boundary requirements defined (walls, hazards, camera lock)? [Gap]
- [ ] CHK026 - Are requirements for boss phase transitions defined (visual change, behavior change at health thresholds)? [Gap]
- [ ] CHK027 - Are requirements specified for boss defeat rewards (score, item, world unlock)? [Completeness, Spec §US4-AC9]
- [ ] CHK028 - Are requirements for the final boss differentiated from standard world bosses (unique mechanics, higher difficulty)? [Clarity, Spec §FR-040]

## Level Progression Completeness

- [ ] CHK029 - Are requirements defined for the world map or level selection screen? [Gap]
- [ ] CHK030 - Are world theme requirements specified to differentiate worlds? [Gap]
- [ ] CHK031 - Are requirements defined for how level timer duration is determined per level/world? [Clarity, Spec §FR-027]
- [ ] CHK032 - Are requirements specified for the transition between completing a world and unlocking the next (cutscene, screen, prompt)? [Gap]
- [ ] CHK033 - Are requirements defined for replaying completed levels? [Gap]
- [ ] CHK034 - Are checkpoint placement guidelines specified (minimum distance, maximum per level)? [Clarity, Spec §FR-026]
- [ ] CHK035 - Are requirements defined for what happens when player loads a save made at a checkpoint that no longer exists? [Edge Case, Spec §Edge Cases]

## Save/Load Requirements Completeness

- [ ] CHK036 - Is save data validation approach specified with concrete criteria (checksum, version, field integrity)? [Clarity, Spec §FR-047]
- [ ] CHK037 - Are requirements defined for save file storage location and naming conventions? [Gap]
- [ ] CHK038 - Are requirements specified for handling corrupted saves beyond backup restore (user notification, recovery options)? [Clarity, Spec §FR-047]
- [ ] CHK039 - Are requirements defined for save data migration between game versions? [Gap]
- [ ] CHK040 - Are requirements specified for prevent-save-during-boss-fight or allow it? [Gap, Spec §FR-035]
- [ ] CHK041 - Are requirements defined for save slot management (single save, multiple slots)? [Gap]
- [ ] CHK042 - Is the Continue menu option behavior specified when no save exists or save is corrupted? [Completeness, Spec §US5-AC1]

## Accessibility Requirements Completeness

- [ ] CHK043 - Are requirements defined for color-blind mode or color-pair alternatives for critical gameplay info? [Gap]
- [ ] CHK044 - Are requirements specified for UI text size options or scaling? [Gap]
- [ ] CHK045 - Are requirements defined for subtitle or visual cue alternatives for audio-based gameplay events? [Gap]
- [ ] CHK046 - Are requirements specified for control remapping UI and save persistence? [Completeness, Spec §US5-AC5]
- [ ] CHK047 - Are requirements defined for difficulty options that affect gameplay accessibility (e.g., slower enemies, infinite lives)? [Gap]
- [ ] CHK048 - Are requirements specified for pause functionality accessibility (controller disconnect behavior, auto-pause on focus loss)? [Gap, Spec §US5-AC3]

## Systems Coverage

- [ ] CHK049 - Are requirements for a score display HUD element explicitly specified with position and content? [Clarity, Spec §US1]
- [ ] CHK050 - Are requirements defined for lives display on HUD (icon count, numeric)? [Gap]
- [ ] CHK051 - Are requirements specified for power-up timer display (remaining duration indicator)? [Gap]
- [ ] CHK052 - Are requirements defined for coin count or score value per coin? [Gap, Spec §FR-011]
- [ ] CHK053 - Are requirements specified for what constitutes a "secret area" (trigger type, visual tell, accessibility)? [Clarity, Spec §US3-AC9]
- [ ] CHK054 - Are pipe transport requirements defined (enter animation, destination type, exit behavior)? [Gap, Spec §US4-AC8]
- [ ] CHK055 - Are requirements specified for level completion requirements beyond reaching goal flag (all coins, secret areas)? [Gap, Spec §US1-AC7]
- [ ] CHK056 - Are requirements defined for environmental hazards beyond pits, spikes, and lava (poison water, wind, ice)? [Gap, Spec §FR-028]
