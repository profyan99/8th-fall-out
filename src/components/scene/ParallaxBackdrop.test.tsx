import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParallaxBackdrop } from "./ParallaxBackdrop";

describe("ParallaxBackdrop", () => {
  it("renders semantic bunker scene layers with parallax transforms", () => {
    render(
      <ParallaxBackdrop
        layerTransforms={[
          "translate3d(0px, 0px, 0)",
          "translate3d(0px, 0px, 0)",
          "translate3d(0px, 0px, 0)",
          "translate3d(0px, 0px, 0)",
        ]}
      />
    );

    expect(screen.getByTestId("parallax-layer-0")).toBeInTheDocument();
    expect(screen.getByTestId("parallax-layer-1")).toBeInTheDocument();
    expect(screen.getByTestId("parallax-layer-2")).toBeInTheDocument();
    expect(screen.getByTestId("parallax-layer-3")).toBeInTheDocument();

    const backdrop = screen.getByTestId("parallax-backdrop");
    expect(backdrop.querySelector(".bunker-architecture")).toBeInTheDocument();
    expect(backdrop.querySelector(".bunker-interior")).toBeInTheDocument();
    expect(backdrop.querySelector(".march-decor")).toBeInTheDocument();
    expect(backdrop.querySelector(".ambient-haze")).toBeInTheDocument();

    expect(backdrop.querySelector('[data-semantic-layer="bunker-architecture"]')).toBeInTheDocument();
    expect(backdrop.querySelector('[data-semantic-layer="bunker-interior"]')).toBeInTheDocument();
    expect(backdrop.querySelector('[data-semantic-layer="march-decor"]')).toBeInTheDocument();
    expect(backdrop.querySelector('[data-semantic-layer="ambient-haze"]')).toBeInTheDocument();

    expect(screen.getByTestId("parallax-layer-0")).toHaveAttribute("data-depth", "0.3");
    expect(screen.getByTestId("parallax-layer-3")).toHaveAttribute("data-depth", "1");
  });
});
