import axiosInstance from '../utils/axiosInstance'; // Use centralized Axios instance
import { API_URLS } from '../utils/apiUrls'; // Import API URLs

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post(API_URLS.LOGIN, credentials, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200) {
      const message = response.data?.message || 'Login failed';
      console.warn(`Login Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    console.error(`Login Error [${error.status}]: ${error.message}`);
    throw new Error(error.message);
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post(API_URLS.REGISTER, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        
      },
    });
    if (response.status !== 200) {
      const message = response.data?.message || 'Signup failed';
      console.warn(`Signup Warning [${response.status}]: ${message}`);
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    console.error(`Signup Error [${error.status}]: ${error.message}`);
    throw new Error(error.message);
  }
};

// Add other authentication-related functions as needed
