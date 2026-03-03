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
  it("renders scene stage, monitor frame and screen viewport wrappers", () => {
    render(<GameShell level={level} />);

    expect(screen.getByTestId("scene-stage")).toBeInTheDocument();
    expect(screen.getByTestId("monitor-frame")).toBeInTheDocument();
    expect(screen.getByTestId("screen-viewport")).toBeInTheDocument();
  });
});
