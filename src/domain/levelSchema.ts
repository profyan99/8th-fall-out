import type { GridCell, LevelDefinition, WordDefinition } from './types';
import { generateGridFromWords } from './generateGrid';

const SUPPORTED_GRID_SIZES = new Set([8, 10, 12]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGridCell = (value: unknown): value is GridCell =>
  isRecord(value) && typeof value.row === 'number' && typeof value.col === 'number';

const parseWordMedia = (value: Record<string, unknown>) => {
  const hasVideo = typeof value.videoSrc === 'string';
  const hasImage = typeof value.imageSrc === 'string';

  if (hasVideo === hasImage) {
    throw new Error('Invalid word definition: xor media required');
  }

  if (hasVideo) {
    return { mediaType: 'video' as const, videoSrc: value.videoSrc as string };
  }

  return { mediaType: 'image' as const, imageSrc: value.imageSrc as string };
};

const parseWord = (value: unknown): WordDefinition => {
  if (!isRecord(value)) {
    throw new Error('Invalid word definition');
  }

  if (typeof value.id !== 'string' || typeof value.value !== 'string' || !Array.isArray(value.path)) {
    throw new Error('Invalid word definition shape');
  }

  if (!value.path.every(isGridCell)) {
    throw new Error('Invalid word path');
  }

  const media = parseWordMedia(value);

  return {
    id: value.id,
    value: value.value,
    ...media,
    path: value.path
  };
};

type WordSeedInput = Omit<WordDefinition, 'path'>;

const parseWordSeedInput = (value: unknown): WordSeedInput => {
  if (!isRecord(value)) {
    throw new Error('Invalid word definition');
  }

  if (typeof value.id !== 'string' || typeof value.value !== 'string') {
    throw new Error('Invalid word definition shape');
  }

  const media = parseWordMedia(value);

  return {
    id: value.id,
    value: value.value,
    ...media
  };
};

export const parseLevelDefinition = (value: unknown): LevelDefinition => {
  if (!isRecord(value)) {
    throw new Error('Level payload must be an object');
  }

  if (typeof value.id !== 'string' || typeof value.title !== 'string') {
    throw new Error('Level requires id and title');
  }

  if (!Array.isArray(value.words)) {
    throw new Error('Level words must be an array');
  }

  const hasGrid = Array.isArray(value.grid) && value.grid.every((row) => typeof row === 'string');
  const someWordHasPath = value.words.some((word) => isRecord(word) && 'path' in word);
  const wordsHavePaths = value.words.every(
    (word) => isRecord(word) && Array.isArray(word.path) && word.path.every(isGridCell)
  );

  if (hasGrid && someWordHasPath && !wordsHavePaths) {
    value.words.map(parseWord);
    throw new Error('Invalid word path');
  }

  if (hasGrid && wordsHavePaths) {
    const gridRows = value.grid as string[];
    const gridSize = gridRows.length;
    if (!SUPPORTED_GRID_SIZES.has(gridSize)) {
      throw new Error('Unsupported grid size');
    }

    const hasInvalidRowLength = gridRows.some((row) => row.length !== gridSize);
    if (hasInvalidRowLength) {
      throw new Error('Grid must be square');
    }

    const words = value.words.map(parseWord);

    return {
      id: value.id,
      title: value.title,
      grid: gridRows,
      gridSize,
      words
    };
  }

  const gridSize = value.gridSize;
  if (gridSize !== 10) {
    throw new Error('Dynamic payload requires gridSize 10');
  }
  const alphabet = value.alphabet;
  if (alphabet !== undefined && alphabet !== 'latin' && alphabet !== 'cyrillic') {
    throw new Error('Dynamic payload alphabet must be latin or cyrillic');
  }

  const seededWords = value.words.map(parseWordSeedInput);
  const { grid, words } = generateGridFromWords({
    words: seededWords,
    gridSize,
    seed: typeof value.seed === 'string' || typeof value.seed === 'number' ? value.seed : undefined,
    alphabet: alphabet === 'cyrillic' ? 'cyrillic' : 'latin'
  });

  return {
    id: value.id,
    title: value.title,
    grid,
    gridSize,
    words
  };
};
