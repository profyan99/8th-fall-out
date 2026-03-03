import { describe, expect, it } from "vitest";
import { getParallaxAmplitude, normalizePointer } from "./useParallax";

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
  });
});
