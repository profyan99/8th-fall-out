# CRT Monitor Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the game presentation into a Fallout-style CRT monitor scene with parallax interior background, boot sequence, and terminal-grade visual effects while preserving existing gameplay behavior.

**Architecture:** Keep all gameplay/domain logic untouched and build a visual shell around current components. Introduce scene-level containers (`SceneStage`, `MonitorFrame`, `ScreenViewport`) and effect layers that are purely decorative and non-interactive. Add a boot-state controller that gates input until animation completion and quality settings for motion/performance fallbacks.

**Tech Stack:** React, TypeScript, CSS (custom properties + keyframes), Vite, Vitest, React Testing Library, Playwright.

---

### Task 1: Introduce Theme Tokens and Visual Modes

**Files:**
- Modify: `src/styles.css`
- Create: `src/theme/crtTokens.ts`
- Create: `src/theme/qualityMode.ts`
- Test: `src/theme/qualityMode.test.ts`

**Step 1: Write failing tests for quality mode resolution**
- Cover:
  - default mode is `high`
  - reduced motion maps to `safe`
  - manual override is respected

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/theme/qualityMode.test.ts`
Expected: FAIL (module missing/incomplete).

**Step 3: Implement minimal theme token and quality-mode helpers**
- Add typed quality mode union: `high | medium | safe`.
- Implement selector utility for `prefers-reduced-motion`.
- Add CRT color/spacing tokens in CSS variables.

**Step 4: Re-run tests and verify pass**
Run: `npm run test -- src/theme/qualityMode.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/styles.css src/theme/crtTokens.ts src/theme/qualityMode.ts src/theme/qualityMode.test.ts
git commit -m "feat: add crt theme tokens and quality mode resolver"
```

### Task 2: Build Scene Shell (Backdrop + Monitor Frame + Screen Viewport)

**Files:**
- Create: `src/components/scene/SceneStage.tsx`
- Create: `src/components/scene/ParallaxBackdrop.tsx`
- Create: `src/components/scene/MonitorFrame.tsx`
- Create: `src/components/scene/ScreenViewport.tsx`
- Modify: `src/components/GameShell.tsx`
- Modify: `src/styles.css`
- Test: `src/components/scene/SceneStage.test.tsx`

**Step 1: Write failing scene shell test**
- Assert new wrappers render in tree:
  - scene stage
  - monitor frame
  - screen viewport

**Step 2: Run test and confirm fail**
Run: `npm run test -- src/components/scene/SceneStage.test.tsx`
Expected: FAIL.

**Step 3: Implement minimal scene components**
- Move existing game UI inside `ScreenViewport`.
- Keep IDs/testids stable for existing tests when possible.

**Step 4: Re-run target test**
Run: `npm run test -- src/components/scene/SceneStage.test.tsx`
Expected: PASS.

**Step 5: Run integration smoke**
Run: `npm run test -- src/components/GameShell.integration.test.tsx`
Expected: PASS.

**Step 6: Commit**
```bash
git add src/components/scene/SceneStage.tsx src/components/scene/ParallaxBackdrop.tsx src/components/scene/MonitorFrame.tsx src/components/scene/ScreenViewport.tsx src/components/GameShell.tsx src/styles.css src/components/scene/SceneStage.test.tsx
git commit -m "feat: add fallout-style scene shell and monitor frame"
```

### Task 3: Add Parallax Engine for Interior Background

**Files:**
- Create: `src/hooks/useParallax.ts`
- Modify: `src/components/scene/ParallaxBackdrop.tsx`
- Test: `src/hooks/useParallax.test.ts`
- Test: `src/components/scene/ParallaxBackdrop.test.tsx`

**Step 1: Write failing hook tests**
- Cover pointer normalization, clamp behavior, and safe mode amplitude.

**Step 2: Run tests to verify fail**
Run: `npm run test -- src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx`
Expected: FAIL.

**Step 3: Implement hook with `requestAnimationFrame` smoothing**
- Add low-amplitude transforms for 2-3 layers.
- Respect quality mode and reduced motion.

**Step 4: Re-run tests**
Run: `npm run test -- src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useParallax.ts src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.tsx src/components/scene/ParallaxBackdrop.test.tsx
git commit -m "feat: implement interior parallax backdrop"
```

### Task 4: Implement Boot Sequence State and Input Gating

**Files:**
- Create: `src/hooks/useBootSequence.ts`
- Create: `src/components/terminal/BootOverlay.tsx`
- Modify: `src/components/GameShell.tsx`
- Modify: `src/components/GridCanvas.tsx`
- Test: `src/hooks/useBootSequence.test.ts`
- Test: `src/components/terminal/BootOverlay.test.tsx`
- Test: `src/components/GameShell.boot.integration.test.tsx`

**Step 1: Write failing tests**
- Verify boot phases and completion timing.
- Verify input is blocked while boot is active.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/hooks/useBootSequence.test.ts src/components/terminal/BootOverlay.test.tsx src/components/GameShell.boot.integration.test.tsx`
Expected: FAIL.

**Step 3: Implement minimal boot flow**
- Add phase machine: `booting` -> `playing`.
- Typewriter lines and reveal timing controlled by hook.

**Step 4: Re-run tests**
Run: `npm run test -- src/hooks/useBootSequence.test.ts src/components/terminal/BootOverlay.test.tsx src/components/GameShell.boot.integration.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useBootSequence.ts src/components/terminal/BootOverlay.tsx src/components/GameShell.tsx src/components/GridCanvas.tsx src/hooks/useBootSequence.test.ts src/components/terminal/BootOverlay.test.tsx src/components/GameShell.boot.integration.test.tsx
git commit -m "feat: add crt boot sequence and input lock"
```

### Task 5: Build CRT FX Layers (Scanline, Noise, Vignette, Glow)

**Files:**
- Create: `src/components/fx/CrtScanlineLayer.tsx`
- Create: `src/components/fx/CrtNoiseLayer.tsx`
- Create: `src/components/fx/CrtVignetteLayer.tsx`
- Create: `src/components/fx/PhosphorGlowLayer.tsx`
- Modify: `src/components/FxLayer.tsx`
- Modify: `src/styles.css`
- Test: `src/components/fx/CrtLayers.test.tsx`

**Step 1: Write failing layer test**
- Assert all FX layers render and have `pointer-events: none`.

**Step 2: Run test and verify fail**
Run: `npm run test -- src/components/fx/CrtLayers.test.tsx`
Expected: FAIL.

**Step 3: Implement minimal CRT layers**
- Wire classes and keyframes.
- Ensure no overlay captures pointer events.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/fx/CrtLayers.test.tsx src/components/GameShell.integration.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/fx/CrtScanlineLayer.tsx src/components/fx/CrtNoiseLayer.tsx src/components/fx/CrtVignetteLayer.tsx src/components/fx/PhosphorGlowLayer.tsx src/components/FxLayer.tsx src/styles.css src/components/fx/CrtLayers.test.tsx
git commit -m "feat: add layered crt effects with non-blocking overlays"
```

### Task 6: Terminal HUD and Progress Restyle

**Files:**
- Create: `src/components/terminal/TerminalHud.tsx`
- Modify: `src/components/ProgressPanel.tsx`
- Modify: `src/components/GameShell.tsx`
- Modify: `src/styles.css`
- Test: `src/components/terminal/TerminalHud.test.tsx`
- Test: `src/components/ProgressPanel.test.tsx`

**Step 1: Write failing component tests**
- HUD displays title/session/progress markers.
- Progress panel remains accurate with found words.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`
Expected: FAIL.

**Step 3: Implement minimal terminal UI components**
- Keep same data sources from game state.
- Do not alter domain logic.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/terminal/TerminalHud.tsx src/components/ProgressPanel.tsx src/components/GameShell.tsx src/styles.css src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx
git commit -m "feat: add terminal hud and fallout progress styling"
```

### Task 7: Video Overlay Transition Restyle (Signal Capture)

**Files:**
- Modify: `src/components/VideoOverlay.tsx`
- Modify: `src/styles.css`
- Test: `src/components/VideoOverlay.test.tsx`
- Test: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Write/adjust failing tests**
- Verify dialog still appears, fallback still works, close action still resumes.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`
Expected: FAIL after style/structure changes.

**Step 3: Implement signal-capture transition**
- Add enter/exit animation classes.
- Preserve existing behavior and accessibility labels.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/VideoOverlay.tsx src/styles.css src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx
git commit -m "feat: restyle video overlay with terminal signal transitions"
```

### Task 8: Completion Screen Styling and 8 March Message Layer

**Files:**
- Modify: `src/components/GameShell.tsx`
- Modify: `src/styles.css`
- Test: `src/components/GameShell.integration.test.tsx`
- Test: `e2e/game-happy-path.spec.ts`

**Step 1: Write failing tests for completion copy/state**
- Assert completion message and banner remain present after final word.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/GameShell.integration.test.tsx`
Expected: FAIL after content change.

**Step 3: Implement completion terminal stamp**
- Add themed text for the 8 March congratulation.
- Keep `data-testid="completion-banner"` to avoid broad E2E rewrites.

**Step 4: Re-run unit/integration tests**
Run: `npm run test -- src/components/GameShell.integration.test.tsx`
Expected: PASS.

**Step 5: Re-run related E2E**
Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts`
Expected: PASS.

**Step 6: Commit**
```bash
git add src/components/GameShell.tsx src/styles.css src/components/GameShell.integration.test.tsx e2e/game-happy-path.spec.ts
git commit -m "feat: add themed completion terminal message for 8 march"
```

### Task 9: Visual Regression and Documentation

**Files:**
- Create: `e2e/visual/visual-states.spec.ts`
- Create: `docs/visual/scene-states.md`
- Modify: `README.md`

**Step 1: Write failing visual-state E2E**
- Capture screenshots for:
  - boot start
  - boot finish
  - playing
  - video overlay
  - completion

**Step 2: Run test and confirm fail (no baselines yet)**
Run: `npm run test:e2e -- e2e/visual/visual-states.spec.ts`
Expected: FAIL or prompt for baseline setup.

**Step 3: Establish baseline snapshots and document update workflow**
- Add notes on updating snapshots intentionally.

**Step 4: Run full verification**
Run: `npm run test`
Expected: PASS.
Run: `npm run test:e2e`
Expected: PASS.
Run: `npm run build`
Expected: PASS.

**Step 5: Commit**
```bash
git add e2e/visual/visual-states.spec.ts docs/visual/scene-states.md README.md
git commit -m "test: add visual state coverage and docs for crt scene"
```

### Task 10: Optional Polish Pass (Only If All Tests Already Green)

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/fx/PhosphorGlowLayer.tsx`
- Modify: `src/components/scene/MonitorFrame.tsx`

**Step 1: Fine tune bloom, curvature, and monitor glass reflections**
**Step 2: Validate readability remains acceptable**
**Step 3: Re-run regression checks**
Run: `npm run test && npm run build`
Expected: PASS.

**Step 4: Commit**
```bash
git add src/styles.css src/components/fx/PhosphorGlowLayer.tsx src/components/scene/MonitorFrame.tsx
git commit -m "style: polish crt monitor look and phosphor response"
```
