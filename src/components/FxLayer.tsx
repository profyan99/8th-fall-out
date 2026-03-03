import { CrtNoiseLayer } from "./fx/CrtNoiseLayer";
import { CrtScanlineLayer } from "./fx/CrtScanlineLayer";
import { CrtVignetteLayer } from "./fx/CrtVignetteLayer";
import { PhosphorGlowLayer } from "./fx/PhosphorGlowLayer";

export function FxLayer() {
  return (
    <div className="fx-layer" aria-hidden="true">
      <CrtScanlineLayer />
      <CrtNoiseLayer />
      <CrtVignetteLayer />
      <PhosphorGlowLayer />
    </div>
  );
}
