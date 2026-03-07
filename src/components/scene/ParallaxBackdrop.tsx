type ParallaxBackdropProps = {
  layerTransforms: string[];
};

const SCENE_LAYER_CLASSES = ["bunker-wall", "bunker-props", "march-decor", "ambient-haze"] as const;

export function ParallaxBackdrop({ layerTransforms }: ParallaxBackdropProps) {
  return (
    <div className="parallax-backdrop" data-testid="parallax-backdrop" aria-hidden="true">
      {layerTransforms.map((transform, index) => (
        <div
          key={index}
          className={`parallax-layer parallax-layer-${index} ${SCENE_LAYER_CLASSES[index] ?? ""}`.trim()}
          data-testid={`parallax-layer-${index}`}
          aria-hidden="true"
          style={{ transform }}
        />
      ))}
    </div>
  );
}
