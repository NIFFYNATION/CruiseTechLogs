/**
 * Simple caching service for Shop Data
 * Implements SWR (Stale-While-Revalidate) logic
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

const cacheService = {
    /**
     * Save data to localStorage with a timestamp
     * @param {string} key 
     * @param {any} data 
     */
    save: (key, data) => {
        try {
            const cacheObj = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(`shop_cache_${key}`, JSON.stringify(cacheObj));
        } catch (e) {
            console.error('Error saving to cache:', e);
        }
    },

    /**
     * Get data from cache
     * @param {string} key 
     * @returns {any|null}
     */
    get: (key) => {
        try {
            const cached = localStorage.getItem(`shop_cache_${key}`);
            if (!cached) return null;
            const { data } = JSON.parse(cached);
            return data;
        } catch (e) {
            console.error('Error reading from cache:', e);
            return null;
        }
    },

    /**
     * Check if cache is stale
     * @param {string} key 
     * @param {number} ttl 
     * @returns {boolean}
     */
    isStale: (key, ttl = DEFAULT_TTL) => {
        try {
            const cached = localStorage.getItem(`shop_cache_${key}`);
            if (!cached) return true;
            const { timestamp } = JSON.parse(cached);
            return Date.now() - timestamp > ttl;
        } catch (e) {
            return true;
        }
    },

    /**
     * Clear specific or all shop cache
     * @param {string|null} key 
     */
    clear: (key = null) => {
        if (key) {
            localStorage.removeItem(`shop_cache_${key}`);
        } else {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('shop_cache_')) {
                    localStorage.removeItem(k);
                }
            });
        }
    }
};

export default cacheService;
