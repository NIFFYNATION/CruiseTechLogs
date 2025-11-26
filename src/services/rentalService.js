import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';

/**
 * Trigger rental cronjob for a specific user
 * @param {string} userID - The user ID to trigger the cronjob for
 * @returns {Promise<void>} - Silent background request
 */
export const triggerRentalCronjob = async (userID) => {
  if (!userID) {
    console.warn('triggerRentalCronjob: userID is required');
    return false;
  }

  try {
    const res = await axiosInstance.get(`https://cruisetechlogs.com/app/rental_cronjob?userID=${userID}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // Treat HTTP 200 as success
    return res?.status === 200;
  } catch (error) {
    // Silent failure - log only for debugging purposes
    console.debug('Rental cronjob request failed:', error.message);
    return false;
  }
};

/**
 * Reactivate a number/order by ID.
 * Makes authenticated GET request to rentals/active/:orderID
 * @param {string} orderID - The order ID to reactivate
 * @returns {Promise<object>} - Resolves with response data or rejects with error
 */
export const reactivateNumber = async (orderID) => {
  if (!orderID || typeof orderID !== 'string') {
    return Promise.reject(new Error('Order ID is required'));
  }

  const url = `${API_URLS.RENTALS_ACTIVATE}/${encodeURIComponent(orderID)}`;

  try {
    const response = await axiosInstance.get(url, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Validate successful response
    if (response.status === 200) {
      return response.data;
    }
    const message = response.data?.message || 'Failed to reactivate number';
    return Promise.reject(new Error(message));
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Network error while reactivating number';
    return Promise.reject(new Error(message));
  }
};