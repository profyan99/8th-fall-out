import { useParallax } from "../../hooks/useParallax";
import type { QualityMode } from "../../theme/qualityMode";

type ParallaxBackdropProps = {
  qualityMode?: QualityMode;
};

export function ParallaxBackdrop({ qualityMode = "high" }: ParallaxBackdropProps) {
  const { layerTransforms, onPointerMove, onPointerLeave } = useParallax(qualityMode);

  return (
    <div
      className="parallax-backdrop"
      data-testid="parallax-backdrop"
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {layerTransforms.map((transform, index) => (
        <div
          key={index}
          className={`parallax-layer parallax-layer-${index}`}
          data-testid={`parallax-layer-${index}`}
          style={{ transform }}
        />
      ))}
    </div>
  );
}
