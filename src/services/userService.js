import axiosInstance from '../utils/axiosInstance'; // Use centralized Axios instance
import { API_URLS, API_BASE_URL } from '../utils/apiUrls';
import cookiesManager from '../utils/cookiesManager'; // <-- Add this import

export const refreshUserToken = async (currentToken) => {
  try {
    // Use token from cookiesManager if not provided
    const token = currentToken || cookiesManager.getToken();
    const response = await axiosInstance.post('/auth/refresh-token', { token });
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to refresh token';
      console.warn(`Token Refresh Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
    cookiesManager.setToken(response.data.token); // Cache refreshed token
    return response.data.token; // Return refreshed token
  } catch (error) {
    console.error(`Token Refresh Error [${error.status}]: ${error.message}`);
    throw new Error(error.message);
  }
};

export const fetchUserProfile = async () => {
  // cookiesManager.clearAll();
  // Try to get user profile from cookiesManager first
  const cachedUser = cookiesManager.getUser();
  if (cachedUser) {
    console.log(cachedUser)
    return cachedUser;
  }
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/user/get`);
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to fetch user profile';
      console.warn(`User Profile Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
    cookiesManager.setUser(response.data.data); // Cache user profile
    return response.data.data; // Return user profile data
  } catch (error) {
    console.error(`User Profile Error [${error.status}]: ${error.message}`);
    throw new Error(error.message);
  }
};

/**
 * Fetch crypto wallet details, cache for 1hr in localStorage.
 * @returns {Promise<object>} Wallet data or null
 */
export const fetchUserCryptoWallet = async () => {
  const cacheKey = "user_crypto_wallet";
  const cacheRaw = localStorage.getItem(cacheKey);
  if (cacheRaw) {
    try {
      const cache = JSON.parse(cacheRaw);
      if (cache.data && cache.expiry && Date.now() < cache.expiry) {
        return cache.data;
      }
    } catch {}
  }
  try {
    const response = await axiosInstance.get(`${API_URLS.API_BASE_URL || API_BASE_URL}/user/wallet`);
    if (response.status === 200 && response.data?.data) {
      const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem(cacheKey, JSON.stringify({ data: response.data.data, expiry }));
      return response.data.data;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Fetch user virtual accounts, cache for 1hr in localStorage.
 * @returns {Promise<Array>} Array of account objects
 */
export const fetchUserAccounts = async () => {
  const cacheKey = "user_virtual_accounts";
  const cacheRaw = localStorage.getItem(cacheKey);
  if (cacheRaw) {
    try {
      const cache = JSON.parse(cacheRaw);
      if (Array.isArray(cache.data) && cache.expiry && Date.now() < cache.expiry) {
        return cache.data;
      }
    } catch {}
  }
  try {
    const response = await axiosInstance.get(`${API_URLS.API_BASE_URL || API_BASE_URL}/user/accounts`);
    if (response.status === 200 && Array.isArray(response.data?.data)) {
      const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem(cacheKey, JSON.stringify({ data: response.data.data, expiry }));
      return response.data.data;
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Fetch user transactions from API.
 * @param {Object} params - { start: number }
 * @returns {Promise<{transactions: Array, next: number}>}
 */
export const fetchUserTransactions = async ({ start = 0 } = {}) => {
  try {
    const response = await axiosInstance.get(`${API_URLS.API_BASE_URL || API_BASE_URL}/user/transactions?start=${start}`);
    if (response.status === 200 && response.data?.data) {
      return {
        transactions: Array.isArray(response.data.data.transactions) ? response.data.data.transactions : [],
        next: response.data.data.next,
      };
    }
    return { transactions: [], next: null };
  } catch {
    return { transactions: [], next: null };
  }
};
