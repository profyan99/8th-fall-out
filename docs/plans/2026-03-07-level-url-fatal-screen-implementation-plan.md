# URL Level Routing With Fallout Fatal Screen Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Require `?level=<name>` for every launch and show a Fallout-style fatal screen when level is missing or unknown.

**Architecture:** Replace default-level fallback with explicit level resolution result (`success` / `error`). App becomes a small router: render `GameShell` only on success, render `LevelFatalScreen` on error. Keep gameplay/domain mechanics unchanged.

**Tech Stack:** React, TypeScript, CSS, Vitest, React Testing Library, Vite.

---

### Task 1: Introduce Explicit Level Resolve Contract (No Fallback)

**Files:**
- Modify: `src/domain/levelCatalog.ts`
- Modify: `src/domain/levelCatalog.test.ts`

**Step 1: Write failing tests for missing/unknown level behavior**
- Cover:
  - `missing_level` when `?level` absent
  - `missing_level` when `?level=` empty/whitespace
  - `unknown_level` for unknown key
  - success for known key

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/domain/levelCatalog.test.ts`  
Expected: FAIL.

**Step 3: Implement resolver result type and strict URL handling**
- Normalize level key (`trim().toLowerCase()`).
- Return explicit object:
  - success: `{ status: 'ok', payload, levelKey }`
  - error: `{ status: 'error', reason: 'missing_level' | 'unknown_level', requestedLevel }`
- Remove default fallback behavior.

**Step 4: Re-run tests**
Run: `npm run test -- src/domain/levelCatalog.test.ts`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/domain/levelCatalog.ts src/domain/levelCatalog.test.ts
git commit -m "feat: require explicit level query and return resolver errors"
```

### Task 2: Add Fallout-Style Fatal Screen Component

**Files:**
- Create: `src/components/LevelFatalScreen.tsx`
- Create: `src/components/LevelFatalScreen.test.tsx`
- Modify: `src/styles.css`

**Step 1: Write failing component tests**
- Render alarm title, error reason text, and URL hint.
- Ensure `role="alert"` exists.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/components/LevelFatalScreen.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal fatal screen**
- Props:
  - `reason: 'missing_level' | 'unknown_level'`
  - `requestedLevel?: string | null`
  - `availableLevels: string[]`
- Copy requirements:
  - Title: `FATAL SYSTEM EXCEPTION`
  - Missing: `LEVEL IDENTIFIER NOT PROVIDED`
  - Unknown: `LEVEL IDENTIFIER NOT RECOGNIZED`
  - Hint: `Launch with: /?level=<name>`

**Step 4: Add Fallout terminal styles**
- Add dedicated fatal-screen classes to `styles.css`.
- Keep styles isolated from game scene layout.

**Step 5: Re-run tests**
Run: `npm run test -- src/components/LevelFatalScreen.test.tsx`  
Expected: PASS.

**Step 6: Commit**
```bash
git add src/components/LevelFatalScreen.tsx src/components/LevelFatalScreen.test.tsx src/styles.css
git commit -m "feat: add fallout-style fatal screen for level routing errors"
```

### Task 3: Wire App Routing (Fatal Screen vs Game)

**Files:**
- Modify: `src/App.tsx`
- Create or Modify Test: `src/App.test.tsx` (or app integration test file)

**Step 1: Write failing app-level tests**
- Without `?level`: fatal screen shown, game not shown.
- With unknown `?level`: fatal screen shown.
- With known `?level=test`: game shown.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/App.test.tsx`  
Expected: FAIL.

**Step 3: Implement App routing logic**
- Use `resolveLevelPayload(window.location.search)` result.
- On `status: 'error'`: render `LevelFatalScreen`.
- On `status: 'ok'`: call `loadLevel` and render `GameShell`.

**Step 4: Re-run target tests**
Run: `npm run test -- src/App.test.tsx`  
Expected: PASS.

**Step 5: Run domain + app smoke**
Run: `npm run test -- src/domain/levelCatalog.test.ts src/App.test.tsx`  
Expected: PASS.

**Step 6: Commit**
```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: route app to fatal screen when level query is missing or invalid"
```

### Task 4: Full Verification

**Files:**
- No new files required unless small README note is added.

**Step 1: Run full unit/integration suite**
Run: `npm run test`  
Expected: PASS.

**Step 2: Run build**
Run: `npm run build`  
Expected: PASS.

**Step 3: Commit verification/docs updates if any**
```bash
git add README.md
git commit -m "docs: clarify mandatory level query in launch url"
```
(Only if docs changed.)
