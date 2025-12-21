import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';
import cookiesManager from '../utils/cookiesManager';

// No need to handle Authorization here, handled globally in axiosInstance

export const fetchNumberTypes = async () => {
  // Try to get from cookies/localStorage first
  // const cached = cookiesManager.getNumberTypes();
  // if (cached && Array.isArray(cached) && cached.length > 0) {
  //   return { code: 200, data: cached };
  // }

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
  // console.log('fetchCountries called with:', typeObj);
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

export const fetchServices = async ({ type, network, countryID = "", time, forceRefresh = false }) => {
  if (!type || !network) return [];
  // Build cache key
  const cacheKey = `services_${type}_${network}${countryID ? `_${countryID}` : ""}${time ? `_${time}` : ""}`;
  // Check localStorage for cached data and expiry (skip if forceRefresh)
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw && cachedRaw !== "" && cachedRaw != null) {
        const cached = JSON.parse(cachedRaw);
        if (
          cached && Array.isArray(cached.data) && cached.data.length > 0 &&
          cached.expiry && Date.now() < cached.expiry
        ) {
          return cached.data;
        }
      }
    } catch {}
  }

  // Build params
  let url = `${API_URLS.NUMBERSERVICES}?type=${type}&network=${network}`;
  if (countryID) url += `&countryID=${countryID}`;
  if (time) url += `&time=${time}`;
  if (forceRefresh) url += `&refresh=true`;

  try {
    const response = await axiosInstance.get(
      url,
      { timeout: 100000 }
    );
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to fetch services';
      throw new Error(message);
    }
    if (response.data?.data?.services && Array.isArray(response.data.data.services)) {
      const services = response.data.data.services;
      // Only cache non-empty services
      if (services.length > 0) {
        const expiry = Date.now() + 30 * 60 * 1000;
        localStorage.setItem(cacheKey, JSON.stringify({ data: services, expiry }));
      }
      return services;
    }
    return [];
  } catch (error) {
    return [];
  }
};

/**
 * Book a number/account for a service.
 * @param {string} id - The service id (e.g. cXZ8fHNob3J0X3Rlcm18fDJ8fDV8fDU=)
 * @param {string} priceID - Optional price ID for services with multiple costs
 * @returns {Promise<object>} - API response object
 */
export const bookNumber = async (id, priceID = null) => {
  if (!id) throw new Error("Service id is required");
  try {
    let url = `${API_URLS.BOOKNUMBER}?id=${encodeURIComponent(id)}`;
    if (priceID) {
      url += `&priceID=${encodeURIComponent(priceID)}`;
    }
    const response = await axiosInstance.get(url);
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to book number';
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    throw new Error( error.response?.data?.message || error.message || "Failed to book number");
  }
};

/**
 * Fetch user's numbers from the API, paginated.
 * @param {Object} params - { status: string, start: number }
 * @returns {Promise<{numbers: Array, next: number}>}
 */
export const fetchNumbers = async ({ status = "active", start = 0 } = {}) => {
  try {
    const url = `${API_URLS.GET_NUMBERS}?status=${status}&start=${start}`;
    const response = await axiosInstance.get(url, { timeout: 15000 });
    if (response.status !== 200) {
      throw new Error(response.data?.message || "Failed to fetch numbers");
    }
    const data = response.data?.data || {};
    return {
      numbers: Array.isArray(data.numbers) ? data.numbers : [],
      next: typeof data.next === "number" ? data.next : null,
    };
  } catch (error) {
    return { numbers: [], next: null };
  }
};

/**
 * Fetch verification code(s) for a number/order.
 * @param {string} id - The order ID (e.g. order-66e1bec1466a3)
 * @returns {Promise<object>} - API response object
 */
export const fetchNumberCode = async (id) => {
  if (!id) throw new Error("Order id is required");
  try {
    const url = `${API_URLS.GET_NUMBER_CODE}?id=${encodeURIComponent(id)}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return {
      code: error.response?.status || 500,
      status: "error",
      message: error.response?.data?.message || error.message || "Failed to fetch code",
      data: [],
    };
  }
};

/**
 * Close (deactivate) a number/order.
 * @param {string} id - The order ID (e.g. order-675acc548b081)
 * @returns {Promise<object>} - API response object
 */
export const closeNumber = async (id) => {
  if (!id) throw new Error("Order id is required");
  try {
    const url = `${API_URLS.API_BASE_URL || API_URLS.GET_NUMBERS.replace('/rentals/get', '')}/rentals/close?id=${encodeURIComponent(id)}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return {
      code: error.response?.status || 500,
      status: "error",
      message: error.response?.data?.message || error.message || "Failed to close number",
      data: null,
    };
  }
};

/**
 * Check if a number is registered on WhatsApp
 * @param {string} number - The phone number to check
 * @returns {Promise<Object>} Response object with WhatsApp verification status
 */
export const checkWhatsAppNumber = async (number) => {
  if (!number) throw new Error("Phone number is required");
  try {
    const response = await axiosInstance.get(`${API_URLS.WHATSAPP_CHECK}?number=${encodeURIComponent(number)}`);
    return response.data;
  } catch (error) {
    return {
      code: error.response?.status || 500,
      status: "error",
      message: error.response?.data?.message || error.message || "Failed to verify WhatsApp number",
      data: null,
    };
  }
};

// Add more number-related API functions as needed, always using axiosInstance