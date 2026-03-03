export type GridCell = {
  row: number;
  col: number;
};

export type WordDefinition = {
  id: string;
  value: string;
  videoSrc: string;
  path: GridCell[];
};

export type LevelDefinition = {
  id: string;
  title: string;
  grid: string[];
  gridSize: number;
  words: WordDefinition[];
};
