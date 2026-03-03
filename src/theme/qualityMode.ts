export type QualityMode = "high" | "medium" | "safe";

type MatchMediaFn = (query: string) => { matches: boolean };

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(matchMedia: MatchMediaFn): boolean {
  return matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function resolveQualityMode(options?: {
  override?: QualityMode;
  matchMedia?: MatchMediaFn;
}): QualityMode {
  if (options?.override) {
    return options.override;
  }

  if (options?.matchMedia && prefersReducedMotion(options.matchMedia)) {
    return "safe";
  }

  return "high";
}

