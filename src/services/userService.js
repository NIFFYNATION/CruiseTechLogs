import axiosInstance from '../utils/axiosInstance'; // Use centralized Axios instance

export const refreshUserToken = async (currentToken) => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token', { token: currentToken });
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to refresh token';
      console.warn(`Token Refresh Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
    return response.data.token; // Return refreshed token
  } catch (error) {
    console.error(`Token Refresh Error [${error.status}]: ${error.message}`);
    throw new Error(error.message);
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/user/profile');
    if (response.status !== 200) {
      const message = response.data?.message || 'Failed to fetch user profile';
      console.warn(`User Profile Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
    return response.data; // Return user profile data
  } catch (error) {
    console.error(`User Profile Error [${error.status}]: ${error.message}`);
    throw new Error(error.message);
  }
};
