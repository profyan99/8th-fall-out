import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BootOverlay } from "./BootOverlay";

describe("BootOverlay", () => {
  it("renders visible boot lines", () => {
    render(<BootOverlay lines={["INIT", "READY"]} visibleLineCount={1} />);

    expect(screen.getByText("INIT")).toBeInTheDocument();
    expect(screen.queryByText("READY")).not.toBeInTheDocument();
    expect(screen.getByTestId("boot-overlay")).toBeInTheDocument();
  });
});
