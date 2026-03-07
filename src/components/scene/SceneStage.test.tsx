import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LevelDefinition } from "../../domain/types";
import { GameShell } from "../GameShell";

const level: LevelDefinition = {
  id: "scene-shell-test",
  title: "Scene Shell",
  grid: [
    "ABCDEFGH",
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
      id: "word-a",
      value: "ABCDE",
      mediaType: "video",
      videoSrc: "/videos/a.mp4",
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

describe("Scene shell", () => {
  it("renders scene wrappers and global decorative backdrop layers", () => {
    render(<GameShell level={level} />);

    expect(screen.getByTestId("scene-stage")).toBeInTheDocument();
    expect(screen.getByTestId("monitor-frame")).toBeInTheDocument();
    expect(screen.getByTestId("screen-viewport")).toBeInTheDocument();
    expect(screen.getByTestId("monitor-bezel-depth")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("monitor-glass")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("monitor-reflection")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("monitor-glare-sweep")).toHaveAttribute("aria-hidden", "true");

    const backdrop = screen.getByTestId("global-parallax-backdrop");
    expect(backdrop).toHaveClass("bunker-scene-art");
    expect(backdrop.querySelector(".march-decor")).toBeInTheDocument();
    expect(backdrop.querySelector(".ambient-haze")).toBeInTheDocument();
  });
});
