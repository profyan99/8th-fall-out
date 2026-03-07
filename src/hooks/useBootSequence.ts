import { useEffect, useMemo, useState } from "react";

export type BootPhase = "flash" | "sync" | "ready";

type UseBootSequenceOptions = {
  enabled: boolean;
  durationMs: number;
  lineIntervalMs: number;
  lines: string[];
};

type UseBootSequenceResult = {
  phase: BootPhase;
  visibleLineCount: number;
  visibleLines: string[];
};

export function useBootSequence({
  enabled,
  durationMs,
  lineIntervalMs,
  lines,
}: UseBootSequenceOptions): UseBootSequenceResult {
  const [phase, setPhase] = useState<BootPhase>(enabled ? "flash" : "ready");
  const [visibleLineCount, setVisibleLineCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setPhase("ready");
      setVisibleLineCount(lines.length);
      return;
    }

    setPhase("flash");
    setVisibleLineCount(0);
    const flashDuration = Math.max(1, Math.floor(durationMs * 0.25));

    const lineTimer = window.setInterval(() => {
      setVisibleLineCount((current) => Math.min(current + 1, lines.length));
    }, lineIntervalMs);

    const syncTimer = window.setTimeout(() => {
      setPhase("sync");
    }, flashDuration);

    const doneTimer = window.setTimeout(() => {
      setPhase("ready");
      window.clearInterval(lineTimer);
      setVisibleLineCount(lines.length);
    }, durationMs);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(syncTimer);
      window.clearTimeout(doneTimer);
    };
  }, [durationMs, enabled, lineIntervalMs, lines.length]);

  const visibleLines = useMemo(() => lines.slice(0, visibleLineCount), [lines, visibleLineCount]);

  return { phase, visibleLineCount, visibleLines };
}
