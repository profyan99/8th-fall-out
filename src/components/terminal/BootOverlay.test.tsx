import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BootOverlay } from "./BootOverlay";

describe("BootOverlay", () => {
  it("renders visible boot lines with phase-specific class", () => {
    render(<BootOverlay lines={["INIT", "READY"]} visibleLineCount={1} phase="sync" />);

    expect(screen.getByText("INIT")).toBeInTheDocument();
    expect(screen.queryByText("READY")).not.toBeInTheDocument();
    expect(screen.getByTestId("boot-overlay")).toHaveClass("boot-overlay--sync");
  });
});
