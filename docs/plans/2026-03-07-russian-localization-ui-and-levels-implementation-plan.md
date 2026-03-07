# Russian Localization (UI + Levels) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Localize user-facing UI text and level content to Russian while preserving current gameplay behavior.

**Architecture:** Introduce a centralized Russian string dictionary and replace hardcoded UI copy in presentation components. Update level payload content fields (`title`, `words[].value`) to Russian without changing technical identifiers or game logic.

**Tech Stack:** React, TypeScript, JSON content payloads, Vitest, React Testing Library, Playwright.

---

### Task 1: Add Centralized Russian Dictionary

**Files:**
- Create: `src/i18n/ru.ts`
- Test: `src/components/terminal/TerminalHud.test.tsx`
- Test: `src/components/ProgressPanel.test.tsx`

**Step 1: Write failing tests referencing Russian labels**
- Assert expected Russian labels are rendered (through components).

**Step 2: Run tests and confirm fail**

Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`  
Expected: FAIL.

**Step 3: Add minimal dictionary module**
- Export UI strings for HUD, progress, buttons, completion, and fallback messages.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`  
Expected: PASS (or partially pass depending on next task).

**Step 5: Commit**

```bash
git add src/i18n/ru.ts src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx
git commit -m "feat: add centralized russian ui dictionary"
```

### Task 2: Localize Terminal HUD and Progress Panel

**Files:**
- Modify: `src/components/terminal/TerminalHud.tsx`
- Modify: `src/components/ProgressPanel.tsx`
- Test: `src/components/terminal/TerminalHud.test.tsx`
- Test: `src/components/ProgressPanel.test.tsx`

**Step 1: Add/adjust failing tests for Russian copy**
- HUD labels in Russian.
- Progress text uses Russian wording.
- Replay entry button label remains `%word%` and surrounding UI is Russian.

**Step 2: Run tests and verify fail**

Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal copy replacement**
- Pull strings from `src/i18n/ru.ts`.
- Keep existing test IDs unchanged.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/terminal/TerminalHud.tsx src/components/ProgressPanel.tsx src/components/terminal/TerminalHud.test.tsx src/components/ProgressPanel.test.tsx
git commit -m "feat: localize terminal hud and progress panel to russian"
```

### Task 3: Localize Overlay and Completion Copy

**Files:**
- Modify: `src/components/VideoOverlay.tsx` (or media overlay component used)
- Modify: `src/components/GameShell.tsx`
- Modify: `src/components/terminal/BootOverlay.tsx` (if boot lines are user-facing)
- Test: `src/components/VideoOverlay.test.tsx`
- Test: `src/components/GameShell.integration.test.tsx`
- Test: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Add failing tests for Russian overlay/completion strings**
- Close/Continue/fallback in Russian.
- Completion banner in Russian.

**Step 2: Run tests and confirm fail**

Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal localization updates**
- Use dictionary strings.
- Keep all existing behavior and test IDs.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/VideoOverlay.test.tsx src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/VideoOverlay.tsx src/components/GameShell.tsx src/components/terminal/BootOverlay.tsx src/components/VideoOverlay.test.tsx src/components/GameShell.integration.test.tsx src/components/GameShell.video.integration.test.tsx
git commit -m "feat: localize overlay and completion messages to russian"
```

### Task 4: Translate Level Content Payloads

**Files:**
- Modify: `content/levels/level-01.json`
- Modify: `content/levels/level-test.json`
- Test: `src/domain/loadLevel.test.ts`
- Test: `src/domain/levelCatalog.test.ts`

**Step 1: Add/adjust failing tests for Russian content compatibility**
- Ensure parser still loads levels with Russian `title` and `value`.

**Step 2: Run tests and verify fail**

Run: `npm run test -- src/domain/loadLevel.test.ts src/domain/levelCatalog.test.ts`  
Expected: FAIL if assertions still expect English content.

**Step 3: Implement content translation**
- Translate user-facing `title` and `value`.
- Preserve `id`, media fields, and path correctness.

**Step 4: Re-run tests**

Run: `npm run test -- src/domain/loadLevel.test.ts src/domain/levelCatalog.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add content/levels/level-01.json content/levels/level-test.json src/domain/loadLevel.test.ts src/domain/levelCatalog.test.ts
git commit -m "chore: translate level titles and words to russian"
```

### Task 5: E2E Text Expectations and Visual Baselines

**Files:**
- Modify: `e2e/game-happy-path.spec.ts`
- Modify: `e2e/video-fallback.spec.ts`
- Modify: `e2e/visual/visual-states.spec.ts` (if text assertions/snapshots are affected)
- Modify: `e2e/visual/visual-states.spec.ts-snapshots/*.png` (if regenerated)

**Step 1: Add failing e2e assertions for Russian UI strings**
- Verify Russian labels appear in key flow states.

**Step 2: Run targeted e2e and confirm fail**

Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts e2e/video-fallback.spec.ts`  
Expected: FAIL.

**Step 3: Update e2e expectations**
- Replace English assertions with Russian copy.

**Step 4: Re-run targeted e2e**

Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts e2e/video-fallback.spec.ts`  
Expected: PASS.

**Step 5: Refresh visual snapshots only if needed**

Run: `npm run test:e2e -- e2e/visual/visual-states.spec.ts --update-snapshots`  
Expected: PASS with new baselines (if text changed visuals).

**Step 6: Commit**

```bash
git add e2e/game-happy-path.spec.ts e2e/video-fallback.spec.ts e2e/visual/visual-states.spec.ts e2e/visual/visual-states.spec.ts-snapshots
git commit -m "test: align e2e and visual baselines with russian localization"
```

### Task 6: Full Verification Gate

**Files:**
- No new files required

**Step 1: Run full unit/integration**

Run: `npm run test`  
Expected: PASS.

**Step 2: Run full e2e**

Run: `npm run test:e2e`  
Expected: PASS.

**Step 3: Run build**

Run: `npm run build`  
Expected: PASS.

**Step 4: Commit final checkpoint**

```bash
git add -A
git commit -m "chore: finalize russian localization for ui and level content"
```
