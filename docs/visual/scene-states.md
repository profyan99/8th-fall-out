# CRT Scene Visual States

Visual regression coverage is defined in `e2e/visual/visual-states.spec.ts`.

Captured states:

- `boot-start` - boot overlay appears before gameplay input.
- `boot-finish` - boot overlay hidden, scene warmed up.
- `playing` - default gameplay view in monitor shell.
- `video-overlay` - signal-capture dialog state.
- `completion` - final terminal completion banner.

## Updating snapshots intentionally

When visual changes are expected, update baseline snapshots:

```bash
npx playwright test e2e/visual/visual-states.spec.ts --update-snapshots
```

Then verify all E2E tests still pass:

```bash
npm run test:e2e
```
