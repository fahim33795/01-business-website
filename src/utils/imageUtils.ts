export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80';

export function parseProductImages(imagesField: any): string[] {
  if (!imagesField) return [DEFAULT_FALLBACK_IMAGE];

  function extractUrls(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) {
      return input.flatMap(extractUrls);
    }
    if (typeof input === 'string') {
      let str = input.trim();
      if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        str = str.slice(1, -1).trim();
      }
      if (str.startsWith('[')) {
        try {
          const parsed = JSON.parse(str);
          return extractUrls(parsed);
        } catch (_e) {
          // ignore
        }
      }
      if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/') || str.startsWith('data:')) {
        return [str];
      }
    }
    return [];
  }

  const results = extractUrls(imagesField);
  return results.length > 0 ? results : [DEFAULT_FALLBACK_IMAGE];
}

export function parseJsonField<T>(field: any, fallback: T): T {
  if (field === null || field === undefined) return fallback;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch (_e) {
      return fallback;
    }
  }
  return fallback;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (target.src !== DEFAULT_FALLBACK_IMAGE) {
    target.src = DEFAULT_FALLBACK_IMAGE;
  }
}
