import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import type { WordDefinition } from '../domain/types';
import { ru } from '../i18n/ru';
import { VideoOverlay } from './VideoOverlay';

const word: WordDefinition = {
  id: 'word-1',
  value: 'ALPHA',
  mediaType: 'video',
  videoSrc: '/videos/alpha.mp4',
  path: [
    { row: 0, col: 0 },
    { row: 0, col: 1 }
  ]
};

const imageWord: WordDefinition = {
  id: 'word-2',
  value: 'POSTER',
  mediaType: 'image',
  imageSrc: '/images/poster.png',
  path: [
    { row: 0, col: 0 },
    { row: 0, col: 1 }
  ]
};

describe('VideoOverlay', () => {
  test('renders video modal and word label', () => {
    render(<VideoOverlay word={word} onClose={() => undefined} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveClass('video-overlay-lg');
    expect(dialog).toHaveClass('video-overlay-viewport-fit');
    expect(screen.getByText(`${ru.overlay.signalLock}: ${word.value}`)).toBeInTheDocument();
    expect(screen.getByTestId('video-overlay-media')).toHaveClass('video-overlay-media-bounded');
    expect(screen.getByTestId('video-element')).toHaveAttribute('src', expect.stringMatching(/\/videos\/alpha\.mp4$/));
    expect(screen.getByTestId('video-element')).toHaveClass('video-player-fit');
    expect(screen.getByTestId('video-overlay-backdrop')).toHaveClass('signal-state-capture');
    expect(screen.getByTestId('video-close-button')).toHaveClass('terminal-action-button');
    expect(screen.getByRole('button', { name: ru.overlay.close })).toBeInTheDocument();
    expect(dialog).toHaveClass('signal-state-locked');
  });

  test('shows fallback UI on video error and allows continue', () => {
    const onClose = vi.fn();
    render(<VideoOverlay word={word} onClose={onClose} />);

    fireEvent.error(screen.getByTestId('video-element'));

    expect(screen.getByTestId('video-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('video-overlay-backdrop')).toHaveClass('signal-state-loss');
    const continueButton = screen.getByRole('button', { name: ru.overlay.continue });
    expect(continueButton).toHaveClass('terminal-action-button');
    fireEvent.click(continueButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders image branch when mediaType is image', () => {
    render(<VideoOverlay word={imageWord} onClose={() => undefined} />);

    expect(screen.queryByTestId('video-element')).not.toBeInTheDocument();
    expect(screen.getByTestId('media-image')).toHaveAttribute('src', expect.stringMatching(/\/images\/poster\.png$/));
    expect(screen.getByTestId('video-overlay-backdrop')).toHaveClass('signal-state-capture');
  });

  test('shows image fallback UI on image load error and allows continue', () => {
    const onClose = vi.fn();
    render(<VideoOverlay word={imageWord} onClose={onClose} />);

    fireEvent.error(screen.getByTestId('media-image'));

    expect(screen.getByTestId('media-image-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('video-overlay-backdrop')).toHaveClass('signal-state-loss');
    fireEvent.click(screen.getByRole('button', { name: ru.overlay.continue }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
