import { useState } from 'react';
import { ru } from '../i18n/ru';
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
        className={`video-overlay video-overlay-lg video-overlay-viewport-fit signal-capture-dialog ${dialogSignalClass}`}
        role="dialog"
        aria-modal="true"
        aria-label={ru.overlay.ariaLabel}
      >
        <h2>{ru.overlay.signalLock}: {word.value}</h2>

        <div className="video-overlay-media video-overlay-media-bounded" data-testid="video-overlay-media">
          {word.mediaType === 'video' ? (
            !hasError ? (
              <video
                data-testid="video-element"
                className="video-player video-player-fit"
                src={word.videoSrc}
                controls
                autoPlay
                onError={() => setHasError(true)}
              />
            ) : (
              <div data-testid="video-fallback" className="video-fallback">
                <p>{ru.overlay.videoUnavailable}</p>
                <button type="button" className="terminal-action-button" onClick={onClose}>
                  {ru.overlay.continue}
                </button>
              </div>
            )
          ) : !hasError ? (
            <img
              data-testid="media-image"
              className="media-image media-image-fit"
              src={word.imageSrc}
              alt={`${word.value} медиа`}
              onError={() => setHasError(true)}
            />
          ) : (
            <div data-testid="media-image-fallback" className="video-fallback">
              <p>{ru.overlay.imageUnavailable}</p>
              <button type="button" className="terminal-action-button" onClick={onClose}>
                {ru.overlay.continue}
              </button>
            </div>
          )}
        </div>

        <button type="button" className="terminal-action-button" onClick={onClose} data-testid="video-close-button">
          {ru.overlay.close}
        </button>
      </section>
    </div>
  );
}
