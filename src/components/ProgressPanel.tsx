type ProgressPanelProps = {
  foundCount: number;
  totalCount: number;
};

export function ProgressPanel({ foundCount, totalCount }: ProgressPanelProps) {
  return (
    <aside className="progress-panel">
      <h2>Progress</h2>
      <p data-testid="progress-text">
        {foundCount}/{totalCount} words found
      </p>
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
    </aside>
  );
}
