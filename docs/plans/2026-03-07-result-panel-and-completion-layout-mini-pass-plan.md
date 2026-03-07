# Result Panel And Completion Layout Mini Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply small UI refinements: copy updates, fixed-height scrollable Result list, and stable completion layout that does not push terminal content out of viewport.

**Architecture:** Keep gameplay and reducer flow unchanged; touch only UI components and styles. Preserve existing behavior and test IDs while updating labels and layout constraints. Validate with unit/integration/e2e to prevent regressions in replay and completion flows.

**Tech Stack:** React, TypeScript, CSS, Vitest, React Testing Library, Playwright.

---

### Task 1: Rename Terminal Copy Labels

**Files:**
- Modify: `src/components/ProgressPanel.tsx`
- Modify: `src/components/terminal/TerminalHud.tsx`
- Test: `src/components/ProgressPanel.test.tsx`
- Test: `src/components/terminal/TerminalHud.test.tsx`

**Step 1: Write failing tests for updated copy**
- Assert panel title is `Result`.
- Assert progress text uses `words` (not `words indexed`).
- Assert replay button label is `%word%` only.

**Step 2: Run tests and verify fail**

Run: `npm run test -- src/components/ProgressPanel.test.tsx src/components/terminal/TerminalHud.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal copy changes**
- Replace `Retrieval log` label with `Result`.
- Replace `replay record %word%` with `%word%`.
- Replace `words indexed` with `words`.

**Step 4: Re-run tests and verify pass**

Run: `npm run test -- src/components/ProgressPanel.test.tsx src/components/terminal/TerminalHud.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/ProgressPanel.tsx src/components/terminal/TerminalHud.tsx src/components/ProgressPanel.test.tsx src/components/terminal/TerminalHud.test.tsx
git commit -m "style: rename result and word labels in terminal ui"
```

### Task 2: Make Result List Scrollable With Fixed Height

**Files:**
- Modify: `src/components/ProgressPanel.tsx`
- Modify: `src/styles.css`
- Test: `src/components/ProgressPanel.test.tsx`

**Step 1: Add failing test for list container behavior**
- Assert list container exists with dedicated test ID/class.
- Assert rendering works with 10+ items.

**Step 2: Run test and verify fail**

Run: `npm run test -- src/components/ProgressPanel.test.tsx`  
Expected: FAIL.

**Step 3: Implement fixed-height scroll list**
- Wrap replay entries in a list container.
- Add CSS:
  - fixed/max height (viewport-safe)
  - `overflow-y: auto`
  - compact terminal scrollbar styling

**Step 4: Re-run tests and verify pass**

Run: `npm run test -- src/components/ProgressPanel.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/ProgressPanel.tsx src/styles.css src/components/ProgressPanel.test.tsx
git commit -m "style: constrain result list height and enable internal scroll"
```

### Task 3: Prevent Completion Banner From Shifting Terminal Layout

**Files:**
- Modify: `src/components/GameShell.tsx`
- Modify: `src/styles.css`
- Test: `src/components/GameShell.integration.test.tsx`
- Test: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Add failing integration assertions**
- Assert completion state renders banner without changing key UI availability.
- Keep grid, result panel, and hud visible/present after completion.

**Step 2: Run tests and verify fail**

Run: `npm run test -- src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement stable completion layout**
- Move banner to non-flow overlay or reserved static slot.
- Ensure no terminal “jump” when completion toggles.
- Keep existing completion test ID.

**Step 4: Re-run tests and verify pass**

Run: `npm run test -- src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/GameShell.tsx src/styles.css src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx
git commit -m "fix: stabilize completion banner without viewport layout shift"
```

### Task 4: E2E Regression Checks For Labels And Viewport Stability

**Files:**
- Modify: `e2e/game-happy-path.spec.ts`
- Modify: `e2e/video-fallback.spec.ts` (if label assertions are shared)
- Optional: `e2e/visual/visual-states.spec.ts` and snapshot files

**Step 1: Add failing e2e assertions**
- Assert `Result` label visible.
- Assert word counter text contains `words`.
- Assert replay button label is `%word%` only.
- Assert no page-level vertical scroll at completion.

**Step 2: Run targeted e2e and verify fail**

Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts`  
Expected: FAIL.

**Step 3: Apply minimal selector/assertion updates**
- Keep behavior checks same.
- Update textual expectations to new labels.

**Step 4: Re-run targeted e2e and verify pass**

Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add e2e/game-happy-path.spec.ts e2e/video-fallback.spec.ts e2e/visual/visual-states.spec.ts e2e/visual/visual-states.spec.ts-snapshots
git commit -m "test: align e2e expectations for result labels and completion layout"
```

### Task 5: Final Verification Gate

**Files:**
- No new files required

**Step 1: Run full unit/integration suite**

Run: `npm run test`  
Expected: PASS.

**Step 2: Run full e2e suite**

Run: `npm run test:e2e`  
Expected: PASS.

**Step 3: Run production build**

Run: `npm run build`  
Expected: PASS.

**Step 4: Commit final checkpoint**

```bash
git add -A
git commit -m "chore: finalize mini ui pass for result panel and completion layout"
```
