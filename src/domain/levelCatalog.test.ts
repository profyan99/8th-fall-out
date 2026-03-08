import { describe, expect, test } from 'vitest';
import { loadLevel } from './loadLevel';
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

  test('returns unknown_level for unknown key', () => {
    expect(resolveLevelPayload('?level=unknown')).toEqual({
      status: 'error',
      reason: 'unknown_level',
      requestedLevel: 'unknown'
    });
  });

  test('returns success for known key', () => {
    expect(resolveLevelPayload('?level=for-girls')).toMatchObject({
      status: 'ok',
      levelKey: 'for-girls',
      payload: { id: 'for-girls' }
    });
  });

  test('resolves generated payload for level=for-girls', () => {
    const result = resolveLevelPayload('?level=for-girls');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.payload).toMatchObject({
      id: 'for-girls',
      title: 'для всех девушек',
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(6);
  });

  test('loads for-girls payload through existing loadLevel flow', () => {
    const result = resolveLevelPayload('?level=for-girls');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    expect(level.words).toHaveLength(6);
    for (const word of level.words) {
      expect(word.value).toBe(word.value.toLocaleUpperCase('ru-RU'));
    }
  });

  test('loads alina payload with at least one image-backed word after parse', () => {
    const result = resolveLevelPayload('?level=alina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.words.some((word) => word.mediaType === 'image')).toBe(true);
  });

  test('resolves cyrillic dynamic payload by key polina without word цветы', () => {
    const result = resolveLevelPayload('?level=polina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.payload).toMatchObject({
      id: 'polina',
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(9);
    expect(result.payload.words.some((word) => word.value.toLocaleLowerCase('ru-RU') === 'цветы')).toBe(false);
  });

  test('resolves cyrillic dynamic payload by key masha without word цветы', () => {
    const result = resolveLevelPayload('?level=masha');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.payload).toMatchObject({
      id: 'masha',
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(9);
    expect(result.payload.words.some((word) => word.value.toLocaleLowerCase('ru-RU') === 'цветы')).toBe(false);
  });

  test('resolves cyrillic dynamic payload by key alina', () => {
    const result = resolveLevelPayload('?level=alina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.payload).toMatchObject({
      id: 'alina',
      title: "Alina's challenge",
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(10);
  });
});
