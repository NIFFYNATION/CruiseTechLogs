import axiosInstance from '../utils/axiosInstance';

/**
 * Trigger rental cronjob for a specific user
 * @param {string} userID - The user ID to trigger the cronjob for
 * @returns {Promise<void>} - Silent background request
 */
export const triggerRentalCronjob = async (userID) => {
  if (!userID) {
    console.warn('triggerRentalCronjob: userID is required');
    return;
  }

  try {
    // Silent background request - no error handling to avoid disrupting user experience
    await axiosInstance.get(`https://cruisetechlogs.com/app/rental_cronjob?userID=${userID}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Silent failure - log only for debugging purposes
    console.debug('Rental cronjob request failed:', error.message);
  }
};