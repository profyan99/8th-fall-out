import defaultLevel from '../../content/levels/level-01.json';
import testLevel from '../../content/levels/level-test.json';
import ruTestLevel from '../../content/levels/level-ru-test.json';
import type { LevelPayload } from './types';

const LEVELS: Record<string, LevelPayload> = {
  '01': defaultLevel,
  test: testLevel,
  'ru-test': ruTestLevel
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
