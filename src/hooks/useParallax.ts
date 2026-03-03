import { useMemo, useRef, useState } from "react";
import type { PointerEventHandler } from "react";
import type { QualityMode } from "../theme/qualityMode";

type Point = { x: number; y: number };

const LAYER_FACTORS = [0.35, 0.6, 1] as const;

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

export function useParallax(qualityMode: QualityMode = "high"): {
  layerTransforms: string[];
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerLeave: PointerEventHandler<HTMLDivElement>;
} {
  const [current, setCurrent] = useState<Point>({ x: 0, y: 0 });
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const amplitude = getParallaxAmplitude(qualityMode);

  const tick = () => {
    setCurrent((prev) => {
      const nextX = prev.x + (targetRef.current.x - prev.x) * 0.16;
      const nextY = prev.y + (targetRef.current.y - prev.y) * 0.16;
      return { x: nextX, y: nextY };
    });

    const dx = Math.abs(targetRef.current.x - current.x);
    const dy = Math.abs(targetRef.current.y - current.y);
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
      LAYER_FACTORS.map(
        (factor) =>
          `translate3d(${(current.x * amplitude * factor).toFixed(3)}px, ${(current.y * amplitude * factor).toFixed(3)}px, 0)`
      ),
    [amplitude, current.x, current.y]
  );

  return { layerTransforms, onPointerMove, onPointerLeave };
}

