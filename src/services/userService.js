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
