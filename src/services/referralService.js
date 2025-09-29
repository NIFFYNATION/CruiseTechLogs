import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';

// Fetch referral statistics
export const fetchReferralStats = async () => {
  try {
    const response = await axiosInstance.get(API_URLS.REFERRAL_STATS);
    return response.data;
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    throw error;
  }
};

// Fetch all referrals with optional pagination
export const fetchReferrals = async (start = 0, limit = 50) => {
  try {
    const response = await axiosInstance.get(API_URLS.REFERRAL_GET, {
      params: { start, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching referrals:', error);
    throw error;
  }
};
