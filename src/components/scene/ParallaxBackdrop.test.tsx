import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParallaxBackdrop } from "./ParallaxBackdrop";

describe("ParallaxBackdrop", () => {
  it("renders interior parallax layers", () => {
    render(
      <ParallaxBackdrop
        layerTransforms={[
          "translate3d(0px, 0px, 0)",
          "translate3d(0px, 0px, 0)",
          "translate3d(0px, 0px, 0)",
        ]}
      />
    );

    expect(screen.getByTestId("parallax-layer-0")).toBeInTheDocument();
    expect(screen.getByTestId("parallax-layer-1")).toBeInTheDocument();
    expect(screen.getByTestId("parallax-layer-2")).toBeInTheDocument();
  });
});
