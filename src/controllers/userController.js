import { refreshUserToken, fetchUserProfile } from '../services/userService';
import { logoutUserApi } from '../services/authService';
import cookiesManager from '../utils/cookiesManager';

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
  return JSON.parse(userData);
};

export const isTokenExpired = () => {
  const userData = getUserData();
  if (!userData || !userData.token) return true; // If no user data or token, consider expired
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTime > (userData.token.expiry_date || 0); // Compare current time with token expiry
};

export const logoutUser = async () => {
  try {
    await logoutUserApi();
  } catch (e) {
    // Optionally log error, but proceed to clear local data anyway
    console.error('Logout API error:', e.message);
  }
  // Aggressively clear key storage to avoid conflicts, but preserve session-scope navigation state
  try {
    cookiesManager.clearAll();
    // Ensure legacy keys are removed if present
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  } catch (e) {
    // Swallow errors from storage clearing to not block logout
    console.warn('Storage clearing warning:', e?.message || e);
  }
  // Only redirect if not already on / or /login or public shop pages
  const path = window.location.pathname;
  const isPublicShopPage = path.startsWith('/shop') && !path.includes('/dashboard');

  if (path !== '/' && path !== '/login' && !isPublicShopPage) {
    const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?redirect=${redirectPath}`;
  }
};

export const refreshToken = async () => {
  const userData = getUserData();
  if (!userData || !userData.ID || !userData.token) {
    console.error('No user data or token available for refresh.');
    return;
  }
  try {
    const refreshedToken = await refreshUserToken(userData.ID); // Pass userID
    userData.token = refreshedToken; // Update token in userData
    localStorage.setItem('userData', JSON.stringify(userData)); // Save updated userData
    localStorage.setItem('authToken', refreshedToken.token); // Update authToken for axios
  } catch {
    // console.error('Error refreshing token:', error.message);
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
    // Merge with existing userData to preserve token
    const existing = localStorage.getItem('userData');
    let merged = userProfile;
    if (existing) {
      try {
        const prev = JSON.parse(existing);
        merged = { ...prev, ...userProfile, token: prev.token };
      } catch {
        merged = userProfile;
      }
    }
    localStorage.setItem('userData', JSON.stringify(merged)); // Update localStorage
    return merged;
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    return defaultUser; // Return default user on error
  }
};
