import type { GridCell } from './types';

const normalize = (delta: number): number => {
  if (delta === 0) {
    return 0;
  }

  return delta > 0 ? 1 : -1;
};

export const buildSelectionPath = (start: GridCell, end: GridCell): GridCell[] | null => {
  const deltaRow = end.row - start.row;
  const deltaCol = end.col - start.col;

  const isHorizontal = deltaRow === 0;
  const isVertical = deltaCol === 0;
  const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol);

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return null;
  }

  const stepRow = normalize(deltaRow);
  const stepCol = normalize(deltaCol);
  const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));

  return Array.from({ length: steps + 1 }, (_, index) => ({
    row: start.row + stepRow * index,
    col: start.col + stepCol * index
  }));
};
