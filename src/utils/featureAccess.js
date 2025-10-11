/**
 * Utility functions to check feature access based on user permissions
 */

/**
 * Check if a user has access to the email rental feature
 * @param {string} userEmail - The user's email address
 * @returns {boolean} - Whether the user has access to the feature
 */
export const hasEmailRentalAccess = (userEmail) => {
  if (!userEmail) return false;
  
  // Get allowed emails from environment variable
  const allowedEmails = import.meta.env.VITE_API_ALLOW_EMAILS || '';
  
  // If no allowed emails are specified, allow access to all users
  if (!allowedEmails.trim()) return true;
  
  // Split the comma-separated list and trim each email
  const emailList = allowedEmails.split(',').map(email => email.trim().toLowerCase());
  
  // Check if the user's email is in the allowed list
  return emailList.includes(userEmail.toLowerCase());
};