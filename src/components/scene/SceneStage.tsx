import type { PropsWithChildren } from "react";
import { useParallax } from "../../hooks/useParallax";
import { ParallaxBackdrop } from "./ParallaxBackdrop";

export function SceneStage({ children }: PropsWithChildren) {
  const { layerTransforms, onPointerMove, onPointerLeave } = useParallax("medium");

  return (
    <section
      className="scene-stage"
      data-testid="scene-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <ParallaxBackdrop layerTransforms={layerTransforms} />
      {children}
    </section>
  );
}
