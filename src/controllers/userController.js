import { refreshUserToken, fetchUserProfile } from '../services/userService';

// Default user fallback
export const defaultUser = {
  avatar: '/icons/female.svg',
  name: 'User',
  first_name: 'User',
  last_name: '',
  email: '',
  level: 1,
  progress: 0,
};

export const isUserLoggedIn = () => {
  const authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  return authToken && userData ? true : false; // Check if token and user data exist
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  if (!userData) return defaultUser; // Return default user if no data

  const parsedData = JSON.parse(userData);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Transform the response to match the format used in the code
  return {
    name: `${capitalize(parsedData.first_name || 'Unknown')} ${capitalize(parsedData.last_name || '')}`.trim(),
    email: parsedData.email || 'No email provided',
    avatar: parsedData.profile_image || '/icons/female.svg', // Default avatar
    level: parsedData.level || 1, // Default level
    progress: parsedData.progress || 10, // Default progress
  };
};

export const isTokenExpired = () => {
  const userData = getUserData();
  if (!userData || !userData.token) return true; // If no user data or token, consider expired

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTime > userData.token.expiry_date; // Compare current time with token expiry
};

export const logoutUser = () => {
  localStorage.removeItem('authToken'); // Remove token
  localStorage.removeItem('userData'); // Remove user data
  // Remove all cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  });
  // Redirect to login page only if not already on login page
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith("/login") && !currentPath.startsWith("/")) {
      window.location.href = "/login";
    }
  }
  console.log('User logged out successfully');
};

export const refreshToken = async () => {
  const userData = getUserData();
  if (!userData || !userData.token) {
    console.error('No user data or token available for refresh.');
    return;
  }

  try {
    const refreshedToken = await refreshUserToken(userData.token.token); // Call userService
    userData.token = refreshedToken; // Update token in userData
    localStorage.setItem('userData', JSON.stringify(userData)); // Save updated userData
    console.log('Token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing token:', error.message);
  }
};

export const getFullName = () => {
  const userData = getUserData();
  return userData ? userData.name : null; // Return full name
};

export const getUserEmail = () => {
  const userData = getUserData();
  return userData ? userData.email : null; // Return user email
};

export const fetchUserDetails = async () => {
  try {
    const userProfile = await fetchUserProfile(); // Call userService
    localStorage.setItem('userData', JSON.stringify(userProfile)); // Update localStorage
    return userProfile;
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    return defaultUser; // Return default user on error
  }
};
