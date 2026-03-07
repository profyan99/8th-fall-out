import { describe, expect, test } from 'vitest';
import { resolveLevelPayload } from './levelCatalog';

describe('resolveLevelPayload', () => {
  test('returns missing_level when query is empty', () => {
    expect(resolveLevelPayload('')).toEqual({
      status: 'error',
      reason: 'missing_level',
      requestedLevel: null
    });
  });

  test('returns missing_level when level is empty', () => {
    expect(resolveLevelPayload('?level=')).toEqual({
      status: 'error',
      reason: 'missing_level',
      requestedLevel: ''
    });
  });

  test('returns missing_level when level is whitespace', () => {
    expect(resolveLevelPayload('?level=%20%20')).toEqual({
      status: 'error',
      reason: 'missing_level',
      requestedLevel: '  '
    });
  });

  test('returns unknown_level for unknown key', () => {
    expect(resolveLevelPayload('?level=unknown')).toEqual({
      status: 'error',
      reason: 'unknown_level',
      requestedLevel: 'unknown'
    });
  });

  test('returns success for known key', () => {
    expect(resolveLevelPayload('?level=test')).toMatchObject({
      status: 'ok',
      levelKey: 'test',
      payload: { id: 'level-test' }
    });
  });
});
