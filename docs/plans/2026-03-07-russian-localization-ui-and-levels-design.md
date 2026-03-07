# Russian Localization (UI + Levels) Design

**Date:** 2026-03-07  
**Scope:** Translate user-facing UI copy and level content to Russian.

## Goal
Replace all user-visible English text in the app UI and level content with Russian while keeping gameplay mechanics, state flow, and component structure unchanged.

## Confirmed Scope
- Translate UI text in components.
- Translate level content (`title`, `words[].value`) in JSON payloads.
- Do not rename technical code identifiers, test IDs, reducer action names, or file paths.

## Approach
- Add centralized Russian dictionary module (`src/i18n/ru.ts`).
- Consume dictionary values in UI components instead of hardcoded strings.
- Keep existing component APIs stable where possible.
- Update level payload strings to Russian.

## Components Affected
- `TerminalHud`
- `ProgressPanel`
- `VideoOverlay` (and image branch if present)
- `BootOverlay`
- `GameShell` completion copy

## Content Affected
- `content/levels/level-01.json`
- `content/levels/level-test.json` (if used by tests)
- Any additional level payload referenced by catalog/tests

## Constraints
- Preserve current gameplay and selection logic.
- Preserve existing test IDs to reduce regression risk.
- Ensure Russian text does not break viewport-fit layout.

## Risks and Mitigations
- **Risk:** Assertions fail due to text updates.  
  **Mitigation:** Update component/integration/e2e expected strings.
- **Risk:** Cyrillic causes visual overflow in terminal panels.  
  **Mitigation:** adjust typography/wrapping where needed.
- **Risk:** Content/word mismatch in static grids after translation.  
  **Mitigation:** validate that word paths still point to matching letters.

## Testing Strategy
- Unit: parser and content compatibility with Russian `value`.
- Component: UI labels/buttons/fallbacks in Russian.
- Integration: completion and replay flows remain intact.
- E2E: happy path and fallback path pass with Russian copy.
- Visual snapshots: refresh if text changes affect baselines.
