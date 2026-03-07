# Media Overlay XOR Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Support XOR media per word (`video` or `image`) so correct word selection opens popup with the configured media type.

**Architecture:** Keep current gameplay/state flow and extend only data model, schema parser, and overlay rendering. Use discriminated union (`mediaType`) for type-safe branching in UI. Preserve key integration/e2e selectors to minimize test churn.

**Tech Stack:** React, TypeScript, Vitest, React Testing Library, Playwright.

---

### Task 1: Extend Domain Types to Discriminated Union

**Files:**
- Modify: `src/domain/types.ts`
- Test: `src/domain/loadLevel.test.ts`

**Step 1: Write failing type-aware tests**
- Add/adjust tests expecting parsed words to expose `mediaType`.

**Step 2: Run tests to verify fail**

Run: `npm run test -- src/domain/loadLevel.test.ts`  
Expected: FAIL.

**Step 3: Implement minimal type changes**
- Add `VideoWordDefinition`, `ImageWordDefinition`, union `WordDefinition`.
- Keep existing payload types aligned with static/dynamic modes.

**Step 4: Re-run tests**

Run: `npm run test -- src/domain/loadLevel.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/domain/types.ts src/domain/loadLevel.test.ts
git commit -m "feat: add xor media word types with discriminated union"
```

### Task 2: Enforce XOR Media in Level Schema Parser

**Files:**
- Modify: `src/domain/levelSchema.ts`
- Test: `src/domain/loadLevel.test.ts`

**Step 1: Add failing parser tests**
- Valid with only `videoSrc`.
- Valid with only `imageSrc`.
- Invalid with both fields.
- Invalid with neither.

**Step 2: Run tests and confirm fail**

Run: `npm run test -- src/domain/loadLevel.test.ts`  
Expected: FAIL.

**Step 3: Implement XOR parsing logic**
- Build `mediaType` at parse time.
- Throw explicit error for invalid XOR combinations.

**Step 4: Re-run tests**

Run: `npm run test -- src/domain/loadLevel.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/domain/levelSchema.ts src/domain/loadLevel.test.ts
git commit -m "feat: enforce xor media validation in level schema"
```

### Task 3: Update Overlay Component for Video/Image Branches

**Files:**
- Modify: `src/components/VideoOverlay.tsx` (or rename to `MediaOverlay.tsx` + adapter)
- Modify: `src/components/VideoOverlay.test.tsx`
- Modify: `src/styles.css` (only if new classes are needed)

**Step 1: Write failing component tests**
- Renders video branch when `mediaType='video'`.
- Renders image branch when `mediaType='image'`.
- Video error fallback works.
- Image error fallback works.

**Step 2: Run tests to verify fail**

Run: `npm run test -- src/components/VideoOverlay.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal branching logic**
- Keep backdrop and close button behavior unchanged.
- Keep existing test IDs where possible.
- Add `media-image` and `media-image-fallback` IDs.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/VideoOverlay.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/VideoOverlay.tsx src/components/VideoOverlay.test.tsx src/styles.css
git commit -m "feat: support image media branch in overlay popup"
```

### Task 4: Wire Updated Word Model Through GameShell

**Files:**
- Modify: `src/components/GameShell.tsx`
- Modify: `src/components/GameShell.video.integration.test.tsx`

**Step 1: Add failing integration test**
- Include one image-backed word in test fixture.
- Ensure selecting that word opens popup with image content.

**Step 2: Run tests and confirm fail**

Run: `npm run test -- src/components/GameShell.video.integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal shell updates**
- Ensure active word union is passed to overlay correctly.
- Do not alter reducer/gameplay semantics.

**Step 4: Re-run tests**

Run: `npm run test -- src/components/GameShell.video.integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/GameShell.tsx src/components/GameShell.video.integration.test.tsx
git commit -m "feat: wire xor media words through game shell overlay flow"
```

### Task 5: Update Level Content Fixtures

**Files:**
- Modify: `content/levels/level-01.json`
- Modify: `content/levels/level-test.json` (if used)
- Test: `src/domain/levelCatalog.test.ts`

**Step 1: Write/adjust failing tests for level payload compatibility**
- Ensure parser/catalog still resolves configured levels.

**Step 2: Run tests and confirm fail**

Run: `npm run test -- src/domain/levelCatalog.test.ts src/domain/loadLevel.test.ts`  
Expected: FAIL if fixtures are not aligned.

**Step 3: Migrate payloads**
- For each word set exactly one media field.
- Include at least one `imageSrc` word in test-oriented content.

**Step 4: Re-run tests**

Run: `npm run test -- src/domain/levelCatalog.test.ts src/domain/loadLevel.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add content/levels/level-01.json content/levels/level-test.json src/domain/levelCatalog.test.ts src/domain/loadLevel.test.ts
git commit -m "chore: migrate level fixtures to xor media content model"
```

### Task 6: E2E Coverage for Image Popup and Fallback

**Files:**
- Modify: `e2e/game-happy-path.spec.ts`
- Create: `e2e/image-fallback.spec.ts` (or extend existing spec)
- Modify: `playwright` snapshots only if visual assertions require updates

**Step 1: Add failing e2e case**
- Select image-backed word.
- Verify popup shows image branch.
- Trigger image error and verify fallback + continue.

**Step 2: Run targeted e2e and confirm fail**

Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts e2e/image-fallback.spec.ts`  
Expected: FAIL initially.

**Step 3: Implement minimal test-aligned updates**
- Adjust selectors/assertions to new branch.

**Step 4: Re-run targeted e2e**

Run: `npm run test:e2e -- e2e/game-happy-path.spec.ts e2e/image-fallback.spec.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add e2e/game-happy-path.spec.ts e2e/image-fallback.spec.ts
git commit -m "test: add e2e coverage for image overlay and fallback"
```

### Task 7: Full Verification Gate

**Files:**
- No new files required

**Step 1: Run full unit/integration**

Run: `npm run test`  
Expected: PASS.

**Step 2: Run full E2E**

Run: `npm run test:e2e`  
Expected: PASS.

**Step 3: Run build**

Run: `npm run build`  
Expected: PASS.

**Step 4: Commit verification checkpoint**

```bash
git add -A
git commit -m "chore: finalize xor media overlay verification"
```
