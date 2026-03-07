import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FxLayer } from "../FxLayer";

describe("CRT layers", () => {
  it("renders all crt fx layers as non-interactive overlays", () => {
    render(<FxLayer />);

    const ids = [
      "crt-scanline-layer",
      "crt-noise-layer",
      "crt-vignette-layer",
      "crt-curvature-layer",
      "phosphor-glow-layer",
    ];
    for (const id of ids) {
      const layer = screen.getByTestId(id);
      expect(layer).toBeInTheDocument();
      expect(layer).toHaveStyle({ pointerEvents: "none" });
    }
  });
});
