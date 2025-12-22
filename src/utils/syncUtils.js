/**
 * Data Synchronization Utilities
 * Syncs JSON file data with localStorage on every app refresh
 */

/**
 * Generate a simple hash from data for comparison
 * @param {any} data - Data to hash
 * @returns {string} Hash string
 */
export const generateDataHash = (data) => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
};

/**
 * Sync data from JSON with localStorage
 * @param {string} storageKey - localStorage key
 * @param {any} jsonData - Data from JSON file
 * @returns {any} The current data (either from storage or JSON)
 */
export const syncDataWithStorage = (storageKey, jsonData) => {
    const hashKey = `${storageKey}_hash`;
    const currentHash = generateDataHash(jsonData);
    const storedHash = localStorage.getItem(hashKey);
    const storedData = localStorage.getItem(storageKey);

    // If hash is different or no stored data, update localStorage
    if (!storedData || !storedHash || storedHash !== currentHash) {
        console.log(`[Sync] Updating ${storageKey} - hash changed or missing`);
        localStorage.setItem(storageKey, JSON.stringify(jsonData));
        localStorage.setItem(hashKey, currentHash);
        return jsonData;
    }

    // Hash matches, use stored data
    console.log(`[Sync] ${storageKey} is up to date`);
    return JSON.parse(storedData);
};

/**
 * Check if sync is needed
 * @param {string} storageKey - localStorage key
 * @param {any} jsonData - Data from JSON file
 * @returns {boolean} True if sync is needed
 */
export const shouldSync = (storageKey, jsonData) => {
    const hashKey = `${storageKey}_hash`;
    const currentHash = generateDataHash(jsonData);
    const storedHash = localStorage.getItem(hashKey);

    return !storedHash || storedHash !== currentHash;
};

/**
 * Force update localStorage with JSON data
 * @param {string} storageKey - localStorage key
 * @param {any} jsonData - Data from JSON file
 */
export const forceSync = (storageKey, jsonData) => {
    const hashKey = `${storageKey}_hash`;
    const currentHash = generateDataHash(jsonData);

    localStorage.setItem(storageKey, JSON.stringify(jsonData));
    localStorage.setItem(hashKey, currentHash);
    console.log(`[Sync] Force updated ${storageKey}`);
};
