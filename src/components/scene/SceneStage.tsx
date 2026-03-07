import type { PointerEventHandler, PropsWithChildren } from "react";

type SceneStageProps = PropsWithChildren<{
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerLeave: PointerEventHandler<HTMLElement>;
}>;

export function SceneStage({ children, onPointerMove, onPointerLeave }: SceneStageProps) {
  return (
    <section
      className="scene-stage"
      data-testid="scene-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </section>
  );
}
