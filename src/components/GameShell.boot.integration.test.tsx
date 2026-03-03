import { act, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { LevelDefinition } from "../domain/types";
import { GameShell } from "./GameShell";

const level: LevelDefinition = {
  id: "boot-level",
  title: "Boot Integration",
  grid: [
    "ALPHAXXX",
    "XXXXXXXX",
    "XXXXXXXX",
    "XXXXXXXX",
    "XXXXXXXX",
    "XXXXXXXX",
    "XXXXXXXX",
    "XXXXXXXX",
  ],
  gridSize: 8,
  words: [
    {
      id: "word-alpha",
      value: "ALPHA",
      videoSrc: "/videos/alpha.mp4",
      path: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 },
      ],
    },
  ],
};

describe("GameShell boot flow", () => {
  test("blocks grid input while boot sequence is active", () => {
    vi.useFakeTimers();
    render(<GameShell level={level} enableBootSequence bootDurationMs={1000} />);

    const canvas = screen.getByTestId("grid-canvas");
    expect(canvas).toHaveAttribute("data-input-blocked", "true");
    expect(screen.getByTestId("boot-overlay")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(canvas).toHaveAttribute("data-input-blocked", "false");
    expect(screen.queryByTestId("boot-overlay")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
