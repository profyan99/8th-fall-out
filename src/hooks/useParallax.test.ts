import { describe, expect, it } from "vitest";
import {
  clampParallaxTarget,
  getLayerFactors,
  getParallaxAmplitude,
  getParallaxSmoothing,
  interpolateTowardTarget,
  normalizePointer,
} from "./useParallax";

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
  it("uses stronger amplitudes while keeping safe mode conservative", () => {
    expect(getParallaxAmplitude("high")).toBeGreaterThanOrEqual(10);
    expect(getParallaxAmplitude("medium")).toBeGreaterThanOrEqual(6);
    expect(getParallaxAmplitude("safe")).toBeLessThan(getParallaxAmplitude("medium"));
    expect(getParallaxAmplitude("safe")).toBeLessThanOrEqual(2);
  });
});

describe("getParallaxSmoothing", () => {
  it("keeps safe mode slower for gentler inertial response", () => {
    expect(getParallaxSmoothing("safe")).toBeLessThan(getParallaxSmoothing("medium"));
    expect(getParallaxSmoothing("medium")).toBeLessThan(getParallaxSmoothing("high"));
  });
});

describe("getLayerFactors", () => {
  it("returns 4-layer profile with stronger foreground motion", () => {
    const factors = getLayerFactors("high");
    expect(factors).toHaveLength(4);
    expect(factors[3]).toBeGreaterThan(factors[0]);
    expect(factors[3] - factors[0]).toBeGreaterThanOrEqual(1);
  });
});

describe("interpolateTowardTarget", () => {
  it("returns pointer state toward neutral with slower safe smoothing", () => {
    const safe = interpolateTowardTarget({ x: 0.8, y: -0.6 }, { x: 0, y: 0 }, getParallaxSmoothing("safe"));
    const high = interpolateTowardTarget({ x: 0.8, y: -0.6 }, { x: 0, y: 0 }, getParallaxSmoothing("high"));

    expect(Math.abs(safe.x)).toBeGreaterThan(Math.abs(high.x));
    expect(Math.abs(safe.y)).toBeGreaterThan(Math.abs(high.y));
    expect(safe.x).toBeGreaterThan(0);
    expect(safe.y).toBeLessThan(0);
  });
});

describe("clampParallaxTarget", () => {
  it("applies tighter pointer clamp in safe mode", () => {
    const safe = clampParallaxTarget({ x: 0.9, y: -0.9 }, "safe");
    const high = clampParallaxTarget({ x: 0.9, y: -0.9 }, "high");

    expect(Math.abs(safe.x)).toBeLessThan(Math.abs(high.x));
    expect(Math.abs(safe.y)).toBeLessThan(Math.abs(high.y));
    expect(Math.abs(safe.x)).toBeLessThanOrEqual(0.55);
    expect(Math.abs(safe.y)).toBeLessThanOrEqual(0.55);
  });
});
