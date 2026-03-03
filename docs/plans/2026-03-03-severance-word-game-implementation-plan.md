# Severance-Style Browser Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a desktop-only browser game where users drag-select encoded words in a grid and trigger per-word video overlays until all words are found.

**Architecture:** Use React + TypeScript for app structure and state, with Canvas 2D for grid rendering and visual feedback. Keep game logic in pure modules (`selection`, `validation`, `state`) so it is testable independently from UI.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Playwright.

---

### Task 1: Scaffold Project and Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`

**Step 1: Create Vite React TS scaffold files**
- Add minimal project scripts: `dev`, `build`, `preview`, `test`, `test:ui`, `test:e2e`.

**Step 2: Install dependencies**
Run: `npm install`
Expected: install completes without errors.

**Step 3: Verify dev server boots**
Run: `npm run build`
Expected: build succeeds.

**Step 4: Commit**
```bash
git add package.json tsconfig.json vite.config.ts index.html src/main.tsx src/App.tsx src/styles.css vitest.config.ts playwright.config.ts .gitignore
git commit -m "chore: scaffold react ts game project"
```

### Task 2: Define Level Schema and Sample Content

**Files:**
- Create: `src/domain/levelSchema.ts`
- Create: `src/domain/types.ts`
- Create: `content/levels/level-01.json`
- Create: `src/domain/loadLevel.ts`
- Test: `src/domain/loadLevel.test.ts`

**Step 1: Write failing tests for level loading**
Add tests for:
- valid level JSON parses
- malformed word path throws
- unsupported grid size throws

**Step 2: Run test to verify fail**
Run: `npm run test -- src/domain/loadLevel.test.ts`
Expected: FAIL because loader/schema are incomplete.

**Step 3: Implement minimal schema + loader**
- Add runtime validation for required fields.
- Return typed `LevelDefinition`.

**Step 4: Run tests again**
Run: `npm run test -- src/domain/loadLevel.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/domain/levelSchema.ts src/domain/types.ts src/domain/loadLevel.ts src/domain/loadLevel.test.ts content/levels/level-01.json
git commit -m "feat: add level schema and loader with validation"
```

### Task 3: Implement Selection Geometry

**Files:**
- Create: `src/domain/selection.ts`
- Test: `src/domain/selection.test.ts`

**Step 1: Write failing tests**
Cover:
- horizontal, vertical, diagonal path generation
- reverse drag path
- reject non-straight lines
- interpolate skipped cells

**Step 2: Verify fail**
Run: `npm run test -- src/domain/selection.test.ts`
Expected: FAIL.

**Step 3: Implement path math**
- Convert start/end cells to normalized direction vectors.
- Generate inclusive path of cells.

**Step 4: Verify pass**
Run: `npm run test -- src/domain/selection.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/domain/selection.ts src/domain/selection.test.ts
git commit -m "feat: add straight-line selection geometry"
```

### Task 4: Implement Word Validation and Game State Reducer

**Files:**
- Create: `src/domain/wordValidation.ts`
- Create: `src/domain/gameState.ts`
- Test: `src/domain/wordValidation.test.ts`
- Test: `src/domain/gameState.test.ts`

**Step 1: Write failing validator tests**
Cover forward/reverse path matches, duplicate word handling, miss handling.

**Step 2: Write failing state reducer tests**
Cover transitions:
- `idle -> selecting`
- `selecting -> found -> video_open`
- `video_open -> idle`
- all found -> `completed`

**Step 3: Run tests**
Run: `npm run test -- src/domain/wordValidation.test.ts src/domain/gameState.test.ts`
Expected: FAIL.

**Step 4: Implement minimal validator + reducer**
- Keep pure functions with no DOM access.

**Step 5: Re-run tests**
Run: `npm run test -- src/domain/wordValidation.test.ts src/domain/gameState.test.ts`
Expected: PASS.

**Step 6: Commit**
```bash
git add src/domain/wordValidation.ts src/domain/gameState.ts src/domain/wordValidation.test.ts src/domain/gameState.test.ts
git commit -m "feat: add word validation and game state reducer"
```

### Task 5: Build Core UI Shell and Canvas Grid

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/GameShell.tsx`
- Create: `src/components/GridCanvas.tsx`
- Create: `src/components/ProgressPanel.tsx`
- Create: `src/components/FxLayer.tsx`
- Modify: `src/styles.css`
- Test: `src/components/GridCanvas.test.tsx`

**Step 1: Write failing component test**
Assert grid canvas renders expected cell count metadata and updates on selection props.

**Step 2: Run test and confirm fail**
Run: `npm run test -- src/components/GridCanvas.test.tsx`
Expected: FAIL.

**Step 3: Implement minimal components**
- `GameShell` composes top bar, grid area, and progress panel.
- `GridCanvas` draws letters and active/found highlights.

**Step 4: Run component test**
Run: `npm run test -- src/components/GridCanvas.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/App.tsx src/components/GameShell.tsx src/components/GridCanvas.tsx src/components/ProgressPanel.tsx src/components/FxLayer.tsx src/styles.css src/components/GridCanvas.test.tsx
git commit -m "feat: add game shell and canvas grid renderer"
```

### Task 6: Wire Mouse Drag Selection to Domain Logic

**Files:**
- Create: `src/hooks/useGridSelection.ts`
- Modify: `src/components/GridCanvas.tsx`
- Modify: `src/components/GameShell.tsx`
- Test: `src/components/GameShell.integration.test.tsx`

**Step 1: Write failing integration test**
Simulate drag gesture over known word path and assert found state changes.

**Step 2: Verify fail**
Run: `npm run test -- src/components/GameShell.integration.test.tsx`
Expected: FAIL.

**Step 3: Implement selection hook and wire events**
- Translate mouse coordinates to grid cells.
- Generate selection path and validate on mouse up.

**Step 4: Verify pass**
Run: `npm run test -- src/components/GameShell.integration.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useGridSelection.ts src/components/GridCanvas.tsx src/components/GameShell.tsx src/components/GameShell.integration.test.tsx
git commit -m "feat: connect drag selection to validation flow"
```

### Task 7: Add Video Overlay Flow and Fallback

**Files:**
- Create: `src/components/VideoOverlay.tsx`
- Modify: `src/components/GameShell.tsx`
- Modify: `src/domain/gameState.ts`
- Test: `src/components/VideoOverlay.test.tsx`
- Test: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Write failing overlay tests**
Cover:
- opens on found word
- blocks game input
- fallback UI on video error
- close resumes game

**Step 2: Run tests**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`
Expected: FAIL.

**Step 3: Implement minimal overlay**
- Modal with `<video>` and controls.
- Error handler displays continue button.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/VideoOverlay.tsx src/components/GameShell.tsx src/domain/gameState.ts src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx
git commit -m "feat: add per-word video overlay and fallback handling"
```

### Task 8: Completion UX, E2E, and Final Verification

**Files:**
- Modify: `src/components/GameShell.tsx`
- Create: `e2e/game-happy-path.spec.ts`
- Create: `e2e/game-invalid-selection.spec.ts`
- Create: `e2e/video-fallback.spec.ts`
- Modify: `README.md`

**Step 1: Write failing E2E tests**
Implement 3 scenarios:
- full level completion
- invalid drag does not mark word
- broken video still allows continue

**Step 2: Run E2E and confirm initial fail**
Run: `npm run test:e2e`
Expected: FAIL before final wiring/mocks.

**Step 3: Implement completion view + test hooks**
- completion banner/state
- stable selectors for E2E

**Step 4: Run full verification**
Run: `npm run test`
Expected: PASS.
Run: `npm run test:e2e`
Expected: PASS.
Run: `npm run build`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/GameShell.tsx e2e/game-happy-path.spec.ts e2e/game-invalid-selection.spec.ts e2e/video-fallback.spec.ts README.md
git commit -m "feat: finalize gameplay completion and e2e coverage"
```

### Task 9: Optional Polish (Only If Core MVP Already Green)

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/FxLayer.tsx`
- Modify: `src/components/ProgressPanel.tsx`

**Step 1: Add subtle CRT/scanline visual layer**
**Step 2: Add smooth progress transitions**
**Step 3: Verify no regressions**
Run: `npm run test && npm run build`
Expected: PASS.

**Step 4: Commit**
```bash
git add src/styles.css src/components/FxLayer.tsx src/components/ProgressPanel.tsx
git commit -m "style: add cinematic ui polish for severance aesthetic"
```
