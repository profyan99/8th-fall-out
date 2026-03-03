import defaultLevel from '../../content/levels/level-01.json';
import testLevel from '../../content/levels/level-test.json';

type LevelPayload = typeof defaultLevel;

const LEVELS: Record<string, LevelPayload> = {
  '01': defaultLevel,
  test: testLevel
};

export const resolveLevelPayload = (search: string): LevelPayload => {
  const params = new URLSearchParams(search);
  const requested = params.get('level');

  if (!requested) {
    return defaultLevel;
  }

  return LEVELS[requested] ?? defaultLevel;
};
