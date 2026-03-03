import { describe, expect, test } from 'vitest';
import { loadLevel } from './loadLevel';

describe('loadLevel', () => {
  test('parses valid level JSON', () => {
    const level = loadLevel({
      id: 'level-01',
      title: 'Wellness Session',
      grid: [
        'ABCDWXYZ',
        'EFGHQRST',
        'IJKLUVWX',
        'MNOPABCD',
        'QRSTEFGH',
        'UVWXIJKL',
        'YZABMNOP',
        'CDEFQRST'
      ],
      words: [
        {
          id: 'word-1',
          value: 'ABCD',
          videoSrc: '/video/word-1.mp4',
          path: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 }
          ]
        }
      ]
    });

    expect(level.id).toBe('level-01');
    expect(level.gridSize).toBe(8);
    expect(level.words).toHaveLength(1);
  });

  test('throws on malformed word path', () => {
    expect(() =>
      loadLevel({
        id: 'bad-level',
        title: 'Bad',
        grid: Array.from({ length: 8 }, () => 'ABCDEFGH'),
        words: [
          {
            id: 'word-1',
            value: 'AB',
            videoSrc: '/video/word.mp4',
            path: [{ row: 0 }]
          }
        ]
      })
    ).toThrow(/word path/i);
  });

  test('throws on unsupported grid size', () => {
    expect(() =>
      loadLevel({
        id: 'bad-grid',
        title: 'Bad grid',
        grid: Array.from({ length: 7 }, () => 'ABCDEFG'),
        words: []
      })
    ).toThrow(/grid size/i);
  });
});
