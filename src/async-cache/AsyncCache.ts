interface CacheEntry<T> {
  value: T;
  expiration: Date;
}

export class AsyncCache<K, T> {
  constructor(private readonly ttl: number) {
    this.ttl = ttl
  }

  private cache: Map<K, CacheEntry<T>> = new Map<K, CacheEntry<T>>()

  async getOrSet(key: K, asyncOperation: () => Promise<T>): Promise<T> {
    const cacheEntry = this.cache.get(key)
    if (cacheEntry && cacheEntry.expiration > new Date()) {
      return cacheEntry.value
    }
    const newValue = await asyncOperation()
    this.cache.set(key, {
      value: newValue,
      expiration: new Date(Date.now() + this.ttl)
    })
    return newValue
  }

  clearExpiredEntries(): void {
    const currentDate = new Date()
    this.cache.forEach((cacheEntry, key) => {
      if (cacheEntry.expiration < currentDate) {
        this.cache.delete(key)
      }
    })
  }
}
