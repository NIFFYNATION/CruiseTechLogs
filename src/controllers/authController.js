import { registerUser, loginUser } from '../services/authService';
import { fetchUserDetails } from './userController';

export const signupController = async (formData) => {
  const { name, email, password, confirmPassword, phoneNumber } = formData;
  const [firstName, lastName] = name.split(' '); // Split name into first and last name

  try {
    const response = await registerUser({
      email,
      first_name: firstName,
      last_name: lastName || '',
      phone_number: phoneNumber,
      password: btoa(password), // Encode password in Base64
      confirm_password: btoa(confirmPassword), // Encode confirm password in Base64
    });
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
    localStorage.setItem('authToken', response.data.token.token); // Store token in localStorage
    await fetchUserDetails(); // Fetch and store user details
    console.log('Login successful:', response);
    return response; // Return API response
  } catch (error) {
    console.error('Login failed:', error.message);
    throw new Error(error.message); // Propagate error
  }
};
