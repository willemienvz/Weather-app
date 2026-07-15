interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function getCachedData<T>(key: string): T | null {
  const stored = localStorage.getItem(key);

  if (!stored) {
    return null;
  }

  try {
    const cache = JSON.parse(stored) as CacheEntry<T>;

    if (Date.now() > cache.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return cache.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  const cache: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + CACHE_DURATION,
  };

  localStorage.setItem(key, JSON.stringify(cache));
}
