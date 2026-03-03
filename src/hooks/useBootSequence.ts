import { useEffect, useMemo, useState } from "react";

type BootPhase = "booting" | "playing";

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
  const [phase, setPhase] = useState<BootPhase>(enabled ? "booting" : "playing");
  const [visibleLineCount, setVisibleLineCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setPhase("playing");
      setVisibleLineCount(lines.length);
      return;
    }

    setPhase("booting");
    setVisibleLineCount(0);

    const lineTimer = window.setInterval(() => {
      setVisibleLineCount((current) => Math.min(current + 1, lines.length));
    }, lineIntervalMs);

    const doneTimer = window.setTimeout(() => {
      setPhase("playing");
      window.clearInterval(lineTimer);
      setVisibleLineCount(lines.length);
    }, durationMs);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(doneTimer);
    };
  }, [durationMs, enabled, lineIntervalMs, lines.length]);

  const visibleLines = useMemo(() => lines.slice(0, visibleLineCount), [lines, visibleLineCount]);

  return { phase, visibleLineCount, visibleLines };
}

