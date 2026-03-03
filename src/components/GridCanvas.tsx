import { useMemo } from 'react';
import type { GridCell } from '../domain/types';

type GridCanvasProps = {
  gridLetters: string[][];
  activeSelection: GridCell[];
  foundPaths: GridCell[][];
  onPointerStart: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerEnd: () => void;
};

export function GridCanvas({
  gridLetters,
  activeSelection,
  foundPaths,
  onPointerStart,
  onPointerMove,
  onPointerEnd
}: GridCanvasProps) {
  const rows = gridLetters.length;
  const cols = gridLetters[0]?.length ?? 0;
  const cells = rows * cols;

  const foundCellCount = useMemo(() => foundPaths.reduce((sum, path) => sum + path.length, 0), [foundPaths]);

  return (
    <section className="grid-canvas-wrap">
      <canvas
        aria-label="Word grid"
        width={640}
        height={640}
        data-testid="grid-canvas"
        onPointerDown={onPointerStart}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
      />
      <div data-testid="grid-canvas-meta">rows:{rows} cols:{cols} cells:{cells}</div>
      <div data-testid="grid-canvas-selection">selection:{activeSelection.length}</div>
      <div data-testid="grid-canvas-found">found-cells:{foundCellCount}</div>
    </section>
  );
}
