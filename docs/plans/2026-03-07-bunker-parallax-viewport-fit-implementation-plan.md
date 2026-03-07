# Bunker Parallax And Viewport Fit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the abstract striped backdrop with a clear Fallout-style bunker scene (with 8 March decor), strengthen parallax depth, and ensure the monitor UI fully fits in the viewport.

**Architecture:** Keep gameplay and state flow unchanged. Refactor only decorative scene layers (`ParallaxBackdrop` + CSS), tune motion profile in `useParallax`, and make monitor/canvas layout responsive with viewport-aware sizing. All decorative layers remain non-interactive.

**Tech Stack:** React, TypeScript, CSS, Vitest, React Testing Library, Vite.

---

### Task 1: Add Semantic Bunker Scene Layers

**Files:**
- Modify: `src/components/scene/ParallaxBackdrop.tsx`
- Modify: `src/components/scene/ParallaxBackdrop.test.tsx`

**Step 1: Write failing tests for semantic scene layers**
- Assert presence of named layers:
  - `bunker-architecture`
  - `bunker-interior`
  - `march-decor`
  - `ambient-haze`
- Keep checks that parallax transform slots render.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal semantic structure**
- Update `ParallaxBackdrop` markup to render semantic layer wrappers with stable test IDs.
- Preserve transform application behavior.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/scene/ParallaxBackdrop.tsx src/components/scene/ParallaxBackdrop.test.tsx
git commit -m "feat: add semantic bunker scene layers for parallax backdrop"
```

### Task 2: Replace Abstract Stripes With Bunker + 8 March Art Direction

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/scene/SceneStage.test.tsx` (if assertions need update)

**Step 1: Write/adjust failing assertions for decor classes**
- Assert `march-decor` layer exists and backdrop remains decorative.
- Keep scene shell wrapper assertions intact.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/scene/SceneStage.test.tsx src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: FAIL.

**Step 3: Implement bunker visual styling**
- Remove or significantly reduce abstract stripe overlays.
- Add bunker scene look using layered gradients/shapes:
  - architectural wall/metal channels
  - interior props/poster signage silhouettes
  - 8 March accents (pink glow, flowers/garlands/poster-like blocks)
  - ambient warm/cool haze
- Keep terminal area readability high.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/scene/SceneStage.test.tsx src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/styles.css src/components/scene/SceneStage.test.tsx src/components/scene/ParallaxBackdrop.test.tsx
git commit -m "style: redesign backdrop as fallout bunker with 8 march decor"
```

### Task 3: Strengthen Parallax Motion Profile

**Files:**
- Modify: `src/hooks/useParallax.ts`
- Modify: `src/hooks/useParallax.test.ts`
- Modify: `src/components/scene/SceneStage.tsx` (if quality mode wiring needed)

**Step 1: Write failing tests for stronger depth profile**
- Verify amplitude values increase for high/medium/safe profile targets.
- Verify layer factors produce more visible foreground movement than background.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/hooks/useParallax.test.ts`  
Expected: FAIL.

**Step 3: Implement tuned motion**
- Increase amplitude and depth spread for visible effect.
- Keep `safe` mode conservative.
- Preserve smooth reset on pointer leave.

**Step 4: Re-run tests**
Run: `npm run test -- src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useParallax.ts src/hooks/useParallax.test.ts src/components/scene/SceneStage.tsx
git commit -m "feat: strengthen parallax depth and amplitude for bunker scene"
```

### Task 4: Ensure Monitor And Grid Fully Fit Viewport

**Files:**
- Modify: `src/components/GameShell.tsx`
- Modify: `src/components/GridCanvas.tsx` (only if size prop behavior needs update)
- Modify: `src/styles.css`
- Test: `src/components/GameShell.integration.test.tsx`

**Step 1: Write failing test for responsive fit signals**
- Add assertion for responsive class/attribute signaling viewport-fit mode (e.g. constrained canvas size prop usage).
- Keep existing gameplay assertions.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/GameShell.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement responsive sizing**
- Replace fixed large canvas layout assumptions with viewport-aware sizing:
  - reduce base canvas size
  - apply `clamp()`/`max-height` limits to monitor and main content
  - ensure full monitor stays visible in common 16:9 viewport height
- Do not alter selection mechanics.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/GameShell.tsx src/components/GridCanvas.tsx src/styles.css src/components/GameShell.integration.test.tsx
git commit -m "fix: make monitor and grid responsive to viewport height"
```

### Task 5: Final Regression Verification

**Files:**
- Optional Modify: `e2e/visual/visual-states.spec.ts`
- Optional Modify: `e2e/visual/visual-states.spec.ts-snapshots/*` (only if intended visual baseline updates are required)

**Step 1: Run full unit/integration tests**
Run: `npm run test`  
Expected: PASS.

**Step 2: Run E2E suite**
Run: `npm run test:e2e`  
Expected: PASS (if visual diffs are intentional, update snapshots and rerun).

**Step 3: Run build**
Run: `npm run build`  
Expected: PASS.

**Step 4: Commit optional visual baseline updates (if any)**
```bash
git add e2e/visual/visual-states.spec.ts e2e/visual/visual-states.spec.ts-snapshots
git commit -m "test: refresh visual baselines for bunker parallax and viewport fit"
```
