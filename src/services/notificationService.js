import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';

export const fetchNotifications = async ({ start = 0 } = {}) => {
  try {
    const url = `${API_URLS.USER_NOTIFICATIONS}?start=${start}`;
    const res = await axiosInstance.get(url);
    if (res.data && res.data.status === 'success' && res.data.data) {
      return {
        next: res.data.data.next,
        notifications: Array.isArray(res.data.data.notifications) ? res.data.data.notifications : [],
      };
    }
    return { next: null, notifications: [] };
  } catch (error) {
    return { next: null, notifications: [], error: error.message || 'Failed to fetch notifications.' };
  }
};

export const fetchNotificationCount = async () => {
  try {
    const res = await axiosInstance.get(API_URLS.USER_NOTIFICATION_COUNT);
    if (res.data && res.data.status === 'success' && res.data.data?.count != null) {
      return res.data.data.count;
    }
    return 0;
  } catch {
    return 0;
  }
};

export const markNotificationAsRead = async (notificationID) => {
  if (!notificationID) return { success: false, message: 'Notification ID is required.' };
  try {
    const res = await axiosInstance.get(`${API_URLS.USER_NOTIFICATION_SEEN}?ID=${notificationID}`);
    if (res.data && res.data.status === 'success') {
      return { success: true };
    }
    return { success: false, message: res.data.message || 'An unknown error occurred.' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to mark as read.' };
  }
}; 