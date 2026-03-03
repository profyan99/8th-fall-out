import type { GridCell } from '../domain/types';

type GridCanvasProps = {
  gridLetters: string[][];
  activeSelection: GridCell[];
  foundPaths: GridCell[][];
  onMouseStart: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseEnd: () => void;
};

export function GridCanvas({
  gridLetters,
  activeSelection,
  foundPaths,
  onMouseStart,
  onMouseMove,
  onMouseEnd
}: GridCanvasProps) {
  const rows = gridLetters.length;
  const cols = gridLetters[0]?.length ?? 0;
  const cells = rows * cols;
  const foundCellCount = foundPaths.reduce((sum, path) => sum + path.length, 0);

  return (
    <section className="grid-canvas-wrap">
      <canvas
        aria-label="Word grid"
        width={640}
        height={640}
        data-testid="grid-canvas"
        onMouseDown={onMouseStart}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseEnd}
      />
      <div data-testid="grid-canvas-meta">rows:{rows} cols:{cols} cells:{cells}</div>
      <div data-testid="grid-canvas-selection">selection:{activeSelection.length}</div>
      <div data-testid="grid-canvas-found">found-cells:{foundCellCount}</div>
    </section>
  );
}
