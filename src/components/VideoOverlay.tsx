import { useState } from 'react';
import type { WordDefinition } from '../domain/types';

type VideoOverlayProps = {
  word: WordDefinition;
  onClose: () => void;
};

export function VideoOverlay({ word, onClose }: VideoOverlayProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="video-overlay-backdrop" role="presentation" data-testid="video-overlay-backdrop">
      <section className="video-overlay" role="dialog" aria-modal="true" aria-label="Word video">
        <h2>{word.value}</h2>

        {!hasError ? (
          <video
            data-testid="video-element"
            className="video-player"
            src={word.videoSrc}
            controls
            autoPlay
            onError={() => setHasError(true)}
          />
        ) : (
          <div data-testid="video-fallback" className="video-fallback">
            <p>Video unavailable. Continue to the game.</p>
            <button type="button" onClick={onClose}>
              Continue
            </button>
          </div>
        )}

        <button type="button" onClick={onClose} data-testid="video-close-button">
          Close
        </button>
      </section>
    </div>
  );
}
