# Video Overlay Resize, Restyle, And Rewatch From Progress Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Increase video overlay size by ~25%, restyle overlay controls to Fallout terminal aesthetics, and allow replay of found-word videos from `ProgressPanel`.

**Architecture:** Keep gameplay rules unchanged and extend presentation flow only. `GameShell` remains the single source of truth for video-open state. `ProgressPanel` receives read-only word status and emits replay intent callbacks. `VideoOverlay` remains responsible for media/fallback rendering.

**Tech Stack:** React, TypeScript, CSS, Vitest, React Testing Library, Vite.

---

### Task 1: Add Failing Tests For Overlay Size And Styled Controls

**Files:**
- Modify: `src/components/VideoOverlay.test.tsx`
- Modify: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Write failing tests**
- `VideoOverlay` test asserts:
  - overlay root has enlarged layout class (e.g. `video-overlay-lg`)
  - action buttons have Fallout control class (e.g. `terminal-action-button`)
- Integration test still verifies close/fallback behavior remains intact.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal overlay/UI updates**
- Add semantic classes for enlarged container and themed buttons.
- Keep accessibility labels and roles unchanged.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/VideoOverlay.tsx src/components/VideoOverlay.test.tsx src/components/GameShell.video.integration.test.tsx src/styles.css
git commit -m "feat: enlarge video overlay and style controls for terminal theme"
```

### Task 2: Add Replay UX In Progress Panel (Found Words Only)

**Files:**
- Modify: `src/components/ProgressPanel.tsx`
- Modify: `src/components/ProgressPanel.test.tsx`

**Step 1: Write failing ProgressPanel tests**
- Assert found words render as interactive replay items.
- Assert non-found words are not replay-enabled.
- Assert click emits callback with word id.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/ProgressPanel.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal ProgressPanel replay API**
- Extend props to include:
  - list of words with found status
  - `onReplayRequested(wordId: string)` callback
- Render found words as themed buttons/links.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/ProgressPanel.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/ProgressPanel.tsx src/components/ProgressPanel.test.tsx src/styles.css
git commit -m "feat: add replay controls for found words in progress panel"
```

### Task 3: Wire Replay Flow In GameShell

**Files:**
- Modify: `src/components/GameShell.tsx`
- Modify: `src/components/GameShell.video.integration.test.tsx`
- Modify: `src/components/GameShell.integration.test.tsx` (if needed)

**Step 1: Write failing integration test for replay**
- Scenario:
  - find word -> overlay opens
  - close overlay
  - click found word in ProgressPanel
  - same video overlay opens again

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal wiring**
- In `GameShell`, derive found-word view model for `ProgressPanel`.
- Handle replay callback by opening overlay for requested found word id.
- Preserve existing input-lock and close transitions.

**Step 4: Re-run tests**
Run: `npm run test -- src/components/GameShell.video.integration.test.tsx src/components/GameShell.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/GameShell.tsx src/components/GameShell.video.integration.test.tsx src/components/GameShell.integration.test.tsx
git commit -m "feat: allow replay of found-word videos from progress panel"
```

### Task 4: Final Verification

**Files:**
- Optional Modify: `e2e/*` (only if regressions require explicit update)

**Step 1: Run focused suite**
Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/ProgressPanel.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 2: Run full unit/integration tests**
Run: `npm run test`  
Expected: PASS.

**Step 3: Run build**
Run: `npm run build`  
Expected: PASS.

**Step 4: Commit optional test updates (if any)**
```bash
git add e2e
git commit -m "test: update coverage for replayable video overlay flow"
```
(Only if test files changed.)
