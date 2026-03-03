# Severance-Style Browser Game Design

**Date:** 2026-03-03
**Scope:** MVP (desktop-only)

## Goal
Build an interactive browser game where users find hidden words in a letter grid. When a valid encoded word is selected, a video clip opens, visual effects play, and the game continues until all encoded words are found.

## Product Constraints
- Platform: desktop web only (mouse input, no mobile/touch in MVP).
- Selection interaction: drag from first to last letter in a straight line.
- Allowed directions: horizontal, vertical, diagonal (8 directions total).
- Content source: static JSON files in repository (no backend/CMS for MVP).

## Architecture
- App type: frontend-only SPA.
- Stack:
  - React + TypeScript (UI structure and state orchestration)
  - Vite (build/dev tooling)
  - Canvas 2D (grid rendering and selection highlighting)
  - HTML5 video element (clip playback)
  - Playwright + Vitest (E2E + unit/integration tests)
- Deployment target: static hosting (Vercel/Netlify/GitHub Pages compatible).

## High-Level Components
- `GameShell`: top-level layout, loading/error/completion states.
- `GridCanvas`: draws grid, letters, active selection, and found-word highlights.
- `SelectionController`: mouse drag handling and path generation.
- `WordValidator`: checks path against encoded words in both directions.
- `VideoOverlay`: modal/overlay for clip playback, input lock while active.
- `FxLayer`: transient visual effects on successful word detection.
- `ProgressPanel`: found words and completion percentage.

## Data Model (Level JSON)
`content/levels/level-01.json` contains:
- Grid dimensions (`rows`, `cols`)
- Letter matrix (`cells`)
- Word definitions (`id`, `text`, `path`, `videoSrc`, optional `fxPreset`)
- Optional UI metadata (`title`, `subtitle`, `theme`)

Example path representation:
- `path`: ordered list of coordinates: `[{ "r": 2, "c": 3 }, { "r": 2, "c": 4 }, ...]`

## Runtime Flow
1. Load level JSON and initialize game state.
2. Render grid and UI chrome.
3. User drags across letters.
4. Selection path is projected onto straight-line discrete cells.
5. Validator checks if path matches a hidden word path (forward/reverse).
6. On match:
   - mark word as found
   - play success FX
   - open video overlay
   - after clip close/end, resume gameplay
7. When all words are found, transition to completion state.

## Error Handling and Edge Cases
- Non-straight drag: mark invalid and clear on mouse up.
- Already found word selected again: ignore and show neutral feedback.
- Sparse mouse events during fast drag: interpolate crossed cells.
- Video load/playback failure: show fallback message and continue button.
- Window blur/focus during playback: preserve coherent overlay state.

## Non-Functional Requirements
- Deterministic, testable selection geometry.
- Clean separation of pure game logic from React presentation.
- Smooth rendering at common desktop resolutions.
- Content authoring should require only JSON edits for new levels.

## Testing Strategy
- Unit (Vitest):
  - straight-line path generation
  - word match validation (forward/reverse)
  - game state transitions (found/completed)
- Integration (React Testing Library):
  - valid drag triggers overlay
  - overlay close resumes game
  - all found => completion state
- E2E (Playwright):
  - full level happy path
  - invalid drag path
  - broken video fallback

## Out of Scope (MVP)
- Mobile/touch controls
- User accounts, cloud save, analytics backend
- In-game level editor UI
- CMS integration
