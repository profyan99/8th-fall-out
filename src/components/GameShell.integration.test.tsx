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
      mediaType: 'video',
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
  test('marks a word as found after valid drag path and keeps backdrop non-interactive', () => {
    render(<GameShell level={level} />);

    const canvas = screen.getByTestId('grid-canvas');
    const backdrop = screen.getByTestId('global-parallax-backdrop');
    const decorLayer = screen.getByTestId('parallax-layer-2');

    fireEvent.mouseDown(canvas, { offsetX: 10, offsetY: 10, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 390, offsetY: 10, clientX: 390, clientY: 10 });
    fireEvent.mouseUp(canvas);

    expect(canvas).toHaveAttribute('data-layout-mode', 'viewport-fit');
    expect(canvas).toHaveAttribute('data-grid-highlight', 'phosphor-v2');
    expect(backdrop).toHaveStyle({ pointerEvents: 'none' });
    expect(decorLayer).toHaveStyle({ pointerEvents: 'none' });
    expect(screen.getByTestId('progress-text')).toHaveTextContent('WORDS INDEXED: 1 OF 1');
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.getByTestId('completion-banner')).toHaveTextContent('8 March transmission complete');
  });
});
