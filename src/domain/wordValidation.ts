import type { GridCell, LevelDefinition, WordDefinition } from './types';

type ValidationResult =
  | { status: 'found'; word: WordDefinition }
  | { status: 'duplicate'; word: WordDefinition }
  | { status: 'miss'; word: null };

const sameCell = (left: GridCell, right: GridCell): boolean =>
  left.row === right.row && left.col === right.col;

const pathEquals = (a: GridCell[], b: GridCell[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((cell, index) => sameCell(cell, b[index]));
};

const reversePath = (path: GridCell[]): GridCell[] => [...path].reverse();

export const validateSelection = (
  level: LevelDefinition,
  foundWordIds: Set<string>,
  selection: GridCell[]
): ValidationResult => {
  const matched = level.words.find(
    (word) => pathEquals(word.path, selection) || pathEquals(reversePath(word.path), selection)
  );

  if (!matched) {
    return { status: 'miss', word: null };
  }

  if (foundWordIds.has(matched.id)) {
    return { status: 'duplicate', word: matched };
  }

  return { status: 'found', word: matched };
};
