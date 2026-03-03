import { describe, expect, test } from 'vitest';
import { resolveLevelPayload } from './levelCatalog';

describe('resolveLevelPayload', () => {
  test('returns default level when query is empty', () => {
    expect(resolveLevelPayload('')).toMatchObject({ id: 'level-01' });
  });

  test('returns test level when level=test is provided', () => {
    expect(resolveLevelPayload('?level=test')).toMatchObject({ id: 'level-test' });
  });
});
