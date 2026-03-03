import { parseLevelDefinition } from './levelSchema';
import type { LevelDefinition } from './types';

export const loadLevel = (payload: unknown): LevelDefinition => parseLevelDefinition(payload);
