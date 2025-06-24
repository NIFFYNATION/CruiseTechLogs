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
  // Always fetch from API, ignore cache
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/user/get`);
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to fetch user profile';
      console.warn(`User Profile Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
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

export const editUserProfile = async (data) => {
  // data: { first_name, last_name, email, phone_number, gender }
  try {
    const response = await axiosInstance.post(API_URLS.USER_EDIT, data);
    if (response.status === 200 && response.data?.status === 'success') {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data?.message || 'Failed to update profile.' };
    }
  } catch (error) {
    return { success: false, message: error.message || 'Failed to update profile.' };
  }
};

export const changeUserPassword = async (data) => {
  // data: { password, current_password, confirm_password }
  try {
    const response = await axiosInstance.post(API_URLS.USER_CHANGE_PASSWORD, data);
    if (response.status === 200 && response.data?.status === 'success') {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data?.message || 'Failed to change password.' };
    }
  } catch (error) {
    console.error('Failed to change password:', error);
    return { success: false, message: error.message || 'An error occurred' };
  }
};

export const generateApiKey = async (password) => {
  if (!password) {
    return { success: false, message: 'Password is required.' };
  }
  try {
    const res = await axiosInstance.post(API_URLS.USER_GENERATE_API, { password: btoa(password) });
    if (res.data && res.data.status === 'success' && res.data.data?.key) {
      return { success: true, key: res.data.data.key };
    } else {
      return { success: false, message: res.data.message || 'An unknown error occurred' };
    }
  } catch (error) {
    return { success: false, message: error.message || 'Failed to generate API key.' };
  }
};

