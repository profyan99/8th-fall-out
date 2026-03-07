import { useMemo, useRef, useState } from 'react';
import { buildSelectionPath } from '../domain/selection';
import type { GridCell } from '../domain/types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const toCell = (
  event: React.MouseEvent<HTMLCanvasElement>,
  gridSize: number
): GridCell => {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const rectWidth = rect.width > 0 ? rect.width : canvas.width || 1;
  const rectHeight = rect.height > 0 ? rect.height : canvas.height || 1;
  const scaleX = canvas.width / rectWidth;
  const scaleY = canvas.height / rectHeight;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const cellWidth = canvas.width / gridSize;
  const cellHeight = canvas.height / gridSize;
  const row = clamp(Math.floor(y / cellHeight), 0, gridSize - 1);
  const col = clamp(Math.floor(x / cellWidth), 0, gridSize - 1);

  return { row, col };
};

type UseGridSelectionArgs = {
  gridSize: number;
  onSelectionCommitted: (path: GridCell[]) => void;
};

export const useGridSelection = ({
  gridSize,
  onSelectionCommitted
}: UseGridSelectionArgs) => {
  const [startCell, setStartCell] = useState<GridCell | null>(null);
  const startCellRef = useRef<GridCell | null>(null);
  const [activeSelection, setActiveSelection] = useState<GridCell[]>([]);
  const selectionRef = useRef<GridCell[]>([]);

  const handlers = useMemo(
    () => ({
      onMouseStart: (event: React.MouseEvent<HTMLCanvasElement>) => {
        const cell = toCell(event, gridSize);
        setStartCell(cell);
        startCellRef.current = cell;
        setActiveSelection([cell]);
        selectionRef.current = [cell];
      },
      onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!startCellRef.current) {
          return;
        }

        const endCell = toCell(event, gridSize);
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
    [gridSize, onSelectionCommitted, startCell]
  );

  return {
    activeSelection,
    ...handlers
  };
};
