import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';

export const fetchHelpContent = async () => {
  try {
    const res = await axiosInstance.get(API_URLS.CONTENT_HELP);
    if (res.data && res.data.status === 'success' && res.data.data?.help) {
      return res.data.data.help;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch help content:', error);
    return null;
  }
};

export const getStages = async () => {
  try {
    const res = await axiosInstance.get(API_URLS.STAGES);
    if (res.data && res.data.code === 200 && res.data.data && res.data.data.stages) {
      return Object.values(res.data.data.stages);
    }
    throw new Error(res.data?.message || 'Failed to fetch stages');
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch stages');
  }
};
