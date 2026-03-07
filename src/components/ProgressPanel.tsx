import { ru } from '../i18n/ru';

type ProgressPanelProps = {
  foundCount: number;
  totalCount: number;
  replayItems?: Array<{ wordId: string; label: string; found: boolean }>;
  onReplayRequested?: (wordId: string) => void;
};

export function ProgressPanel({
  foundCount,
  totalCount,
  replayItems = [],
  onReplayRequested,
}: ProgressPanelProps) {
  return (
    <aside className="progress-panel">
      <h2>{ru.progress.title}</h2>
      <p className="progress-caption">{ru.progress.caption}</p>
      <p data-testid="progress-text">{`${ru.progress.words}: ${foundCount} ${ru.progress.of} ${totalCount}`}</p>
      <div className="progress-markers">
        {Array.from({ length: totalCount }, (_, index) => (
          <span
            key={index}
            data-testid="progress-marker"
            className={index < foundCount ? 'progress-marker progress-marker-found' : 'progress-marker'}
            aria-hidden="true"
          />
        ))}
      </div>
      {replayItems.length > 0 && (
        <div className="progress-replay-scroll progress-replay-scroll-fill" data-testid="progress-replay-scroll">
          <div className="progress-replay-list" data-testid="progress-replay-list">
            {replayItems
              .filter((item) => item.found)
              .map((item) => (
                <button
                  key={item.wordId}
                  type="button"
                  className="terminal-action-button progress-replay-button"
                  onClick={() => onReplayRequested?.(item.wordId)}
                  aria-label={item.label}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </aside>
  );
}
