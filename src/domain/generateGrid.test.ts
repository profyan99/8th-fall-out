import { describe, expect, test } from 'vitest';
import { generateGridFromWords } from './generateGrid';

describe('generateGridFromWords', () => {
  const words = [
    { id: 'w1', value: 'HELIO', videoSrc: '/videos/helio.mp4' },
    { id: 'w2', value: 'TRACE', videoSrc: '/videos/trace.mp4' },
    { id: 'w3', value: 'SNOW', videoSrc: '/videos/snow.mp4' }
  ];

  test('generates deterministic grid and paths for the same seed', () => {
    const first = generateGridFromWords({ words, gridSize: 10, seed: 'alpha' });
    const second = generateGridFromWords({ words, gridSize: 10, seed: 'alpha' });

    expect(first.grid).toEqual(second.grid);
    expect(first.words.map((word) => word.path)).toEqual(second.words.map((word) => word.path));
  });

  test('creates a 10x10 grid and fills all cells with letters', () => {
    const result = generateGridFromWords({ words, gridSize: 10, seed: 'fill' });

    expect(result.grid).toHaveLength(10);
    for (const row of result.grid) {
      expect(row).toHaveLength(10);
      expect(row).toMatch(/^[A-Z]+$/);
    }
  });

  test('returns valid paths that map to the original words in the generated grid', () => {
    const result = generateGridFromWords({ words, gridSize: 10, seed: 'paths' });

    for (const word of result.words) {
      const extracted = word.path.map((cell) => result.grid[cell.row][cell.col]).join('');
      expect(extracted).toBe(word.value.toUpperCase());
    }
  });

  test('stores generated word paths in forward canonical direction', () => {
    const result = generateGridFromWords({
      words: [
        { id: 'word-alpha', value: 'ALPHA', videoSrc: '/videos/alpha.mp4' },
        { id: 'word-beta', value: 'BETA', videoSrc: '/videos/beta.mp4' }
      ],
      gridSize: 10,
      seed: 'test-level-seed'
    });

    for (const word of result.words) {
      const start = word.path[0];
      const end = word.path[word.path.length - 1];
      const isForward = end.row > start.row || (end.row === start.row && end.col >= start.col);
      expect(isForward).toBe(true);
    }
  });
});
