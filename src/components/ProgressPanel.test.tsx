import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressPanel } from "./ProgressPanel";

describe("ProgressPanel", () => {
  it("shows accurate found words and marker count", () => {
    render(<ProgressPanel foundCount={2} totalCount={4} />);

    expect(screen.getByTestId("progress-text")).toHaveTextContent("2/4 words found");
    expect(screen.getAllByTestId("progress-marker")).toHaveLength(4);
  });
});
