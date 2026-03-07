import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBootSequence } from "./useBootSequence";

describe("useBootSequence", () => {
  it("progresses through flash, sync and ready phases", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useBootSequence({ enabled: true, durationMs: 1000, lines: ["A", "B"], lineIntervalMs: 250 })
    );

    expect(result.current.phase).toBe("flash");
    expect(result.current.visibleLineCount).toBe(0);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current.phase).toBe("sync");
    expect(result.current.visibleLineCount).toBe(1);

    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(result.current.visibleLineCount).toBe(2);
    expect(result.current.phase).toBe("ready");
    vi.useRealTimers();
  });
});
