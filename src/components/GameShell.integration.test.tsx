import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import type { LevelDefinition } from '../domain/types';
import { GameShell } from './GameShell';

const level: LevelDefinition = {
  id: 'level-01',
  title: 'Integration',
  grid: [
    'ALPHAXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX'
  ],
  gridSize: 8,
  words: [
    {
      id: 'word-alpha',
      value: 'ALPHA',
      videoSrc: '/videos/alpha.mp4',
      path: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 }
      ]
    }
  ]
};

describe('GameShell drag integration', () => {
  test('marks a word as found after valid drag path', () => {
    render(<GameShell level={level} />);

    const canvas = screen.getByTestId('grid-canvas');

    fireEvent.mouseDown(canvas, { offsetX: 10, offsetY: 10, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 390, offsetY: 10, clientX: 390, clientY: 10 });
    expect(screen.getByTestId('grid-canvas-selection')).toHaveTextContent('selection:5');
    fireEvent.mouseUp(canvas);

    expect(screen.getByTestId('progress-text')).toHaveTextContent('1/1 words found');
  });
});
