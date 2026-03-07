import { describe, expect, test } from 'vitest';
import type { LevelDefinition } from './types';
import { validateSelection } from './wordValidation';

const level: LevelDefinition = {
  id: 'level-01',
  title: 'Test',
  grid: Array.from({ length: 8 }, () => 'ABCDEFGH'),
  gridSize: 8,
  words: [
    {
      id: 'word-alpha',
      value: 'ALPHA',
      mediaType: 'video',
      videoSrc: '/videos/alpha.mp4',
      path: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 }
      ]
    }
  ]
};

describe('validateSelection', () => {
  test('matches forward path', () => {
    const result = validateSelection(level, new Set(), [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 }
    ]);

    expect(result.status).toBe('found');
    expect(result.word?.id).toBe('word-alpha');
  });

  test('matches reverse path', () => {
    const result = validateSelection(level, new Set(), [
      { row: 0, col: 2 },
      { row: 0, col: 1 },
      { row: 0, col: 0 }
    ]);

    expect(result.status).toBe('found');
    expect(result.word?.id).toBe('word-alpha');
  });

  test('handles duplicate word selection', () => {
    const result = validateSelection(level, new Set(['word-alpha']), [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 }
    ]);

    expect(result.status).toBe('duplicate');
  });

  test('handles miss selection', () => {
    const result = validateSelection(level, new Set(), [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 }
    ]);

    expect(result.status).toBe('miss');
  });
});
