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

export const fetchServices = async ({ type, network, countryID = "" }) => {
  if (!type || !network) return [];
  // Build cache key
  const cacheKey = `services_${type}_${network}${countryID ? `_${countryID}` : ""}`;
  // Check localStorage for cached data and expiry
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (cached.data && cached.expiry && Date.now() < cached.expiry) {
        return cached.data;
      }
    }
  } catch {}

  // Build params
  let url = `${API_URLS.NUMBERSERVICES}?type=${type}&network=${network}`;
  if (countryID) url += `&countryID=${countryID}`;

  try {
    const response = await axiosInstance.get(
      url,
      { timeout: 20000 } // 20 seconds timeout
    );
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to fetch services';
      throw new Error(message);
    }
    if (response.data?.data?.services && Array.isArray(response.data.data.services)) {
      // Save to localStorage for 30 minutes
      const expiry = Date.now() + 30 * 60 * 1000;
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data.data.services,
        expiry
      }));
      return response.data.data.services;
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Add more number-related API functions as needed, always using axiosInstance
