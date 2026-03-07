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
      <h2>RETRIEVAL LOG</h2>
      <p className="progress-caption">TERMINAL INDEX</p>
      <p data-testid="progress-text">{`WORDS INDEXED: ${foundCount} OF ${totalCount}`}</p>
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
        <div className="progress-replay-list" data-testid="progress-replay-list">
          {replayItems
            .filter((item) => item.found)
            .map((item) => (
              <button
                key={item.wordId}
                type="button"
                className="terminal-action-button progress-replay-button"
                onClick={() => onReplayRequested?.(item.wordId)}
                aria-label={`Replay record ${item.label}`}
              >
                Replay record {item.label}
              </button>
            ))}
        </div>
      )}
    </aside>
  );
}
