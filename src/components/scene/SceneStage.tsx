import type { PropsWithChildren } from "react";
import { ParallaxBackdrop } from "./ParallaxBackdrop";

export function SceneStage({ children }: PropsWithChildren) {
  return (
    <section className="scene-stage" data-testid="scene-stage">
      <ParallaxBackdrop />
      {children}
    </section>
  );
}

