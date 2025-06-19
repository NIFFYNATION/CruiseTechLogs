import axios from 'axios';
import { API_URLS } from '../utils/apiUrls';
import { logoutUser } from '../controllers/userController'; // Import logoutUser

// Example cookies utility for token management
const cookies = {
  getToken: () => localStorage.getItem('authToken'),
  clearAuth: () => localStorage.removeItem('authToken'),
};

const axiosInstance = axios.create({
  baseURL: API_URLS.baseURL,
  timeout: 80000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add CORS preflight handling and Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    // Remove Host header: browsers block setting Host header for security reasons
    if (config.headers && config.headers['Host']) {
      delete config.headers['Host'];
    }

    // CORS headers are only needed on the server, not in browser requests
    // Remove these lines to avoid unnecessary/blocked headers:
    // config.headers['Access-Control-Allow-Origin'] = '*';
    // config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
    // config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Host';

    // Attach Bearer token if available
    const token = cookies.getToken();
    console.log(token);
    if (token && token.trim() !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred Try again later';
      // --- LOGOUT ON 401 ---
      if (status === 401) {
        // Call logoutUser (which also clears localStorage and all cookies)
        logoutUser();
      }
      switch (status) {
        case 403:
          // Handle forbidden access
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          break;
      }
      console.error(`API Error [${status}]: ${message}`);
      return Promise.reject({ status, message });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;