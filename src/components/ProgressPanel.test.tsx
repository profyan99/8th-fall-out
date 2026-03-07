import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProgressPanel } from "./ProgressPanel";

describe("ProgressPanel", () => {
  it("shows accurate found words and marker count", () => {
    render(
      <ProgressPanel
        foundCount={2}
        totalCount={4}
        replayItems={[
          { wordId: "alpha", label: "ALPHA", found: true },
          { wordId: "beta", label: "BETA", found: false },
          { wordId: "gamma", label: "GAMMA", found: true },
        ]}
        onReplayRequested={() => undefined}
      />
    );

    expect(screen.getByText("RETRIEVAL LOG")).toBeInTheDocument();
    expect(screen.getByTestId("progress-text")).toHaveTextContent("WORDS INDEXED: 2 OF 4");
    expect(screen.getAllByTestId("progress-marker")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /replay record alpha/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replay record gamma/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /replay record beta/i })).not.toBeInTheDocument();
  });

  it("emits replay callback with found word id", () => {
    const onReplayRequested = vi.fn();
    render(
      <ProgressPanel
        foundCount={1}
        totalCount={2}
        replayItems={[
          { wordId: "alpha", label: "ALPHA", found: true },
          { wordId: "beta", label: "BETA", found: false },
        ]}
        onReplayRequested={onReplayRequested}
      />
    );

    const replayButton = screen.getByRole("button", { name: /replay record alpha/i });
    fireEvent.click(replayButton);
    expect(onReplayRequested).toHaveBeenCalledTimes(1);
    expect(onReplayRequested).toHaveBeenCalledWith("alpha");
  });
});
