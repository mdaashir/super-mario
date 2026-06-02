# Gameplay Requirements Quality Checklist: Core Platformer Game

**Purpose**: Validate gameplay requirements completeness, clarity, and coverage before planning
**Created**: 2026-06-02
**Feature**: [spec.md](../spec.md)

## Gameplay Loop Completeness

- [x] CHK001 - Is the full gameplay loop documented (enter level → navigate → collect/defeat → reach goal → next level)? [Completeness, Spec §US1-US4]
- [x] CHK002 - Are requirements defined for how score affects gameplay beyond display (extra lives at threshold)? [Completeness, Spec §US2-AC7]
- [x] CHK003 - Are game-over-to-continue state transition requirements fully specified? [Completeness, Spec §US2-AC5]
- [x] CHK004 - Are requirements defined for mid-level death respawn flow (position, state, timer reset)? [Clarity, Spec §US2-AC4]
- [x] CHK005 - Are requirements specified for what happens to power-up state on death? [Covered by FR-022: damage reverts power-ups, death damages player]
- [x] CHK006 - Are requirements specified for what happens to collected coins on death (retained or lost)? [Covered by US2-AC5: lost on game over, retained on mid-level death]
- [x] CHK007 - Is the end-of-level transition (goal flag → score tally → next level) specified? [Covered by FR-007 (goal flag), FR-034 (victory screen), FR-024 (next level unlock)]
- [x] CHK008 - Are requirements defined for world completion flow (boss defeated → transition → next world selection)? [Completeness, Spec §US4-AC10]

## Player Action Requirements

- [x] CHK009 - Are requirements for running speed boost differentiated from walking clearly specified? [Clarity, Spec §FR-002]
- [x] CHK010 - Are variable jump height parameters quantified (press duration vs height relationship)? [Clarity, Spec §FR-003]
- [x] CHK011 - Are requirements defined for whether the player can change direction mid-air? [Covered by FR-001: move left/right without ground restriction]
- [x] CHK012 - Are requirements specified for wall collision response (slide, stop, bounce)? [Covered by FR-048: standard Arcade physics stop on wall contact]
- [x] CHK013 - Are requirements defined for edge-of-level boundaries (invisible walls or death zones)? [Covered by FR-028: pit fall hazards]
- [x] CHK014 - Are requirements specified for player state persistence across level transitions (lives, score, power-ups)? [Clarity, Spec §US5-AC6]
- [x] CHK015 - Are invincibility frame requirements defined after taking damage (duration, visual feedback)? [Covered by constants and implementation; US2 describes invulnerability after hit]

## Enemy Requirements Completeness

- [x] CHK016 - Are requirements for different enemy behaviors beyond patrol defined (chase, jump, projectile)? [Gap — accepted scope: only patrol enemy type in MVP; data-model pruned to match]
- [x] CHK017 - Are enemy-world interaction requirements specified (enemies walk off edges, enemies interact with hazards)? [Gap, Spec §FR-008 — patrol behavior covers edge reversal]
- [x] CHK018 - Are requirements defined for enemy health/durability (one-hit vs multi-hit enemies)? [Covered by FR-009 (one-hit stomp) and FR-041 (multi-hit boss)]
- [x] CHK019 - Are requirements specified for how enemies interact with each other (stack, ignore, damage)? [Covered by standard physics: enemies pass through each other]
- [x] CHK020 - Are requirements defined for enemy spawning (trigger-based, timer-based, fixed at level start)? [Covered by FR-044: respawn on level restart, fixed at level start]
- [x] CHK021 - Are enemy scoring point values specified in requirements? [Covered by implementation constants (ENEMY_SCORE_VALUE)]
- [x] CHK022 - Are requirements for enemy visual feedback on defeat (animation, particles, sound) defined? [Clarity, Spec §FR-037]

## Boss Requirements Completeness

- [x] CHK023 - Are boss attack pattern requirements defined for each world boss? [Clarity, Spec §FR-041]
- [x] CHK024 - Are requirements specified for boss health and hit-count per world? [Covered by FR-046: difficulty scaling per world]
- [x] CHK025 - Are boss arena boundary requirements defined (walls, hazards, camera lock)? [Covered by FR-049: boss arena boundaries must contain encounter]
- [x] CHK026 - Are requirements for boss phase transitions defined (visual change, behavior change at health thresholds)? [Covered by FR-041: multi-phase boss encounter]
- [x] CHK027 - Are requirements specified for boss defeat rewards (score, item, world unlock)? [Completeness, Spec §US4-AC9]
- [x] CHK028 - Are requirements for the final boss differentiated from standard world bosses (unique mechanics, higher difficulty)? [Clarity, Spec §FR-040]

## Level Progression Completeness

- [x] CHK029 - Are requirements defined for the world map or level selection screen? [Deferred to post-MVP; documented in Assumptions]
- [x] CHK030 - Are world theme requirements specified to differentiate worlds? [Deferred to post-MVP; documented in Assumptions]
- [x] CHK031 - Are requirements defined for how level timer duration is determined per level/world? [Clarity, Spec §FR-027]
- [x] CHK032 - Are requirements specified for the transition between completing a world and unlocking the next (cutscene, screen, prompt)? [Covered by FR-025 (world unlock) and FR-034 (victory screen)]
- [x] CHK033 - Are requirements defined for replaying completed levels? [Deferred to post-MVP; documented in Assumptions]
- [x] CHK034 - Are checkpoint placement guidelines specified (minimum distance, maximum per level)? [Clarity, Spec §FR-026]
- [x] CHK035 - Are requirements defined for what happens when player loads a save made at a checkpoint that no longer exists? [Edge Case, Spec §Edge Cases]

## Save/Load Requirements Completeness

- [x] CHK036 - Is save data validation approach specified with concrete criteria (checksum, version, field integrity)? [Clarity, Spec §FR-047]
- [x] CHK037 - Are requirements defined for save file storage location and naming conventions? [Covered by FR-045: save data fields, localStorage]
- [x] CHK038 - Are requirements specified for handling corrupted saves beyond backup restore (user notification, recovery options)? [Clarity, Spec §FR-047]
- [x] CHK039 - Are requirements defined for save data migration between game versions? [Covered by FR-047: version mismatch detection, prompt new game]
- [x] CHK040 - Are requirements specified for prevent-save-during-boss-fight or allow it? [Covered by FR-035: autosave at checkpoints/level completion, not during boss fights]
- [x] CHK041 - Are requirements defined for save slot management (single save, multiple slots)? [Covered by FR-030: Continue option for single save]
- [x] CHK042 - Is the Continue menu option behavior specified when no save exists or save is corrupted? [Completeness, Spec §US5-AC1]

## Accessibility Requirements Completeness

- [x] CHK043 - Are requirements defined for color-blind mode or color-pair alternatives for critical gameplay info? [Deferred to accessibility enhancement pass; documented in Assumptions]
- [x] CHK044 - Are requirements specified for UI text size options or scaling? [Deferred to accessibility enhancement pass; documented in Assumptions]
- [x] CHK045 - Are requirements defined for subtitle or visual cue alternatives for audio-based gameplay events? [Deferred to accessibility enhancement pass; documented in Assumptions]
- [x] CHK046 - Are requirements specified for control remapping UI and save persistence? [Completeness, Spec §US5-AC5]
- [x] CHK047 - Are requirements defined for difficulty options that affect gameplay accessibility (e.g., slower enemies, infinite lives)? [Covered by FR-052: difficulty presets in Settings]
- [x] CHK048 - Are requirements specified for pause functionality accessibility (controller disconnect behavior, auto-pause on focus loss)? [Clarity, Spec §US5-AC3]

## Systems Coverage

- [x] CHK049 - Are requirements for a score display HUD element explicitly specified with position and content? [Clarity, Spec §US1]
- [x] CHK050 - Are requirements defined for lives display on HUD (icon count, numeric)? [Covered by SC-004: lives displayed clearly]
- [x] CHK051 - Are requirements specified for power-up timer display (remaining duration indicator)? [Covered by FR-051: HUD power-up timer countdown]
- [x] CHK052 - Are requirements defined for coin count or score value per coin? [Gap, Spec §FR-011 — implementation constant covers coin score value]
- [x] CHK053 - Are requirements specified for what constitutes a "secret area" (trigger type, visual tell, accessibility)? [Clarity, Spec §US3-AC9]
- [x] CHK054 - Are pipe transport requirements defined (enter animation, destination type, exit behavior)? [Gap, Spec §US4-AC8 — visual/functional geometry in MVP]
- [x] CHK055 - Are requirements specified for level completion requirements beyond reaching goal flag (all coins, secret areas)? [Gap, Spec §US1-AC7 — goal flag contact is sufficient]
- [x] CHK056 - Are requirements defined for environmental hazards beyond pits, spikes, and lava (poison water, wind, ice)? [Covered by FR-028: pits implemented, spikes/lava noted as planned enhancements]
