import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TerminalHud } from "./TerminalHud";

describe("TerminalHud", () => {
  it("renders title, session id and progress markers", () => {
    render(<TerminalHud title="WORD GRID" sessionId="S-1" foundCount={2} totalCount={5} />);

    expect(screen.getByText("WORD GRID")).toBeInTheDocument();
    expect(screen.getByText("SESSION::S-1")).toBeInTheDocument();
    expect(screen.getByTestId("hud-progress")).toHaveTextContent("WORDS LOCATED 2/5");
    expect(screen.getByText("LINK STABLE")).toBeInTheDocument();
  });
});
