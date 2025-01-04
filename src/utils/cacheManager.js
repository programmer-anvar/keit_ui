// src/utils/cacheManager.js
const responseCache = new Map();
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;

// Set cache with expiration
export const setCache = (key, data, ttl = CACHE_EXPIRATION_TIME) => {
    responseCache.set(key, {
        data,
        expiration: Date.now() + ttl,
    });
};

// Get cached data if not expired
export const getCache = (key) => {
    const cached = responseCache.get(key);
    if (cached && Date.now() < cached.expiration) {
        return cached.data;
    }
    responseCache.delete(key); // Remove expired cache entry
    return null;
};

// Clear a specific cache entry
export const clearCacheEntry = (key) => responseCache.delete(key);

// Clear the entire cache
export const clearAllCache = () => responseCache.clear();
