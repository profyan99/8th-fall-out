import { describe, expect, it, vi } from "vitest";
import { resolveQualityMode } from "./qualityMode";

describe("resolveQualityMode", () => {
  it("returns high by default", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: false });

    expect(resolveQualityMode({ matchMedia })).toBe("high");
  });

  it("maps reduced motion preference to safe", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });

    expect(resolveQualityMode({ matchMedia })).toBe("safe");
  });

  it("respects manual override", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });

    expect(resolveQualityMode({ override: "medium", matchMedia })).toBe("medium");
  });
});
