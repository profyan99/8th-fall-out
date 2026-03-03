import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import type { WordDefinition } from '../domain/types';
import { VideoOverlay } from './VideoOverlay';

const word: WordDefinition = {
  id: 'word-1',
  value: 'ALPHA',
  videoSrc: '/videos/alpha.mp4',
  path: [
    { row: 0, col: 0 },
    { row: 0, col: 1 }
  ]
};

describe('VideoOverlay', () => {
  test('renders video modal and word label', () => {
    render(<VideoOverlay word={word} onClose={() => undefined} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/ALPHA/i)).toBeInTheDocument();
    expect(screen.getByTestId('video-element')).toHaveAttribute('src', '/videos/alpha.mp4');
  });

  test('shows fallback UI on video error and allows continue', () => {
    const onClose = vi.fn();
    render(<VideoOverlay word={word} onClose={onClose} />);

    fireEvent.error(screen.getByTestId('video-element'));

    expect(screen.getByTestId('video-fallback')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
