import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ru } from "../../i18n/ru";
import { TerminalHud } from "./TerminalHud";

describe("TerminalHud", () => {
  it("renders russian title passed from localized dictionary", () => {
    render(<TerminalHud title={ru.level.title} sessionId="S-1" foundCount={2} totalCount={5} />);

    expect(screen.getByText(ru.level.title)).toBeInTheDocument();
    expect(ru.level.title).toMatch(/[А-Яа-яЁё]/);
  });

  it("renders title, session id and progress markers", () => {
    render(<TerminalHud title="WORD GRID" sessionId="S-1" foundCount={2} totalCount={5} />);

    expect(screen.getByText("SESSION::S-1")).toBeInTheDocument();
    expect(screen.getByTestId("hud-progress")).toHaveTextContent("WORDS LOCATED 2/5");
    expect(screen.getByText("LINK STABLE")).toBeInTheDocument();
  });
});
