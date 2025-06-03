import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:80/cruise/app/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'An error occurred';
    console.error(`API Error [${status}]: ${message}`);
    return Promise.reject({ status, message }); // Return structured error
  }
);

export default axiosInstance;