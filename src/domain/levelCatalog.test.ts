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

  test('supports static payload shape for level=01', () => {
    const result = resolveLevelPayload('?level=01');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.payload).toMatchObject({
      id: 'level-01',
      grid: expect.any(Array)
    });
    expect(result.payload.words[0]).toHaveProperty('path');
  });

  test('supports generated payload shape for level=test', () => {
    const result = resolveLevelPayload('?level=test');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.payload).toMatchObject({
      id: 'level-test',
      gridSize: 10
    });
    expect(result.payload).not.toHaveProperty('grid');
    expect(result.payload.words[0]).not.toHaveProperty('path');
  });
});
