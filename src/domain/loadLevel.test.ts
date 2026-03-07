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

  test('generates grid and paths for dynamic 10x10 level payload with words only', () => {
    const level = loadLevel({
      id: 'generated-10',
      title: 'Generated',
      gridSize: 10,
      seed: 'seed-1',
      words: [
        { id: 'w1', value: 'HELIO', videoSrc: '/videos/helio.mp4' },
        { id: 'w2', value: 'TRACE', videoSrc: '/videos/trace.mp4' }
      ]
    });

    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    expect(level.words[0].path.length).toBe(level.words[0].value.length);
    expect(level.words[1].path.length).toBe(level.words[1].value.length);
  });

  test('supports dynamic 10x10 cyrillic payload with explicit alphabet', () => {
    const level = loadLevel({
      id: 'generated-ru',
      title: 'Generated RU',
      gridSize: 10,
      alphabet: 'cyrillic',
      seed: 'ru-seed',
      words: [
        { id: 'w1', value: 'лампа', videoSrc: '/videos/lampa.mp4' },
        { id: 'w2', value: 'сигнал', videoSrc: '/videos/signal.mp4' }
      ]
    });

    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    for (const row of level.grid) {
      expect(row).toHaveLength(10);
      expect(row).toMatch(/^[А-ЯЁ]+$/);
    }
    for (const word of level.words) {
      expect(word.value).toBe(word.value.toLocaleUpperCase('ru-RU'));
    }
  });

  test('keeps dynamic payload backward compatible when alphabet is omitted', () => {
    const level = loadLevel({
      id: 'generated-latin-default',
      title: 'Generated Latin',
      gridSize: 10,
      seed: 'latin-default',
      words: [
        { id: 'w1', value: 'helio', videoSrc: '/videos/helio.mp4' },
        { id: 'w2', value: 'trace', videoSrc: '/videos/trace.mp4' }
      ]
    });

    expect(level.gridSize).toBe(10);
    for (const row of level.grid) {
      expect(row).toMatch(/^[A-Z]+$/);
    }
  });
});
