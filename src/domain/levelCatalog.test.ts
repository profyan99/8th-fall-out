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
    expect(result.payload.title).toMatch(/[А-Яа-яЁё]/);
    expect(result.payload.words[0].value).toMatch(/[А-Яа-яЁё]/);
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
    expect(result.payload.title).toMatch(/[А-Яа-яЁё]/);
    expect(result.payload).not.toHaveProperty('grid');
    expect(result.payload.words[0]).not.toHaveProperty('path');
    expect(result.payload.words.some((word) => 'imageSrc' in word)).toBe(true);
    expect(result.payload.words.every((word) => /[А-Яа-яЁё]/.test(word.value))).toBe(true);
  });

  test('loads level=test with at least one image-backed word after parse', () => {
    const result = resolveLevelPayload('?level=test');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.words.some((word) => word.mediaType === 'image')).toBe(true);
  });

  test('resolves cyrillic dynamic payload by key ru-test', () => {
    const result = resolveLevelPayload('?level=ru-test');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.levelKey).toBe('ru-test');
    expect(result.payload).toMatchObject({
      id: 'level-ru-test',
      gridSize: 10,
      alphabet: 'cyrillic'
    });
  });

  test('loads ru-test payload through existing loadLevel flow', () => {
    const result = resolveLevelPayload('?level=ru-test');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    expect(level.words.length).toBeGreaterThan(0);
    for (const word of level.words) {
      expect(word.value).toBe(word.value.toLocaleUpperCase('ru-RU'));
    }
  });

  test('resolves cyrillic dynamic payload by key polina', () => {
    const result = resolveLevelPayload('?level=polina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.levelKey).toBe('polina');
    expect(result.payload).toMatchObject({
      id: 'polina',
      title: "Polina's challenge",
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(10);
  });

  test('loads polina payload through existing loadLevel flow', () => {
    const result = resolveLevelPayload('?level=polina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    expect(level.words).toHaveLength(10);
    for (const word of level.words) {
      expect(word.value).toBe(word.value.toLocaleUpperCase('ru-RU'));
    }
  });

  test('resolves cyrillic dynamic payload by key masha', () => {
    const result = resolveLevelPayload('?level=masha');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.levelKey).toBe('masha');
    expect(result.payload).toMatchObject({
      id: 'masha',
      title: "Masha's challenge",
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(10);
  });

  test('loads masha payload through existing loadLevel flow', () => {
    const result = resolveLevelPayload('?level=masha');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    expect(level.words).toHaveLength(10);
    for (const word of level.words) {
      expect(word.value).toBe(word.value.toLocaleUpperCase('ru-RU'));
    }
  });

  test('resolves cyrillic dynamic payload by key alina', () => {
    const result = resolveLevelPayload('?level=alina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    expect(result.levelKey).toBe('alina');
    expect(result.payload).toMatchObject({
      id: 'alina',
      title: "Alina's challenge",
      gridSize: 10,
      alphabet: 'cyrillic'
    });
    expect(result.payload.words).toHaveLength(10);
  });

  test('loads alina payload through existing loadLevel flow', () => {
    const result = resolveLevelPayload('?level=alina');
    expect(result.status).toBe('ok');
    if (result.status !== 'ok') {
      return;
    }

    const level = loadLevel(result.payload);
    expect(level.gridSize).toBe(10);
    expect(level.grid).toHaveLength(10);
    expect(level.words).toHaveLength(10);
    for (const word of level.words) {
      expect(word.value).toBe(word.value.toLocaleUpperCase('ru-RU'));
    }
  });
});
