import { useState } from 'react';
import { ru } from '../i18n/ru';
import { resolveAssetUrl } from '../domain/assetUrl';
import type { WordDefinition } from '../domain/types';

type VideoOverlayProps = {
  word: WordDefinition;
  onClose: () => void;
};

export function VideoOverlay({ word, onClose }: VideoOverlayProps) {
  const [hasError, setHasError] = useState(false);
  const [videoFitMode, setVideoFitMode] = useState<'portrait' | 'landscape' | 'square'>('landscape');
  const baseUrl = import.meta.env.BASE_URL;
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

        <div
          className="video-overlay-media video-overlay-media-bounded video-overlay-media-letterbox"
          data-testid="video-overlay-media"
        >
          {word.mediaType === 'video' ? (
            !hasError ? (
              <video
                data-testid="video-element"
                className={`video-player video-player-fit video-player-fit-${videoFitMode}`}
                src={resolveAssetUrl(word.videoSrc, baseUrl)}
                controls
                autoPlay
                onLoadedMetadata={(event) => {
                  const videoElement = event.currentTarget;
                  if (!videoElement.videoWidth || !videoElement.videoHeight) {
                    return;
                  }

                  const ratio = videoElement.videoWidth / videoElement.videoHeight;
                  if (ratio > 1.05) {
                    setVideoFitMode('landscape');
                  } else if (ratio < 0.95) {
                    setVideoFitMode('portrait');
                  } else {
                    setVideoFitMode('square');
                  }
                }}
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
                src={resolveAssetUrl(word.imageSrc, baseUrl)}
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
