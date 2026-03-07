type ParallaxBackdropProps = {
  layerTransforms: string[];
};

const SCENE_LAYER_CLASSES = ["bunker-wall", "bunker-props", "march-decor", "ambient-haze"] as const;

export function ParallaxBackdrop({ layerTransforms }: ParallaxBackdropProps) {
  return (
    <div className="parallax-backdrop" data-testid="parallax-backdrop" aria-hidden="true">
      {SCENE_LAYER_CLASSES.map((layerClass, index) => (
        <div
          key={index}
          className={`parallax-layer parallax-layer-${index} ${layerClass}`}
          data-testid={`parallax-layer-${index}`}
          aria-hidden="true"
          style={{ transform: layerTransforms[index] ?? "translate3d(0px, 0px, 0)" }}
        />
      ))}
    </div>
  );
}
