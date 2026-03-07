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

    expect(screen.getByText("RESULT")).toBeInTheDocument();
    expect(screen.getByTestId("progress-text")).toHaveTextContent("WORDS: 2 OF 4");
    expect(screen.getAllByTestId("progress-marker")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "ALPHA" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "GAMMA" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "BETA" })).not.toBeInTheDocument();
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

    const replayButton = screen.getByRole("button", { name: "ALPHA" });
    fireEvent.click(replayButton);
    expect(onReplayRequested).toHaveBeenCalledTimes(1);
    expect(onReplayRequested).toHaveBeenCalledWith("alpha");
  });

  it("renders found words inside dedicated replay scroll container", () => {
    const replayItems = Array.from({ length: 12 }, (_, index) => ({
      wordId: `word-${index + 1}`,
      label: `WORD-${index + 1}`,
      found: true,
    }));

    render(
      <ProgressPanel
        foundCount={12}
        totalCount={12}
        replayItems={replayItems}
        onReplayRequested={() => undefined}
      />
    );

    const scrollContainer = screen.getByTestId("progress-replay-scroll");
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass("progress-replay-scroll-fill");
    expect(scrollContainer.querySelectorAll("button")).toHaveLength(12);
    expect(screen.getByRole("button", { name: "WORD-12" })).toBeInTheDocument();
  });
});
