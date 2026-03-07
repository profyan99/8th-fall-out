import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { GridCell } from "../domain/types";
import { useGridSelection } from "./useGridSelection";

function createMouseEvent({
  clientX,
  clientY,
  left,
  top,
  width,
  height,
  canvasSize,
}: {
  clientX: number;
  clientY: number;
  left: number;
  top: number;
  width: number;
  height: number;
  canvasSize: number;
}): React.MouseEvent<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.getBoundingClientRect = () =>
    ({
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect;

  return {
    clientX,
    clientY,
    currentTarget: canvas,
    nativeEvent: {} as MouseEvent,
  } as React.MouseEvent<HTMLCanvasElement>;
}

describe("useGridSelection", () => {
  it("selects the intended top area cell when canvas is CSS-scaled", () => {
    const onSelectionCommitted = vi.fn<(path: GridCell[]) => void>();
    const { result } = renderHook(() =>
      useGridSelection({
        gridSize: 8,
        onSelectionCommitted,
      })
    );

    const event = createMouseEvent({
      left: 50,
      top: 120,
      width: 320,
      height: 320,
      canvasSize: 640,
      clientX: 132,
      clientY: 162,
    });

    act(() => {
      result.current.onMouseStart(event);
      result.current.onMouseEnd();
    });

    expect(onSelectionCommitted).toHaveBeenCalledTimes(1);
    expect(onSelectionCommitted).toHaveBeenCalledWith([{ row: 1, col: 2 }]);
  });
});
