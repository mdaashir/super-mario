<!--
  Sync Impact Report

  Version change: 0.0.0 → 1.0.0

  Modified principles: N/A (initial fill from template)

  Added sections:
  - I. Product Quality
  - II. Clean Architecture
  - III. Code Quality
  - IV. Gameplay Quality
  - V. Performance & Optimization
  - Security, Data Integrity & Accessibility (with 3 sub-sections)
  - Testing, Documentation & Delivery (with 3 sub-sections)
  - Governance (with amendment procedure, versioning policy, compliance review)

  Removed sections: N/A (initial fill)

  Templates requiring updates:
  - .specify/templates/constitution-template.md ⚠ pending (template exists for re-init, constitution now overrides)
  - .specify/templates/plan-template.md ✅ updated (Constitution Check section)
  - .specify/templates/spec-template.md ✅ no changes needed
  - .specify/templates/tasks-template.md ✅ no changes needed
  - .specify/templates/checklist-template.md ✅ no changes needed

  Follow-up TODOs: None
-->

# Super Mario Constitution

## Core Principles

### I. Product Quality — NON-NEGOTIABLE

The project MUST be production-quality and portfolio-quality. Every implemented
feature MUST be complete, polished, and fully integrated with the rest of the
game. No placeholder systems, temporary implementations, mock features, stub
functions, fake data, or unfinished mechanics are allowed. The final result
MUST feel like a complete commercial-quality game rather than a technology
demonstration.

### II. Clean Architecture

The codebase MUST follow clean architecture principles. All systems MUST be
modular, maintainable, testable, and loosely coupled. Game logic, rendering,
audio, input, physics, persistence, UI, and level systems MUST be separated
into clearly defined modules. Monolithic files and tightly coupled
implementations are forbidden. Design systems to be extensible for future
levels, enemies, power-ups, bosses, and game modes.

### III. Code Quality

All code MUST be readable, maintainable, and documented where necessary.
Functions and classes MUST have single responsibilities. Avoid duplication
whenever practical. Follow consistent naming conventions throughout the
project. No dead code, unused assets, unused dependencies, or obsolete files
SHOULD exist in the final implementation.

### IV. Gameplay Quality

Gameplay MUST feel responsive and polished. Movement, jumping, collision
handling, camera movement, enemy interactions, and power-up systems MUST
prioritize player experience. All gameplay systems MUST be tested against edge
cases and failure conditions. Player actions MUST have clear visual and audio
feedback. Difficulty progression SHOULD be deliberate and balanced.

### V. Performance & Optimization

The game MUST maintain smooth performance during normal gameplay. Rendering,
physics updates, collision checks, and audio processing MUST be optimized
appropriately. Avoid unnecessary allocations during gameplay loops. Design
systems to support large levels and numerous entities without significant
degradation.

## Security, Data Integrity & Accessibility

### Security and Data Integrity

Save data MUST be validated before loading. Game state transitions MUST be
reliable and resistant to corruption. Settings and progress persistence MUST
be fault tolerant. Errors MUST be handled gracefully without crashing the
game.

### Accessibility

The game SHOULD support accessibility considerations whenever feasible. Provide
configurable audio settings. Provide configurable controls. Ensure UI
readability and clear visual communication. Avoid relying solely on color for
critical gameplay information.

### Asset Management

Assets MUST follow a structured organization strategy. Sprites, audio, levels,
fonts, effects, and UI assets MUST be organized consistently. Asset loading
MUST be centralized and maintainable.

## Testing, Documentation & Delivery

### Testing — NON-NEGOTIABLE

Every major gameplay system MUST have corresponding automated tests where
practical. Critical systems requiring validation include:

- Player movement
- Physics
- Collision detection
- Enemy behavior
- Power-up behavior
- Save and load functionality
- Level progression
- Boss mechanics
- UI state transitions

All critical gameplay paths MUST be verifiable through testing.

### Documentation

The project MUST include comprehensive documentation covering:

- Project setup
- Build process
- Deployment process
- Architecture overview
- Level creation workflow
- Asset pipeline
- Testing workflow

Documentation MUST allow a new developer to contribute without extensive
onboarding.

### Completion Criteria

A feature is not considered complete unless:

- Functionality is implemented
- Edge cases are handled
- Testing is provided where applicable
- Documentation is updated
- Integration with existing systems is verified
- Performance implications are reviewed

The project MUST continuously favor long-term maintainability, gameplay
quality, reliability, and extensibility over short-term implementation speed.

## Governance

This Constitution supersedes all other development practices.

### Amendment Procedure

1. Proposed amendments MUST be documented in writing.
2. Amendments MUST include rationale and impact analysis.
3. Amendments MUST include a migration plan for existing code.
4. Approval requires review against all existing principles.

### Versioning Policy

CONSTITUTION_VERSION follows semantic versioning:

- MAJOR: Backward incompatible removals or redefinitions of principles.
- MINOR: New principles or materially expanded guidance.
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements.

### Compliance Review

All implementation plans, specifications, and task lists MUST verify compliance
with this Constitution. Complexity MUST be justified when it conflicts with
established principles.

**Version**: 1.0.0 | **Ratified**: 2026-06-02 | **Last Amended**: 2026-06-02
