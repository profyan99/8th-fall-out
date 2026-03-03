# CRT Monitor Redesign (Fallout Style) Design

**Date:** 2026-03-03  
**Scope:** Post-MVP visual overhaul (no gameplay rule changes)

## Goal
Transform the existing word-search game into a cinematic Fallout-style CRT terminal scene: the game field is embedded inside a monitor, shown against an interior parallax background, with aggressive green monochrome effects and a boot-up sequence.

## Confirmed Decisions
- Visual direction: full Fallout CRT aesthetic.
- Environment: interior background with parallax movement.
- Startup: full boot sequence before interaction.
- Gameplay mechanics unchanged: desktop-only, drag straight-line selection, JSON-driven content.

## Design Summary

### 1) Scene Composition
- `SceneStage`: full viewport container with interior background layers.
- `ParallaxBackdrop`: 2-3 depth layers reacting to pointer position.
- `MonitorFrame`: physical monitor shell (bezel, glass, subtle shadows/reflections).
- `ScreenViewport`: clipped display area containing the playable UI.

### 2) Screen UI Structure
- `TerminalHud` at top:
  - terminal title line
  - progress and session indicators
- Existing `GridCanvas` in center as the playable area.
- Existing `ProgressPanel` restyled as terminal status module.
- Completion state shown as terminal “ACCESS GRANTED / 8 MARCH MESSAGE”.

### 3) Effect Layers (inside screen viewport)
- `CrtScanlineLayer`: dense horizontal scanline pattern.
- `CrtNoiseLayer`: animated phosphor/noise flicker.
- `CrtVignetteLayer`: edge darkening and tube curvature feel.
- `PhosphorGlowLayer`: bloom-like green glow on active/found states.
- All layers use `pointer-events: none`.

### 4) Animation Narrative
- Boot sequence total: ~2.4s to ~3.2s.
  1. black to green flash
  2. sync-jitter and warm-up
  3. typewriter terminal lines
  4. field reveal, input unlocked
- Runtime micro-interactions:
  - hover glow
  - pulsing drag path
  - short signal-flash on found word
- Video overlay transition:
  - signal-capture wipe in/out

## Performance and UX Constraints
- Keep effects mostly CSS-based (`opacity`, `transform`, gradients).
- Parallax updates through `requestAnimationFrame` and clamped amplitude.
- Add reduced-motion/safe mode for low-end hardware.
- Maintain readability: tuned green palette (not pure neon only).

## Risks and Mitigations
- Readability loss from heavy effects:
  - define contrast-safe text tokens and cap bloom intensity.
- Interaction interference:
  - enforce `pointer-events: none` on all FX layers.
- Performance regressions:
  - quality presets (`high`, `medium`, `safe`) with easy fallback.

## Testing Approach
- Visual snapshots for key states:
  - `boot-start`, `boot-finish`, `playing`, `video-overlay`, `completed`
- Functional smoke:
  - selection remains accurate under all FX layers
- Performance smoke:
  - stable interaction and acceptable frame pacing on desktop
- Accessibility:
  - `prefers-reduced-motion` disables jitter-heavy effects

## Do We Need a Graphic Tool First?
Not required to proceed. Current component structure is stable enough to implement directly with a coded design system.  
Optional: add Figma storyboard later for art direction alignment before polish pass.
