import { describe, expect, test } from 'vitest';
import type { LevelDefinition } from './types';
import { createInitialGameState, reduceGameState } from './gameState';

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

describe('reduceGameState', () => {
  test('transitions idle to selecting', () => {
    const initial = createInitialGameState(level);

    const next = reduceGameState(initial, {
      type: 'selection_started',
      path: [{ row: 0, col: 0 }]
    });

    expect(next.phase).toBe('selecting');
    expect(next.activeSelection).toEqual([{ row: 0, col: 0 }]);
  });

  test('transitions selecting to found and video_open', () => {
    const selecting = {
      ...createInitialGameState(level),
      phase: 'selecting' as const,
      activeSelection: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 }
      ]
    };

    const next = reduceGameState(selecting, {
      type: 'selection_committed',
      path: selecting.activeSelection
    });

    expect(next.phase).toBe('video_open');
    expect(next.activeVideoWordId).toBe('word-alpha');
    expect(next.foundWordIds.has('word-alpha')).toBe(true);
  });

  test('transitions video_open to idle on close', () => {
    const withVideo = {
      ...createInitialGameState(level),
      phase: 'video_open' as const,
      activeVideoWordId: 'word-alpha',
      foundWordIds: new Set(['word-alpha'])
    };

    const next = reduceGameState(withVideo, { type: 'video_closed' });
    expect(next.phase).toBe('completed');
    expect(next.activeVideoWordId).toBeNull();
  });

  test('keeps video_open state when selection input arrives', () => {
    const withVideo = {
      ...createInitialGameState(level),
      phase: 'video_open' as const,
      activeVideoWordId: 'word-alpha',
      foundWordIds: new Set(['word-alpha'])
    };

    const next = reduceGameState(withVideo, {
      type: 'selection_started',
      path: [{ row: 1, col: 1 }]
    });

    expect(next.phase).toBe('video_open');
    expect(next.activeSelection).toEqual([]);
  });

  test('transitions to completed when all words found', () => {
    const selecting = {
      ...createInitialGameState(level),
      phase: 'selecting' as const,
      activeSelection: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 }
      ]
    };

    const afterCommit = reduceGameState(selecting, {
      type: 'selection_committed',
      path: selecting.activeSelection
    });

    const completed = reduceGameState(afterCommit, { type: 'video_closed' });
    expect(completed.phase).toBe('completed');
  });
});
