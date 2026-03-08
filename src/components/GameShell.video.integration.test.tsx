import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import type { LevelDefinition } from '../domain/types';
import { ru } from '../i18n/ru';
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
      mediaType: 'video',
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
      mediaType: 'image',
      imageSrc: '/images/beta.png',
      path: [
        { row: 0, col: 5 },
        { row: 0, col: 6 },
        { row: 0, col: 7 }
      ]
    }
  ]
};

describe('GameShell video flow', () => {
  test('opens overlay on found word, supports image-backed word, allows replay, and blocks input until close', () => {
    render(<GameShell level={level} />);

    const canvas = screen.getByTestId('grid-canvas');
    const hazeLayer = screen.getByTestId('parallax-layer-3');

    fireEvent.mouseDown(canvas, { offsetX: 450, offsetY: 10, clientX: 450, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 690, offsetY: 10, clientX: 690, clientY: 10 });
    fireEvent.mouseUp(canvas);

    expect(hazeLayer).toHaveStyle({ pointerEvents: 'none' });
    expect(canvas).toHaveAttribute('data-grid-pulse', 'steady');
    expect(screen.getByRole('dialog')).toHaveClass('video-overlay-lg');
    expect(screen.getByTestId('video-overlay-backdrop')).toHaveClass('signal-state-capture');
    expect(screen.getByRole('dialog')).toHaveClass('signal-state-locked');
    expect(screen.getByTestId('video-close-button')).toHaveClass('terminal-action-button');
    expect(screen.getByTestId('media-image')).toHaveAttribute('src', expect.stringMatching(/\/images\/beta\.png$/));
    expect(screen.getByTestId('progress-text')).toHaveTextContent(`${ru.progress.words}: 1 ${ru.progress.of} 2`);
    expect(screen.getByTestId('grid-canvas')).toHaveAttribute('data-input-blocked', 'true');

    fireEvent.mouseDown(canvas, { offsetX: 10, offsetY: 10, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 390, offsetY: 10, clientX: 390, clientY: 10 });
    fireEvent.mouseUp(canvas);
    expect(screen.getByTestId('media-image')).toHaveAttribute('src', expect.stringMatching(/\/images\/beta\.png$/));

    fireEvent.click(screen.getByRole('button', { name: ru.overlay.close }));
    fireEvent.click(screen.getByRole('button', { name: /^beta$/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('media-image')).toHaveAttribute('src', expect.stringMatching(/\/images\/beta\.png$/));
    fireEvent.click(screen.getByRole('button', { name: ru.overlay.close }));

    fireEvent.mouseDown(canvas, { offsetX: 10, offsetY: 10, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { offsetX: 390, offsetY: 10, clientX: 390, clientY: 10 });
    fireEvent.mouseUp(canvas);

    expect(screen.getByTestId('progress-text')).toHaveTextContent(`${ru.progress.words}: 2 ${ru.progress.of} 2`);
  });
});
