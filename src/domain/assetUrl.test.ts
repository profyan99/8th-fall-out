import { describe, expect, test } from 'vitest';
import { resolveAssetUrl } from './assetUrl';

describe('resolveAssetUrl', () => {
  test('prefixes root-relative assets with non-root base URL', () => {
    expect(resolveAssetUrl('/images/poster.png', '/8th-fall-out/')).toBe('/8th-fall-out/images/poster.png');
  });

  test('keeps root-relative assets when base URL is root', () => {
    expect(resolveAssetUrl('/images/poster.png', '/')).toBe('/images/poster.png');
  });

  test('does not rewrite absolute URLs', () => {
    expect(resolveAssetUrl('https://cdn.example.com/poster.png', '/8th-fall-out/')).toBe(
      'https://cdn.example.com/poster.png'
    );
  });

  test('does not rewrite data URLs', () => {
    expect(resolveAssetUrl('data:image/png;base64,AAAA', '/8th-fall-out/')).toBe('data:image/png;base64,AAAA');
  });
});
