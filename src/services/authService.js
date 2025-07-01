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

export const forgetPassword = async (email) => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    const response = await axiosInstance.post(API_URLS.FORGET_PASSWORD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (![200, 201].includes(response.status)) {
      const message = response.data?.message || 'Failed to send OTP';
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async ({ email, code, password, confirm_password }) => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('code', code);
    formData.append('password', btoa(password));
    formData.append('confirm_password', btoa(confirm_password));
    const response = await axiosInstance.post(API_URLS.RESET_PASSWORD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (![200, 201].includes(response.status)) {
      const message = response.data?.message || 'Failed to reset password';
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUserApi = async () => {
  try {
    const response = await axiosInstance.post(API_URLS.LOGOUT, {}, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (![200, 201].includes(response.status)) {
      const message = response.data?.message || 'Logout failed';
      throw new Error(message);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Logout failed');
  }
};

// Add other authentication-related functions as needed
