import polinaLevel from '../../content/levels/level-polina.json';
import mashaLevel from '../../content/levels/level-masha.json';
import alinaLevel from '../../content/levels/level-alina.json';
import forGirlsLevel from '../../content/levels/level-for-girls.json';
import type { LevelPayload } from './types';

const LEVELS: Record<string, LevelPayload> = {
  polina: polinaLevel,
  masha: mashaLevel,
  alina: alinaLevel,
  'for-girls': forGirlsLevel
};

export type ResolveLevelResult =
  | { status: 'ok'; payload: LevelPayload; levelKey: string }
  | {
      status: 'error';
      reason: 'missing_level' | 'unknown_level';
      requestedLevel: string | null;
    };

export const resolveLevelPayload = (search: string): ResolveLevelResult => {
  const params = new URLSearchParams(search);
  const requested = params.get('level');

  if (requested === null) {
    return { status: 'error', reason: 'missing_level', requestedLevel: null };
  }

  const normalized = requested.trim().toLowerCase();
  if (!normalized) {
    return { status: 'error', reason: 'missing_level', requestedLevel: requested };
  }

  const payload = LEVELS[normalized];
  if (!payload) {
    return { status: 'error', reason: 'unknown_level', requestedLevel: requested };
  }

  return { status: 'ok', payload, levelKey: normalized };
};

export const availableLevels = Object.keys(LEVELS);
