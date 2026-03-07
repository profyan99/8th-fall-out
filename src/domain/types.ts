export type GridCell = {
  row: number;
  col: number;
};

type BaseWordDefinition = {
  id: string;
  value: string;
  path: GridCell[];
};

export type VideoWordDefinition = BaseWordDefinition & {
  mediaType: 'video';
  videoSrc: string;
  imageSrc?: never;
};

export type ImageWordDefinition = BaseWordDefinition & {
  mediaType: 'image';
  imageSrc: string;
  videoSrc?: never;
};

export type WordDefinition = VideoWordDefinition | ImageWordDefinition;

export type LevelDefinition = {
  id: string;
  title: string;
  grid: string[];
  gridSize: number;
  words: WordDefinition[];
};

type BaseWordPayload = {
  id: string;
  value: string;
};

type VideoWordPayload = BaseWordPayload & {
  videoSrc: string;
  imageSrc?: never;
};

type ImageWordPayload = BaseWordPayload & {
  imageSrc: string;
  videoSrc?: never;
};

export type StaticWordPayload = (VideoWordPayload | ImageWordPayload) & {
  path: GridCell[];
};

export type GeneratedWordPayload = VideoWordPayload | ImageWordPayload;

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
