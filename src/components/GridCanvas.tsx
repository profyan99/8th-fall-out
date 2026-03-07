import { useEffect, useRef } from 'react';
import type { GridCell } from '../domain/types';

type GridCanvasProps = {
  gridLetters: string[][];
  activeSelection: GridCell[];
  foundPaths: GridCell[][];
  onMouseStart: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseEnd: () => void;
  isInputBlocked?: boolean;
  isBooting?: boolean;
  canvasSize?: number;
  layoutMode?: "default" | "viewport-fit";
};

const isCellInPath = (cell: GridCell, path: GridCell[]): boolean =>
  path.some((pathCell) => pathCell.row === cell.row && pathCell.col === cell.col);

export function GridCanvas({
  gridLetters,
  activeSelection,
  foundPaths,
  onMouseStart,
  onMouseMove,
  onMouseEnd,
  isInputBlocked = false,
  isBooting = false,
  canvasSize = 700,
  layoutMode = "default",
}: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rows = gridLetters.length;
  const cols = gridLetters[0]?.length ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || rows === 0 || cols === 0) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cell = { row, col };
        const isActive = isCellInPath(cell, activeSelection);
        const isFound = foundPaths.some((path) => isCellInPath(cell, path));

        if (isFound || isActive) {
          context.fillStyle = isFound ? 'rgba(95, 255, 130, 0.30)' : 'rgba(140, 255, 140, 0.22)';
          context.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }

        context.strokeStyle = 'rgba(120, 255, 120, 0.15)';
        context.lineWidth = 1;
        context.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

        context.fillStyle = '#8cff8c';
        context.font = `${Math.max(14, Math.floor(cellWidth * 0.38))}px IBM Plex Mono, monospace`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(
          gridLetters[row][col],
          col * cellWidth + cellWidth / 2,
          row * cellHeight + cellHeight / 2
        );
      }
    }
  }, [activeSelection, cols, foundPaths, gridLetters, rows]);

  return (
    <section className="grid-canvas-wrap">
      <canvas
        ref={canvasRef}
        aria-label="Word grid"
        width={canvasSize}
        height={canvasSize}
        data-testid="grid-canvas"
        data-input-blocked={String(isInputBlocked)}
        data-booting={String(isBooting)}
        data-layout-mode={layoutMode}
        onMouseDown={isInputBlocked ? undefined : onMouseStart}
        onMouseMove={isInputBlocked ? undefined : onMouseMove}
        onMouseUp={isInputBlocked ? undefined : onMouseEnd}
      />
    </section>
  );
}
