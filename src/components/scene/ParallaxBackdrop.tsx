type ParallaxBackdropProps = {
  layerTransforms: string[];
  className?: string;
  testId?: string;
};

const SCENE_LAYER_CLASSES = ["bunker-architecture", "bunker-interior", "march-decor", "ambient-haze"] as const;

export function ParallaxBackdrop({
  layerTransforms,
  className = "parallax-backdrop",
  testId = "parallax-backdrop",
}: ParallaxBackdropProps) {
  return (
    <div className={className} data-testid={testId} aria-hidden="true" style={{ pointerEvents: "none" }}>
      {SCENE_LAYER_CLASSES.map((layerClass, index) => (
        <div
          key={index}
          className={`parallax-layer parallax-layer-${index} ${layerClass}`}
          data-testid={`parallax-layer-${index}`}
          data-semantic-layer={layerClass}
          aria-hidden="true"
          style={{ transform: layerTransforms[index] ?? "translate3d(0px, 0px, 0)", pointerEvents: "none" }}
        />
      ))}
    </div>
  );
}
