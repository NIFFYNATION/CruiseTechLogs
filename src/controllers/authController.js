import { registerUser, loginUser, forgetPassword, resetPassword } from '../services/authService';
import { fetchUserDetails } from './userController';

export const signupController = async (formData) => {
  const { name, email, password, confirmPassword, phoneNumber, referralCode } = formData;
  const [firstName, lastName] = name.split(' '); // Split name into first and last name

  try {
    const registrationData = {
      email,
      first_name: firstName,
      last_name: lastName || '',
      phone_number: phoneNumber,
      password: btoa(password), // Encode password in Base64
      confirm_password: btoa(confirmPassword), // Encode confirm password in Base64
    };

    // Add referral code if provided
    if (referralCode && referralCode.trim() !== '') {
      registrationData.referral_code = referralCode.trim();
    }

    const response = await registerUser(registrationData);
    // Save full user data and token if present
    if (response.data && response.data.token && response.data.ID) {
      localStorage.setItem('authToken', response.data.token.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
    }
    return response; // Return API response
  } catch (error) {
    throw new Error(error.message); // Propagate error
  }
};

export const loginController = async (credentials) => {
  try {
    const response = await loginUser({
      email: credentials.email,
      password: btoa(credentials.password), // Encode password in Base64
    });
    // Save full user data and token
    localStorage.setItem('authToken', response.data.token.token);
    localStorage.setItem('userData', JSON.stringify(response.data));
    return response; // Return API response
  } catch (error) {
    throw new Error(error.message); // Propagate error
  }
};

export const forgetPasswordController = async (email) => {
  try {
    const response = await forgetPassword(email);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resetPasswordController = async ({ email, code, password, confirm_password }) => {
  try {
    const response = await resetPassword({ email, code, password, confirm_password });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
