// Get base URL from environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8073';

export const API_URLS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  NUMBERTYPES: `${API_BASE_URL}/rentals/types`,
  NUMBERCOUNTRIES: `${API_BASE_URL}/rentals/countries`,
  NUMBERSERVICES: `${API_BASE_URL}/rentals/services`,
  BOOKNUMBER: `${API_BASE_URL}/rentals/new`,
  GET_NUMBERS: `${API_BASE_URL}/rentals/get`,
  GET_NUMBER_CODE: `${API_BASE_URL}/rentals/getcode`,
  BUY_ACCOUNT: `${API_BASE_URL}/account/buy`,
  ORDERS: `${API_BASE_URL}/account/orders`,
  ORDER_DETAILS: `${API_BASE_URL}/account/order`,
  LOGIN_DETAILS: `${API_BASE_URL}/account/fetch/logins`,
  USER_EDIT: `${API_BASE_URL}/user/edit`,
  USER_CHANGE_PASSWORD: `${API_BASE_URL}/user/changepassword`,
  USER_NOTIFICATIONS: `${API_BASE_URL}/user/notifications`,
  USER_NOTIFICATION_COUNT: `${API_BASE_URL}/user/notification/no`,
  USER_NOTIFICATION_SEEN: `${API_BASE_URL}/user/notification/seen`,
  CONTENT_HELP: `${API_BASE_URL}/content/help`,
  STAGES: `${API_BASE_URL}/content/stages`,
  CONTENT_LIVECHAT: `${API_BASE_URL}/content/livechat`,
  USER_GENERATE_API: `${API_BASE_URL}/user/gen/api`,
  FORGET_PASSWORD: `${API_BASE_URL}/auth/forgetpassword`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/resetpassword`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  // Add other endpoints as needed
};
