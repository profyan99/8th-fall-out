import type { GridCell, WordDefinition } from './types';

export type WordSeedInput = Omit<WordDefinition, 'path'>;

type GenerateGridOptions = {
  words: WordSeedInput[];
  gridSize: number;
  seed?: string | number;
  alphabet?: 'latin' | 'cyrillic';
};

type GenerateGridResult = {
  grid: string[];
  words: WordDefinition[];
};

const LATIN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CYRILLIC_LETTERS = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const DIRECTIONS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 }
] as const;

const hashSeed = (seed: string | number | undefined): number => {
  const source = String(seed ?? 'default-seed');
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRng = (seed: string | number | undefined): (() => number) => {
  let state = hashSeed(seed);
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

const randomInt = (rng: () => number, maxExclusive: number): number =>
  Math.floor(rng() * maxExclusive);

const pathForWord = (
  startRow: number,
  startCol: number,
  dr: number,
  dc: number,
  length: number
): GridCell[] =>
  Array.from({ length }, (_, index) => ({
    row: startRow + dr * index,
    col: startCol + dc * index
  }));

const normalizePathDirection = (path: GridCell[]): GridCell[] => {
  const start = path[0];
  const end = path[path.length - 1];
  const isForward = end.row > start.row || (end.row === start.row && end.col >= start.col);
  return isForward ? path : [...path].reverse();
};

const canPlaceWord = (grid: string[][], letters: string, path: GridCell[]): boolean => {
  for (let index = 0; index < letters.length; index += 1) {
    const cell = path[index];
    const current = grid[cell.row][cell.col];
    if (current !== '' && current !== letters[index]) {
      return false;
    }
  }

  return true;
};

const placeWord = (grid: string[][], letters: string, path: GridCell[]): void => {
  for (let index = 0; index < letters.length; index += 1) {
    const cell = path[index];
    grid[cell.row][cell.col] = letters[index];
  }
};

const inBounds = (path: GridCell[], size: number): boolean =>
  path.every((cell) => cell.row >= 0 && cell.row < size && cell.col >= 0 && cell.col < size);

const toUpperWord = (word: string, alphabet: 'latin' | 'cyrillic'): string =>
  alphabet === 'cyrillic' ? word.trim().toLocaleUpperCase('ru-RU') : word.trim().toUpperCase();

const randomLetter = (rng: () => number, alphabet: 'latin' | 'cyrillic'): string => {
  const letters = alphabet === 'cyrillic' ? CYRILLIC_LETTERS : LATIN_LETTERS;
  return letters[randomInt(rng, letters.length)];
};

export const generateGridFromWords = ({
  words,
  gridSize,
  seed,
  alphabet = 'latin'
}: GenerateGridOptions): GenerateGridResult => {
  if (gridSize !== 10) {
    throw new Error('Dynamic grid generator currently supports only 10x10');
  }

  const rng = createRng(seed);
  const normalizedWords = words
    .map((word) => ({ ...word, value: toUpperWord(word.value, alphabet) }))
    .sort((left, right) => right.value.length - left.value.length);

  const maxRestarts = 250;
  const maxAttemptsPerWord = 300;

  for (let restart = 0; restart < maxRestarts; restart += 1) {
    const grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => ''));
    const placed: WordDefinition[] = [];
    let failed = false;

    for (const word of normalizedWords) {
      let placedWord = false;
      for (let attempt = 0; attempt < maxAttemptsPerWord; attempt += 1) {
        const direction = DIRECTIONS[randomInt(rng, DIRECTIONS.length)];
        const startRow = randomInt(rng, gridSize);
        const startCol = randomInt(rng, gridSize);
        const rawPath = pathForWord(startRow, startCol, direction.dr, direction.dc, word.value.length);
        const path = normalizePathDirection(rawPath);

        if (!inBounds(path, gridSize) || !canPlaceWord(grid, word.value, path)) {
          continue;
        }

        placeWord(grid, word.value, path);
        placed.push({
          id: word.id,
          value: word.value,
          videoSrc: word.videoSrc,
          path
        });
        placedWord = true;
        break;
      }

      if (!placedWord) {
        failed = true;
        break;
      }
    }

    if (failed) {
      continue;
    }

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        if (grid[row][col] === '') {
          grid[row][col] = randomLetter(rng, alphabet);
        }
      }
    }

    const finalizedGrid = grid.map((row) => row.join(''));
    const resolvedWords = words.map((original) => {
      const placedWord = placed.find((entry) => entry.id === original.id);
      if (!placedWord) {
        throw new Error(`Word "${original.id}" was not placed`);
      }
      return placedWord;
    });

    return { grid: finalizedGrid, words: resolvedWords };
  }

  throw new Error('Failed to generate grid for provided words');
};
