# Cyrillic Grid Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add support for Cyrillic letters in generated word grids while preserving existing Latin behavior.

**Architecture:** Extend grid generation with explicit alphabet mode (`latin` or `cyrillic`) and locale-aware uppercasing. Keep path-based gameplay logic unchanged. Make payload parsing choose alphabet explicitly (or via safe default) without breaking existing levels.

**Tech Stack:** React, TypeScript, Vitest, Vite.

---

### Task 1: Add Alphabet Mode To Generator API

**Files:**
- Modify: `src/domain/generateGrid.ts`
- Modify: `src/domain/generateGrid.test.ts`

**Step 1: Write failing tests for alphabet-aware generation**
- Cover:
  - `alphabet: 'latin'` fills random cells using `A-Z`
  - `alphabet: 'cyrillic'` fills random cells using Russian uppercase letters
  - generated words in Cyrillic are placed and extracted correctly from paths

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/domain/generateGrid.test.ts`  
Expected: FAIL.

**Step 3: Implement minimal alphabet support**
- Add `alphabet` option to `generateGridFromWords`.
- Add alphabet tables:
  - Latin: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
  - Cyrillic: `АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ`
- Use locale-aware normalization:
  - Latin path: standard uppercase
  - Cyrillic path: `toLocaleUpperCase('ru-RU')`

**Step 4: Re-run tests**
Run: `npm run test -- src/domain/generateGrid.test.ts`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/domain/generateGrid.ts src/domain/generateGrid.test.ts
git commit -m "feat: add latin/cyrillic alphabet support to grid generation"
```

### Task 2: Support Cyrillic In Dynamic Level Payload Parsing

**Files:**
- Modify: `src/domain/levelSchema.ts`
- Modify: `src/domain/loadLevel.test.ts`

**Step 1: Write failing payload tests**
- Add dynamic-level payload case with Cyrillic words.
- Verify generated grid is 10x10 and selected words are Cyrillic uppercase.
- Verify backward compatibility with existing payloads.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/domain/loadLevel.test.ts`  
Expected: FAIL.

**Step 3: Implement minimal schema integration**
- Add optional payload field: `alphabet?: 'latin' | 'cyrillic'`.
- Pass alphabet to `generateGridFromWords`.
- Default to `latin` when field is absent (for backward compatibility).

**Step 4: Re-run tests**
Run: `npm run test -- src/domain/loadLevel.test.ts`  
Expected: PASS.

**Step 5: Commit**
```bash
git add src/domain/levelSchema.ts src/domain/loadLevel.test.ts
git commit -m "feat: support cyrillic alphabet option in dynamic level payloads"
```

### Task 3: Add Cyrillic Test Level Fixture

**Files:**
- Create: `content/levels/level-ru-test.json`
- Modify: `src/domain/levelCatalog.ts`
- Modify: `src/domain/levelCatalog.test.ts`

**Step 1: Write failing catalog tests**
- Assert `?level=ru-test` resolves successfully.
- Assert payload can be loaded through existing flow.

**Step 2: Run tests and confirm fail**
Run: `npm run test -- src/domain/levelCatalog.test.ts`  
Expected: FAIL.

**Step 3: Implement fixture wiring**
- Create Cyrillic dynamic level fixture with `gridSize: 10`, `alphabet: 'cyrillic'`, `seed`, and Cyrillic words.
- Register it in level catalog map.

**Step 4: Re-run tests**
Run: `npm run test -- src/domain/levelCatalog.test.ts src/domain/loadLevel.test.ts`  
Expected: PASS.

**Step 5: Commit**
```bash
git add content/levels/level-ru-test.json src/domain/levelCatalog.ts src/domain/levelCatalog.test.ts src/domain/loadLevel.test.ts
git commit -m "feat: add cyrillic dynamic test level and catalog mapping"
```

### Task 4: Full Verification

**Files:**
- Optional modify: `README.md` (if documenting `alphabet` field)

**Step 1: Run domain-focused regression**
Run: `npm run test -- src/domain/generateGrid.test.ts src/domain/loadLevel.test.ts src/domain/levelCatalog.test.ts`  
Expected: PASS.

**Step 2: Run full test suite**
Run: `npm run test`  
Expected: PASS.

**Step 3: Run build**
Run: `npm run build`  
Expected: PASS.

**Step 4: Commit docs updates (only if changed)**
```bash
git add README.md
git commit -m "docs: describe alphabet option for dynamic level generation"
```
