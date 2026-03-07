# CRT Cinematic Polish v3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add cinematic Fallout-style polish (boot, CRT curvature, parallax depth, terminal look) on top of the current working 10x10 game without changing gameplay rules.

**Architecture:** Keep all domain gameplay logic untouched and iterate only on presentation layers (`scene`, `fx`, `terminal`, `styles`). Improve visual behavior through CSS-first effects and focused hooks (`useBootSequence`, `useParallax`) so interaction reliability remains stable. Preserve existing test IDs and update visual snapshots intentionally.

**Tech Stack:** React, TypeScript, CSS keyframes/custom properties, Vitest, React Testing Library, Playwright.

---

### Task 1: Baseline and Scope Guard

**Files:**
- Modify: `README.md` (optional short note about polish branch scope)
- Test: existing test suites

**Step 1: Run baseline verification**

Run: `npm run test`  
Expected: PASS.

**Step 2: Run baseline E2E**

Run: `npm run test:e2e`  
Expected: PASS.

**Step 3: Run build check**

Run: `npm run build`  
Expected: PASS.

**Step 4: Commit baseline checkpoint**

```bash
git add README.md
git commit -m "chore: checkpoint baseline before crt polish v3"
```

### Task 2: Boot Sequence Phase Upgrade (CRT Power-On)

**Files:**
- Modify: `src/hooks/useBootSequence.ts`
- Modify: `src/components/terminal/BootOverlay.tsx`
- Modify: `src/components/GameShell.tsx`
- Modify: `src/styles.css`
- Test: `src/hooks/useBootSequence.test.ts`
- Test: `src/components/terminal/BootOverlay.test.tsx`
- Test: `src/components/GameShell.boot.integration.test.tsx`

**Step 1: Write/adjust failing tests for phased boot**
- Assert phases are explicit (`flash`, `sync`, `ready` or equivalent).
- Assert input remains blocked until final phase.

**Step 2: Verify tests fail**

Run: `npm run test -- src/hooks/useBootSequence.test.ts src/components/terminal/BootOverlay.test.tsx src/components/GameShell.boot.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal phased boot behavior**
- Add phase progression in hook.
- Render per-phase class/state in overlay.
- Keep total duration configurable from `GameShell`.

**Step 4: Re-run tests**

Run: `npm run test -- src/hooks/useBootSequence.test.ts src/components/terminal/BootOverlay.test.tsx src/components/GameShell.boot.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/hooks/useBootSequence.ts src/components/terminal/BootOverlay.tsx src/components/GameShell.tsx src/styles.css src/hooks/useBootSequence.test.ts src/components/terminal/BootOverlay.test.tsx src/components/GameShell.boot.integration.test.tsx
git commit -m "feat: add cinematic multi-phase crt boot sequence"
```

### Task 3: CRT Curvature and Edge Distortion Layer

**Files:**
- Modify: `src/components/FxLayer.tsx`
- Modify: `src/components/fx/PhosphorGlowLayer.tsx`
- Create: `src/components/fx/CrtCurvatureLayer.tsx` (if needed)
- Modify: `src/styles.css`
- Test: `src/components/fx/CrtLayers.test.tsx`

**Step 1: Write failing tests for new FX layer composition**
- Assert curvature layer renders.
- Assert all FX layers remain non-interactive (`pointer-events: none`).

**Step 2: Confirm fail**

Run: `npm run test -- src/components/fx/CrtLayers.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal curvature effect**
- Add curvature mask/gradient/perspective effect.
- Keep center readability and avoid strong blur.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/fx/CrtLayers.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/FxLayer.tsx src/components/fx/PhosphorGlowLayer.tsx src/components/fx/CrtCurvatureLayer.tsx src/styles.css src/components/fx/CrtLayers.test.tsx
git commit -m "feat: add crt curvature and edge distortion layer"
```

### Task 4: Monitor Glass and Bezel Depth Polish

**Files:**
- Modify: `src/components/scene/MonitorFrame.tsx`
- Modify: `src/styles.css`
- Test: `src/components/scene/SceneStage.test.tsx`

**Step 1: Extend tests for glass/depth elements**
- Assert required decorative elements exist and are aria-hidden.

**Step 2: Confirm fail**

Run: `npm run test -- src/components/scene/SceneStage.test.tsx`  
Expected: FAIL after adding new expectations.

**Step 3: Implement monitor polish**
- Add bezel depth classes and extra reflection layers if needed.
- Preserve layout and viewport constraints.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/scene/SceneStage.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/scene/MonitorFrame.tsx src/styles.css src/components/scene/SceneStage.test.tsx
git commit -m "style: enhance monitor glass and bezel depth"
```

### Task 5: Parallax v2 (Depth + Inertia + Safe Behavior)

**Files:**
- Modify: `src/hooks/useParallax.ts`
- Modify: `src/components/scene/SceneStage.tsx`
- Modify: `src/components/scene/ParallaxBackdrop.tsx`
- Modify: `src/styles.css`
- Test: `src/hooks/useParallax.test.ts`
- Test: `src/components/scene/ParallaxBackdrop.test.tsx`

**Step 1: Add failing tests for inertia and safe mode clamps**
- Verify reduced amplitude and smooth return behavior.

**Step 2: Run tests to verify fail**

Run: `npm run test -- src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal parallax v2**
- Improve interpolation and layer depth factors.
- Keep current stage-level pointer model.

**Step 4: Re-run tests**

Run: `npm run test -- src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/hooks/useParallax.ts src/components/scene/SceneStage.tsx src/components/scene/ParallaxBackdrop.tsx src/styles.css src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx
git commit -m "feat: improve parallax depth and inertial response"
```

### Task 6: Terminal HUD and Progress Readability Polish

**Files:**
- Modify: `src/components/terminal/TerminalHud.tsx`
- Modify: `src/components/ProgressPanel.tsx`
- Modify: `src/styles.css`
- Test: `src/components/terminal/TerminalHud.test.tsx`
- Test: `src/components/ProgressPanel.test.tsx`

**Step 1: Write failing tests for updated terminal copy/layout**
- Keep existing key test IDs (`hud-progress`, `progress-text`, `progress-marker`).

**Step 2: Confirm fail**

Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal typography/copy polish**
- Make HUD and panel consistently terminal-like.
- Preserve semantic structure and readability.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/terminal/TerminalHud.tsx src/components/ProgressPanel.tsx src/styles.css src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx
git commit -m "style: polish terminal hud and progress readability"
```

### Task 7: Grid Visual Pulse and Highlight Tuning

**Files:**
- Modify: `src/components/GridCanvas.tsx`
- Modify: `src/styles.css`
- Test: `src/components/GridCanvas.test.tsx`
- Test: `src/components/GameShell.integration.test.tsx`
- Test: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Add/adjust failing tests**
- Ensure no debug metrics reappear.
- Ensure interactions still pass with visual changes.

**Step 2: Run tests and verify fail**

Run: `npm run test -- src/components/GridCanvas.test.tsx src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL if assertions updated for new visual states.

**Step 3: Implement minimal grid polish**
- Tune selected/found colors and pulse timing.
- Keep canvas size and 10x10 readability intact.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/GridCanvas.test.tsx src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/GridCanvas.tsx src/styles.css src/components/GridCanvas.test.tsx src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx
git commit -m "style: tune grid highlights and phosphor pulse behavior"
```

### Task 8: Video Overlay Cinematic Signal v2

**Files:**
- Modify: `src/components/VideoOverlay.tsx`
- Modify: `src/styles.css`
- Test: `src/components/VideoOverlay.test.tsx`
- Test: `src/components/GameShell.video.integration.test.tsx`
- Test: `e2e/video-fallback.spec.ts`

**Step 1: Add failing tests for enhanced transition classes**
- Ensure fallback path still works.

**Step 2: Verify fail**

Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal cinematic transitions**
- Add signal-loss/capture classes.
- Keep accessibility and close behavior unchanged.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Run targeted E2E**

Run: `npm run test:e2e -- e2e/video-fallback.spec.ts`  
Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/VideoOverlay.tsx src/styles.css src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx e2e/video-fallback.spec.ts
git commit -m "feat: upgrade video overlay signal transitions with fallback safety"
```

### Task 9: Visual Regression Update for Cinematic States

**Files:**
- Modify: `e2e/visual/visual-states.spec.ts`
- Modify: `e2e/visual/visual-states.spec.ts-snapshots/*.png`
- Modify: `docs/visual/scene-states.md`

**Step 1: Update/extend visual states assertions if needed**
- Keep: boot-start, boot-finish, playing, video-overlay, completion.

**Step 2: Run visual test (expected diff)**

Run: `npm run test:e2e -- e2e/visual/visual-states.spec.ts`  
Expected: FAIL due to snapshot diffs.

**Step 3: Regenerate snapshots intentionally**

Run: `npm run test:e2e -- e2e/visual/visual-states.spec.ts --update-snapshots`  
Expected: PASS and snapshot files updated.

**Step 4: Commit**

```bash
git add e2e/visual/visual-states.spec.ts e2e/visual/visual-states.spec.ts-snapshots docs/visual/scene-states.md
git commit -m "test: refresh visual baselines for crt cinematic polish v3"
```

### Task 10: Final Verification Gate

**Files:**
- No new files required

**Step 1: Run full unit/integration**

Run: `npm run test`  
Expected: PASS.

**Step 2: Run full E2E**

Run: `npm run test:e2e`  
Expected: PASS.

**Step 3: Run production build**

Run: `npm run build`  
Expected: PASS.

**Step 4: Commit verification marker**

```bash
git add -A
git commit -m "chore: finalize crt cinematic polish v3 verification"
```
