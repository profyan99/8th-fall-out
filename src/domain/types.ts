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

export type StaticWordPayload = {
  id: string;
  value: string;
  videoSrc: string;
  path: GridCell[];
};

export type GeneratedWordPayload = {
  id: string;
  value: string;
  videoSrc: string;
};

export type StaticLevelPayload = {
  id: string;
  title: string;
  grid: string[];
  words: StaticWordPayload[];
};

export type GeneratedLevelPayload = {
  id: string;
  title: string;
  gridSize: number;
  seed?: string;
  words: GeneratedWordPayload[];
};

export type LevelPayload = StaticLevelPayload | GeneratedLevelPayload;
