import type { GridCell, LevelDefinition, WordDefinition } from './types';

const SUPPORTED_GRID_SIZES = new Set([8, 10, 12]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGridCell = (value: unknown): value is GridCell =>
  isRecord(value) && typeof value.row === 'number' && typeof value.col === 'number';

const parseWord = (value: unknown): WordDefinition => {
  if (!isRecord(value)) {
    throw new Error('Invalid word definition');
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.value !== 'string' ||
    typeof value.videoSrc !== 'string' ||
    !Array.isArray(value.path)
  ) {
    throw new Error('Invalid word definition shape');
  }

  if (!value.path.every(isGridCell)) {
    throw new Error('Invalid word path');
  }

  return {
    id: value.id,
    value: value.value,
    videoSrc: value.videoSrc,
    path: value.path
  };
};

export const parseLevelDefinition = (value: unknown): LevelDefinition => {
  if (!isRecord(value)) {
    throw new Error('Level payload must be an object');
  }

  if (typeof value.id !== 'string' || typeof value.title !== 'string') {
    throw new Error('Level requires id and title');
  }

  if (!Array.isArray(value.grid) || !value.grid.every((row) => typeof row === 'string')) {
    throw new Error('Level grid must be an array of strings');
  }

  const gridSize = value.grid.length;
  if (!SUPPORTED_GRID_SIZES.has(gridSize)) {
    throw new Error('Unsupported grid size');
  }

  const hasInvalidRowLength = value.grid.some((row) => row.length !== gridSize);
  if (hasInvalidRowLength) {
    throw new Error('Grid must be square');
  }

  if (!Array.isArray(value.words)) {
    throw new Error('Level words must be an array');
  }

  const words = value.words.map(parseWord);

  return {
    id: value.id,
    title: value.title,
    grid: value.grid,
    gridSize,
    words
  };
};
