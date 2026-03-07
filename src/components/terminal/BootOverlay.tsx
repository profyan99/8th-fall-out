import type { BootPhase } from "../../hooks/useBootSequence";
import { ru } from "../../i18n/ru";

type BootOverlayProps = {
  lines: string[];
  visibleLineCount: number;
  phase: BootPhase;
};

export function BootOverlay({ lines, visibleLineCount, phase }: BootOverlayProps) {
  return (
    <div
      className={`boot-overlay boot-overlay--${phase}`}
      data-testid="boot-overlay"
      data-boot-phase={phase}
      aria-live="polite"
      aria-label={ru.boot.overlayAria}
    >
      {lines.slice(0, visibleLineCount).map((line) => (
        <p key={line}>{line}</p>
      ))}
      <span className="boot-cursor" aria-hidden="true">
        _
      </span>
    </div>
  );
}
