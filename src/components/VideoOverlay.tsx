import { useState } from 'react';
import type { WordDefinition } from '../domain/types';

type VideoOverlayProps = {
  word: WordDefinition;
  onClose: () => void;
};

export function VideoOverlay({ word, onClose }: VideoOverlayProps) {
  const [hasError, setHasError] = useState(false);
  const backdropSignalClass = hasError ? 'signal-state-loss' : 'signal-state-capture';
  const dialogSignalClass = hasError ? 'signal-state-loss-dialog' : 'signal-state-locked';

  return (
    <div
      className={`video-overlay-backdrop signal-capture-active ${backdropSignalClass}`}
      role="presentation"
      data-testid="video-overlay-backdrop"
    >
      <section
        className={`video-overlay video-overlay-lg signal-capture-dialog ${dialogSignalClass}`}
        role="dialog"
        aria-modal="true"
        aria-label="Word video"
      >
        <h2>SIGNAL LOCK: {word.value}</h2>

        {word.mediaType === 'video' ? (
          !hasError ? (
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
              <button type="button" className="terminal-action-button" onClick={onClose}>
                Continue
              </button>
            </div>
          )
        ) : !hasError ? (
          <img
            data-testid="media-image"
            className="media-image"
            src={word.imageSrc}
            alt={`${word.value} media`}
            onError={() => setHasError(true)}
          />
        ) : (
          <div data-testid="media-image-fallback" className="video-fallback">
            <p>Image unavailable. Continue to the game.</p>
            <button type="button" className="terminal-action-button" onClick={onClose}>
              Continue
            </button>
          </div>
        )}

        <button type="button" className="terminal-action-button" onClick={onClose} data-testid="video-close-button">
          Close
        </button>
      </section>
    </div>
  );
}
