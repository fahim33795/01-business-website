export function parseProductImages(imagesField: any): string[] {
  const fallback = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80';
  if (!imagesField) return [fallback];

  if (Array.isArray(imagesField)) {
    const validArray = imagesField
      .map((item: any) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item: string) => item.length > 0);
    return validArray.length > 0 ? validArray : [fallback];
  }

  if (typeof imagesField === 'string') {
    const trimmed = imagesField.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const validParsed = parsed
            .map((item: any) => (typeof item === 'string' ? item.trim() : ''))
            .filter((item: string) => item.length > 0);
          if (validParsed.length > 0) return validParsed;
        }
      } catch (_e) {
        // failed JSON parse
      }
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
      return [trimmed];
    }
  }

  return [fallback];
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
