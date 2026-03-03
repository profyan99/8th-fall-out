type ParallaxBackdropProps = {
  layerTransforms: string[];
};

export function ParallaxBackdrop({ layerTransforms }: ParallaxBackdropProps) {
  return (
    <div className="parallax-backdrop" data-testid="parallax-backdrop" aria-hidden="true">
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
