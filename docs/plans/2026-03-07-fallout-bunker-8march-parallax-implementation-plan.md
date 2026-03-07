# Fallout Bunker 8 March Parallax Backdrop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current dark static backdrop with a Fallout-style bunker scene decorated for 8 March, driven by mouse-based parallax without changing gameplay mechanics.

**Architecture:** Keep parallax motion logic in `useParallax`, but introduce semantic visual layers (bunker wall, props, celebration decor, dust/light haze). Render those layers inside `ParallaxBackdrop` and animate each layer via existing transform pipeline. Keep all scene layers decorative and non-interactive.

**Tech Stack:** React, TypeScript, CSS custom properties/keyframes, Vitest, React Testing Library.

---

### Task 1: Define Bunker Scene Layer Model

**Files:**
- Modify: `src/components/scene/ParallaxBackdrop.tsx`
- Test: `src/components/scene/ParallaxBackdrop.test.tsx`

**Step 1: Write failing test for semantic backdrop layers**
- Assert the backdrop renders dedicated bunker/celebration layers:
  - `bunker-wall`
  - `bunker-props`
  - `march-decor`
  - `ambient-haze`
- Keep existing layer count assertions for parallax transforms.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal semantic layer structure**
- Extend `ParallaxBackdrop` markup to include semantic layer wrappers while preserving transform wiring.
- Keep all layers `aria-hidden`.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/scene/ParallaxBackdrop.tsx src/components/scene/ParallaxBackdrop.test.tsx
git commit -m "feat: add semantic bunker scene layers to parallax backdrop"
```

### Task 2: Implement Fallout Bunker + 8 March Visual Styling

**Files:**
- Modify: `src/styles.css`
- Test: `src/components/scene/SceneStage.test.tsx`

**Step 1: Add failing style-level assertions in scene test**
- Assert key decorative classes exist in DOM (`march-decor`, `ambient-haze`) through test IDs/classes.
- Ensure wrappers remain present (`scene-stage`, `monitor-frame`, `screen-viewport`).

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/scene/SceneStage.test.tsx`  
Expected: FAIL.

**Step 3: Implement CSS art direction**
- Replace flat dark backdrop look with layered bunker visuals:
  - concrete/metal wall texture gradients
  - panel seams, hazard tape accents
  - 8 March decor accents (flags/garland/ribbon tones, terminal-safe)
  - warm ambient haze and subtle particles
- Preserve readability and contrast around monitor frame.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/scene/SceneStage.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/styles.css src/components/scene/SceneStage.test.tsx
git commit -m "style: add fallout bunker backdrop with 8 march decor layers"
```

### Task 3: Tune Parallax Depth and Motion Quality

**Files:**
- Modify: `src/hooks/useParallax.ts`
- Modify: `src/components/scene/SceneStage.tsx`
- Test: `src/hooks/useParallax.test.ts`

**Step 1: Write failing tests for depth profile**
- Verify depth factors map correctly for 4 layers.
- Verify `safe` quality keeps low amplitude.
- Verify pointer leave returns toward neutral.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/hooks/useParallax.test.ts`  
Expected: FAIL.

**Step 3: Implement depth tuning**
- Expand layer factors for semantic scene depth (background -> foreground).
- Keep reduced-motion behavior intact.
- Ensure `SceneStage` still passes transforms predictably to backdrop.

**Step 4: Re-run tests**
Run: `npm run test -- src/hooks/useParallax.test.ts src/components/scene/ParallaxBackdrop.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useParallax.ts src/hooks/useParallax.test.ts src/components/scene/SceneStage.tsx
git commit -m "feat: tune parallax depth profile for bunker scene layers"
```

### Task 4: Protect Gameplay Visibility and Interaction

**Files:**
- Modify: `src/components/GameShell.integration.test.tsx`
- Modify: `src/components/GameShell.video.integration.test.tsx`
- Modify: `src/components/fx/CrtLayers.test.tsx` (if needed)

**Step 1: Write failing integration checks**
- Confirm gameplay remains fully interactive:
  - grid drag selection still works
  - overlay flows still block/unblock input correctly
- Confirm backdrop remains non-interactive (`pointer-events: none` on decorative layers).

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL (if structure changed).

**Step 3: Implement minimal fixes**
- Adjust z-index/pointer-events to prevent backdrop from intercepting interactions.
- Keep monitor + game UI on top.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx src/components/fx/CrtLayers.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx src/components/fx/CrtLayers.test.tsx src/styles.css
git commit -m "fix: preserve gameplay interaction over decorative parallax backdrop"
```

### Task 5: Final Visual Verification and Regression Run

**Files:**
- Optional Modify: `e2e/visual/visual-states.spec.ts` (only if stabilization needed)
- Optional Modify: `e2e/visual/visual-states.spec.ts-snapshots/*` (only if visuals intentionally changed)

**Step 1: Run unit/integration suite**
Run: `npm run test`  
Expected: PASS.

**Step 2: Run E2E suite**
Run: `npm run test:e2e`  
Expected: PASS (if visual diffs are expected, update snapshots intentionally and rerun).

**Step 3: Run build**
Run: `npm run build`  
Expected: PASS.

**Step 4: Commit optional visual snapshot updates (if any)**
```bash
git add e2e/visual/visual-states.spec.ts e2e/visual/visual-states.spec.ts-snapshots
git commit -m "test: update visual baselines for bunker 8 march parallax scene"
```
