import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';

/**
 * Fetch available email types
 * @returns {Promise<Array>} Array of email types
 */
export const fetchEmailTypes = async () => {
  // Prevent duplicate requests by returning a single promise if already fetching
  if (fetchEmailTypes._pending) return fetchEmailTypes._pending;

  fetchEmailTypes._pending = (async () => {
    try {
      const response = await axiosInstance.get(API_URLS.EMAIL_TYPES);
      if (response.status !== 200) {
        const message = response.data?.message || 'Failed to fetch email types';
        console.warn(`Email Types Warning [${response.status}]: ${message}`);
        throw new Error(message);
      }
      return response.data;
    } catch (error) {
      const status = error.status || error.response?.status;
      const message = error.message || error.response?.data?.message || 'Failed to fetch email types';
      console.error(`Email Types Error [${status}]: ${message}`);
      throw new Error(message);
    } finally {
      fetchEmailTypes._pending = null;
    }
  })();

  return fetchEmailTypes._pending;
};

/**
 * Fetch email services for a specific email type
 * @param {string} type - The email type ID
 * @returns {Promise<Array>} Array of email services
 */
export const fetchEmailServices = async (type) => {
  if (!type) return [];
  
  // Build cache key
  const cacheKey = `email_services_${type}`;
  
  // Check localStorage for cached data and expiry
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw && cachedRaw !== "" && cachedRaw !== null) {
      const cached = JSON.parse(cachedRaw);
      if (cached.data && cached.expiry && Date.now() < cached.expiry) {
        return cached.data;
      }
    }
  } catch {}

  // Prevent duplicate requests for the same type
  if (!fetchEmailServices._pending) fetchEmailServices._pending = {};
  if (fetchEmailServices._pending[type]) return fetchEmailServices._pending[type];

  fetchEmailServices._pending[type] = (async () => {
    try {
      const response = await axiosInstance.get(`${API_URLS.EMAIL_SERVICES}?type=${type}`);
      
      if (response.status !== 200) {
        const message = response.data?.message || 'Failed to fetch email services';
        throw new Error(message);
      }
      
      const services = response.data?.data?.services || [];
      
      // Cache the result for 5 minutes
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: services,
            expiry: Date.now() + 5 * 60 * 1000, // 5 minutes
          })
        );
      } catch {}
      
      return services;
    } catch (error) {
      console.error('Error fetching email services:', error);
      return [];
    } finally {
      if (fetchEmailServices._pending) {
        fetchEmailServices._pending[type] = null;
      }
    }
  })();

  return fetchEmailServices._pending[type];
};

/**
 * Book a new email rental
 * @param {Object} emailData - The email booking data
 * @returns {Promise<Object>} The booked email data
 */
/**
 * Book an email for a service using the same endpoint as number service.
 * @param {string} serviceID - The service ID
 * @param {string} emailType - The email type ID
 * @returns {Promise<object>} - API response object
 */
export const bookEmail = async ({ serviceID, emailType }) => {
  if (!serviceID) throw new Error("Service ID is required");
  if (!emailType) throw new Error("Email type ID is required");
  
  try {
    const url = `${API_URLS.BOOKNUMBER}?id=${encodeURIComponent(serviceID)}&emailType=${encodeURIComponent(emailType)}`;
    const response = await axiosInstance.get(url);
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to book email';
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to book email");
  }
};

/**
 * Get all emails for the current user
 * @returns {Promise<Array>} Array of emails
 */
export const getEmails = async () => {
  try {
    const response = await axiosInstance.get(API_URLS.GET_EMAILS);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to get emails';
    throw new Error(message);
  }
};

/**
 * Get email verification code
 * @param {string} emailId - The email ID
 * @returns {Promise<Object>} The email verification code data
 */
export const getEmailCode = async (emailId) => {
  try {
    const response = await axiosInstance.get(`${API_URLS.GET_EMAIL_CODE}?id=${emailId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to get email code';
    throw new Error(message);
  }
};