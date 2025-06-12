import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';
import cookiesManager from '../utils/cookiesManager';

// No need to handle Authorization here, handled globally in axiosInstance

export const fetchNumberTypes = async () => {
  // Try to get from cookies/localStorage first
  const cached = cookiesManager.getNumberTypes();
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return { code: 200, data: cached };
  }

  // Prevent duplicate requests by returning a single promise if already fetching
  if (fetchNumberTypes._pending) return fetchNumberTypes._pending;

  fetchNumberTypes._pending = (async () => {
    try {
      const response = await axiosInstance.get(
        API_URLS.NUMBERTYPES
      );
      if (response.status !== 200) {
        const message = response.data?.message || 'Failed to fetch number types';
        console.warn(`Number Types Warning [${response.status}]: ${message}`);
        throw new Error(message);
      }
      // Save to cookies/localStorage
      if (response.data?.data && Array.isArray(response.data.data)) {
        cookiesManager.setNumberTypes(response.data.data);
      }
      return response.data;
    } catch (error) {
      const status = error.status || error.response?.status;
      const message = error.message || error.response?.data?.message || 'Failed to fetch number types';
      console.error(`Number Types Error [${status}]: ${message}`);
      throw new Error(message);
    } finally {
      fetchNumberTypes._pending = null;
    }
  })();

  return fetchNumberTypes._pending;
};

export const fetchCountries = async (typeObj) => {
  console.log('fetchCountries called with:', typeObj);
  if (!typeObj || !typeObj.type || !typeObj.network) return [];
  const cacheKey = `countries_${typeObj.type}_${typeObj.network}`;
  // Try to get from localStorage/cookies first
  let cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(cacheKey));
  } catch {}
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  // Prevent duplicate requests for the same type/network
  if (!fetchCountries._pending) fetchCountries._pending = {};
  if (fetchCountries._pending[cacheKey]) return fetchCountries._pending[cacheKey];

  fetchCountries._pending[cacheKey] = (async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URLS.NUMBERCOUNTRIES}?network=${typeObj.network}&type=${typeObj.type}`
      );
      if (response.status !== 200) {
        const message = response.data?.message || 'Failed to fetch countries';
        throw new Error(message);
      }
      if (response.data?.data?.countries && Array.isArray(response.data.data.countries)) {
        localStorage.setItem(cacheKey, JSON.stringify(response.data.data.countries));
        return response.data.data.countries;
      }
      return [];
    } catch (error) {
      return [];
    } finally {
      fetchCountries._pending[cacheKey] = null;
    }
  })();

  return fetchCountries._pending[cacheKey];
};

// Add more number-related API functions as needed, always using axiosInstance
