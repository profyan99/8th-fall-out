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
    </aside>
  );
}
