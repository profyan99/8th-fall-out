import { useMemo, useRef, useState } from 'react';
import { buildSelectionPath } from '../domain/selection';
import type { GridCell } from '../domain/types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const toCell = (
  event: React.MouseEvent<HTMLCanvasElement>,
  gridSize: number,
  canvasSize: number
): GridCell => {
  const cellSize = canvasSize / gridSize;
  const eventWithOffsets = event.nativeEvent as MouseEvent & {
    offsetX?: number;
    offsetY?: number;
  };
  const rawOffsetX =
    Number.isFinite(eventWithOffsets.offsetX) && eventWithOffsets.offsetX !== undefined
      ? eventWithOffsets.offsetX
      : event.clientX;
  const rawOffsetY =
    Number.isFinite(eventWithOffsets.offsetY) && eventWithOffsets.offsetY !== undefined
      ? eventWithOffsets.offsetY
      : event.clientY;
  const row = clamp(Math.floor(rawOffsetY / cellSize), 0, gridSize - 1);
  const col = clamp(Math.floor(rawOffsetX / cellSize), 0, gridSize - 1);

  return { row, col };
};

type UseGridSelectionArgs = {
  gridSize: number;
  canvasSize: number;
  onSelectionCommitted: (path: GridCell[]) => void;
};

export const useGridSelection = ({
  gridSize,
  canvasSize,
  onSelectionCommitted
}: UseGridSelectionArgs) => {
  const [startCell, setStartCell] = useState<GridCell | null>(null);
  const startCellRef = useRef<GridCell | null>(null);
  const [activeSelection, setActiveSelection] = useState<GridCell[]>([]);
  const selectionRef = useRef<GridCell[]>([]);

  const handlers = useMemo(
    () => ({
      onMouseStart: (event: React.MouseEvent<HTMLCanvasElement>) => {
        const cell = toCell(event, gridSize, canvasSize);
        setStartCell(cell);
        startCellRef.current = cell;
        setActiveSelection([cell]);
        selectionRef.current = [cell];
      },
      onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!startCellRef.current) {
          return;
        }

        const endCell = toCell(event, gridSize, canvasSize);
        const path = buildSelectionPath(startCellRef.current, endCell);
        const nextPath = path ?? [startCellRef.current];
        setActiveSelection(nextPath);
        selectionRef.current = nextPath;
      },
      onMouseEnd: () => {
        if (selectionRef.current.length > 0) {
          onSelectionCommitted(selectionRef.current);
        }

        setStartCell(null);
        startCellRef.current = null;
        setActiveSelection([]);
        selectionRef.current = [];
      }
    }),
    [canvasSize, gridSize, onSelectionCommitted, startCell]
  );

  return {
    activeSelection,
    ...handlers
  };
};
