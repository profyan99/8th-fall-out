# Media Overlay XOR Design

**Date:** 2026-03-07  
**Scope:** Extend word overlay content from video-only to XOR media (`video` or `image`)

## Goal
Allow each encoded word in level config to specify exactly one media source: either video or image. On valid word selection, popup should display the corresponding media type.

## Confirmed Rules
- Media source is strict XOR:
  - valid: only `videoSrc`
  - valid: only `imageSrc`
  - invalid: both fields present
  - invalid: no media field
- Gameplay rules remain unchanged.

## Current State (Context)
- `WordDefinition` currently requires `videoSrc`.
- `levelSchema` validates only `videoSrc`.
- `VideoOverlay` supports only `<video>` rendering and video error fallback.
- `GameShell` already routes found word to overlay through existing state flow.

## Proposed Model
- Introduce discriminated union for words:
  - `VideoWordDefinition` (`mediaType: 'video'`, `videoSrc`)
  - `ImageWordDefinition` (`mediaType: 'image'`, `imageSrc`)
  - `WordDefinition = VideoWordDefinition | ImageWordDefinition`
- Preserve existing shared fields:
  - `id`, `value`, `path`

## Schema and Validation
- Update parser to enforce XOR at runtime.
- Parsing behavior:
  - if only `videoSrc` -> return `mediaType: 'video'`
  - if only `imageSrc` -> return `mediaType: 'image'`
  - otherwise throw explicit error (`Word media must be exactly one of videoSrc/imageSrc`)

## UI Behavior
- Overlay remains one component (can keep name `VideoOverlay` for compatibility, or rename to `MediaOverlay` with adapter).
- Render rules:
  - `mediaType === 'video'` -> existing video player + fallback
  - `mediaType === 'image'` -> image element + fallback block
- Keep close/continue behavior unchanged.

## Compatibility Strategy
- Keep existing test IDs used by integration/e2e where possible:
  - `video-overlay-backdrop`
  - `video-close-button`
- Add image-specific test IDs:
  - `media-image`
  - `media-image-fallback`

## Error Handling
- Invalid level payload fails at parse time.
- Broken image/video source shows fallback UI and allows continuing game.

## Testing Strategy
- Unit:
  - parser accepts valid video word
  - parser accepts valid image word
  - parser rejects both/none
- Component:
  - overlay renders correct branch by `mediaType`
  - video and image error fallbacks work
- Integration:
  - word with image opens image popup and game continues after close
- E2E:
  - at least one image-backed word in test level
  - image fallback scenario
