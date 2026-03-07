# Severance Word Game (MVP)

Desktop-only browser word game inspired by Severance-style UI.

## Scripts

- `npm run dev` - run local dev server
- `npm run test` - run Vitest test suite
- `npm run test:e2e` - run Playwright end-to-end tests
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npx playwright test e2e/visual/visual-states.spec.ts` - run visual state regression checks
- `npx playwright test e2e/visual/visual-states.spec.ts --update-snapshots` - intentionally refresh visual baselines

## Gameplay

- Drag-select words in straight lines (8 directions)
- Boot sequence gates input before the game starts
- Found words open per-word video overlays
- Close/continue resumes the game
- Completion banner appears when all words are found

## CRT Polish v3 Scope

- Cinematic polish updates are limited to scene/fx/terminal styling and hooks.
- Gameplay/domain logic and rules remain unchanged.

## Content

Level data comes from JSON files in `content/levels`.
