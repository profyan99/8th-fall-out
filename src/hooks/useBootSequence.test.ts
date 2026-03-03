import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBootSequence } from "./useBootSequence";

describe("useBootSequence", () => {
  it("transitions from booting to playing after configured duration", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useBootSequence({ enabled: true, durationMs: 1000, lines: ["A", "B"], lineIntervalMs: 250 })
    );

    expect(result.current.phase).toBe("booting");
    expect(result.current.visibleLineCount).toBe(0);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.visibleLineCount).toBe(2);
    expect(result.current.phase).toBe("booting");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.phase).toBe("playing");
    vi.useRealTimers();
  });
});
