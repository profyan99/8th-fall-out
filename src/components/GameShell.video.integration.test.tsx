import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import type { LevelDefinition } from '../domain/types';
import { GameShell } from './GameShell';

const level: LevelDefinition = {
  id: 'level-01',
  title: 'Video Integration',
  grid: [
    'ALPHABET',
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
    },
    {
      id: 'word-beta',
      value: 'BETA',
      videoSrc: '/videos/beta.mp4',
      path: [
        { row: 0, col: 5 },
        { row: 0, col: 6 },
        { row: 0, col: 7 }
      ]
    }
  ]
};

describe('GameShell video flow', () => {
  test('opens overlay on found word, allows replay from progress panel, and blocks input until close', () => {
    render(<GameShell level={level} />);

    const canvas = screen.getByTestId('grid-canvas');
    const hazeLayer = screen.getByTestId('parallax-layer-3');

    fireEvent.mouseDown(canvas, { offsetX: 10, offsetY: 10, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 390, offsetY: 10, clientX: 390, clientY: 10 });
    fireEvent.mouseUp(canvas);

    expect(hazeLayer).toHaveStyle({ pointerEvents: 'none' });
    expect(canvas).toHaveAttribute('data-grid-pulse', 'steady');
    expect(screen.getByRole('dialog')).toHaveClass('video-overlay-lg');
    expect(screen.getByTestId('video-overlay-backdrop')).toHaveClass('signal-state-capture');
    expect(screen.getByRole('dialog')).toHaveClass('signal-state-locked');
    expect(screen.getByTestId('video-close-button')).toHaveClass('terminal-action-button');
    expect(screen.getByTestId('grid-canvas')).toHaveAttribute('data-input-blocked', 'true');

    fireEvent.mouseDown(canvas, { offsetX: 450, offsetY: 10, clientX: 450, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 690, offsetY: 10, clientX: 690, clientY: 10 });
    fireEvent.mouseUp(canvas);

    expect(screen.getByTestId('progress-text')).toHaveTextContent('WORDS: 1 OF 2');

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    fireEvent.click(screen.getByRole('button', { name: 'ALPHA' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('video-element')).toHaveAttribute('src', '/videos/alpha.mp4');
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    fireEvent.mouseDown(canvas, { offsetX: 450, offsetY: 10, clientX: 450, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 690, offsetY: 10, clientX: 690, clientY: 10 });
    fireEvent.mouseUp(canvas);

    expect(screen.getByTestId('progress-text')).toHaveTextContent('WORDS: 2 OF 2');
  });
});
