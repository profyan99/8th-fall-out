import type { PointerEventHandler, PropsWithChildren } from "react";

type SceneStageProps = PropsWithChildren<{
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerLeave: PointerEventHandler<HTMLElement>;
}>;

export function SceneStage({ children, onPointerMove, onPointerLeave }: SceneStageProps) {
  return (
    <section
      className="scene-stage scene-stage--parallax-v2"
      data-testid="scene-stage"
      data-parallax-inertia="enabled"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </section>
  );
}
