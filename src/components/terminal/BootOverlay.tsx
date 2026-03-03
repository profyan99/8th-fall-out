type BootOverlayProps = {
  lines: string[];
  visibleLineCount: number;
};

export function BootOverlay({ lines, visibleLineCount }: BootOverlayProps) {
  return (
    <div className="boot-overlay" data-testid="boot-overlay" aria-live="polite">
      {lines.slice(0, visibleLineCount).map((line) => (
        <p key={line}>{line}</p>
      ))}
      <span className="boot-cursor" aria-hidden="true">
        _
      </span>
    </div>
  );
}

