const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//i;

export const resolveAssetUrl = (src: string, baseUrl: string): string => {
  if (!src) {
    return src;
  }

  if (ABSOLUTE_URL_PATTERN.test(src) || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  if (!src.startsWith('/')) {
    return src;
  }

  if (!baseUrl || baseUrl === '/') {
    return src;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${src.slice(1)}`;
};
