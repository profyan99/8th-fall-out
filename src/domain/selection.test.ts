import { describe, expect, test } from 'vitest';
import { buildSelectionPath } from './selection';

describe('buildSelectionPath', () => {
  test('generates horizontal path', () => {
    expect(buildSelectionPath({ row: 2, col: 1 }, { row: 2, col: 4 })).toEqual([
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 }
    ]);
  });

  test('generates vertical path', () => {
    expect(buildSelectionPath({ row: 1, col: 3 }, { row: 4, col: 3 })).toEqual([
      { row: 1, col: 3 },
      { row: 2, col: 3 },
      { row: 3, col: 3 },
      { row: 4, col: 3 }
    ]);
  });

  test('generates diagonal path', () => {
    expect(buildSelectionPath({ row: 1, col: 1 }, { row: 4, col: 4 })).toEqual([
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 4 }
    ]);
  });

  test('supports reverse drag path', () => {
    expect(buildSelectionPath({ row: 4, col: 4 }, { row: 1, col: 1 })).toEqual([
      { row: 4, col: 4 },
      { row: 3, col: 3 },
      { row: 2, col: 2 },
      { row: 1, col: 1 }
    ]);
  });

  test('rejects non-straight lines', () => {
    expect(buildSelectionPath({ row: 0, col: 0 }, { row: 2, col: 3 })).toBeNull();
  });

  test('interpolates skipped cells', () => {
    expect(buildSelectionPath({ row: 0, col: 0 }, { row: 0, col: 3 })).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 }
    ]);
  });
});
