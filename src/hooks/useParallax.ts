import { useMemo, useRef, useState } from "react";
import type { PointerEventHandler } from "react";
import type { QualityMode } from "../theme/qualityMode";

type Point = { x: number; y: number };

const LAYER_FACTORS_BY_MODE = {
  safe: [0.18, 0.38, 0.64, 0.9],
  medium: [0.2, 0.42, 0.7, 0.95],
  high: [0.2, 0.45, 0.75, 1],
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizePointer(position: number, size: number): number {
  if (size <= 0) {
    return 0;
  }

  return clamp((position / size) * 2 - 1, -1, 1);
}

export function getParallaxAmplitude(mode: QualityMode): number {
  if (mode === "safe") {
    return 2;
  }
  if (mode === "medium") {
    return 5;
  }
  return 8;
}

export function getLayerFactors(mode: QualityMode): readonly number[] {
  return LAYER_FACTORS_BY_MODE[mode];
}

export function interpolateTowardTarget(current: Point, target: Point, smoothing: number): Point {
  return {
    x: current.x + (target.x - current.x) * smoothing,
    y: current.y + (target.y - current.y) * smoothing,
  };
}

export function useParallax(qualityMode: QualityMode = "high"): {
  layerTransforms: string[];
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerLeave: PointerEventHandler<HTMLDivElement>;
} {
  const [current, setCurrent] = useState<Point>({ x: 0, y: 0 });
  const currentRef = useRef<Point>({ x: 0, y: 0 });
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const amplitude = getParallaxAmplitude(qualityMode);
  const layerFactors = getLayerFactors(qualityMode);

  const tick = () => {
    setCurrent((prev) => {
      const next = interpolateTowardTarget(prev, targetRef.current, 0.16);
      currentRef.current = next;
      return next;
    });

    const dx = Math.abs(targetRef.current.x - currentRef.current.x);
    const dy = Math.abs(targetRef.current.y - currentRef.current.y);
    if (dx < 0.01 && dy < 0.01) {
      rafRef.current = null;
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    targetRef.current = {
      x: normalizePointer(event.clientX - rect.left, rect.width),
      y: normalizePointer(event.clientY - rect.top, rect.height),
    };
    start();
  };

  const onPointerLeave: PointerEventHandler<HTMLDivElement> = () => {
    targetRef.current = { x: 0, y: 0 };
    start();
  };

  const layerTransforms = useMemo(
    () =>
      layerFactors.map(
        (factor) =>
          `translate3d(${(current.x * amplitude * factor).toFixed(3)}px, ${(current.y * amplitude * factor).toFixed(3)}px, 0)`
      ),
    [amplitude, current.x, current.y, layerFactors]
  );

  return { layerTransforms, onPointerMove, onPointerLeave };
}
