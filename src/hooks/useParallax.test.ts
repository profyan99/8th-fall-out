import { describe, expect, it } from "vitest";
import { getLayerFactors, getParallaxAmplitude, interpolateTowardTarget, normalizePointer } from "./useParallax";

describe("normalizePointer", () => {
  it("normalizes pointer to a -1..1 range around center", () => {
    expect(normalizePointer(50, 100)).toBe(0);
    expect(normalizePointer(0, 100)).toBe(-1);
    expect(normalizePointer(100, 100)).toBe(1);
  });

  it("clamps values outside bounds", () => {
    expect(normalizePointer(-20, 100)).toBe(-1);
    expect(normalizePointer(140, 100)).toBe(1);
  });
});

describe("getParallaxAmplitude", () => {
  it("reduces amplitude for safe mode", () => {
    expect(getParallaxAmplitude("safe")).toBeLessThan(getParallaxAmplitude("high"));
    expect(getParallaxAmplitude("safe")).toBeLessThanOrEqual(2);
  });
});

describe("getLayerFactors", () => {
  it("returns depth factors for 4 parallax layers", () => {
    expect(getLayerFactors("high")).toEqual([0.2, 0.45, 0.75, 1]);
  });
});

describe("interpolateTowardTarget", () => {
  it("returns pointer state toward neutral after leave", () => {
    const next = interpolateTowardTarget({ x: 0.8, y: -0.6 }, { x: 0, y: 0 }, 0.16);
    expect(Math.abs(next.x)).toBeLessThan(0.8);
    expect(Math.abs(next.y)).toBeLessThan(0.6);
    expect(next.x).toBeGreaterThan(0);
    expect(next.y).toBeLessThan(0);
  });
});
